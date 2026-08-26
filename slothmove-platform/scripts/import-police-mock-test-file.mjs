#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Stripe from 'stripe';
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

function validatePayload(payload) {
  const { examSet, questions } = payload;
  assert(examSet?.id && /^police-mock_test-set-\d{2}$/.test(examSet.id), 'Invalid exam set id');
  assert(Array.isArray(questions) && questions.length === 150, 'Mock Test must contain exactly 150 questions');
  assert(examSet.totalQuestions === questions.length, 'totalQuestions does not match question count');
  assert(['free', 'paid'].includes(examSet.accessType), 'accessType must be free or paid');
  if (examSet.accessType === 'paid') assert(examSet.priceSatang > 0, 'Paid Mock Test requires a positive price');
  questions.forEach((question, index) => {
    assert(question.position === index + 1, `Q${index + 1}: invalid position`);
    assert(question.prompt?.trim(), `Q${index + 1}: missing prompt`);
    assert(Array.isArray(question.choices) && question.choices.length === 4, `Q${index + 1}: choices must contain four items`);
    assert(Number.isInteger(question.correctChoiceIndex) && question.correctChoiceIndex >= 0 && question.correctChoiceIndex <= 3, `Q${index + 1}: invalid answer`);
    assert(question.explanation?.trim() && question.tip?.trim(), `Q${index + 1}: missing explanation or tip`);
  });
}

async function verifyImportedPayload(supabase, payload) {
  const examSetId = payload.examSet.id;
  const expectedQuestionIds = payload.questions.map((question) => `${examSetId}-q${String(question.position).padStart(3, '0')}`);
  const { data: mappings, error: mappingError } = await supabase
    .from('exam_set_questions')
    .select('question_id,position')
    .eq('exam_set_id', examSetId)
    .order('position');
  if (mappingError) throw new Error(`Verify mappings: ${mappingError.message}`);
  assert(mappings?.length === payload.questions.length, `Verify mappings: expected ${payload.questions.length}, found ${mappings?.length ?? 0}`);
  assert(mappings.every((mapping, index) => mapping.question_id === expectedQuestionIds[index] && mapping.position === index + 1), 'Verify mappings: order or question id mismatch');

  const { data: questions, error: questionError } = await supabase
    .from('questions')
    .select('id,metadata')
    .in('id', expectedQuestionIds);
  if (questionError) throw new Error(`Verify questions: ${questionError.message}`);
  assert(questions?.length === payload.questions.length, `Verify questions: expected ${payload.questions.length}, found ${questions?.length ?? 0}`);
  assert(questions.every((question) => question.metadata?.source_dna_set && question.metadata?.source_mechanism && question.metadata?.difficulty), 'Verify questions: incomplete DNA metadata');

  const { data: solutions, error: solutionError } = await supabase
    .from('question_solutions')
    .select('question_id,correct_choice_index,explanation,tip')
    .in('question_id', expectedQuestionIds);
  if (solutionError) throw new Error(`Verify solutions: ${solutionError.message}`);
  assert(solutions?.length === payload.questions.length, `Verify solutions: expected ${payload.questions.length}, found ${solutions?.length ?? 0}`);
  const solutionById = new Map(solutions.map((solution) => [solution.question_id, solution]));
  assert(payload.questions.every((question, index) => {
    const solution = solutionById.get(expectedQuestionIds[index]);
    return solution?.correct_choice_index === question.correctChoiceIndex && solution.explanation === question.explanation && solution.tip === question.tip;
  }), 'Verify solutions: answer or explanation mismatch');

  return { mappings: mappings.length, questions: questions.length, solutions: solutions.length, dnaMetadataComplete: true };
}

async function upsertPaidProduct(supabase, stripe, payload, productId) {
  const priceAmount = payload.examSet.priceSatang;
  const { data: currentProduct } = await supabase
    .from('products')
    .select('stripe_price_id')
    .eq('id', productId)
    .maybeSingle();

  let stripePriceId = currentProduct?.stripe_price_id ?? null;
  let stripeProductId = null;
  if (stripePriceId) {
    const currentPrice = await stripe.prices.retrieve(stripePriceId);
    stripeProductId = typeof currentPrice.product === 'string' ? currentPrice.product : currentPrice.product.id;
    if (currentPrice.currency !== 'thb' || currentPrice.unit_amount !== priceAmount || !currentPrice.active) stripePriceId = null;
  }
  if (!stripeProductId) {
    const product = await stripe.products.create({
      name: payload.examSet.title,
      description: payload.examSet.description,
      metadata: { local_product_id: productId, course_id: 'police_admin', subject_id: 'mock_test' }
    });
    stripeProductId = product.id;
  } else {
    await stripe.products.update(stripeProductId, {
      name: payload.examSet.title,
      description: payload.examSet.description,
      metadata: { local_product_id: productId, course_id: 'police_admin', subject_id: 'mock_test' }
    });
  }
  if (!stripePriceId) {
    const price = await stripe.prices.create({
      product: stripeProductId,
      currency: 'thb',
      unit_amount: priceAmount,
      metadata: { local_product_id: productId }
    });
    stripePriceId = price.id;
  }

  const { error } = await supabase.from('products').upsert({
    id: productId,
    title: payload.examSet.title,
    description: payload.examSet.description,
    price: priceAmount,
    type: 'exam_set',
    metadata: { course_id: 'police_admin', subject_id: 'mock_test', access_type: 'paid', currency: 'thb' },
    stripe_price_id: stripePriceId,
    is_published: true
  }, { onConflict: 'id' });
  if (error) throw new Error(`Product: ${error.message}`);
  return { productId, stripePriceId };
}

