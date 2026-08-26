#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const PRICE_AMOUNT = 1900;
const CURRENCY = 'thb';
const SUBJECTS = [
  { id: 'thai', title: 'ภาษาไทย' },
  { id: 'english', title: 'ภาษาอังกฤษ' },
  { id: 'computer', title: 'คอมพิวเตอร์' },
  { id: 'law', title: 'กฎหมาย' },
  { id: 'saraban', title: 'งานสารบรรณ' }
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
const updated = [];

for (const subject of SUBJECTS) {
  for (const setNumber of [1, 2, 3]) {
    const padded = String(setNumber).padStart(2, '0');
    const examSetId = `police-${subject.id}-set-${padded}`;
    const { data: examSet, error } = await supabase
      .from('exam_sets')
      .select('id,product_id,description,products(id,title,description,price,stripe_price_id,metadata)')
      .eq('id', examSetId)
      .single();
    if (error || !examSet) throw new Error(`${examSetId}: ${error?.message || 'missing exam set'}`);

    const product = Array.isArray(examSet.products) ? examSet.products[0] : examSet.products;
    if (!product) throw new Error(`${examSetId}: missing product`);

    const title = `${subject.title} ชุดที่ ${setNumber}`;
    const description = examSet.description || `ข้อสอบ${subject.title}นายสิบตำรวจ ชุดที่ ${setNumber} จำนวน 50 ข้อ พร้อมเฉลย`;
    const accessType = setNumber === 1 ? 'free' : 'paid';
    const priceAmount = accessType === 'free' ? 0 : PRICE_AMOUNT;
    let stripePriceId = product.stripe_price_id;

    if (accessType === 'paid') {
      let stripeProductId;
      if (stripePriceId) {
        const currentPrice = await stripe.prices.retrieve(stripePriceId);
        stripeProductId = typeof currentPrice.product === 'string'
          ? currentPrice.product
          : currentPrice.product.id;
        if (currentPrice.currency !== CURRENCY || currentPrice.unit_amount !== PRICE_AMOUNT || !currentPrice.active) {
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
        metadata: { local_product_id: product.id, course_id: 'police_admin', subject_id: subject.id }
      });
      if (!stripePriceId) {
        const stripePrice = await stripe.prices.create({
          product: stripeProductId,
          currency: CURRENCY,
          unit_amount: PRICE_AMOUNT,
          metadata: { local_product_id: product.id }
        });
        stripePriceId = stripePrice.id;
      }
    }

    const metadata = {
      ...(product.metadata || {}),
      course_id: 'police_admin',
      subject_id: subject.id,
      access_type: accessType,
      currency: CURRENCY
    };
    const { error: productError } = await supabase
      .from('products')
      .update({
        title,
        description,
        price: priceAmount,
        stripe_price_id: accessType === 'free' ? null : stripePriceId,
        metadata,
        is_published: true
      })
      .eq('id', product.id);
    if (productError) throw new Error(`${product.id}: ${productError.message}`);

    const { error: examSetError } = await supabase
      .from('exam_sets')
      .update({ access_type: accessType, is_published: true, updated_at: new Date().toISOString() })
      .eq('id', examSetId);
    if (examSetError) throw new Error(`${examSetId}: ${examSetError.message}`);

    updated.push({ exam_set_id: examSetId, access_type: accessType, price: priceAmount, stripe_price_id: stripePriceId });
  }
}

console.log(JSON.stringify({ updated }, null, 2));
