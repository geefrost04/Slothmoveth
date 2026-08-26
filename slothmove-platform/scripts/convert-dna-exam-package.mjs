#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';

const SUBJECTS = {
  thai: { title: 'ภาษาไทย', source: 'ไทย.pdf', questionCount: 50, durationMinutes: 75 },
  law: { title: 'กฎหมาย', source: 'กฏหมาย.pdf', questionCount: 50, durationMinutes: 75 },
  saraban: { title: 'งานสารบรรณ', source: 'สารบรรณ.pdf', questionCount: 50, durationMinutes: 75 },
  english: { title: 'ภาษาอังกฤษ', source: 'อังกฤษ.pdf', questionCount: 30, durationMinutes: 45 }
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const [subjectId, rawSetNo, rawInputPath] = process.argv.slice(2);
const subject = SUBJECTS[subjectId];
const setNo = Number(rawSetNo);

assert(subject, 'Usage: node scripts/convert-dna-exam-package.mjs <thai|law|saraban|english> <setNo> <input.js>');
assert(Number.isInteger(setNo) && setNo > 0, 'setNo must be a positive integer');
assert(rawInputPath, 'input.js is required');

const inputPath = path.resolve(rawInputPath);
assert(fs.existsSync(inputPath), `Input not found: ${inputPath}`);

const require = createRequire(import.meta.url);
delete require.cache[inputPath];
const source = require(inputPath);
assert(Array.isArray(source?.questions), 'Input must export an object containing questions');
assert(source.questions.length === subject.questionCount, `Expected ${subject.questionCount} questions, found ${source.questions.length}`);

const paddedSetNo = String(setNo).padStart(2, '0');
const examSetId = `police-${subjectId}-set-${paddedSetNo}`;
const questions = source.questions.map((question, index) => {
  const position = index + 1;
  const sourcePosition = question.position ?? question.id;
  const correctChoiceOneBased = question.correctChoiceIndex ?? question.answer;
  assert(sourcePosition === position, `Q${position}: source position must be sequential`);
  assert(Array.isArray(question.choices) && question.choices.length === 4, `Q${position}: expected 4 choices`);
  assert(new Set(question.choices).size === 4, `Q${position}: choices must be unique`);
  assert(Number.isInteger(correctChoiceOneBased) && correctChoiceOneBased >= 1 && correctChoiceOneBased <= 4, `Q${position}: answer must be 1-4`);
  if (question.answerText) {
    assert(question.answerText === question.choices[correctChoiceOneBased - 1], `Q${position}: answerText mismatch`);
  }
  assert((question.question ?? question.prompt) && question.category && question.explanation, `Q${position}: incomplete content`);

  return {
    position,
    category: question.category,
    difficulty: question.difficulty ?? 'ปานกลาง',
    prompt: question.question ?? question.prompt,
    choices: question.choices,
    correctChoiceIndex: correctChoiceOneBased - 1,
    explanation: question.explanation.replaceAll('描写', 'พรรณนา'),
    tip: (question.tip ?? `จุดจำ: ${question.choices[correctChoiceOneBased - 1]}`).replaceAll('描写', 'พรรณนา'),
    sourceRef: question.sourceRef ?? source.basedOn ?? subject.source,
    verificationRef: question.verificationRef ?? null,
    dnaType: question.dnaType ?? null,
    media: {}
  };
});

const payload = {
  examSet: {
    id: examSetId,
    title: `${subject.title} ชุดที่ ${setNo}`,
    description: `ข้อสอบ${subject.title} ${subject.questionCount} ข้อ พร้อมเฉลย สร้างจากโครงสร้างต้นฉบับชุดที่ ${setNo}`,
    sourceReference: source.basedOn ?? `${subject.source} ชุดที่ ${setNo}`,
    durationMinutes: subject.durationMinutes,
    totalQuestions: subject.questionCount
  },
  qualityNotes: {
    sourceSet: setNo,
    policy: 'DNA package converted without changing questions or solutions',
    generatedBy: 'External DNA package',
    qaBy: 'Package audit and SlothMove schema validator',
    originalId: source.id
  },
  questions
};

const outputPath = path.resolve(`content/exams/${examSetId}-notebooklm.json`);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputPath, examSetId, questions: questions.length }, null, 2));
