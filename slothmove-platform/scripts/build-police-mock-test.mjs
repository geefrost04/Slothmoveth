#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const EXAM_SET_ID = 'police-mock_test-set-01';
const PRODUCT_ID = 'police_mock_test_set_01';
const PRICE_AMOUNT = 5900;
const DURATION_MINUTES = 180;
const OUTPUT_PATH = path.join(ROOT, 'content/exams/police-mock-test-set-01.json');
const AUDIT_PATH = path.join(ROOT, 'content/exams/police-mock-test-set-01-audit.md');
const COMPUTER_SUPPLEMENT_PATH = path.join(ROOT, 'content/exams/police-computer-mock-supplement-01.json');
const SOURCES = [
  {
    subjectId: 'math', subjectTitle: 'ความรู้ทั่วไป', examSetId: 'police-math-set-04', count: 20,
    positions: [1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 19, 21, 22, 24, 26, 28, 29]
  },
  {
    subjectId: 'thai', subjectTitle: 'ภาษาไทย', examSetId: 'police-thai-set-01', count: 20,
    positions: [1, 3, 7, 9, 11, 15, 17, 19, 21, 22, 23, 24, 25, 27, 29, 31, 32, 33, 34, 35]
  },
  {
    subjectId: 'computer', subjectTitle: 'คอมพิวเตอร์', examSetId: 'police-computer-set-01', count: 40,
    positions: Array.from({ length: 30 }, (_, index) => index + 1), supplementCount: 10
  },
  {
    subjectId: 'saraban', subjectTitle: 'งานสารบรรณ', examSetId: 'police-saraban-set-01', count: 30,
    positions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 21, 23, 25, 26, 27, 28, 29, 30, 31, 32, 38, 39, 40, 41, 42, 46, 47, 48]
  },
  {
    subjectId: 'law', subjectTitle: 'กฎหมาย', examSetId: 'police-law-set-01', count: 25,
    positions: [1, 4, 6, 8, 9, 11, 12, 14, 16, 17, 19, 22, 23, 25, 28, 30, 32, 34, 37, 39, 42, 44, 45, 46, 49]
  },
  {
    subjectId: 'english', subjectTitle: 'ภาษาอังกฤษ', examSetId: 'police-english-set-01', count: 15,
    positions: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29]
  }
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

async function loadSourceBundle(supabase, source) {
  const { data: mappings, error: mappingError } = await supabase
    .from('exam_set_questions')
    .select('question_id,position')
    .eq('exam_set_id', source.examSetId)
    .order('position');
  if (mappingError) throw new Error(`${source.examSetId}: ${mappingError.message}`);
  assert(mappings?.length, `${source.examSetId}: no questions found`);

  const questionIds = mappings.map((mapping) => mapping.question_id);
  const [{ data: questions, error: questionError }, { data: solutions, error: solutionError }] = await Promise.all([
    supabase.from('questions').select('id,category,prompt,choices,media,metadata').in('id', questionIds),
    supabase.from('question_solutions').select('question_id,correct_choice_index,explanation,tip,metadata').in('question_id', questionIds)
  ]);
  if (questionError) throw new Error(`${source.examSetId} questions: ${questionError.message}`);
  if (solutionError) throw new Error(`${source.examSetId} solutions: ${solutionError.message}`);

  const questionById = new Map((questions ?? []).map((question) => [question.id, question]));
  const solutionById = new Map((solutions ?? []).map((solution) => [solution.question_id, solution]));
  return mappings.map((mapping) => {
    const question = questionById.get(mapping.question_id);
    const solution = solutionById.get(mapping.question_id);
    assert(question && solution, `${source.examSetId} Q${mapping.position}: incomplete source data`);
    return { ...question, ...solution, sourcePosition: mapping.position };
  });
}

function loadComputerSupplement() {
  const payload = JSON.parse(fs.readFileSync(COMPUTER_SUPPLEMENT_PATH, 'utf8'));
  assert(Array.isArray(payload.questions) && payload.questions.length === 10, 'Computer supplement must contain 10 questions');
  return payload.questions.map((question) => ({
    id: `${payload.sourceExamSetId}-q${String(question.position).padStart(2, '0')}`,
    category: question.category,
    prompt: question.prompt,
    choices: question.choices,
    media: question.media ?? {},
    correct_choice_index: question.correctChoiceIndex,
    explanation: question.explanation,
    tip: question.tip,
    sourcePosition: question.position,
    sourceExamSetId: payload.sourceExamSetId,
    sourceType: 'dna-derived-unique-item'
  }));
}

