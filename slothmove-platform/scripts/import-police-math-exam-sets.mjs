#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const DEFAULT_SETS = [5, 6, 7];

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
  assert(payload?.examSet && Array.isArray(payload.questions), `Set ${setNo}: invalid JSON shape`);
  assert(payload.examSet.id === `police-math-set-${String(setNo).padStart(2, '0')}`, `Set ${setNo}: id mismatch`);
  assert(payload.questions.length === 30, `Set ${setNo}: expected 30 questions`);
  assert(payload.questions.filter((question) => question.media?.src).length === 3, `Set ${setNo}: expected 3 media questions`);

  const positions = payload.questions.map((question) => question.position).join(',');
  const expectedPositions = Array.from({ length: 30 }, (_, index) => index + 1).join(',');
  assert(positions === expectedPositions, `Set ${setNo}: question positions must be 1-30`);

  for (const question of payload.questions) {
    assert(question.choices.length === 4, `Set ${setNo} Q${question.position}: expected 4 choices`);
    assert(new Set(question.choices).size === 4, `Set ${setNo} Q${question.position}: duplicate choices`);
    assert(question.correctChoiceIndex >= 0 && question.correctChoiceIndex <= 3, `Set ${setNo} Q${question.position}: bad correctChoiceIndex`);
    assert(question.explanation && question.tip, `Set ${setNo} Q${question.position}: missing explanation/tip`);
  }
}

async function importSet(supabase, setNo) {
  const padded = String(setNo).padStart(2, '0');
  const setId = `police-math-set-${padded}`;
  const productId = `police_math_set_${padded}_free`;
  const jsonPath = path.join(ROOT, 'content/exams', `${setId}-original.json`);
  const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  validate(setNo, payload);

  const now = new Date().toISOString();
  const baseSourceSet = payload.examSet.baseSourceSet ?? setNo - 4;

  await upsertOrThrow(
    supabase.from('products').upsert({
      id: productId,
      title: payload.examSet.title,
      description: `ข้อสอบตำรวจ วิชาความสามารถทั่วไป ${payload.examSet.title} จำนวน 30 ข้อ พร้อมเฉลย`,
      price: 0,
      type: 'exam_set',
      metadata: { course_id: 'police_admin', subject_id: 'math', access_type: 'free' },
      is_published: true
    }, { onConflict: 'id' }),
    `Upsert product ${productId}`
  );

  await upsertOrThrow(
    supabase.from('exam_sets').upsert({
      id: setId,
      course_id: 'police_admin',
      subject_id: 'math',
      product_id: productId,
      title: payload.examSet.title,
      description: payload.examSet.description,
      source_label: `NotebookLM Source Set ${baseSourceSet} -> SlothMove Additional Set ${setNo}`,
      access_type: 'free',
      duration_minutes: payload.examSet.durationMinutes,
      total_questions: payload.questions.length,
      metadata: {
        version: setNo,
        qa_status: payload.examSet.qaStatus,
        base_source_set: baseSourceSet,
        content_source: path.basename(jsonPath),
        source_pattern: payload.examSet.sourcePattern,
        difficulty_policy: 'same_or_harder_than_source',
        generated_images_with_chatgpt: true,
        media_question_count: 3
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
    .eq('subject_id', 'math')
    .eq('item_id', setId)
    .maybeSingle();
  if (productItemLookupError) throw new Error(`Lookup product item ${productId}: ${productItemLookupError.message}`);
  if (!existingProductItem) {
    await upsertOrThrow(
      supabase.from('product_items').insert({
        product_id: productId,
        subject_id: 'math',
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
          qa_status: 'passed',
          base_source_set: baseSourceSet,
          difficulty_policy: 'same_or_harder_than_source',
          image_prompt: question.imagePrompt ?? null
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
          qa_status: 'passed',
          source: path.basename(jsonPath),
          base_source_set: baseSourceSet
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
    baseSourceSet,
    questions: payload.questions.length,
    media: payload.questions.filter((question) => question.media?.src).map((question) => question.position)
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
