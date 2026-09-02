#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const root = process.cwd();
const sets = [
  ['foundations', 'free', 0, 1], ['algebra', 'free', 0, 2], ['ratios-percent', 'free', 0, 3],
  ['geometry', 'free', 0, 4], ['stats-prob', 'free', 0, 5], ['aptitude-logic', 'free', 0, 6]
];
function loadEnv(file) { if (!fs.existsSync(file)) return; for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) { const m=line.match(/^([^#=\s]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]]=m[2].replace(/^['"]|['"]$/g,''); } }
function assert(value, message) { if (!value) throw new Error(message); }
async function run(query, label) { const { data, error } = await query; if (error) throw new Error(`${label}: ${error.message}`); return data; }

loadEnv(path.join(root, '.env.local'));
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
assert(url && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Supabase credentials are missing.');
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const now = new Date().toISOString();

for (const [slug, accessType, price, catalogOrder] of sets) {
  const payload = JSON.parse(fs.readFileSync(path.join(root, 'content/exams', `police-math-category-${slug}.json`), 'utf8'));
  const set = payload.examSet;
  assert(set.id === `police-math-category-${slug}` && payload.questions.length === set.totalQuestions, `${slug}: invalid payload`);
  const productId = `police_math_category_${slug}`;
  await run(db.from('products').upsert({ id: productId, title: set.title, description: set.description, price, type: 'exam_set', metadata: { course_id: 'police_admin', subject_id: 'math', access_type: accessType, content_origin: 'owner_authored' }, is_published: true }, { onConflict: 'id' }), `product ${slug}`);
  await run(db.from('exam_sets').upsert({ id: set.id, course_id: 'police_admin', subject_id: 'math', product_id: productId, title: set.title, description: set.description, source_label: 'SlothMove original content', access_type: accessType, duration_minutes: set.durationMinutes, total_questions: set.totalQuestions, metadata: { catalog: 'math_categories', slug, catalog_order: catalogOrder, content_origin: 'owner_authored', qa_status: payload.qualityNotes?.qaStatus }, is_published: true, updated_at: now }, { onConflict: 'id' }), `exam set ${slug}`);
  const { data: item } = await db.from('product_items').select('id').eq('product_id', productId).eq('subject_id', 'math').eq('item_id', set.id).maybeSingle();
  if (!item) await run(db.from('product_items').insert({ product_id: productId, subject_id: 'math', item_id: set.id }), `product item ${slug}`);
  await run(db.from('questions').upsert(payload.questions.map(q => ({ id: `${set.id}-q${String(q.position).padStart(2,'0')}`, category: q.category, prompt: q.prompt, choices: q.choices, media: q.media ?? {}, metadata: { source_question_no: q.position, content_origin: 'owner_authored', difficulty: null } })), { onConflict: 'id' }), `questions ${slug}`);
  await run(db.from('question_solutions').upsert(payload.questions.map(q => ({ question_id: `${set.id}-q${String(q.position).padStart(2,'0')}`, correct_choice_index: q.correctChoiceIndex, explanation: q.explanation, tip: q.tip, metadata: { content_origin: 'owner_authored' } })), { onConflict: 'question_id' }), `solutions ${slug}`);
  await run(db.from('exam_set_questions').upsert(payload.questions.map(q => ({ exam_set_id: set.id, question_id: `${set.id}-q${String(q.position).padStart(2,'0')}`, position: q.position, points: 1 })), { onConflict: 'exam_set_id,question_id' }), `mappings ${slug}`);
}

await run(db.from('exam_sets').update({ is_published: false, updated_at: now }).in('id', ['police-math-set-02','police-math-set-03','police-math-set-04','police-math-set-05','police-math-set-06','police-math-set-07']), 'archive legacy math sets');
console.log(JSON.stringify({ imported: sets.map(([slug]) => `police-math-category-${slug}`), archivedLegacySets: 6 }, null, 2));
