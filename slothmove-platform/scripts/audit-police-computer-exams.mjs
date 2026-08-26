#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const shouldFix = process.argv.includes('--fix');
const targetPattern = [0, 2, 1, 3, 1, 0, 3, 2];
const results = [];

for (const setNo of [1, 2, 3]) {
  const padded = String(setNo).padStart(2, '0');
  const filePath = path.join(ROOT, 'content/exams', `police-computer-set-${padded}-notebooklm.json`);
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const issues = [];

  if (payload.questions.length !== 30) issues.push(`expected 30 questions, found ${payload.questions.length}`);

  payload.questions.forEach((question, index) => {
    if (question.position !== index + 1) issues.push(`Q${index + 1}: invalid position`);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) issues.push(`Q${index + 1}: expected four choices`);
    if (new Set(question.choices).size !== 4) issues.push(`Q${index + 1}: duplicate choices`);
    if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex > 3) {
      issues.push(`Q${index + 1}: invalid answer index`);
    }
    if (!question.prompt || !question.explanation || !question.tip) issues.push(`Q${index + 1}: incomplete content`);

    if (shouldFix && setNo < 3) {
      const targetIndex = targetPattern[index % targetPattern.length];
      const currentIndex = question.correctChoiceIndex;
      if (currentIndex !== targetIndex) {
        [question.choices[currentIndex], question.choices[targetIndex]] = [question.choices[targetIndex], question.choices[currentIndex]];
        question.correctChoiceIndex = targetIndex;
      }
    }
  });

  const distribution = [0, 0, 0, 0];
  payload.questions.forEach((question) => distribution[question.correctChoiceIndex] += 1);
  if (Math.max(...distribution) - Math.min(...distribution) > 2) {
    issues.push(`imbalanced answer distribution: ${distribution.join('/')}`);
  }

  if (shouldFix) fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  results.push({ setNo, questions: payload.questions.length, answerDistribution: distribution, issues });
}

console.log(JSON.stringify({ fixed: shouldFix, results }, null, 2));
if (results.some((result) => result.issues.length)) process.exitCode = 1;
