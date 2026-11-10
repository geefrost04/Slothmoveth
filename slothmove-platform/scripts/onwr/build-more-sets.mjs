#!/usr/bin/env node
// Builds extra ONWR topic sets from scripts/onwr/more/<topic>.mjs as the next set number after the live ones
// (e.g. onwr-wateract-set-04), without touching sets made by build-topic-sets.mjs.
// Import: node scripts/import-local-exam-sets.mjs --course=onwr --sets=<ids> --apply
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { TOPICS } from './topics.mjs';

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

const built = [];
for (const name of fs.readdirSync('scripts/onwr/more').filter((file) => file.endsWith('.mjs')).sort()) {
  const topicId = name.replace(/\.mjs$/, '');
  const topic = TOPICS.find((item) => item.id === topicId);
  if (!topic) throw new Error(`${name}: unknown ONWR topic`);
  const { QUESTIONS } = await import(pathToFileURL(path.resolve('scripts/onwr/more', name)).href);
  const existing = fs.readdirSync('content/exams').filter((file) => new RegExp(`^onwr-${topicId}-set-\\d{2}\\.json$`).test(file));
  const existingQ = new Set(existing.flatMap((file) => JSON.parse(fs.readFileSync(path.join('content/exams', file), 'utf8')).questions.map((q) => q.prompt)));
  // Re-running keeps the same set number: skip files this script wrote before.
  const ours = existing.filter((file) => JSON.parse(fs.readFileSync(path.join('content/exams', file), 'utf8')).qualityNotes?.generatedBy === 'scripts/onwr/build-more-sets.mjs');
  const setNo = ours.length ? Number(ours[0].match(/set-(\d{2})/)[1]) : existing.length + 1;
  const id = `onwr-${topicId}-set-${String(setNo).padStart(2, '0')}`;
  const rand = mulberry32(20261110 + setNo * 31 + topicId.length);
  const slots = shuffle(QUESTIONS.map((_, i) => i % 4), rand);
  const questions = QUESTIONS.map((item, i) => {
    if (!item.q || !item.why || !item.tip || !item.category) throw new Error(`${name} #${i + 1}: missing field`);
    if (item.choices?.length !== 4 || new Set(item.choices).size !== 4) throw new Error(`${name} #${i + 1}: needs 4 distinct choices`);
    if (existingQ.has(item.q) && !ours.length) throw new Error(`${name} #${i + 1}: repeats a live question`);
    const [correct, ...wrong] = item.choices;
    const choices = shuffle(wrong, rand);
    choices.splice(slots[i], 0, correct);
    return { position: i + 1, category: item.category, topic: topic.title, difficulty: item.difficulty ?? 'medium', prompt: item.q, choices, correctChoiceIndex: slots[i], explanation: item.why, tip: item.tip, sourceRef: item.ref ?? '' };
  });
  const payload = {
    examSet: {
      id,
      title: `${topic.title} ชุดที่ ${setNo}`,
      description: `${topic.title} ${questions.length} ข้อ พร้อมเฉลยละเอียด สำหรับสอบพนักงานราชการ สทนช. ตำแหน่งเจ้าหน้าที่วิเคราะห์นโยบายและแผน`,
      accessType: 'free',
      durationMinutes: Math.ceil(questions.length * 1.2),
      totalQuestions: questions.length,
      catalogOrder: setNo
    },
    qualityNotes: { generatedBy: 'scripts/onwr/build-more-sets.mjs', answerDistribution: [0, 1, 2, 3].map((k) => questions.filter((q) => q.correctChoiceIndex === k).length) },
    questions
  };
  fs.writeFileSync(`content/exams/${id}.json`, JSON.stringify(payload, null, 2) + '\n');
  built.push(id);
  console.log(`${id}: ${questions.length} questions`);
}
console.log(built.join(','));
