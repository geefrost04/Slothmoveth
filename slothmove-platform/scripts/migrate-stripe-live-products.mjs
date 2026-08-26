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
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (!match) continue;
    process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '');
  }
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function loadLiveProducts(stripe) {
  const products = new Map();
  for await (const product of stripe.products.list({ active: true, limit: 100 })) {
    const localProductId = product.metadata?.local_product_id;
    if (localProductId) products.set(localProductId, product);
  }
  return products;
}

async function resolveLivePrice(stripe, stripeProduct, localProduct) {
  const prices = await stripe.prices.list({
    product: stripeProduct.id,
    active: true,
    currency: 'thb',
    limit: 100
  });
  const reusable = prices.data.find((price) => price.unit_amount === localProduct.price);
  if (reusable) return reusable.id;

  const price = await stripe.prices.create({
    product: stripeProduct.id,
    currency: 'thb',
    unit_amount: localProduct.price,
    metadata: { local_product_id: localProduct.id, stripe_mode: 'live' }
  });
  return price.id;
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));

  const dryRun = process.argv.includes('--dry-run');
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const liveSecretKey = process.env.STRIPE_LIVE_SECRET_KEY;

  assert(supabaseUrl, 'Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  assert(serviceRoleKey, 'Set SUPABASE_SERVICE_ROLE_KEY.');
  if (!dryRun) {
    assert(liveSecretKey?.startsWith('sk_live_'), 'Set STRIPE_LIVE_SECRET_KEY to a Live mode secret key.');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: products, error } = await supabase
    .from('products')
    .select('id,title,description,price,metadata,is_published')
    .eq('is_published', true)
    .gt('price', 0)
    .order('id');
  if (error) throw error;
  assert(products?.length, 'No published paid products were found.');

  if (dryRun) {
    console.log(JSON.stringify({
      mode: 'dry-run',
      count: products.length,
      products: products.map(({ id, title, price }) => ({ id, title, price }))
    }, null, 2));
    return;
  }

  const stripe = new Stripe(liveSecretKey);
  const liveProducts = await loadLiveProducts(stripe);
  const migrated = [];

  for (const product of products) {
    let stripeProduct = liveProducts.get(product.id);
    const metadata = {
      ...(product.metadata || {}),
      local_product_id: product.id,
      stripe_mode: 'live'
    };

    if (!stripeProduct) {
      stripeProduct = await stripe.products.create({
        name: product.title,
        description: product.description || undefined,
        metadata
      });
      liveProducts.set(product.id, stripeProduct);
    } else {
      stripeProduct = await stripe.products.update(stripeProduct.id, {
        name: product.title,
        description: product.description || undefined,
        metadata
      });
    }

    const stripePriceId = await resolveLivePrice(stripe, stripeProduct, product);
    const { error: updateError } = await supabase
      .from('products')
      .update({ stripe_price_id: stripePriceId, metadata })
      .eq('id', product.id);
    if (updateError) throw updateError;

    migrated.push({ id: product.id, price: product.price, stripe_price_id: stripePriceId });
  }

  console.log(JSON.stringify({ mode: 'live', migrated }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
