#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const PRODUCT_ID = 'police_admin_all_in_2026';
const PRICE_AMOUNT = 29900;
const CURRENCY = 'thb';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '');
  }
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  assert(supabaseUrl && serviceRoleKey && stripeSecretKey, 'Supabase or Stripe environment variables are missing.');
  if (APPLY) assert(stripeSecretKey.startsWith('sk_live_'), 'Refusing to publish: STRIPE_SECRET_KEY must be a live-mode key.');
  const db = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const stripe = new Stripe(stripeSecretKey);

  const { data: paidSets, error: paidSetsError } = await db
    .from('exam_sets')
    .select('id,subject_id,total_questions,product_id')
    .eq('course_id', 'police_admin')
    .eq('access_type', 'paid')
    .eq('is_published', true)
    .not('product_id', 'is', null);
  if (paidSetsError) throw paidSetsError;
  assert(paidSets?.length, 'No published paid Police Admin exam sets exist yet.');
  const includedQuestionCount = paidSets.reduce((total, examSet) => total + examSet.total_questions, 0);
  const metadata = {
    course_id: 'police_admin',
    access_duration_days: 365,
    release_window_end: '2026-12-31',
    release_cadence_days: 14,
    included_set_count: paidSets.length,
    included_question_count: includedQuestionCount,
    currency: CURRENCY
  };

  if (!APPLY) {
    console.log(JSON.stringify({ mode: 'dry-run', product_id: PRODUCT_ID, price: PRICE_AMOUNT, included_set_count: paidSets.length, included_question_count: includedQuestionCount }, null, 2));
    return;
  }

  const { data: existing, error: existingError } = await db
    .from('products')
    .select('stripe_price_id')
    .eq('id', PRODUCT_ID)
    .maybeSingle();
  if (existingError) throw existingError;
  let stripeProductId = null;
  let stripePriceId = null;
  if (existing?.stripe_price_id) {
    const currentPrice = await stripe.prices.retrieve(existing.stripe_price_id);
    stripeProductId = typeof currentPrice.product === 'string' ? currentPrice.product : currentPrice.product.id;
    if (currentPrice.active && currentPrice.currency === CURRENCY && currentPrice.unit_amount === PRICE_AMOUNT) stripePriceId = currentPrice.id;
  }
  if (!stripeProductId) {
    const stripeProduct = await stripe.products.create({ name: 'Police Admin All-in 2026' });
    stripeProductId = stripeProduct.id;
  }
  await stripe.products.update(stripeProductId, {
    name: 'Police Admin All-in 2026',
    description: 'ปลดล็อก Mock Test และชุดข้อสอบรายวิชาที่อยู่ในแพ็กเกจ ใช้ได้ 1 ปีนับจากวันซื้อ',
    metadata: { local_product_id: PRODUCT_ID, course_id: 'police_admin', access_duration_days: '365' }
  });
  if (!stripePriceId) {
    const prices = await stripe.prices.list({ product: stripeProductId, active: true, currency: CURRENCY, limit: 100 });
    stripePriceId = prices.data.find((price) => price.unit_amount === PRICE_AMOUNT)?.id ?? null;
    if (!stripePriceId) {
      const newPrice = await stripe.prices.create({ product: stripeProductId, currency: CURRENCY, unit_amount: PRICE_AMOUNT, metadata: { local_product_id: PRODUCT_ID } });
      stripePriceId = newPrice.id;
    }
  }

  const { error: productError } = await db.from('products').upsert({
    id: PRODUCT_ID,
    title: 'Police Admin All-in 2026',
    description: 'ปลดล็อก Mock Test และชุดข้อสอบรายวิชาที่อยู่ในแพ็กเกจ พร้อมสิทธิ์เข้าใช้ 1 ปี',
    price: PRICE_AMOUNT,
    type: 'bundle',
    metadata: { ...metadata, stripe_mode: stripeSecretKey.startsWith('sk_test_') ? 'test' : 'live' },
    stripe_price_id: stripePriceId,
    is_published: true
  });
  if (productError) throw productError;

  const { error: deleteItemsError } = await db.from('product_items').delete().eq('product_id', PRODUCT_ID);
  if (deleteItemsError) throw deleteItemsError;
  const { error: itemError } = await db.from('product_items').insert(
    paidSets.map((examSet) => ({ product_id: PRODUCT_ID, subject_id: examSet.subject_id, item_id: examSet.id }))
  );
  if (itemError) throw itemError;
  console.log(JSON.stringify({ mode: 'applied', product_id: PRODUCT_ID, price: PRICE_AMOUNT, stripe_price_id: stripePriceId, included_set_count: paidSets.length, included_question_count: includedQuestionCount }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
