#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const EXAM_SET_ID = 'police-mini_mock-set-01';
const SOURCE_EXAM_SET_ID = 'police-mock_test-set-01';
const DURATION_MINUTES = 35;
const SOURCES = [
  { subjectId: 'math', title: 'ความรู้ทั่วไป', positions: [1, 6, 11, 16] },
  { subjectId: 'thai', title: 'ภาษาไทย', positions: [21, 26, 31, 36] },
  { subjectId: 'computer', title: 'คอมพิวเตอร์', positions: [41, 46, 51, 56, 61, 66, 71, 76] },
  { subjectId: 'saraban', title: 'งานสารบรรณ', positions: [81, 86, 91, 96, 101, 106] },
  { subjectId: 'law', title: 'กฎหมาย', positions: [111, 116, 121, 126, 131] },
  { subjectId: 'english', title: 'ภาษาอังกฤษ', positions: [136, 141, 146] }
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (!match) continue;
    process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '');
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert(url && serviceRoleKey, 'Supabase environment variables are missing.');

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: sourceMappings, error: sourceError } = await supabase
    .from('exam_set_questions')
    .select('question_id,position')
    .eq('exam_set_id', SOURCE_EXAM_SET_ID)
    .order('position');
  if (sourceError) throw new Error(`Source mappings: ${sourceError.message}`);

  const byPosition = new Map((sourceMappings ?? []).map((mapping) => [mapping.position, mapping.question_id]));
  const selected = SOURCES.flatMap((source) => source.positions.map((position) => ({
    source,
    sourcePosition: position,
    questionId: byPosition.get(position)
  })));
  assert(selected.length === 30, `Expected 30 questions, found ${selected.length}.`);
  assert(selected.every((item) => item.questionId), 'A selected source question is missing.');

  const { error: examError } = await supabase.from('exam_sets').upsert({
    id: EXAM_SET_ID,
    course_id: 'police_admin',
    subject_id: 'mini_mock',
    product_id: null,
    title: 'Mini Mock นายสิบตำรวจ 30 ข้อ',
    description: 'ทดลองทำข้อสอบ 30 ข้อ ครบ 6 วิชา จับเวลา 35 นาที พร้อมเฉลยและผลวิเคราะห์',
    source_label: 'คัดจาก Mock Test ชุดฟรี 150 ข้อ',
    access_type: 'free',
    duration_minutes: DURATION_MINUTES,
    total_questions: selected.length,
    metadata: {
      source_exam_set_id: SOURCE_EXAM_SET_ID,
      source_policy: 'Selected only from the published free Mock Test set.',
      distribution: SOURCES.map(({ subjectId, title, positions }) => ({ subjectId, title, count: positions.length, positions }))
    },
    is_published: true,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' });
  if (examError) throw new Error(`Exam set: ${examError.message}`);

  const { error: deleteError } = await supabase
    .from('exam_set_questions')
    .delete()
    .eq('exam_set_id', EXAM_SET_ID);
  if (deleteError) throw new Error(`Existing mappings: ${deleteError.message}`);

  const mappings = selected.map((item, index) => ({
    exam_set_id: EXAM_SET_ID,
    question_id: item.questionId,
    position: index + 1,
    points: 1
  }));
  const { error: mappingError } = await supabase.from('exam_set_questions').insert(mappings);
  if (mappingError) throw new Error(`Mappings: ${mappingError.message}`);

  const { count, error: countError } = await supabase
    .from('exam_set_questions')
    .select('*', { count: 'exact', head: true })
    .eq('exam_set_id', EXAM_SET_ID);
  if (countError) throw new Error(`Verification: ${countError.message}`);
  assert(count === 30, `Expected 30 mapped questions, found ${count}.`);

  console.log(JSON.stringify({
    examSetId: EXAM_SET_ID,
    sourceExamSetId: SOURCE_EXAM_SET_ID,
    totalQuestions: count,
    durationMinutes: DURATION_MINUTES,
    distribution: SOURCES.map(({ subjectId, positions }) => ({ subjectId, count: positions.length }))
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
