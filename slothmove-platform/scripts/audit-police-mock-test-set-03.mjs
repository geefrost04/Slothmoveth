#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'content/exams/police-mock-test-set-03.json');
const REPORT = path.join(ROOT, 'content/exams/police-mock-test-set-03-audit.md');
const expectedCounts = { math: 20, thai: 20, computer: 40, saraban: 30, law: 25, english: 15 };

const payload = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const errors = [];
const warnings = [];
const counts = {};
const prompts = new Map();
const answers = [0, 0, 0, 0];

for (const [index, question] of payload.questions.entries()) {
  const label = `Q${index + 1}`;
  counts[question.subjectId] = (counts[question.subjectId] ?? 0) + 1;
  if (question.position !== index + 1) errors.push(`${label}: invalid position`);
  if (!question.prompt?.trim() || !question.explanation?.trim() || !question.tip?.trim()) errors.push(`${label}: incomplete content`);
  if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${label}: expected four choices`);
  if (new Set(question.choices.map((choice) => String(choice).trim().toLowerCase())).size !== 4) errors.push(`${label}: duplicate choices`);
  if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex > 3) errors.push(`${label}: invalid answer index`);
  else answers[question.correctChoiceIndex] += 1;
  if (!question.sourceDnaSet || !question.sourceMechanism || !question.difficulty) errors.push(`${label}: incomplete DNA metadata`);
  if (['law', 'saraban'].includes(question.subjectId) && !question.verificationRef) warnings.push(`${label}: official verification reference should be reviewed before publication`);
  const normalized = question.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
  prompts.set(normalized, [...(prompts.get(normalized) ?? []), question.position]);
}

if (payload.questions.length !== 150) errors.push(`Expected 150 questions, found ${payload.questions.length}`);
for (const [subject, expected] of Object.entries(expectedCounts)) {
  if (counts[subject] !== expected) errors.push(`${subject}: expected ${expected}, found ${counts[subject] ?? 0}`);
}
for (const positions of prompts.values()) if (positions.length > 1) errors.push(`Duplicate prompts: Q${positions.join(', Q')}`);
if (Math.max(...answers) - Math.min(...answers) > 12) warnings.push(`Answer distribution is uneven: ${answers.join('/')}`);

const passed = errors.length === 0;
fs.writeFileSync(REPORT, [
  '# Police Mock Test Set 03 - Audit', '',
  `- Status: **${passed ? 'PASS' : 'FAIL'}**`,
  `- Total: ${payload.questions.length}`,
  `- Subject counts: ${JSON.stringify(counts)}`,
  `- Answer distribution A/B/C/D: ${answers.join('/')}`,
  `- Errors: ${errors.length}`,
  `- Warnings: ${warnings.length}`, '',
  '## Errors', ...(errors.length ? errors.map((error) => `- ${error}`) : ['- None']), '',
  '## Warnings', ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ['- None']), ''
].join('\n'));

console.log(JSON.stringify({ passed, errors, warnings, counts, answers, report: REPORT }, null, 2));
if (!passed) process.exitCode = 1;
