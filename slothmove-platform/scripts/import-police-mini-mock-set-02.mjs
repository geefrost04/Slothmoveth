#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const MINI2_FILE = path.join(ROOT, 'content/exams/police-mini_mock-set-02.json');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert(url && serviceRoleKey, 'Supabase credentials missing');

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const payload = JSON.parse(fs.readFileSync(MINI2_FILE, 'utf8'));
  const { examSet, questions } = payload;

  assert(examSet.id === 'police-mini_mock-set-02', 'Invalid exam set ID');
  assert(questions.length === 30, 'Expected 30 questions');

  // 1. Upsert exam_sets
  const { error: examError } = await supabase.from('exam_sets').upsert({
    id: examSet.id,
    course_id: examSet.courseId || 'police_admin',
    subject_id: examSet.subjectId || 'mini_mock',
    product_id: null,
    title: examSet.title,
    description: examSet.description,
    source_label: 'คัดจาก Mock Test ชุดที่ 4 (150 ข้อ)',
    access_type: 'free',
    duration_minutes: examSet.durationMinutes || 35,
    total_questions: questions.length,
    metadata: {
      source_exam_set_id: 'police-mock_test-set-04',
      version: 1,
      distribution: [
        { subjectId: 'math', count: 4 },
        { subjectId: 'thai', count: 4 },
        { subjectId: 'computer', count: 8 },
        { subjectId: 'saraban', count: 6 },
        { subjectId: 'law', count: 5 },
        { subjectId: 'english', count: 3 }
      ]
    },
    is_published: true,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' });

  if (examError) throw new Error(`Exam set upsert: ${examError.message}`);

  // 2. Clear old mappings
  const { error: deleteError } = await supabase
    .from('exam_set_questions')
    .delete()
    .eq('exam_set_id', examSet.id);
  if (deleteError) throw new Error(`Delete old mappings: ${deleteError.message}`);

  // 3. Insert mappings pointing to mock 4 questions
  const mappings = questions.map((q, idx) => ({
    exam_set_id: examSet.id,
    question_id: `police-mock_test-set-04-q${String(q.sourcePosition).padStart(3, '0')}`,
    position: idx + 1,
    points: 1
  }));

  const { error: mappingError } = await supabase.from('exam_set_questions').insert(mappings);
  if (mappingError) throw new Error(`Insert mappings: ${mappingError.message}`);

  // 4. Verify remote
  const { data: verifyMappings, error: verifyError } = await supabase
    .from('exam_set_questions')
    .select('question_id,position')
    .eq('exam_set_id', examSet.id)
    .order('position');
  if (verifyError) throw new Error(`Verify mappings: ${verifyError.message}`);
  assert(verifyMappings.length === 30, `Expected 30 mappings, got ${verifyMappings.length}`);

  const questionIds = verifyMappings.map((m) => m.question_id);
  const { data: verifyQs, error: qError } = await supabase
    .from('questions')
    .select('id')
    .in('id', questionIds);
  if (qError) throw new Error(`Verify questions: ${qError.message}`);
  assert(verifyQs.length === 30, `Expected 30 questions exist in questions table, got ${verifyQs.length}`);

  console.log(JSON.stringify({
    status: 'SUCCESS',
    examSetId: examSet.id,
    totalQuestions: verifyMappings.length,
    sampleSourcePositions: questions.map((q) => q.sourcePosition)
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