async function importPayload(supabase, stripe, payload) {
  const examSetId = payload.examSet.id;
  const productId = examSetId.replace('police-mock_test-set-', 'police_mock_test_set_');
  const paidProduct = payload.examSet.accessType === 'paid'
    ? await upsertPaidProduct(supabase, stripe, payload, productId)
    : { productId: null, stripePriceId: null };

  if (payload.examSet.accessType === 'free') {
    await supabase.from('products').update({ is_published: false }).eq('id', productId);
  }

  const { error: examError } = await supabase.from('exam_sets').upsert({
    id: examSetId,
    course_id: 'police_admin',
    subject_id: 'mock_test',
    product_id: paidProduct.productId,
    title: payload.examSet.title,
    description: payload.examSet.description,
    source_label: payload.examSet.sourceLabel ?? 'ข้อสอบสร้างใหม่ตาม DNA สนามสอบ',
    access_type: payload.examSet.accessType,
    duration_minutes: payload.examSet.durationMinutes,
    total_questions: payload.questions.length,
    metadata: {
      version: payload.examSet.version ?? 1,
      qa_status: payload.qualityNotes?.qaStatus ?? 'self_audit_passed',
      source_policy: payload.qualityNotes?.policy ?? null
    },
    is_published: true,
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' });
  if (examError) throw new Error(`Exam set: ${examError.message}`);

  if (paidProduct.productId) {
    const { data: existing, error: lookupError } = await supabase
      .from('product_items')
      .select('id')
      .eq('product_id', paidProduct.productId)
      .eq('subject_id', 'mock_test')
      .eq('item_id', examSetId)
      .maybeSingle();
    if (lookupError) throw new Error(`Product item lookup: ${lookupError.message}`);
    if (!existing) {
      const { error } = await supabase.from('product_items').insert({
        product_id: paidProduct.productId,
        subject_id: 'mock_test',
        item_id: examSetId
      });
      if (error) throw new Error(`Product item: ${error.message}`);
    }
  }

  const questionRows = payload.questions.map((question) => ({
    id: `${examSetId}-q${String(question.position).padStart(3, '0')}`,
    category: question.category,
    prompt: question.prompt,
    choices: question.choices,
    media: question.media ?? {},
    metadata: {
      source_subject_id: question.subjectId,
      source_category: question.originalCategory,
      dna_bucket: question.dnaBucket ?? null,
      difficulty: question.difficulty ?? null,
      source_mechanism: question.sourceMechanism ?? question.originalCategory,
      source_dna_set: question.sourceDnaSet ?? null,
      source_dna_ref: question.sourceDnaRef ?? null,
      verification_ref: question.verificationRef ?? null,
      source_type: question.sourceType ?? 'new-dna-authored-item',
      qa_status: payload.qualityNotes?.qaStatus ?? 'self_audit_passed'
    }
  }));
  const { error: questionError } = await supabase.from('questions').upsert(questionRows, { onConflict: 'id' });
  if (questionError) throw new Error(`Questions: ${questionError.message}`);

  const solutionRows = payload.questions.map((question) => ({
    question_id: `${examSetId}-q${String(question.position).padStart(3, '0')}`,
    correct_choice_index: question.correctChoiceIndex,
    explanation: question.explanation,
    tip: question.tip,
    metadata: {
      source_category: question.originalCategory,
      difficulty: question.difficulty ?? null,
      source_dna_ref: question.sourceDnaRef ?? null,
      verification_ref: question.verificationRef ?? null,
      qa_status: payload.qualityNotes?.qaStatus ?? 'self_audit_passed'
    }
  }));
  const { error: solutionError } = await supabase.from('question_solutions').upsert(solutionRows, { onConflict: 'question_id' });
  if (solutionError) throw new Error(`Solutions: ${solutionError.message}`);

  const { error: deleteError } = await supabase.from('exam_set_questions').delete().eq('exam_set_id', examSetId);
  if (deleteError) throw new Error(`Old mappings: ${deleteError.message}`);
  const mappingRows = payload.questions.map((question) => ({
    exam_set_id: examSetId,
    question_id: `${examSetId}-q${String(question.position).padStart(3, '0')}`,
    position: question.position,
    points: 1
  }));
  const { error: mappingError } = await supabase.from('exam_set_questions').insert(mappingRows);
  if (mappingError) throw new Error(`Mappings: ${mappingError.message}`);

  const remoteVerification = await verifyImportedPayload(supabase, payload);
  return { examSetId, ...paidProduct, mappedQuestions: mappingRows.length, remoteVerification };
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const input = process.argv[2];
  assert(input, 'Usage: node scripts/import-police-mock-test-file.mjs <payload.json>');
  const inputPath = path.resolve(ROOT, input);
  const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  validatePayload(payload);

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  assert(supabaseUrl && serviceRoleKey, 'Supabase environment variables are missing');
  if (payload.examSet.accessType === 'paid') assert(stripeSecretKey, 'Stripe secret key is missing');
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const stripe = payload.examSet.accessType === 'paid' ? new Stripe(stripeSecretKey) : null;
  const result = await importPayload(supabase, stripe, payload);
  console.log(JSON.stringify({ inputPath, result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
