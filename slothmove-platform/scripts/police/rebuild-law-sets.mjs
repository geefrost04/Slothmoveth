#!/usr/bin/env node
// Re-cuts the police law bank (3 × 50 from content/exams/police-law-set-0N-notebooklm.json, plus
// scripts/police/banks/law-extra.mjs) into 8 sets of 20. Each set gets the same mix:
// มหาชน/หลักทั่วไป 6 · แพ่ง 7 · อาญา 5 · กฎหมายเฉพาะ 2, and fine categories are spread across sets.
// Existing question rows are only re-linked, never rewritten, so old attempts and the wrong-answer book
// still point at the right questions. The 10 extra questions get new ids (police-law-extra-qNN).
// Dry-run by default (prints the plan and writes content/exams/police-law-sets-20.json); --apply writes to Supabase.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const SETS = 8;
const PER_SET = { public: 6, civil: 7, criminal: 5, special: 2 };
const ORDER = ['public', 'civil', 'criminal', 'special'];
const GROUPS = {
  public: ['หลักกฎหมายทั่วไป', 'ระบบกฎหมาย', 'ลำดับศักดิ์กฎหมาย', 'ประวัติศาสตร์กฎหมายไทย', 'กฎหมายเอกชน', 'รัฐธรรมนูญ', 'รัฐสภา', 'การยุบสภา', 'องค์กรอิสระ', 'ศาลยุติธรรม', 'ศาลปกครอง', 'กฎหมายปกครอง', 'สัญญาทางปกครอง', 'การบริหารราชการ', 'สิทธิด้านการศึกษา'],
  civil: ['สภาพบุคคล', 'บุคคลสาบสูญ', 'คนสาบสูญ', 'ผู้เยาว์', 'คนไร้ความสามารถ', 'นิติบุคคล', 'นิติเหตุ', 'ส่วนควบ', 'กฎหมายที่ดิน', 'เช่าทรัพย์', 'เช่าซื้อ', 'ดอกเบี้ย', 'ค้ำประกัน', 'จำนำ', 'การหมั้น', 'มรดก', 'พินัยกรรม'],
  criminal: ['ความผิดอันยอมความได้', 'อายุความร้องทุกข์', 'โทษทางอาญา', 'โทษประหารชีวิต', 'ฉ้อโกง', 'ลักทรัพย์', 'ผู้สนับสนุนการกระทำความผิด', 'เด็กกระทำความผิด', 'เยาวชนกระทำผิด', 'ความผิดเกี่ยวกับเพศต่อเด็ก', 'ฆ่าผู้อื่นเหตุฉกรรจ์', 'ฆ่าผู้อื่น', 'เหตุยกเว้นโทษ', 'บันดาลโทสะ', 'วางเพลิง', 'ความผิดเกี่ยวกับทรัพย์ในครอบครัว'],
  special: ['คุ้มครองผู้บริโภค', 'ทะเบียนราษฎร', 'บัตรประจำตัวประชาชน', 'เครื่องหมายการค้า']
};

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261129);
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Existing questions: DB id = police-law-set-0N-qNN (position).
const pool = [];
for (const n of [1, 2, 3]) {
  const file = `content/exams/police-law-set-0${n}-notebooklm.json`;
  for (const q of JSON.parse(fs.readFileSync(file, 'utf8')).questions) {
    const group = ORDER.find((key) => GROUPS[key].includes(q.category));
    if (!group) throw new Error(`${file} Q${q.position}: category "${q.category}" has no group`);
    pool.push({ id: `police-law-set-0${n}-q${String(q.position).padStart(2, '0')}`, group, category: q.category, prompt: q.prompt, existing: true });
  }
}
const { QUESTIONS: EXTRA } = await import(pathToFileURL(path.resolve('scripts/police/banks/law-extra.mjs')).href);
const extra = EXTRA.map((item, i) => {
  if (!PER_SET[item.group]) throw new Error(`law-extra #${i + 1}: bad group`);
  if (item.choices?.length !== 4 || new Set(item.choices).size !== 4) throw new Error(`law-extra #${i + 1}: needs 4 distinct choices`);
  if (pool.some((q) => q.prompt === item.q)) throw new Error(`law-extra #${i + 1}: repeats an existing question`);
  const [correct, ...wrong] = item.choices;
  const slot = Math.floor(rand() * 4);
  const choices = shuffle(wrong);
  choices.splice(slot, 0, correct);
  return { id: `police-law-extra-q${String(i + 1).padStart(2, '0')}`, group: item.group, category: item.category, prompt: item.q, existing: false, choices, correctChoiceIndex: slot, explanation: item.why, tip: item.tip, sourceRef: item.ref ?? '', difficulty: item.difficulty ?? 'medium' };
});
pool.push(...extra);

// Deal each group round-robin, grouped by fine category, so the same category lands in different sets.
const sets = Array.from({ length: SETS }, () => []);
for (const group of ORDER) {
  const items = pool.filter((q) => q.group === group);
  const need = PER_SET[group] * SETS;
  if (items.length !== need) throw new Error(`${group}: have ${items.length}, need ${need}`);
  const byCategory = shuffle([...new Set(items.map((q) => q.category))]).flatMap((category) => shuffle(items.filter((q) => q.category === category)));
  byCategory.forEach((q, i) => sets[i % SETS].push(q));
}

