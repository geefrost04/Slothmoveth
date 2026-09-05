#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const COURSE_ID = 'police_admin';
const ALL_IN_PRODUCT_ID = 'police_admin_all_in_2026';
const SUBJECT_PACKS = [
  { subjectId: 'computer', title: 'คอมพิวเตอร์', questionCount: 60, stripePriceId: 'price_1UCADmF0sYpvB2TNfpOi4dVY' },
  { subjectId: 'english', title: 'ภาษาอังกฤษ', questionCount: 60, stripePriceId: 'price_1UCAERF0sYpvB2TNlwcHv7Jk' },
  { subjectId: 'thai', title: 'ภาษาไทย', questionCount: 100, stripePriceId: 'price_1UCAGDF0sYpvB2TNCdtAfPiD' },
  { subjectId: 'law', title: 'กฎหมาย', questionCount: 100, stripePriceId: 'price_1UCAGbF0sYpvB2TNX0VHicm6' },
  { subjectId: 'saraban', title: 'งานสารบรรณ', questionCount: 100, stripePriceId: 'price_1UCAH2F0sYpvB2TNf2iAUh5D' }
];
const MOCK_TESTS = [
  { productId: 'police_mock_test_set_02', stripePriceId: 'price_1UCAI4F0sYpvB2TNsRB4v9ng' },
  { productId: 'police_mock_test_set_03', stripePriceId: 'price_1UCAJpF0sYpvB2TNS7EoJ3ae' }
];
const ALL_IN = { stripePriceId: 'price_1UCAHPF0sYpvB2TNwdl3vqkS', price: 29900 };

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

function packId(subjectId) {
  return `police_${subjectId}_practice_pack_2026`;
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert(url, 'Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  assert(serviceRoleKey, 'Set SUPABASE_SERVICE_ROLE_KEY.');

  const db = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const subjectPlans = [];
  for (const subject of SUBJECT_PACKS) {
    const examSetIds = [2, 3].map((number) => `police-${subject.subjectId}-set-${String(number).padStart(2, '0')}`);
    const { data: examSets, error } = await db
      .from('exam_sets')
      .select('id,total_questions,is_published')
      .in('id', examSetIds)
      .order('id');
    if (error) throw error;
    assert(examSets?.length === 2, `${subject.subjectId}: expected both subject sets.`);
    assert(examSets.every((examSet) => examSet.is_published), `${subject.subjectId}: unpublished set cannot be sold.`);
    const totalQuestions = examSets.reduce((total, examSet) => total + examSet.total_questions, 0);
    assert(totalQuestions === subject.questionCount, `${subject.subjectId}: expected ${subject.questionCount} questions, found ${totalQuestions}.`);
    subjectPlans.push({ ...subject, productId: packId(subject.subjectId), examSetIds });
  }

  const plan = {
    subjectPacks: subjectPlans.map(({ subjectId, productId, examSetIds, questionCount }) => ({ subjectId, productId, examSetIds, questionCount, price: 4900 })),
    mockTests: MOCK_TESTS.map(({ productId }) => ({ productId, price: 8900 })),
    allIn: { productId: ALL_IN_PRODUCT_ID, price: ALL_IN.price, durationDays: 365 }
  };
  if (!APPLY) {
    console.log(JSON.stringify({ mode: 'dry-run', plan }, null, 2));
    return;
  }

  for (const subject of subjectPlans) {
    const productId = packId(subject.subjectId);
    const metadata = {
      course_id: COURSE_ID,
      subject_id: subject.subjectId,
      set_numbers: [2, 3],
      question_count: subject.questionCount,
      currency: 'thb',
      stripe_mode: 'live'
    };
    const { error: productError } = await db.from('products').upsert({
      id: productId,
      title: `${subject.title} Subject Pack: ชุดที่ 2-3`,
      description: `ข้อสอบ${subject.title}ชุดที่ 2 และ 3 รวม ${subject.questionCount} ข้อ พร้อมเฉลย`,
      price: 4900,
      type: 'bundle',
      stripe_price_id: subject.stripePriceId,
      metadata,
      is_published: true
    });
    if (productError) throw productError;

    const { error: itemsDeleteError } = await db.from('product_items').delete().eq('product_id', productId);
    if (itemsDeleteError) throw itemsDeleteError;
    const { error: itemsInsertError } = await db.from('product_items').insert(
      subject.examSetIds.map((itemId) => ({ product_id: productId, subject_id: subject.subjectId, item_id: itemId }))
    );
    if (itemsInsertError) throw itemsInsertError;

    const { error: examSetError } = await db
      .from('exam_sets')
      .update({ product_id: productId, access_type: 'paid', updated_at: new Date().toISOString() })
      .in('id', subject.examSetIds);
    if (examSetError) throw examSetError;
  }

  for (const mockTest of MOCK_TESTS) {
    const { error } = await db
      .from('products')
      .update({ price: 8900, stripe_price_id: mockTest.stripePriceId })
      .eq('id', mockTest.productId)
      .eq('is_published', true);
    if (error) throw error;
  }

  const { data: paidExamSets, error: paidExamSetsError } = await db
    .from('exam_sets')
    .select('id,subject_id')
    .eq('course_id', COURSE_ID)
    .eq('access_type', 'paid')
    .eq('is_published', true);
  if (paidExamSetsError) throw paidExamSetsError;
  assert(paidExamSets?.length, 'All-in must contain at least one published paid exam set.');

  const { error: allInProductError } = await db.from('products').upsert({
    id: ALL_IN_PRODUCT_ID,
    title: 'All-in นายสิบตำรวจ',
    description: 'ปลดล็อก Mock Test และชุดข้อสอบรายวิชาที่อยู่ในแพ็กเกจ ใช้ได้ 1 ปีนับจากวันซื้อ',
    price: ALL_IN.price,
    type: 'bundle',
    stripe_price_id: ALL_IN.stripePriceId,
    metadata: {
      course_id: COURSE_ID,
      access_duration_days: 365,
      release_window_end: '2026-12-31',
      release_cadence_days: 14,
      stripe_mode: 'live'
    },
    is_published: true
  });
  if (allInProductError) throw allInProductError;
  const { error: allInDeleteError } = await db.from('product_items').delete().eq('product_id', ALL_IN_PRODUCT_ID);
  if (allInDeleteError) throw allInDeleteError;
  const { error: allInItemsError } = await db.from('product_items').insert(
    paidExamSets.map((examSet) => ({ product_id: ALL_IN_PRODUCT_ID, subject_id: examSet.subject_id, item_id: examSet.id }))
  );
  if (allInItemsError) throw allInItemsError;

  console.log(JSON.stringify({ mode: 'applied', plan, allInItemCount: paidExamSets.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
