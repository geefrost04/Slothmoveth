#!/usr/bin/env node
// Re-cuts the police computer bank (6 × 30 from content/exams/police-computer-set-0N[-notebooklm].json)
// into 9 sets of 20 for quick practice. Questions are sorted by topic group and fine category, then dealt
// round-robin, so every set gets a similar mix and no set repeats a category much.
// Existing question rows are only re-linked, never rewritten, so old attempts and the wrong-answer book
// still point at the right questions.
// Dry-run by default (writes content/exams/police-computer-sets-20.json); --apply writes to Supabase.
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const SETS = 9;
const PER_SET = 20;
const GROUPS = {
  basics: ['พื้นฐานคอมพิวเตอร์', 'ประเภทข้อมูล', 'input/output', 'hardware', 'software/OS', 'source code/compiler', 'นามสกุลไฟล์', 'flowchart'],
  network: ['network type/topology/device', 'internet/browser/URL/homepage', 'Bluetooth', 'e-commerce'],
  office: ['Microsoft Word/Excel/PowerPoint'],
  safety: ['malware/phishing/firewall/VPN/protocol', 'social media/viral content', 'กฎหมายดิจิทัล']
};
const ORDER = Object.keys(GROUPS);
const SOURCES = [1, 2, 3].map((n) => `police-computer-set-0${n}-notebooklm.json`).concat([4, 5, 6].map((n) => `police-computer-set-0${n}.json`));

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261111);
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// DB id = police-computer-set-0N-qNN (position).
const pool = [];
SOURCES.forEach((name, i) => {
  for (const q of JSON.parse(fs.readFileSync(`content/exams/${name}`, 'utf8')).questions) {
    const group = ORDER.find((key) => GROUPS[key].includes(q.category));
    if (!group) throw new Error(`${name} Q${q.position}: category "${q.category}" has no group`);
    pool.push({ id: `police-computer-set-0${i + 1}-q${String(q.position).padStart(2, '0')}`, group, category: q.category, prompt: q.prompt });
  }
});
if (pool.length !== SETS * PER_SET) throw new Error(`have ${pool.length} questions, need ${SETS * PER_SET}`);

const ordered = ORDER.flatMap((group) => {
  const items = pool.filter((q) => q.group === group);
  return shuffle([...new Set(items.map((q) => q.category))]).flatMap((category) => shuffle(items.filter((q) => q.category === category)));
});
const sets = Array.from({ length: SETS }, () => []);
ordered.forEach((q, i) => sets[i % SETS].push(q));

const plan = sets.map((items, i) => ({
  id: `police-computer-set-${String(i + 1).padStart(2, '0')}`,
  title: `คอมพิวเตอร์ ชุดที่ ${i + 1}`,
  description: `ข้อสอบวิชาคอมพิวเตอร์และเทคโนโลยีสารสนเทศ ชุดที่ ${i + 1} จำนวน 20 ข้อ คละพื้นฐาน เครือข่าย Office และความปลอดภัย พร้อมเฉลยละเอียด สำหรับสอบนายสิบตำรวจ สายอำนวยการ`,
  durationMinutes: 30,
  // Keep groups together inside a set, in the usual order.
  questionIds: ORDER.flatMap((g) => items.filter((q) => q.group === g)).map((q) => q.id),
  mix: Object.fromEntries(ORDER.map((g) => [g, items.filter((q) => q.group === g).length])),
  maxSameCategory: Math.max(...Object.values(items.reduce((acc, q) => ({ ...acc, [q.category]: (acc[q.category] ?? 0) + 1 }), {})))
}));
fs.writeFileSync('content/exams/police-computer-sets-20.json', JSON.stringify({ generatedBy: 'scripts/police/rebuild-computer-sets.mjs', sets: plan }, null, 2) + '\n');
for (const set of plan) console.log(set.id, set.questionIds.length, JSON.stringify(set.mix), `max same category ${set.maxSameCategory}`);
if (!APPLY) { console.log('dry-run: wrote content/exams/police-computer-sets-20.json; pass --apply to write to Supabase'); process.exit(0); }

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = line.match(/^([^#=\s]+)=(.*)$/); if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const run = async (query, label) => { const { data, error } = await query; if (error) throw new Error(`${label}: ${error.message}`); return data; };

// Safety: every id must already be in the DB with the same prompt.
const rows = [];
for (let i = 0; i < pool.length; i += 100) rows.push(...await run(db.from('questions').select('id, prompt').in('id', pool.slice(i, i + 100).map((q) => q.id)), 'read questions'));
const dbPrompt = new Map(rows.map((row) => [row.id, row.prompt]));
for (const q of pool) if (dbPrompt.get(q.id) !== q.prompt) throw new Error(`${q.id}: DB prompt differs from the JSON file, stopping`);

const now = new Date().toISOString();
for (const set of plan) {
  const live = (await run(db.from('exam_sets').select('id, product_id, metadata').eq('id', set.id), `read ${set.id}`))[0];
  const productId = live?.product_id ?? set.id.replaceAll('-', '_');
  if (!live) {
    await run(db.from('products').upsert({ id: productId, title: set.title, description: set.description, price: 0, type: 'exam_set', metadata: { course_id: 'police_admin', subject_id: 'computer', access_type: 'free', catalog: 'police_admin_computer' }, is_published: true }, { onConflict: 'id' }), `product ${set.id}`);
  }
  await run(db.from('exam_sets').upsert({
    id: set.id, course_id: 'police_admin', subject_id: 'computer', product_id: productId, title: set.title, description: set.description,
    source_label: 'SlothMove: นายสิบตำรวจ สายอำนวยการ (2569)', access_type: 'free', duration_minutes: set.durationMinutes, total_questions: set.questionIds.length,
    metadata: { ...(live?.metadata ?? {}), catalog: live?.metadata?.catalog ?? 'police_admin_computer', layout: '9x20', content_source: 'police-computer-sets-20.json', generated_by: 'scripts/police/rebuild-computer-sets.mjs', previous_layout: live ? '6x30' : undefined },
    is_published: true, updated_at: now
  }, { onConflict: 'id' }), `exam set ${set.id}`);
  const item = await run(db.from('product_items').select('id').eq('product_id', productId).eq('item_id', set.id).maybeSingle(), `product item ${set.id}`);
  if (!item) await run(db.from('product_items').insert({ product_id: productId, subject_id: 'computer', item_id: set.id }), `product item insert ${set.id}`);
  await run(db.from('exam_set_questions').delete().eq('exam_set_id', set.id), `clear ${set.id}`);
  await run(db.from('exam_set_questions').insert(set.questionIds.map((id, i) => ({ exam_set_id: set.id, question_id: id, position: i + 1, points: 1 }))), `link ${set.id}`);
  console.log(`${set.id}: linked ${set.questionIds.length}`);
}