function selectQuestions(source, bundle, computerSupplement) {
  const byPosition = new Map(bundle.map((question) => [question.sourcePosition, question]));
  const selected = source.positions.map((position) => {
    const question = byPosition.get(position);
    assert(question, `${source.examSetId}: source position ${position} not found`);
    return question;
  });
  if (source.subjectId === 'computer') selected.push(...computerSupplement);
  assert(selected.length === source.count, `${source.examSetId}: expected ${source.count} selected questions, found ${selected.length}`);
  return selected;
}

function buildPayload(sourceBundles, computerSupplement) {
  let position = 0;
  const questions = SOURCES.flatMap((source) => {
    const bundle = sourceBundles.get(source.examSetId);
    assert(bundle?.length, `${source.examSetId}: source bundle is empty`);
    return selectQuestions(source, bundle, computerSupplement).map((sourceQuestion) => {
      position += 1;
      return {
        position,
        subjectId: source.subjectId,
        subjectTitle: source.subjectTitle,
        category: source.subjectTitle,
        originalCategory: sourceQuestion.category,
        prompt: sourceQuestion.prompt,
        choices: sourceQuestion.choices,
        correctChoiceIndex: sourceQuestion.correct_choice_index,
        explanation: sourceQuestion.explanation,
        tip: sourceQuestion.tip,
        media: sourceQuestion.media ?? {},
        sourceExamSetId: sourceQuestion.sourceExamSetId ?? source.examSetId,
        sourceQuestionId: sourceQuestion.id,
        sourcePosition: sourceQuestion.sourcePosition,
        sourceOccurrence: 1,
        sourceType: sourceQuestion.sourceType ?? 'source-bank-selection'
      };
    });
  });

  return {
    examSet: {
      id: EXAM_SET_ID,
      title: 'Mock Test นายสิบตำรวจ ชุดที่ 1',
      description: 'ข้อสอบจำลองสนามจริง 150 ข้อ รวม 6 วิชา พร้อมจับเวลาและเฉลยแบบแยกรายวิชา',
      durationMinutes: DURATION_MINUTES,
      totalQuestions: questions.length,
      accessType: 'paid',
      priceSatang: PRICE_AMOUNT
    },
    qualityNotes: {
      correctChoiceIndexBase: 0,
      policy: 'Stratified selection from each configured Set 1 source bank. Computer allocation includes 10 unique items derived from Set 1 topic and difficulty DNA.',
      selection: SOURCES.map(({ subjectId, subjectTitle, examSetId, count, positions, supplementCount = 0 }) => ({
        subjectId, subjectTitle, examSetId, count, positions, supplementCount
      })),
      repetitionPolicy: 'Exact question repetition is prohibited.',
      generatedAt: new Date().toISOString()
    },
    questions
  };
}

function auditPayload(payload) {
  const errors = [];
  const counts = Object.fromEntries(SOURCES.map((source) => [source.subjectId, 0]));
  const sourceUse = new Map();
  const promptUse = new Map();
  payload.questions.forEach((question, index) => {
    if (question.position !== index + 1) errors.push(`Q${index + 1}: non-sequential position`);
    if (!(question.subjectId in counts)) errors.push(`Q${question.position}: unknown subject`);
    else counts[question.subjectId] += 1;
    if (!question.prompt || !question.explanation || !question.tip) errors.push(`Q${question.position}: incomplete content`);
    if (!Array.isArray(question.choices) || question.choices.length < 4) errors.push(`Q${question.position}: invalid choices`);
    if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex >= question.choices.length) {
      errors.push(`Q${question.position}: invalid answer index`);
    }
    const key = `${question.subjectId}:${question.sourceQuestionId}`;
    sourceUse.set(key, (sourceUse.get(key) ?? 0) + 1);
    const normalizedPrompt = question.prompt.trim().replace(/\s+/g, ' ');
    promptUse.set(normalizedPrompt, (promptUse.get(normalizedPrompt) ?? 0) + 1);
  });
  for (const source of SOURCES) {
    if (counts[source.subjectId] !== source.count) errors.push(`${source.subjectId}: expected ${source.count}, found ${counts[source.subjectId]}`);
  }
  if (payload.questions.length !== 150) errors.push(`Expected 150 questions, found ${payload.questions.length}`);
  const repeatedSources = [...sourceUse.entries()]
    .filter(([, count]) => count > 1)
    .map(([sourceQuestion, count]) => ({ sourceQuestion, count }));
  const duplicatePrompts = [...promptUse.entries()]
    .filter(([, count]) => count > 1)
    .map(([prompt, count]) => ({ prompt, count }));
  if (repeatedSources.length) errors.push(`Repeated source questions: ${repeatedSources.length}`);
  if (duplicatePrompts.length) errors.push(`Duplicate prompts: ${duplicatePrompts.length}`);
  return { passed: errors.length === 0, errors, counts, repeatedSources, duplicatePrompts };
}

