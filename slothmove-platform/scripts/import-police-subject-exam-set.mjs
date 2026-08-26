#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const SUBJECTS = {
  thai: { title: 'ภาษาไทย', source: 'ไทย.pdf' },
  law: { title: 'กฎหมาย', source: 'กฏหมาย.pdf' },
  saraban: { title: 'งานสารบรรณ', source: 'สารบรรณ.pdf' },
  english: { title: 'ภาษาอังกฤษ', source: 'อังกฤษ.pdf' }
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function upsertOrThrow(query, label) {
  const { data, error } = await query;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

function validate(subjectId, setNo, payload) {
  const padded = String(setNo).padStart(2, '0');
  const expectedId = `police-${subjectId}-set-${padded}`;
  assert(payload?.examSet && Array.isArray(payload.questions), `Set ${expectedId}: invalid JSON shape`);
  assert(payload.examSet.id === expectedId, `Set ${expectedId}: id mismatch`);
  const expectedQuestionCount = payload.examSet.totalQuestions;
  assert(Number.isInteger(expectedQuestionCount) && expectedQuestionCount > 0, `Set ${expectedId}: invalid totalQuestions`);
  assert(payload.questions.length === expectedQuestionCount, `Set ${expectedId}: expected ${expectedQuestionCount} questions`);

  const positions = payload.questions.map((question) => question.position).join(',');
  const expectedPositions = Array.from({ length: expectedQuestionCount }, (_, index) => index + 1).join(',');
  assert(positions === expectedPositions, `Set ${expectedId}: question positions must be 1-${expectedQuestionCount}`);

  for (const question of payload.questions) {
    assert(typeof question.category === 'string' && question.category, `${expectedId} Q${question.position}: missing category`);
    assert(typeof question.prompt === 'string' && question.prompt, `${expectedId} Q${question.position}: missing prompt`);
    assert(Array.isArray(question.choices) && question.choices.length === 4, `${expectedId} Q${question.position}: expected 4 choices`);
    assert(new Set(question.choices).size === 4, `${expectedId} Q${question.position}: duplicate choices`);
    assert(Number.isInteger(question.correctChoiceIndex) && question.correctChoiceIndex >= 0 && question.correctChoiceIndex <= 3, `${expectedId} Q${question.position}: bad correctChoiceIndex`);
    assert(question.explanation && question.tip, `${expectedId} Q${question.position}: missing explanation/tip`);
  }
}

async function importSet(supabase, subjectId, setNo) {
  const subject = SUBJECTS[subjectId];
  assert(subject, `Unsupported subject: ${subjectId}`);
  const padded = String(setNo).padStart(2, '0');
  const setId = `police-${subjectId}-set-${padded}`;
  const productId = `police_${subjectId}_set_${padded}_free`;
  const jsonPath = path.join(ROOT, 'content/exams', `${setId}-notebooklm.json`);
  const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  validate(subjectId, setNo, payload);

  const now = new Date().toISOString();
  const generatedBy = payload.qualityNotes?.generatedBy ?? 'NotebookLM';
  const qaBy = payload.qualityNotes?.qaBy ?? 'ChatGPT';
  const title = payload.examSet.title ?? `${subject.title} ชุดที่ ${setNo}`;
  const description = payload.examSet.description ?? `ข้อสอบวิชา${subject.title} ชุดที่ ${setNo} จำนวน 50 ข้อ พร้อมเฉลย`;
  const accessType = setNo === 1 ? 'free' : 'paid';
  const price = setNo === 1 ? 0 : 1900;

  await upsertOrThrow(
    supabase.from('products').upsert({
      id: productId,
      title,
      description,
      price,
      type: 'exam_set',
      metadata: {
        course_id: 'police_admin',
        subject_id: subjectId,
        access_type: accessType,
        generated_by: generatedBy,
        qa_by: qaBy,
        source_reference: payload.examSet.sourceReference ?? `NotebookLM: ${subject.source}`
      },
      is_published: true
    }, { onConflict: 'id' }),
    `Upsert product ${productId}`
  );

  await upsertOrThrow(
    supabase.from('exam_sets').upsert({
      id: setId,
      course_id: 'police_admin',
      subject_id: subjectId,
      product_id: productId,
      title,
      description,
      source_label: payload.examSet.sourceReference ?? `NotebookLM: ${subject.source}`,
      access_type: accessType,
      duration_minutes: payload.examSet.durationMinutes ?? 75,
      total_questions: payload.questions.length,
      metadata: {
        version: setNo,
        qa_status: 'chatgpt_quality_passed',
        content_source: path.basename(jsonPath),
        source_reference: payload.examSet.sourceReference ?? `NotebookLM: ${subject.source}`,
        generated_by: generatedBy,
        qa_by: qaBy,
        difficulty_policy: payload.qualityNotes?.policy ?? 'same_or_harder_than_source',
        import_policy: 'as_is_from_notebooklm_after_quality_pass',
        no_manual_question_creation: true
      },
      is_published: true,
      updated_at: now
    }, { onConflict: 'id' }),
    `Upsert exam set ${setId}`
  );

  const { data: existingProductItem, error: productItemLookupError } = await supabase
    .from('product_items')
    .select('id')
    .eq('product_id', productId)
    .eq('subject_id', subjectId)
    .eq('item_id', setId)
    .maybeSingle();
  if (productItemLookupError) throw new Error(`Lookup product item ${productId}: ${productItemLookupError.message}`);
  if (!existingProductItem) {
    await upsertOrThrow(
      supabase.from('product_items').insert({
        product_id: productId,
        subject_id: subjectId,
        item_id: setId
      }),
      `Insert product item ${productId}`
    );
  }

  await upsertOrThrow(
    supabase.from('questions').upsert(
      payload.questions.map((question) => ({
        id: `${setId}-q${String(question.position).padStart(2, '0')}`,
        category: question.category,
        prompt: question.prompt,
        choices: question.choices,
        media: question.media ?? {},
        metadata: {
          source_question_no: question.position,
          qa_status: 'chatgpt_quality_passed',
          source: path.basename(jsonPath),
          generated_by: generatedBy,
          difficulty: question.difficulty ?? null,
          source_ref: question.sourceRef ?? null,
          verification_ref: question.verificationRef ?? null,
          dna_type: question.dnaType ?? null
        }
      })),
      { onConflict: 'id' }
    ),
    `Upsert questions ${setId}`
  );

  await upsertOrThrow(
    supabase.from('question_solutions').upsert(
      payload.questions.map((question) => ({
        question_id: `${setId}-q${String(question.position).padStart(2, '0')}`,
        correct_choice_index: question.correctChoiceIndex,
        explanation: question.explanation,
        tip: question.tip,
        metadata: {
          version: setNo,
          qa_status: 'chatgpt_quality_passed',
          source: path.basename(jsonPath),
          generated_by: generatedBy,
          answer_text: question.choices[question.correctChoiceIndex]
        }
      })),
      { onConflict: 'question_id' }
    ),
    `Upsert solutions ${setId}`
  );

  await upsertOrThrow(
    supabase.from('exam_set_questions').upsert(
      payload.questions.map((question) => ({
        exam_set_id: setId,
        question_id: `${setId}-q${String(question.position).padStart(2, '0')}`,
        position: question.position,
        points: 1
      })),
      { onConflict: 'exam_set_id,question_id' }
    ),
    `Upsert mappings ${setId}`
  );

  const { count, error: countError } = await supabase
    .from('exam_set_questions')
    .select('*', { count: 'exact', head: true })
    .eq('exam_set_id', setId);
  if (countError) throw new Error(`Count mappings ${setId}: ${countError.message}`);
  assert(count === payload.questions.length, `Set ${setId}: expected ${payload.questions.length} mapped questions after import, found ${count}`);

  return { setId, subjectId, questions: payload.questions.length };
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const [subjectId, rawSetNo] = process.argv.slice(2);
  assert(subjectId && rawSetNo, 'Usage: node scripts/import-police-subject-exam-set.mjs <thai|law|saraban|english> <setNo>');
  const setNo = Number(rawSetNo);
  assert(Number.isInteger(setNo) && setNo > 0, 'setNo must be a positive integer.');

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert(url, 'Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  assert(serviceRoleKey, 'Set SUPABASE_SERVICE_ROLE_KEY.');

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  console.log(JSON.stringify({ imported: await importSet(supabase, subjectId, setNo) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
