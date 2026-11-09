#!/usr/bin/env node
// Builds the per-topic exam sets (content/exams/onwr-<topic>-set-NN.json) for the 9 announcement topics.
// Pool per topic = questions from the original subject banks (general/water/planning, mapped by
// scripts/onwr/topics.mjs) + scripts/onwr/banks/extra-<topic>.mjs. Each topic is split round-robin into
// sets of 20–25 questions; the correct answer (listed first in the banks) is placed with a fixed seed.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { TOPICS, topicOf } from './topics.mjs';

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const load = async (name) => {
  const file = path.resolve(`scripts/onwr/banks/${name}.mjs`);
  return fs.existsSync(file) ? import(pathToFileURL(file).href) : null;
};

const pools = Object.fromEntries(TOPICS.map((topic) => [topic.id, []]));
for (const bank of ['general', 'water', 'planning']) {
  const { SETS } = await load(bank);
  SETS.flat().forEach((item) => pools[topicOf(bank, item.category)].push(item));
}
for (const topic of TOPICS) {
  const extra = await load(`extra-${topic.id}`);
  if (extra) pools[topic.id].push(...extra.QUESTIONS);
}

// Remove the old subject-level set files.
for (const name of fs.readdirSync('content/exams')) {
  if (/^onwr-(general|water|planning)-set-\d{2}\.json$/.test(name)) fs.unlinkSync(path.join('content/exams', name));
}

for (const [topicIndex, topic] of TOPICS.entries()) {
  const pool = pools[topic.id];
  const seen = new Set();
  for (const item of pool) {
    if (seen.has(item.q)) throw new Error(`${topic.id}: duplicate question "${item.q}"`);
    seen.add(item.q);
  }
  const rand = mulberry32(20261109 + topicIndex * 101);
  const setCount = Math.max(1, Math.ceil(pool.length / 25));
  const groups = Array.from({ length: setCount }, () => []);
  pool.forEach((item, i) => groups[i % setCount].push(item));

  groups.forEach((items, setIndex) => {
    const id = `onwr-${topic.id}-set-${String(setIndex + 1).padStart(2, '0')}`;
    const slots = items.map((_, i) => i % 4).sort(() => rand() - 0.5);
    const questions = items.map((item, i) => {
      if (item.choices.length !== 4 || new Set(item.choices).size !== 4) throw new Error(`${id} Q${i + 1}: needs 4 distinct choices`);
      const [correct, ...wrong] = item.choices;
      const choices = [...wrong].sort(() => rand() - 0.5);
      choices.splice(slots[i], 0, correct);
      return {
        position: i + 1,
        category: item.category,
        topic: topic.title,
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
        title: `${topic.title} ชุดที่ ${setIndex + 1}`,
        description: `${topic.title} ${questions.length} ข้อ พร้อมเฉลยละเอียด สำหรับสอบพนักงานราชการ สทนช. ตำแหน่งเจ้าหน้าที่วิเคราะห์นโยบายและแผน`,
        accessType: 'free',
        durationMinutes: Math.ceil(questions.length * 1.2),
        totalQuestions: questions.length,
        catalogOrder: setIndex + 1
      },
      qualityNotes: { generatedBy: 'scripts/onwr/build-topic-sets.mjs', answerDistribution: [0, 1, 2, 3].map((k) => questions.filter((q) => q.correctChoiceIndex === k).length) },
      questions
    };
    fs.writeFileSync(`content/exams/${id}.json`, JSON.stringify(payload, null, 2) + '\n');
  });
  console.log(`${topic.id}: ${pool.length} questions → ${groups.map((g) => g.length).join(' + ')}`);
}