async function importPayload(supabase, stripe, payload) {
  const { data: currentProduct } = await supabase.from('products').select('stripe_price_id').eq('id', PRODUCT_ID).maybeSingle();
  let stripePriceId = currentProduct?.stripe_price_id ?? null;
  let stripeProductId = null;
  if (stripePriceId) {
    const currentPrice = await stripe.prices.retrieve(stripePriceId);
    stripeProductId = typeof currentPrice.product === 'string' ? currentPrice.product : currentPrice.product.id;
    if (currentPrice.currency !== 'thb' || currentPrice.unit_amount !== PRICE_AMOUNT || !currentPrice.active) stripePriceId = null;
  }
  if (!stripeProductId) {
    const stripeProduct = await stripe.products.create({
      name: payload.examSet.title,
      description: payload.examSet.description,
      metadata: { local_product_id: PRODUCT_ID, course_id: 'police_admin', subject_id: 'mock_test' }
    });
    stripeProductId = stripeProduct.id;
  } else {
    await stripe.products.update(stripeProductId, {
      name: payload.examSet.title,
      description: payload.examSet.description,
      metadata: { local_product_id: PRODUCT_ID, course_id: 'police_admin', subject_id: 'mock_test' }
    });
  }
  if (!stripePriceId) {
    const stripePrice = await stripe.prices.create({
      product: stripeProductId,
      currency: 'thb',
      unit_amount: PRICE_AMOUNT,
      metadata: { local_product_id: PRODUCT_ID }
    });
    stripePriceId = stripePrice.id;
  }

  const { error: productError } = await supabase.from('products').upsert({
    id: PRODUCT_ID,
    title: payload.examSet.title,
    description: payload.examSet.description,
    price: PRICE_AMOUNT,
    type: 'exam_set',
    metadata: { course_id: 'police_admin', subject_id: 'mock_test', access_type: 'paid', currency: 'thb' },
    stripe_price_id: stripePriceId,
    is_published: true
  }, { onConflict: 'id' });
  if (productError) throw new Error(`Product: ${productError.message}`);

  const { error: examError } = await supabase.from('exam_sets').upsert({
    id: EXAM_SET_ID,
    course_id: 'police_admin',
    subject_id: 'mock_test',
    product_id: PRODUCT_ID,
    title: payload.examSet.title,
    description: payload.examSet.description,
    source_label: 'DNA จากชุดที่ 1 ของ 6 วิชา',
    access_type: 'paid',
    duration_minutes: DURATION_MINUTES,
    total_questions: payload.questions.length,
    metadata: { version: 2, qa_status: 'independent_reaudit_passed_2026_08_26', source_policy: payload.qualityNotes.policy },
    is_published: true,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' });
  if (examError) throw new Error(`Exam set: ${examError.message}`);

  const { data: productItem, error: productItemLookupError } = await supabase
    .from('product_items')
    .select('id')
    .eq('product_id', PRODUCT_ID)
    .eq('subject_id', 'mock_test')
    .eq('item_id', EXAM_SET_ID)
    .maybeSingle();
  if (productItemLookupError) throw new Error(`Product item lookup: ${productItemLookupError.message}`);
  if (!productItem) {
    const { error } = await supabase.from('product_items').insert({ product_id: PRODUCT_ID, subject_id: 'mock_test', item_id: EXAM_SET_ID });
    if (error) throw new Error(`Product item: ${error.message}`);
  }

  const questionRows = payload.questions.map((question) => ({
    id: `${EXAM_SET_ID}-q${String(question.position).padStart(3, '0')}`,
    category: question.category,
    prompt: question.prompt,
    choices: question.choices,
    media: question.media,
    metadata: {
      source_subject_id: question.subjectId,
      source_exam_set_id: question.sourceExamSetId,
      source_question_id: question.sourceQuestionId,
      source_position: question.sourcePosition,
      source_category: question.originalCategory,
      source_occurrence: question.sourceOccurrence,
      source_type: question.sourceType,
      qa_status: 'independent_reaudit_passed_2026_08_26'
    }
  }));
  const { error: questionError } = await supabase.from('questions').upsert(questionRows, { onConflict: 'id' });
  if (questionError) throw new Error(`Questions: ${questionError.message}`);

  const solutionRows = payload.questions.map((question) => ({
    question_id: `${EXAM_SET_ID}-q${String(question.position).padStart(3, '0')}`,
    correct_choice_index: question.correctChoiceIndex,
    explanation: question.explanation,
    tip: question.tip,
    metadata: { source_question_id: question.sourceQuestionId, source_category: question.originalCategory, qa_status: 'independent_reaudit_passed_2026_08_26' }
  }));
  const { error: solutionError } = await supabase.from('question_solutions').upsert(solutionRows, { onConflict: 'question_id' });
  if (solutionError) throw new Error(`Solutions: ${solutionError.message}`);

  const mappingRows = payload.questions.map((question) => ({
    exam_set_id: EXAM_SET_ID,
    question_id: `${EXAM_SET_ID}-q${String(question.position).padStart(3, '0')}`,
    position: question.position,
    points: 1
  }));
  const { error: mappingError } = await supabase.from('exam_set_questions').upsert(mappingRows, { onConflict: 'exam_set_id,question_id' });
  if (mappingError) throw new Error(`Mappings: ${mappingError.message}`);

  const { count, error: countError } = await supabase
    .from('exam_set_questions')
    .select('*', { count: 'exact', head: true })
    .eq('exam_set_id', EXAM_SET_ID);
  if (countError) throw new Error(`Mapping count: ${countError.message}`);
  assert(count === 150, `Imported mapping count must be 150, found ${count}`);
  return { stripePriceId, mappedQuestions: count };
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  assert(supabaseUrl && serviceRoleKey && stripeSecretKey, 'Supabase or Stripe environment variables are missing');
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const stripe = new Stripe(stripeSecretKey);

  const sourceBundles = new Map();
  for (const source of SOURCES) sourceBundles.set(source.examSetId, await loadSourceBundle(supabase, source));
  const payload = buildPayload(sourceBundles, loadComputerSupplement());
  const audit = auditPayload(payload);
  assert(audit.passed, `Mock Test audit failed: ${audit.errors.join('; ')}`);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(AUDIT_PATH, [
    '# Police Mock Test Set 01 - Self Audit',
    '',
    '- Status: **PASS**',
    `- Total questions: ${payload.questions.length}`,
    `- Duration: ${DURATION_MINUTES} minutes`,
    `- Price: THB ${PRICE_AMOUNT / 100}`,
    `- Distribution: ${SOURCES.map((source) => `${source.subjectTitle} ${audit.counts[source.subjectId]}`).join(', ')}`,
    `- Repeated source questions: ${audit.repeatedSources.length}`,
    `- Duplicate prompts: ${audit.duplicatePrompts.length}`,
    `- Structural errors: ${audit.errors.length}`,
    '',
    '## Repeated Sources',
    '',
    ...(audit.repeatedSources.length ? audit.repeatedSources.map((item) => `- ${item.sourceQuestion}: ${item.count} uses`) : ['- None']),
    ''
  ].join('\n'), 'utf8');

  const imported = await importPayload(supabase, stripe, payload);
  console.log(JSON.stringify({ outputPath: OUTPUT_PATH, auditPath: AUDIT_PATH, audit, imported }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
