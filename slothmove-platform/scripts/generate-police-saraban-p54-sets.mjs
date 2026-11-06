#!/usr/bin/env node
// Builds two free 20-question sets on ลักษณะที่ 54 (สารบรรณตำรวจ) from
// content/exams/police-saraban-p54-source.json.
// - balances answer letters to 5/5/5/5 per set (order-dependent choices stay put)
// - orders questions so hard items are spread and no answer letter repeats 3 times in a row
// - fails on leaked wording or missing explanation/tip
//
// Usage: node scripts/generate-police-saraban-p54-sets.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/exams');
const SOURCE = path.join(CONTENT, 'police-saraban-p54-source.json');
const REPORT = path.join(CONTENT, 'police-saraban-p54-sets-audit.md');
const SET_SIZE = 20;
const LEAK = /ต้นฉบับชุด|ตามบทเรียน|ตามชีท|fact sheet|DNA|คาแรกเตอร์|\[ไม่แน่ใจ\]/;
const LETTER = /(ข้อ|ตัวเลือก)\s*[กขคง](?![ก-๙])/;

function assert(condition, message) { if (!condition) throw new Error(message); }
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const all = source.questions;
for (const q of all) {
  const key = `Q${q.no}`;
  assert(Array.isArray(q.choices) && q.choices.length === 4 && new Set(q.choices).size === 4, `${key}: need 4 unique choices`);
  assert(Number.isInteger(q.correctChoiceIndex) && q.correctChoiceIndex >= 0 && q.correctChoiceIndex <= 3, `${key}: bad answer index`);
  assert(q.explanation?.startsWith('ตอบ') && q.tip, `${key}: explanation must start with "ตอบ" and have a tip`);
  for (const text of [q.prompt, q.explanation, q.tip, ...q.choices]) assert(!LEAK.test(text), `${key}: leaked wording: ${text}`);
  assert(!LETTER.test(q.explanation), `${key}: explanation refers to a choice letter`);
  assert(['ง่าย', 'ปานกลาง', 'ยาก'].includes(q.difficulty), `${key}: bad difficulty`);
}

function balance(set, random) {
  const counts = [0, 0, 0, 0];
  for (const q of set.filter((item) => item.orderDependent)) counts[q.correctChoiceIndex] += 1;
  const targets = [];
  for (let letter = 0; letter < 4; letter += 1) for (let n = counts[letter]; n < SET_SIZE / 4; n += 1) targets.push(letter);
  const movable = set.filter((item) => !item.orderDependent);
  while (targets.length < movable.length) targets.push(Math.floor(random() * 4));
  const pool = shuffle(targets, random);
  return set.map((q) => {
    if (q.orderDependent) return { ...q };
    const target = pool.pop();
    const correct = q.choices[q.correctChoiceIndex];
    const others = shuffle(q.choices.filter((_, index) => index !== q.correctChoiceIndex), random);
    others.splice(target, 0, correct);
    return { ...q, choices: others, correctChoiceIndex: target };
  });
}

function order(set, random) {
  const rank = { 'ง่าย': 0, 'ปานกลาง': 1, 'ยาก': 2 };
  for (let tries = 0; tries < 2000; tries += 1) {
    const ordered = shuffle(set, random);
    const noTriple = ordered.every((q, i) => i < 2 || !(q.correctChoiceIndex === ordered[i - 1].correctChoiceIndex && q.correctChoiceIndex === ordered[i - 2].correctChoiceIndex));
    const hardPositions = ordered.map((q, i) => (rank[q.difficulty] === 2 ? i : -1)).filter((i) => i >= 0);
    const spreadHard = hardPositions.every((p, i) => i === 0 || p - hardPositions[i - 1] >= 5) && (hardPositions[0] ?? 3) >= 3;
    const easyStart = rank[ordered[0].difficulty] === 0;
    if (noTriple && spreadHard && easyStart) return ordered;
  }
  throw new Error('Could not find a valid ordering');
}

const outputs = [1, 2].map((number) => {
  const padded = String(number).padStart(2, '0');
  const random = mulberry32(5400 + number);
  const items = all.filter((q) => q.set === number);
  assert(items.length === SET_SIZE, `Set ${number}: expected ${SET_SIZE} questions, found ${items.length}`);
  const questions = order(balance(items, random), random).map((q, index) => ({
    position: index + 1,
    category: q.category,
    difficulty: q.difficulty,
    prompt: q.prompt,
    choices: q.choices,
    correctChoiceIndex: q.correctChoiceIndex,
    explanation: q.explanation,
    tip: q.tip,
    sourceRef: q.sourceRef,
    topic: `p54-ch${q.chapter}`,
    media: {}
  }));
  return {
    examSet: {
      id: `police-saraban-p54-${padded}`,
      title: `สารบรรณตำรวจ ลักษณะที่ 54 ชุดที่ ${number}`,
      description: 'ข้อสอบลักษณะที่ 54 งานสารบรรณตำรวจ 20 ข้อ (ฉบับแก้ไขถึงฉบับที่ 21 พ.ศ. 2569) ใช้เวลาประมาณ 20 นาที พร้อมเฉลยทุกข้อ',
      durationMinutes: 20,
      totalQuestions: SET_SIZE,
      accessType: 'free',
      catalogOrder: 7 + number,
      isPublished: true
    },
    qualityNotes: {
      generatedBy: 'scripts/generate-police-saraban-p54-sets.mjs',
      source: 'police-saraban-p54-source.json',
      factBasis: 'ระเบียบ ตร. ลักษณะที่ 54 พ.ศ. 2556 ฉบับรวม 17 ต.ค. 2566 + ฉบับที่ 21 พ.ศ. 2569',
      review: source.review ?? null
    },
    questions
  };
});

for (const payload of outputs) fs.writeFileSync(path.join(CONTENT, `${payload.examSet.id}.json`), `${JSON.stringify(payload, null, 2)}\n`);

const letters = ['ก', 'ข', 'ค', 'ง'];
const lines = ['# ลักษณะที่ 54 ชุดที่ 1–2 - Audit', ''];
for (const payload of outputs) {
  const answers = [0, 0, 0, 0];
  const difficulty = {};
  const chapters = {};
  for (const q of payload.questions) {
    answers[q.correctChoiceIndex] += 1;
    difficulty[q.difficulty] = (difficulty[q.difficulty] ?? 0) + 1;
    chapters[q.topic] = (chapters[q.topic] ?? 0) + 1;
  }
  lines.push(`## ${payload.examSet.title}`);
  lines.push(`- Answers: ${answers.map((n, i) => `${letters[i]} ${n}`).join(' | ')}`);
  lines.push(`- Difficulty: ${JSON.stringify(difficulty)} · hard at positions ${payload.questions.filter((q) => q.difficulty === 'ยาก').map((q) => q.position).join(', ') || '-'}`);
  lines.push(`- Chapters: ${JSON.stringify(chapters)}`);
  lines.push('');
}
fs.writeFileSync(REPORT, `${lines.join('\n')}\n`);
console.log(JSON.stringify({ written: outputs.map((p) => p.examSet.id), report: path.relative(ROOT, REPORT) }, null, 2));
