#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const DEFAULT_SETS = [1, 2, 3];

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

function validate(setNo, payload) {
  const padded = String(setNo).padStart(2, '0');
  assert(payload?.examSet && Array.isArray(payload.questions), `Set ${setNo}: invalid JSON shape`);
  assert(payload.examSet.id === `police-computer-set-${padded}`, `Set ${setNo}: id mismatch`);
  assert(payload.questions.length === 30, `Set ${setNo}: expected 30 questions`);

  const positions = payload.questions.map((question) => question.position).join(',');
  const expectedPositions = Array.from({ length: 30 }, (_, index) => index + 1).join(',');
  assert(positions === expectedPositions, `Set ${setNo}: question positions must be 1-30`);

  for (const question of payload.questions) {
    assert(typeof question.category === 'string' && question.category, `Set ${setNo} Q${question.position}: missing category`);
    assert(typeof question.prompt === 'string' && question.prompt, `Set ${setNo} Q${question.position}: missing prompt`);
    assert(Array.isArray(question.choices) && question.choices.length === 4, `Set ${setNo} Q${question.position}: expected 4 choices`);
    assert(new Set(question.choices).size === 4, `Set ${setNo} Q${question.position}: duplicate choices`);
    assert(question.correctChoiceIndex >= 0 && question.correctChoiceIndex <= 3, `Set ${setNo} Q${question.position}: bad correctChoiceIndex`);
    assert(question.explanation && question.tip, `Set ${setNo} Q${question.position}: missing explanation/tip`);
  }
}

async function importSet(supabase, setNo) {
  const padded = String(setNo).padStart(2, '0');
  const setId = `police-computer-set-${padded}`;
  const productId = `police_computer_set_${padded}_free`;
  const jsonPath = path.join(ROOT, 'content/exams', `${setId}-notebooklm.json`);
  const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  validate(setNo, payload);

  const now = new Date().toISOString();
  const title = payload.examSet.title ?? `คอมพิวเตอร์ ชุดที่ ${setNo}`;
  const description = payload.examSet.description ?? `ข้อสอบวิชาคอมพิวเตอร์ ชุดที่ ${setNo} จำนวน 30 ข้อ พร้อมเฉลย`;
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
        subject_id: 'computer',
        access_type: accessType,
        generated_by: 'NotebookLM',
        qa_by: 'Codex structural and content audit 2026-08-26',
        source_reference: payload.examSet.sourceReference ?? 'NotebookLM: ท้ายบทคอม.pdf'
      },
      is_published: true
    }, { onConflict: 'id' }),
    `Upsert product ${productId}`
  );

  await upsertOrThrow(
    supabase.from('exam_sets').upsert({
      id: setId,
      course_id: 'police_admin',
      subject_id: 'computer',
      product_id: productId,
      title,
      description,
      source_label: payload.examSet.sourceReference ?? 'NotebookLM: ท้ายบทคอม.pdf',
      access_type: accessType,
      duration_minutes: payload.examSet.durationMinutes ?? 38,
      total_questions: payload.questions.length,
      metadata: {
        version: setNo,
        qa_status: 'content_audited_2026_08_26',
        content_source: path.basename(jsonPath),
        source_reference: payload.examSet.sourceReference ?? 'NotebookLM: ท้ายบทคอม.pdf',
        generated_by: 'NotebookLM',
        import_policy: 'audited_and_corrected_before_import',
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
    .eq('subject_id', 'computer')
    .eq('item_id', setId)
    .maybeSingle();
  if (productItemLookupError) throw new Error(`Lookup product item ${productId}: ${productItemLookupError.message}`);
  if (!existingProductItem) {
    await upsertOrThrow(
      supabase.from('product_items').insert({
        product_id: productId,
        subject_id: 'computer',
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
          qa_status: 'content_audited_2026_08_26',
          source: path.basename(jsonPath),
          generated_by: 'NotebookLM'
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
          qa_status: 'content_audited_2026_08_26',
          source: path.basename(jsonPath),
          generated_by: 'NotebookLM'
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
  assert(count === 30, `Set ${setId}: expected 30 mapped questions after import, found ${count}`);

  return {
    setId,
    questions: payload.questions.length,
    correctChoiceIndexes: [...new Set(payload.questions.map((question) => question.correctChoiceIndex))].sort()
  };
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert(url, 'Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  assert(serviceRoleKey, 'Set SUPABASE_SERVICE_ROLE_KEY.');

  const args = process.argv.slice(2).map(Number).filter(Number.isFinite);
  const setNumbers = args.length ? args : DEFAULT_SETS;
  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const results = [];
  for (const setNo of setNumbers) results.push(await importSet(supabase, setNo));
  console.log(JSON.stringify({ imported: results }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
