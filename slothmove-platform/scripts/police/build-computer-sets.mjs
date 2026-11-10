#!/usr/bin/env node
// Builds content/exams/police-computer-set-NN.json (sets 04+) from scripts/police/banks/computer-NN.mjs.
// Correct answer = choices[0] in the banks; positions are shuffled with a fixed seed per set.
// Import with: node scripts/import-local-exam-sets.mjs --course=police_admin --sets=police-computer-set-04,... --apply
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

const banks = fs.readdirSync('scripts/police/banks').filter((name) => /^computer-\d{2}\.mjs$/.test(name)).sort();
const seen = new Set();
for (const name of banks) {
  const setNo = Number(name.match(/\d{2}/)[0]);
  const id = `police-computer-set-${String(setNo).padStart(2, '0')}`;
  const { QUESTIONS } = await import(pathToFileURL(path.resolve('scripts/police/banks', name)).href);
  if (QUESTIONS.length !== 30) throw new Error(`${name}: expected 30 questions, got ${QUESTIONS.length}`);
  const rand = mulberry32(20261129 + setNo * 97);
  const slots = shuffle(QUESTIONS.map((_, i) => i % 4), rand);
  const questions = QUESTIONS.map((item, i) => {
    if (!item.q || !item.why || !item.tip || !item.category) throw new Error(`${name} #${i + 1}: missing field`);
    if (item.choices?.length !== 4 || new Set(item.choices).size !== 4) throw new Error(`${name} #${i + 1}: needs 4 distinct choices`);
    if (seen.has(item.q)) throw new Error(`${name} #${i + 1}: duplicate question across banks`);
    seen.add(item.q);
    const [correct, ...wrong] = item.choices;
    const choices = shuffle(wrong, rand);
    choices.splice(slots[i], 0, correct);
    return {
      position: i + 1,
      category: item.category,
      topic: 'คอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      difficulty: item.difficulty ?? 'medium',
      prompt: item.q,
      choices,
      correctChoiceIndex: slots[i],
      explanation: item.why,
      tip: item.tip,
      sourceRef: item.ref ?? ''
    };
  });
  const payload = {
    examSet: {
      id,
      title: `คอมพิวเตอร์ ชุดที่ ${setNo}`,
      description: `ข้อสอบวิชาคอมพิวเตอร์และเทคโนโลยีสารสนเทศ ชุดที่ ${setNo} จำนวน 30 ข้อ พร้อมเฉลยละเอียด สำหรับสอบนายสิบตำรวจ สายอำนวยการ`,
      accessType: 'free',
      durationMinutes: 45,
      totalQuestions: questions.length
      // No catalogOrder: sets 01–03 have none, so the catalog sorts all police computer sets by "ชุดที่ N".
    },
    qualityNotes: { generatedBy: 'scripts/police/build-computer-sets.mjs', answerDistribution: [0, 1, 2, 3].map((k) => questions.filter((q) => q.correctChoiceIndex === k).length) },
    questions
  };
  fs.writeFileSync(`content/exams/${id}.json`, JSON.stringify(payload, null, 2) + '\n');
  console.log(`${id}: ${questions.length} questions`);
}
