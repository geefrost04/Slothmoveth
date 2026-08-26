#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const PRICE_AMOUNT = 1900;
const CURRENCY = 'thb';
const CATALOG = [
  { id: 'police-math-set-04', number: 1, accessType: 'free' },
  { id: 'police-math-set-02', number: 2, accessType: 'paid' },
  { id: 'police-math-set-03', number: 3, accessType: 'paid' },
  { id: 'police-math-set-05', number: 4, accessType: 'paid' },
  { id: 'police-math-set-06', number: 5, accessType: 'paid' },
  { id: 'police-math-set-07', number: 6, accessType: 'paid' }
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (!match) continue;
    process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '');
  }
}

loadEnvFile(path.join(ROOT, '.env.local'));
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey) {
  throw new Error('Supabase or Stripe environment variables are missing.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const stripe = new Stripe(stripeSecretKey);

const { data: examSets, error } = await supabase
  .from('exam_sets')
  .select('id,product_id,products(id,title,description,price,stripe_price_id,metadata)')
  .in('id', CATALOG.map((item) => item.id));
if (error) throw error;

const byId = new Map((examSets ?? []).map((item) => [item.id, item]));
const updated = [];
for (const catalogItem of CATALOG) {
  const examSet = byId.get(catalogItem.id);
  if (!examSet) throw new Error(`Missing exam set ${catalogItem.id}.`);
  const product = Array.isArray(examSet.products) ? examSet.products[0] : examSet.products;
  if (!product) throw new Error(`Missing product for ${catalogItem.id}.`);

  const title = `ความรู้ทั่วไป ชุดที่ ${catalogItem.number}`;
  const description = `ข้อสอบตำรวจ วิชาความรู้ทั่วไป ชุดที่ ${catalogItem.number} จำนวน 30 ข้อ พร้อมเฉลย`;
  let stripePriceId = product.stripe_price_id;

  if (catalogItem.accessType === 'paid') {
    let stripeProductId;
    if (stripePriceId) {
      const price = await stripe.prices.retrieve(stripePriceId);
      stripeProductId = typeof price.product === 'string' ? price.product : price.product.id;
      if (price.currency !== CURRENCY || price.unit_amount !== PRICE_AMOUNT || !price.active) {
        stripePriceId = null;
      }
    }

    if (!stripeProductId) {
      const stripeProduct = await stripe.products.create({ name: title, description });
      stripeProductId = stripeProduct.id;
    }
    await stripe.products.update(stripeProductId, {
      name: title,
      description,
      metadata: { local_product_id: product.id, course_id: 'police_admin', subject_id: 'math' }
    });
    if (!stripePriceId) {
      const price = await stripe.prices.create({
        product: stripeProductId,
        currency: CURRENCY,
        unit_amount: PRICE_AMOUNT,
        metadata: { local_product_id: product.id }
      });
      stripePriceId = price.id;
    }
  }

  const price = catalogItem.accessType === 'free' ? 0 : PRICE_AMOUNT;
  const metadata = {
    ...(product.metadata || {}),
    course_id: 'police_admin',
    subject_id: 'math',
    access_type: catalogItem.accessType,
    currency: CURRENCY
  };
  const { error: productError } = await supabase
    .from('products')
    .update({ title, description, price, stripe_price_id: stripePriceId, metadata, is_published: true })
    .eq('id', product.id);
  if (productError) throw new Error(`${product.id}: ${productError.message}`);

  const { error: examSetError } = await supabase
    .from('exam_sets')
    .update({ title, access_type: catalogItem.accessType, is_published: true, updated_at: new Date().toISOString() })
    .eq('id', catalogItem.id);
  if (examSetError) throw new Error(`${catalogItem.id}: ${examSetError.message}`);

  updated.push({ id: catalogItem.id, title, access_type: catalogItem.accessType, price, stripe_price_id: stripePriceId });
}

console.log(JSON.stringify({ updated }, null, 2));
