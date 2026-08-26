#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();

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
  const inputPath = path.resolve(ROOT, process.argv[2] ?? '');
  assert(process.argv[2] && fs.existsSync(inputPath), 'Usage: node scripts/verify-police-mock-test-file.mjs <payload.json>');
  const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const examSetId = payload.examSet.id;
  const productId = examSetId.replace('police-mock_test-set-', 'police_mock_test_set_');
  const questionIds = payload.questions.map((question) => `${examSetId}-q${String(question.position).padStart(3, '0')}`);
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert(supabaseUrl && serviceRoleKey, 'Supabase environment variables are missing');
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const [examResult, productResult, mappingResult, questionResult, solutionResult] = await Promise.all([
    supabase.from('exam_sets').select('id,total_questions,access_type,metadata').eq('id', examSetId).single(),
    supabase.from('products').select('id,price,stripe_price_id,is_published').eq('id', productId).single(),
    supabase.from('exam_set_questions').select('question_id,position').eq('exam_set_id', examSetId).order('position'),
    supabase.from('questions').select('id,prompt,choices,metadata').in('id', questionIds),
    supabase.from('question_solutions').select('question_id,correct_choice_index,explanation,tip,metadata').in('question_id', questionIds)
  ]);
  for (const [label, result] of [['exam', examResult], ['product', productResult], ['mappings', mappingResult], ['questions', questionResult], ['solutions', solutionResult]]) {
    if (result.error) throw new Error(`${label}: ${result.error.message}`);
  }

  const mappings = mappingResult.data;
  const questionsById = new Map(questionResult.data.map((question) => [question.id, question]));
  const solutionsById = new Map(solutionResult.data.map((solution) => [solution.question_id, solution]));
  assert(examResult.data.total_questions === payload.questions.length, 'Exam total does not match payload');
  assert(examResult.data.metadata?.qa_status === payload.qualityNotes.qaStatus, 'Exam QA status does not match payload');
  if (payload.examSet.accessType === 'paid') {
    assert(productResult.data.price === payload.examSet.priceSatang, `Product price mismatch: expected ${payload.examSet.priceSatang}, found ${productResult.data.price}`);
    assert(productResult.data.stripe_price_id, 'Product Stripe price id is missing');
    assert(productResult.data.is_published, 'Product is not published');
  }
  assert(mappings.length === payload.questions.length, `Expected ${payload.questions.length} mappings, found ${mappings.length}`);

  payload.questions.forEach((expected, index) => {
    const id = questionIds[index];
    const mapping = mappings[index];
    const question = questionsById.get(id);
    const solution = solutionsById.get(id);
    assert(mapping?.question_id === id && mapping.position === expected.position, `Q${expected.position}: mapping mismatch`);
    assert(question?.prompt === expected.prompt && JSON.stringify(question.choices) === JSON.stringify(expected.choices), `Q${expected.position}: question mismatch`);
    assert(question.metadata?.source_dna_set === expected.sourceDnaSet && question.metadata?.source_mechanism === expected.sourceMechanism && question.metadata?.difficulty === expected.difficulty, `Q${expected.position}: DNA metadata mismatch`);
    assert(solution?.correct_choice_index === expected.correctChoiceIndex && solution.explanation === expected.explanation && solution.tip === expected.tip, `Q${expected.position}: solution mismatch`);
  });

  console.log(JSON.stringify({
    passed: true,
    examSetId,
    accessType: examResult.data.access_type,
    priceSatang: productResult.data.price,
    stripePriceId: productResult.data.stripe_price_id,
    qaStatus: examResult.data.metadata.qa_status,
    mappings: mappings.length,
    questions: questionResult.data.length,
    solutions: solutionResult.data.length,
    dnaMetadataComplete: true
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
