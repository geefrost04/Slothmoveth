#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const PRICE_AMOUNT = 4900;
const CURRENCY = 'thb';
const SUBJECTS = [
  { id: 'computer', title: 'คอมพิวเตอร์', questionCount: 60 },
  { id: 'english', title: 'ภาษาอังกฤษ', questionCount: 60 },
  { id: 'thai', title: 'ภาษาไทย', questionCount: 100 },
  { id: 'law', title: 'กฎหมาย', questionCount: 100 },
  { id: 'saraban', title: 'งานสารบรรณ', questionCount: 100 }
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (!match) continue;
    process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '');
  }
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

function packId(subjectId) {
  return `police_${subjectId}_practice_pack_2026`;
}

async function findOrCreateStripePrice(stripe, product, subject) {
  let stripeProductId = null;
  if (product?.stripe_price_id) {
    const currentPrice = await stripe.prices.retrieve(product.stripe_price_id);
    stripeProductId = typeof currentPrice.product === 'string' ? currentPrice.product : currentPrice.product.id;
    if (currentPrice.active && currentPrice.currency === CURRENCY && currentPrice.unit_amount === PRICE_AMOUNT) {
      return currentPrice.id;
    }
  }

  if (!stripeProductId) {
    const stripeProduct = await stripe.products.create({
      name: `${subject.title} Subject Pack (ชุดที่ 2-3)`,
      description: `ข้อสอบ${subject.title}ชุดที่ 2 และ 3 รวม ${subject.questionCount} ข้อ พร้อมเฉลย`,
      metadata: { local_product_id: packId(subject.id), course_id: 'police_admin', subject_id: subject.id }
    });
    stripeProductId = stripeProduct.id;
  } else {
    await stripe.products.update(stripeProductId, {
      name: `${subject.title} Subject Pack (ชุดที่ 2-3)`,
      description: `ข้อสอบ${subject.title}ชุดที่ 2 และ 3 รวม ${subject.questionCount} ข้อ พร้อมเฉลย`,
      metadata: { local_product_id: packId(subject.id), course_id: 'police_admin', subject_id: subject.id }
    });
  }

  const prices = await stripe.prices.list({ product: stripeProductId, active: true, currency: CURRENCY, limit: 100 });
  const reusablePrice = prices.data.find((price) => price.unit_amount === PRICE_AMOUNT);
  if (reusablePrice) return reusablePrice.id;

  const newPrice = await stripe.prices.create({
    product: stripeProductId,
    currency: CURRENCY,
    unit_amount: PRICE_AMOUNT,
    metadata: { local_product_id: packId(subject.id), course_id: 'police_admin', subject_id: subject.id }
  });
  return newPrice.id;
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  assert(supabaseUrl, 'Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  assert(serviceRoleKey, 'Set SUPABASE_SERVICE_ROLE_KEY.');
  assert(stripeSecretKey, 'Set STRIPE_SECRET_KEY.');
  if (APPLY) assert(stripeSecretKey.startsWith('sk_live_'), 'Refusing to publish: STRIPE_SECRET_KEY must be a live-mode key.');

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const stripe = new Stripe(stripeSecretKey);
  const plan = [];

  for (const subject of SUBJECTS) {
    const examSetIds = [2, 3].map((number) => `police-${subject.id}-set-${String(number).padStart(2, '0')}`);
    const { data: examSets, error: examSetError } = await supabase
      .from('exam_sets')
      .select('id,title,total_questions,is_published')
      .in('id', examSetIds)
      .order('id');
    if (examSetError) throw examSetError;
    assert(examSets?.length === 2, `${subject.id}: expected Set 2 and Set 3 before publishing the pack.`);
    assert(examSets.every((examSet) => examSet.is_published), `${subject.id}: both sets must be published first.`);

    const totalQuestions = examSets.reduce((total, examSet) => total + examSet.total_questions, 0);
    assert(totalQuestions === subject.questionCount, `${subject.id}: expected ${subject.questionCount} questions, found ${totalQuestions}.`);
    plan.push({ subject: subject.id, product_id: packId(subject.id), exam_set_ids: examSetIds, total_questions: totalQuestions, price: PRICE_AMOUNT });
  }

  if (!APPLY) {
    console.log(JSON.stringify({ mode: 'dry-run', plan, next: 'Run with --apply after the entitlement migration is deployed.' }, null, 2));
    return;
  }

  const updated = [];
  for (const subject of SUBJECTS) {
    const productId = packId(subject.id);
    const examSetIds = [2, 3].map((number) => `police-${subject.id}-set-${String(number).padStart(2, '0')}`);
    const { data: existingProduct, error: existingProductError } = await supabase
      .from('products')
      .select('id,stripe_price_id')
      .eq('id', productId)
      .maybeSingle();
    if (existingProductError) throw existingProductError;

    const stripePriceId = await findOrCreateStripePrice(stripe, existingProduct, subject);
    const metadata = {
      course_id: 'police_admin',
      subject_id: subject.id,
      set_numbers: [2, 3],
      question_count: subject.questionCount,
      currency: CURRENCY,
      access_duration_days: null,
      stripe_mode: stripeSecretKey.startsWith('sk_test_') ? 'test' : 'live'
    };
    const { error: productError } = await supabase.from('products').upsert({
      id: productId,
      title: `${subject.title} Subject Pack: ชุดที่ 2-3`,
      description: `ข้อสอบ${subject.title}ชุดที่ 2 และ 3 รวม ${subject.questionCount} ข้อ พร้อมเฉลย`,
      price: PRICE_AMOUNT,
      type: 'bundle',
      stripe_price_id: stripePriceId,
      metadata,
      is_published: true
    });
    if (productError) throw productError;

    const { error: deleteItemsError } = await supabase.from('product_items').delete().eq('product_id', productId);
    if (deleteItemsError) throw deleteItemsError;
    const { error: itemsError } = await supabase.from('product_items').insert(
      examSetIds.map((itemId) => ({ product_id: productId, subject_id: subject.id, item_id: itemId }))
    );
    if (itemsError) throw itemsError;

    const { error: setError } = await supabase
      .from('exam_sets')
      .update({ product_id: productId, access_type: 'paid', updated_at: new Date().toISOString() })
      .in('id', examSetIds);
    if (setError) throw setError;
    updated.push({ subject: subject.id, product_id: productId, exam_set_ids: examSetIds, price: PRICE_AMOUNT, stripe_price_id: stripePriceId });
  }

  console.log(JSON.stringify({ mode: 'applied', updated }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
