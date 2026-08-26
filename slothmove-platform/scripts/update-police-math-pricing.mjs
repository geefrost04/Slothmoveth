import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PAID_SET_IDS = [
  'police-math-set-02',
  'police-math-set-03',
  'police-math-set-05',
  'police-math-set-06',
  'police-math-set-07'
];
const PRICE_AMOUNT = 1900;
const CURRENCY = 'thb';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    process.env[key] ??= rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function resolveStripePrice(stripe, product) {
  let stripeProductId = null;

  if (product.stripe_price_id) {
    try {
      const existingPrice = await stripe.prices.retrieve(product.stripe_price_id);
      if (
        existingPrice.currency === CURRENCY &&
        existingPrice.unit_amount === PRICE_AMOUNT &&
        existingPrice.active
      ) {
        return existingPrice.id;
      }
      stripeProductId = typeof existingPrice.product === 'string'
        ? existingPrice.product
        : existingPrice.product?.id ?? null;
    } catch (error) {
      console.warn(`Unable to retrieve existing Stripe price for ${product.id}: ${error.message}`);
    }
  }

  if (!stripeProductId) {
    const stripeProduct = await stripe.products.create({
      name: product.title,
      description: product.description || undefined,
      metadata: {
        local_product_id: product.id,
        course_id: 'police_admin',
        subject_id: 'math'
      }
    });
    stripeProductId = stripeProduct.id;
  } else {
    await stripe.products.update(stripeProductId, {
      name: product.title,
      description: product.description || undefined,
      metadata: {
        local_product_id: product.id,
        course_id: 'police_admin',
        subject_id: 'math'
      }
    });
  }

  const prices = await stripe.prices.list({
    product: stripeProductId,
    active: true,
    currency: CURRENCY,
    limit: 100
  });
  const reusablePrice = prices.data.find((price) => price.unit_amount === PRICE_AMOUNT);
  if (reusablePrice) return reusablePrice.id;

  const newPrice = await stripe.prices.create({
    product: stripeProductId,
    currency: CURRENCY,
    unit_amount: PRICE_AMOUNT,
    metadata: {
      local_product_id: product.id,
      course_id: 'police_admin',
      subject_id: 'math'
    }
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

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const stripe = new Stripe(stripeSecretKey);

  const { data: examSets, error } = await supabase
    .from('exam_sets')
    .select('id,title,access_type,product_id,products(id,title,description,price,stripe_price_id,metadata,is_published)')
    .in('id', PAID_SET_IDS)
    .order('id');
  if (error) throw error;

  assert(examSets?.length === PAID_SET_IDS.length, `Expected ${PAID_SET_IDS.length} exam sets, found ${examSets?.length ?? 0}.`);

  const updates = [];
  for (const examSet of examSets) {
    const product = Array.isArray(examSet.products) ? examSet.products[0] : examSet.products;
    assert(product, `Exam set ${examSet.id} does not have a linked product.`);

    const stripePriceId = await resolveStripePrice(stripe, product);
    const metadata = {
      ...(product.metadata || {}),
      course_id: 'police_admin',
      subject_id: 'math',
      access_type: 'paid',
      currency: CURRENCY,
      stripe_mode: stripeSecretKey.startsWith('sk_test_') ? 'test' : 'live'
    };

    const { error: productError } = await supabase
      .from('products')
      .update({
        price: PRICE_AMOUNT,
        stripe_price_id: stripePriceId,
        metadata,
        is_published: true
      })
      .eq('id', product.id);
    if (productError) throw productError;

    const { error: examSetError } = await supabase
      .from('exam_sets')
      .update({
        access_type: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', examSet.id);
    if (examSetError) throw examSetError;

    updates.push({
      exam_set_id: examSet.id,
      product_id: product.id,
      price: PRICE_AMOUNT,
      stripe_price_id: stripePriceId
    });
  }

  console.log(JSON.stringify({ updated: updates }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
