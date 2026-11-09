#!/usr/bin/env node
// Builds ONWR exam-set JSON files from question banks in scripts/onwr/banks/<subject>.mjs.
// Each bank item lists the correct answer first; choices are shuffled with a fixed seed so
// answer positions come out balanced and the output is reproducible.
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

const subject = process.argv[2];
if (!subject) throw new Error('usage: build-exam-sets.mjs <bank>  (e.g. general, general-drill, mini_mock)');
const bank = await import(pathToFileURL(path.resolve(`scripts/onwr/banks/${subject}.mjs`)).href);
// Optional bank exports: ID_PREFIX, SET_TITLES, DESCRIPTION (defaults suit a subject bank).
const { SETS, TITLE } = bank;
const idPrefix = bank.ID_PREFIX ?? `onwr-${subject}-set`;
const isDrill = idPrefix.includes('drill');
const rand = mulberry32(20261109 + subject.length);

SETS.forEach((items, setIndex) => {
  const number = (bank.ID_OFFSET ?? 0) + setIndex + 1;
  const id = `${idPrefix}-${String(number).padStart(2, '0')}`;
  // Target answer slots: cycle 0..3 then shuffle, so each letter appears ~equally.
  const slots = items.map((_, i) => i % 4).sort(() => rand() - 0.5);
  const questions = items.map((item, i) => {
    if (item.choices.length !== 4) throw new Error(`${id} Q${i + 1}: needs 4 choices`);
    if (new Set(item.choices).size !== 4) throw new Error(`${id} Q${i + 1}: duplicate choices`);
    const [correct, ...wrong] = item.choices;
    const others = [...wrong].sort(() => rand() - 0.5);
    const choices = [...others];
    choices.splice(slots[i], 0, correct);
    return {
      position: i + 1,
      category: item.category,
      topic: item.category,
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
      title: bank.SET_TITLES?.[setIndex] ?? `${TITLE} ชุดที่ ${setIndex + 1}`,
      description: bank.DESCRIPTION ?? `${TITLE} ${questions.length} ข้อ พร้อมเฉลยละเอียด สำหรับสอบพนักงานราชการ สทนช. ตำแหน่งเจ้าหน้าที่วิเคราะห์นโยบายและแผน`,
      accessType: 'free',
      durationMinutes: Math.ceil(questions.length * 1.2),
      totalQuestions: questions.length,
      // Drills sort after the regular sets of the same subject.
      catalogOrder: number
    },
    qualityNotes: { generatedBy: 'scripts/onwr/build-exam-sets.mjs', answerDistribution: [0, 1, 2, 3].map((k) => questions.filter((q) => q.correctChoiceIndex === k).length) },
    questions
  };
  fs.writeFileSync(`content/exams/${id}.json`, JSON.stringify(payload, null, 2) + '\n');
  console.log(id, questions.length, 'answers', payload.qualityNotes.answerDistribution.join('/'));
});
