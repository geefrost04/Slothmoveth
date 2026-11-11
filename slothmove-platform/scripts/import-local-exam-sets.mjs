#!/usr/bin/env node
// Imports the free exam sets of a local-content course (content/exams/<course>-<subject>-set-NN.json)
// into Supabase. Course defaults to onwr. Dry-run by default; pass --apply to write.
//
// Usage: node scripts/import-local-exam-sets.mjs [--course=onwr|nesdc|pat] [--apply] [--sets=id1,id2]

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const COURSE = (process.argv.find((arg) => arg.startsWith('--course='))?.slice('--course='.length)) || 'onwr';
const SOURCE_LABELS = {
  onwr: 'SlothMove: สทนช. นักวิเคราะห์นโยบายและแผน (2569)',
  nesdc: 'SlothMove: สศช. งานวิเคราะห์นโยบายและแผน (2569)',
  pat: 'SlothMove: กทท. นักวิชาการ 6 กองแผนวิสาหกิจ (2569)',
  police_admin: 'SlothMove: นายสิบตำรวจ สายอำนวยการ (2569)'
};
// Exam set ids start with this prefix (police sets are "police-…", not "police_admin-…").
const ID_PREFIX = { onwr: 'onwr', nesdc: 'nesdc', pat: 'pat', police_admin: 'police' };
if (!SOURCE_LABELS[COURSE]) throw new Error(`Unknown course: ${COURSE}`);
// Police has many sets built by other scripts: only import the sets named with --sets, never a full run.
if (COURSE === 'police_admin' && !process.argv.some((arg) => arg.startsWith('--sets='))) {
  throw new Error('police_admin imports need --sets=id1,id2 (a full run would unpublish other police sets).');
}
const DEFAULT_SET_IDS = fs.readdirSync(path.join(ROOT, 'content/exams'))
  .filter((name) => new RegExp(`^${ID_PREFIX[COURSE]}-[a-z_]+-(?:set|drill)-\\d{2}\\.json$`).test(name))
  .map((name) => name.replace(/\.json$/, ''))
  .sort();
const setsArg = process.argv.find((arg) => arg.startsWith('--sets='));
const SET_IDS = setsArg ? setsArg.slice('--sets='.length).split(',').filter(Boolean) : DEFAULT_SET_IDS;

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
    next: `Run with --apply to write these free sets to Supabase (a full run also unpublishes ${COURSE} sets not listed here).`
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
  const subjectId = set.id.split('-')[1];
  const questionId = (question) => `${set.id}-q${String(question.position).padStart(2, '0')}`;
  await run(db.from('products').upsert({
    id: productId,
    title: set.title,
    description: set.description,
    price: 0,
    type: 'exam_set',
    metadata: { course_id: COURSE, subject_id: subjectId, access_type: 'free', catalog: `${COURSE}_${subjectId}` },
    is_published: true
  }, { onConflict: 'id' }), `product ${set.id}`);
  await run(db.from('exam_sets').upsert({
    id: set.id,
    course_id: COURSE,
    subject_id: subjectId,
    product_id: productId,
    title: set.title,
    description: set.description,
    source_label: SOURCE_LABELS[COURSE],
    access_type: 'free',
    duration_minutes: set.durationMinutes,
    total_questions: questions.length,
    metadata: {
      catalog: `${COURSE}_${subjectId}`,
      catalog_order: set.catalogOrder,
      content_source: `${set.id}.json`,
      generated_by: qualityNotes?.generatedBy
    },
    is_published: true,
    updated_at: now
  }, { onConflict: 'id' }), `exam set ${set.id}`);
  const existingItem = await run(db.from('product_items').select('id').eq('product_id', productId).eq('subject_id', subjectId).eq('item_id', set.id).maybeSingle(), `product item lookup ${set.id}`);
  if (!existingItem) await run(db.from('product_items').insert({ product_id: productId, subject_id: subjectId, item_id: set.id }), `product item ${set.id}`);

  await run(db.from('questions').upsert(questions.map((question) => ({
    id: questionId(question),
    category: question.category,
    prompt: question.prompt,
    choices: question.choices,
    media: question.media ?? {},
    metadata: { source_subject_id: subjectId, source_ref: question.sourceRef, topic: question.topic, difficulty: question.difficulty }
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

// Hide this course's sets that no longer exist locally (e.g. the old 3-subject layout), only on a full import.
let unpublished = [];
if (!setsArg) {
  const live = await run(db.from('exam_sets').select('id').eq('course_id', COURSE).eq('is_published', true), `list live ${COURSE} sets`);
  unpublished = live.map((row) => row.id).filter((id) => !SET_IDS.includes(id));
  if (unpublished.length) {
    await run(db.from('exam_sets').update({ is_published: false, updated_at: now }).in('id', unpublished), 'unpublish old sets');
    await run(db.from('products').update({ is_published: false }).in('id', unpublished.map((id) => id.replaceAll('-', '_'))), 'unpublish old products');
  }
}

console.log(JSON.stringify({ mode: 'applied', imported: SET_IDS, unpublished }, null, 2));
