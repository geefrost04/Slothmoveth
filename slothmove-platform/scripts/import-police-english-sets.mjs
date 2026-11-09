#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const root = process.cwd();

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([^#=\s]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function run(query, label) {
  const { data, error } = await query;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

loadEnv(path.join(root, '.env.local'));
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
assert(url && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Supabase credentials are missing.');
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const sets = [
  { id: 'police-english-set-01', file: 'police-english-set-01-notebooklm.json' },
  { id: 'police-english-set-02', file: 'police-english-set-02-notebooklm.json' },
  { id: 'police-english-set-03', file: 'police-english-set-03-notebooklm.json' }
];

async function main() {
  console.log('Syncing English Sets 1-3 to Supabase...');
  for (const s of sets) {
    const filePath = path.join(root, 'content/exams', s.file);
    const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const questions = payload.questions;
    assert(questions.length === 30, `${s.id}: expected 30 questions`);

    // 1. Update questions
    await run(
      db.from('questions').upsert(
        questions.map(q => ({
          id: `${s.id}-q${String(q.position).padStart(2, '0')}`,
          category: q.category,
          prompt: q.prompt,
          choices: q.choices,
          media: q.media ?? {},
          metadata: {
            source_question_no: q.position,
            difficulty: q.difficulty ?? 'ปานกลาง'
          }
        })),
        { onConflict: 'id' }
      ),
      `upsert questions for ${s.id}`
    );

    // 2. Update question_solutions
    await run(
      db.from('question_solutions').upsert(
        questions.map(q => ({
          question_id: `${s.id}-q${String(q.position).padStart(2, '0')}`,
          correct_choice_index: q.correctChoiceIndex,
          explanation: q.explanation,
          tip: q.tip,
          metadata: {
            source_ref: q.sourceRef,
            verification_ref: q.verificationRef
          }
        })),
        { onConflict: 'question_id' }
      ),
      `upsert solutions for ${s.id}`
    );

    console.log(`✓ Successfully updated ${questions.length} questions and solutions for ${s.id}`);
  }
  console.log('All 90 English questions and solutions successfully synced to Supabase!');
}

main().catch(err => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
