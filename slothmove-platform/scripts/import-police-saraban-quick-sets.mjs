#!/usr/bin/env node
// Imports the free saraban quick-review sets (police-saraban-quick-01..07) into Supabase.
// Dry-run by default; pass --apply to write.
//
// Usage: node scripts/import-police-saraban-quick-sets.mjs [--apply]

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const SET_IDS = Array.from({ length: 7 }, (_, index) => `police-saraban-quick-${String(index + 1).padStart(2, '0')}`);

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}
function assert(value, message) { if (!value) throw new Error(message); }
async function run(query, label) {
  const { data, error } = await query;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

const payloads = SET_IDS.map((id) => {
  const payload = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/exams', `${id}.json`), 'utf8'));
  assert(payload.examSet.id === id, `${id}: id mismatch`);
  assert(payload.examSet.accessType === 'free', `${id}: must be free`);
  assert(payload.questions.length === payload.examSet.totalQuestions, `${id}: question count mismatch`);
  payload.questions.forEach((question, index) => {
    assert(question.position === index + 1, `${id}: positions must be 1..n`);
    assert(Array.isArray(question.choices) && question.choices.length === 4, `${id} Q${question.position}: 4 choices`);
    assert(Number.isInteger(question.correctChoiceIndex) && question.correctChoiceIndex >= 0 && question.correctChoiceIndex <= 3, `${id} Q${question.position}: bad answer index`);
    assert(question.explanation && question.tip, `${id} Q${question.position}: missing explanation/tip`);
  });
  return payload;
});

if (!APPLY) {
  console.log(JSON.stringify({
    mode: 'dry-run',
    sets: payloads.map(({ examSet, questions }) => ({ id: examSet.id, title: examSet.title, questions: questions.length, catalogOrder: examSet.catalogOrder })),
    next: 'Run with --apply to write these free sets to Supabase.'
  }, null, 2));
  process.exit(0);
}

loadEnv(path.join(ROOT, '.env.local'));
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
assert(url && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Supabase credentials are missing.');
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const now = new Date().toISOString();

for (const { examSet: set, questions, qualityNotes } of payloads) {
  const productId = set.id.replaceAll('-', '_');
  const questionId = (question) => `${set.id}-q${String(question.position).padStart(2, '0')}`;
  await run(db.from('products').upsert({
    id: productId,
    title: set.title,
    description: set.description,
    price: 0,
    type: 'exam_set',
    metadata: { course_id: 'police_admin', subject_id: 'saraban', access_type: 'free', catalog: 'saraban_quick_review' },
    is_published: true
  }, { onConflict: 'id' }), `product ${set.id}`);
  await run(db.from('exam_sets').upsert({
    id: set.id,
    course_id: 'police_admin',
    subject_id: 'saraban',
    product_id: productId,
    title: set.title,
    description: set.description,
    source_label: 'SlothMove saraban quick review (re-split of sets 1-3)',
    access_type: 'free',
    duration_minutes: set.durationMinutes,
    total_questions: questions.length,
    metadata: {
      catalog: 'saraban_quick_review',
      catalog_order: set.catalogOrder,
      content_source: `${set.id}.json`,
      generated_by: qualityNotes?.generatedBy
    },
    is_published: true,
    updated_at: now
  }, { onConflict: 'id' }), `exam set ${set.id}`);
  const existingItem = await run(db.from('product_items').select('id').eq('product_id', productId).eq('subject_id', 'saraban').eq('item_id', set.id).maybeSingle(), `product item lookup ${set.id}`);
  if (!existingItem) await run(db.from('product_items').insert({ product_id: productId, subject_id: 'saraban', item_id: set.id }), `product item ${set.id}`);

  await run(db.from('questions').upsert(questions.map((question) => ({
    id: questionId(question),
    category: question.category,
    prompt: question.prompt,
    choices: question.choices,
    media: question.media ?? {},
    metadata: { source_subject_id: 'saraban', source_ref: question.sourceRef, topic: question.topic, difficulty: question.difficulty }
  })), { onConflict: 'id' }), `questions ${set.id}`);
  await run(db.from('question_solutions').upsert(questions.map((question) => ({
    question_id: questionId(question),
    correct_choice_index: question.correctChoiceIndex,
    explanation: question.explanation,
    tip: question.tip,
    metadata: { source_ref: question.sourceRef }
  })), { onConflict: 'question_id' }), `solutions ${set.id}`);
  await run(db.from('exam_set_questions').delete().eq('exam_set_id', set.id), `clear mappings ${set.id}`);
  await run(db.from('exam_set_questions').insert(questions.map((question) => ({
    exam_set_id: set.id,
    question_id: questionId(question),
    position: question.position,
    points: 1
  }))), `mappings ${set.id}`);
}

console.log(JSON.stringify({ mode: 'applied', imported: SET_IDS }, null, 2));
