#!/usr/bin/env node
// Makes every published exam set free and stops selling paid products.
// The previous state is saved in each row's metadata so it can be restored.
//
// Usage:
//   node scripts/make-all-content-free.mjs            # dry-run
//   node scripts/make-all-content-free.mjs --apply    # make everything free
//   node scripts/make-all-content-free.mjs --revert   # restore saved paid state

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const REVERT = process.argv.includes('--revert');

for (const line of fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([^#=\s]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
}
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase credentials are missing.');
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const now = new Date().toISOString();

async function run(query, label) {
  const { data, error } = await query;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

if (REVERT) {
  const sets = await run(db.from('exam_sets').select('id,metadata').not('metadata->>free_switch_previous_access', 'is', null), 'load switched sets');
  for (const set of sets) {
    const { free_switch_previous_access: previous, free_switch_at: _at, ...metadata } = set.metadata;
    await run(db.from('exam_sets').update({ access_type: previous, metadata, updated_at: now }).eq('id', set.id), `revert ${set.id}`);
  }
  const products = await run(db.from('products').select('id,metadata').not('metadata->>free_switch_unpublished', 'is', null), 'load switched products');
  for (const product of products) {
    const { free_switch_unpublished: _flag, free_switch_at: _at, ...metadata } = product.metadata;
    await run(db.from('products').update({ is_published: true, metadata }).eq('id', product.id), `revert ${product.id}`);
  }
  console.log(JSON.stringify({ mode: 'reverted', sets: sets.map((set) => set.id), products: products.map((product) => product.id) }, null, 2));
  process.exit(0);
}

const paidSets = await run(db.from('exam_sets').select('id,metadata').eq('access_type', 'paid'), 'load paid sets');
const paidProducts = await run(db.from('products').select('id,price,metadata').gt('price', 0).eq('is_published', true), 'load paid products');

if (!APPLY) {
  console.log(JSON.stringify({
    mode: 'dry-run',
    setsToFree: paidSets.map((set) => set.id),
    productsToUnpublish: paidProducts.map((product) => `${product.id} (${product.price / 100} THB)`)
  }, null, 2));
  process.exit(0);
}

for (const set of paidSets) {
  await run(db.from('exam_sets').update({
    access_type: 'free',
    metadata: { ...(set.metadata ?? {}), free_switch_previous_access: 'paid', free_switch_at: now },
    updated_at: now
  }).eq('id', set.id), `free ${set.id}`);
}
for (const product of paidProducts) {
  await run(db.from('products').update({
    is_published: false,
    metadata: { ...(product.metadata ?? {}), free_switch_unpublished: true, free_switch_at: now }
  }).eq('id', product.id), `unpublish ${product.id}`);
}
console.log(JSON.stringify({ mode: 'applied', freedSets: paidSets.length, unpublishedProducts: paidProducts.length }, null, 2));
