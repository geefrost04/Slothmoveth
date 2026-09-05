#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const PRICE_AMOUNT = 8900;
const CURRENCY = 'thb';
const EXAM_SET_IDS = ['police-mock_test-set-02', 'police-mock_test-set-03'];

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

async function resolveStripePrice(stripe, product) {
  let stripeProductId = null;
  if (product.stripe_price_id) {
    const price = await stripe.prices.retrieve(product.stripe_price_id);
    stripeProductId = typeof price.product === 'string' ? price.product : price.product.id;
    if (price.active && price.currency === CURRENCY && price.unit_amount === PRICE_AMOUNT) return price.id;
  }
  if (!stripeProductId) {
    const stripeProduct = await stripe.products.create({ name: product.title, description: product.description || undefined });
    stripeProductId = stripeProduct.id;
  }
  await stripe.products.update(stripeProductId, {
    name: product.title,
    description: product.description || undefined,
    metadata: { local_product_id: product.id, course_id: 'police_admin', subject_id: 'mock_test' }
  });
  const prices = await stripe.prices.list({ product: stripeProductId, active: true, currency: CURRENCY, limit: 100 });
  const reusable = prices.data.find((price) => price.unit_amount === PRICE_AMOUNT);
  if (reusable) return reusable.id;
  const newPrice = await stripe.prices.create({
    product: stripeProductId,
    currency: CURRENCY,
    unit_amount: PRICE_AMOUNT,
    metadata: { local_product_id: product.id, course_id: 'police_admin', subject_id: 'mock_test' }
  });
  return newPrice.id;
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

  const { data: examSets, error } = await db
    .from('exam_sets')
    .select('id,title,product_id,products(id,title,description,price,stripe_price_id,metadata)')
    .in('id', EXAM_SET_IDS)
    .order('id');
  if (error) throw error;
  assert(examSets?.length === EXAM_SET_IDS.length, 'Expected Mock Test Set 2 and Set 3.');

  if (!APPLY) {
    console.log(JSON.stringify({ mode: 'dry-run', exam_set_ids: EXAM_SET_IDS, new_price: PRICE_AMOUNT }, null, 2));
    return;
  }

  const updated = [];
  for (const examSet of examSets) {
    const product = Array.isArray(examSet.products) ? examSet.products[0] : examSet.products;
    assert(product, `${examSet.id}: product is missing.`);
    const stripePriceId = await resolveStripePrice(stripe, product);
    const { error: productError } = await db
      .from('products')
      .update({
        price: PRICE_AMOUNT,
        stripe_price_id: stripePriceId,
        metadata: {
          ...(product.metadata || {}),
          course_id: 'police_admin',
          subject_id: 'mock_test',
          currency: CURRENCY,
          stripe_mode: stripeSecretKey.startsWith('sk_test_') ? 'test' : 'live'
        }
      })
      .eq('id', product.id);
    if (productError) throw productError;
    updated.push({ exam_set_id: examSet.id, product_id: product.id, price: PRICE_AMOUNT, stripe_price_id: stripePriceId });
  }
  console.log(JSON.stringify({ mode: 'applied', updated }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