const plan = sets.map((items, i) => ({
  id: `police-law-set-${String(i + 1).padStart(2, '0')}`,
  title: `กฎหมาย ชุดที่ ${i + 1}`,
  description: `ข้อสอบกฎหมายที่ประชาชนควรรู้ ชุดที่ ${i + 1} จำนวน 20 ข้อ คละมหาชน แพ่ง อาญา และกฎหมายเฉพาะ พร้อมเฉลยละเอียด สำหรับสอบนายสิบตำรวจ สายอำนวยการ`,
  durationMinutes: 30,
  questionIds: items.map((q) => q.id),
  mix: Object.fromEntries(ORDER.map((g) => [g, items.filter((q) => q.group === g).length])),
  maxSameCategory: Math.max(...Object.values(items.reduce((acc, q) => ({ ...acc, [q.category]: (acc[q.category] ?? 0) + 1 }), {})))
}));
fs.writeFileSync('content/exams/police-law-sets-20.json', JSON.stringify({ generatedBy: 'scripts/police/rebuild-law-sets.mjs', sets: plan, extra }, null, 2) + '\n');
for (const set of plan) console.log(set.id, set.questionIds.length, JSON.stringify(set.mix), `max same category ${set.maxSameCategory}`);
if (!APPLY) { console.log('dry-run: wrote content/exams/police-law-sets-20.json; pass --apply to write to Supabase'); process.exit(0); }

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = line.match(/^([^#=\s]+)=(.*)$/); if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const run = async (query, label) => { const { data, error } = await query; if (error) throw new Error(`${label}: ${error.message}`); return data; };

// Safety: every existing id must already be in the DB with the same prompt.
const existingIds = pool.filter((q) => q.existing).map((q) => q.id);
const rows = [];
for (let i = 0; i < existingIds.length; i += 100) rows.push(...await run(db.from('questions').select('id, prompt').in('id', existingIds.slice(i, i + 100)), 'read questions'));
const dbPrompt = new Map(rows.map((row) => [row.id, row.prompt]));
for (const q of pool.filter((item) => item.existing)) {
  if (dbPrompt.get(q.id) !== q.prompt) throw new Error(`${q.id}: DB prompt differs from the JSON file, stopping`);
}

await run(db.from('questions').upsert(extra.map((q) => ({ id: q.id, category: q.category, prompt: q.prompt, choices: q.choices, media: {}, metadata: { source_subject_id: 'law', source_ref: q.sourceRef, difficulty: q.difficulty, generated_by: 'scripts/police/banks/law-extra.mjs' } })), { onConflict: 'id' }), 'extra questions');
await run(db.from('question_solutions').upsert(extra.map((q) => ({ question_id: q.id, correct_choice_index: q.correctChoiceIndex, explanation: q.explanation, tip: q.tip, metadata: { source_ref: q.sourceRef } })), { onConflict: 'question_id' }), 'extra solutions');

const now = new Date().toISOString();
for (const set of plan) {
  const live = (await run(db.from('exam_sets').select('id, product_id, metadata').eq('id', set.id), `read ${set.id}`))[0];
  const productId = live?.product_id ?? set.id.replaceAll('-', '_');
  if (!live) {
    await run(db.from('products').upsert({ id: productId, title: set.title, description: set.description, price: 0, type: 'exam_set', metadata: { course_id: 'police_admin', subject_id: 'law', access_type: 'free', catalog: 'police_admin_law' }, is_published: true }, { onConflict: 'id' }), `product ${set.id}`);
  }
  await run(db.from('exam_sets').upsert({
    id: set.id, course_id: 'police_admin', subject_id: 'law', product_id: productId, title: set.title, description: set.description,
    source_label: 'SlothMove: นายสิบตำรวจ สายอำนวยการ (2569)', access_type: 'free', duration_minutes: set.durationMinutes, total_questions: set.questionIds.length,
    metadata: { ...(live?.metadata ?? {}), catalog: 'police_admin_law', layout: '8x20', content_source: 'police-law-sets-20.json', generated_by: 'scripts/police/rebuild-law-sets.mjs', previous_layout: live ? '3x50' : undefined },
    is_published: true, updated_at: now
  }, { onConflict: 'id' }), `exam set ${set.id}`);
  const item = await run(db.from('product_items').select('id').eq('product_id', productId).eq('item_id', set.id).maybeSingle(), `product item ${set.id}`);
  if (!item) await run(db.from('product_items').insert({ product_id: productId, subject_id: 'law', item_id: set.id }), `product item insert ${set.id}`);
  await run(db.from('exam_set_questions').delete().eq('exam_set_id', set.id), `clear ${set.id}`);
  await run(db.from('exam_set_questions').insert(set.questionIds.map((id, i) => ({ exam_set_id: set.id, question_id: id, position: i + 1, points: 1 }))), `link ${set.id}`);
  console.log(`${set.id}: linked ${set.questionIds.length}`);
}
