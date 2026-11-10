#!/usr/bin/env node
// Builds content/exams/police-mock-test-set-06.json from scripts/police/mock6/*.mjs (correct answer = choices[0]).
// Order and counts follow the real exam: ความรู้ทั่วไป 20, ภาษาไทย 20, คอมพิวเตอร์ 40, งานสารบรรณ 30, กฎหมาย 25, ภาษาอังกฤษ 15.
// Category = subject name (like Mock Test 1–4), so results split by subject and by ภาค ก / ภาค ข.
// Import (free, no Stripe): node scripts/import-police-mock-test-file.mjs content/exams/police-mock-test-set-06.json
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SUBJECTS = [
  { id: 'math', title: 'ความรู้ทั่วไป', count: 20 },
  { id: 'thai', title: 'ภาษาไทย', count: 20 },
  { id: 'computer', title: 'คอมพิวเตอร์', count: 40 },
  { id: 'saraban', title: 'งานสารบรรณ', count: 30 },
  { id: 'law', title: 'กฎหมาย', count: 25 },
  { id: 'english', title: 'ภาษาอังกฤษ', count: 15 }
];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = (items, rand) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const all = [];
for (const name of fs.readdirSync('scripts/police/mock6').filter((file) => file.endsWith('.mjs')).sort()) {
  const { QUESTIONS } = await import(pathToFileURL(path.resolve('scripts/police/mock6', name)).href);
  all.push(...QUESTIONS);
}

const rand = mulberry32(20261129);
const ordered = SUBJECTS.flatMap((subject) => {
  const items = all.filter((item) => item.subject === subject.id);
  if (items.length !== subject.count) throw new Error(`${subject.id}: expected ${subject.count}, got ${items.length}`);
  return items.map((item) => ({ item, subject }));
});
const seen = new Set();
const slots = shuffle(ordered.map((_, i) => i % 4), rand);
const questions = ordered.map(({ item, subject }, i) => {
  const where = `${subject.id} #${i + 1}`;
  if (!item.q || !item.why || !item.tip) throw new Error(`${where}: missing q/why/tip`);
  if (item.choices?.length !== 4 || new Set(item.choices).size !== 4) throw new Error(`${where}: needs 4 distinct choices`);
  if (seen.has(item.q)) throw new Error(`${where}: duplicate question`);
  seen.add(item.q);
  const [correct, ...wrong] = item.choices;
  const choices = shuffle(wrong, rand);
  choices.splice(slots[i], 0, correct);
  return {
    position: i + 1,
    subjectId: subject.id,
    subjectTitle: subject.title,
    category: subject.title,
    originalCategory: item.topic ?? subject.title,
    sourceMechanism: item.topic ?? subject.title,
    sourceDnaSet: 'Set 6',
    sourceDnaRef: 'SlothMove Mock Test 06 (2569)',
    difficulty: item.difficulty ?? 'medium',
    sourceType: 'slothmove-authored-2569',
    prompt: item.q,
    choices,
    correctChoiceIndex: slots[i],
    explanation: item.why,
    tip: item.tip
  };
});

const payload = {
  examSet: {
    id: 'police-mock_test-set-06',
    courseId: 'police_admin',
    subjectId: 'mock_test',
    title: 'Mock Test นายสิบตำรวจ ชุดที่ 6',
    description: 'ข้อสอบจำลองสนามจริง 150 ข้อ ครบ 6 วิชา พร้อมจับเวลาและเฉลยละเอียด (ชุดใหม่ก่อนสอบ 29 พ.ย. 2569)',
    sourceLabel: 'SlothMove: ข้อสอบจำลองนายสิบตำรวจ (2569)',
    durationMinutes: 180,
    totalQuestions: questions.length,
    accessType: 'free',
    productId: 'police_mock_test_set_06',
    isPublished: true
  },
  qualityNotes: { generatedBy: 'scripts/police/build-mock-test-06.mjs', answerDistribution: [0, 1, 2, 3].map((k) => questions.filter((q) => q.correctChoiceIndex === k).length) },
  questions
};
fs.writeFileSync('content/exams/police-mock-test-set-06.json', JSON.stringify(payload, null, 2) + '\n');
console.log(`police-mock_test-set-06: ${questions.length} questions`, payload.qualityNotes.answerDistribution);
