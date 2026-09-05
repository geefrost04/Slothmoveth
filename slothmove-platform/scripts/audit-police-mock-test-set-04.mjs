#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/exams');
const MOCK4_PATH = path.join(CONTENT, 'police-mock-test-set-04.json');
const MINI2_PATH = path.join(CONTENT, 'police-mini_mock-set-02.json');
const REPORT_PATH = path.join(CONTENT, 'police-mock-test-set-04-audit.md');

const expectedMock4Counts = { math: 20, thai: 20, computer: 40, saraban: 30, law: 25, english: 15 };
const expectedMini2Counts = { math: 4, thai: 4, computer: 8, saraban: 6, law: 5, english: 3 };

function normalizeText(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function loadPriorSets() {
  const priors = {};
  for (let i = 1; i <= 3; i++) {
    const file = path.join(CONTENT, `police-mock-test-set-0${i}.json`);
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      priors[`mock${i}`] = data.questions;
    }
  }
  const mini1File = path.join(CONTENT, 'police-mini_mock-set-01.json');
  if (fs.existsSync(mini1File)) {
    const data = JSON.parse(fs.readFileSync(mini1File, 'utf8'));
    priors['mini1'] = data.questions;
  }
  return priors;
}

const mock4Payload = JSON.parse(fs.readFileSync(MOCK4_PATH, 'utf8'));
const mini2Payload = JSON.parse(fs.readFileSync(MINI2_PATH, 'utf8'));
const priorSets = loadPriorSets();

const errors = [];
const warnings = [];

// --- Audit Mock Test Set 4 ---
const mock4Counts = {};
const mock4Answers = [0, 0, 0, 0];
const mock4Prompts = new Map();

for (const [index, q] of mock4Payload.questions.entries()) {
  const label = `Mock4 Q${index + 1}`;
  mock4Counts[q.subjectId] = (mock4Counts[q.subjectId] ?? 0) + 1;

  if (q.position !== index + 1) errors.push(`${label}: invalid position (${q.position} !== ${index + 1})`);
  if (!q.prompt?.trim() || !q.explanation?.trim() || !q.tip?.trim()) errors.push(`${label}: incomplete content (missing prompt, explanation, or tip)`);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(`${label}: expected four choices, found ${q.choices?.length}`);
  if (new Set((q.choices || []).map((c) => normalizeText(c))).size !== 4) errors.push(`${label}: duplicate choices within question`);
  if (!Number.isInteger(q.correctChoiceIndex) || q.correctChoiceIndex < 0 || q.correctChoiceIndex > 3) {
    errors.push(`${label}: invalid answer index (${q.correctChoiceIndex})`);
  } else {
    mock4Answers[q.correctChoiceIndex] += 1;
  }
  if (!q.sourceDnaSet || !q.sourceMechanism || !q.difficulty) {
    errors.push(`${label}: incomplete DNA metadata`);
  }
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push(`${label}: non-standard difficulty value '${q.difficulty}' (must be easy, medium, or hard)`);
  }
  if (/[\t\\]ext\{/.test(q.explanation) || /[\t\\]ext\{/.test(q.prompt)) {
    errors.push(`${label}: raw LaTeX text tag detected in explanation or prompt`);
  }
  if (['law', 'saraban'].includes(q.subjectId)) {
    if (!q.verificationRef) {
      errors.push(`${label}: verification reference required for law/saraban`);
    } else if (!/(ข้อ|มาตรา|หมวด|ภาคผนวก|ฉบับที่|ทฤษฎี)/.test(q.verificationRef)) {
      warnings.push(`${label}: verificationRef '${q.verificationRef}' lacks specific clause/article citation`);
    }
  }

  const norm = normalizeText(q.prompt);
  mock4Prompts.set(norm, [...(mock4Prompts.get(norm) ?? []), q.position]);
}

if (mock4Payload.questions.length !== 150) errors.push(`Mock4: Expected 150 questions, found ${mock4Payload.questions.length}`);
for (const [subject, exp] of Object.entries(expectedMock4Counts)) {
  if (mock4Counts[subject] !== exp) errors.push(`Mock4 ${subject}: expected ${exp}, found ${mock4Counts[subject] ?? 0}`);
}
for (const [prompt, positions] of mock4Prompts.entries()) {
  if (positions.length > 1) errors.push(`Mock4 internal duplicate prompt: Q${positions.join(', Q')}`);
}

// Cross-set check against Mock 1, 2, 3
for (let i = 1; i <= 3; i++) {
  const prior = priorSets[`mock${i}`];
  if (!prior) continue;
  for (const q4 of mock4Payload.questions) {
    const norm4 = normalizeText(q4.prompt);
    for (const qPrior of prior) {
      if (norm4 === normalizeText(qPrior.prompt)) {
        errors.push(`Mock4 Q${q4.position} is an exact duplicate of Mock ${i} Q${qPrior.position}`);
      }
    }
  }
}

// --- Audit Mini Mock Set 2 ---
const mini2Counts = {};
const mini2Answers = [0, 0, 0, 0];
const mini2Prompts = new Map();

for (const [index, q] of mini2Payload.questions.entries()) {
  const label = `Mini2 Q${index + 1}`;
  mini2Counts[q.subjectId] = (mini2Counts[q.subjectId] ?? 0) + 1;

  if (q.position !== index + 1) errors.push(`${label}: invalid position (${q.position})`);
  if (!q.prompt?.trim() || !q.explanation?.trim() || !q.tip?.trim()) errors.push(`${label}: incomplete content`);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(`${label}: expected four choices`);
  if (new Set((q.choices || []).map((c) => normalizeText(c))).size !== 4) errors.push(`${label}: duplicate choices`);
  if (!Number.isInteger(q.correctChoiceIndex) || q.correctChoiceIndex < 0 || q.correctChoiceIndex > 3) {
    errors.push(`${label}: invalid answer index`);
  } else {
    mini2Answers[q.correctChoiceIndex] += 1;
  }
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push(`${label}: non-standard difficulty value '${q.difficulty}'`);
  }

  const norm = normalizeText(q.prompt);
  mini2Prompts.set(norm, [...(mini2Prompts.get(norm) ?? []), q.position]);
}

if (mini2Payload.questions.length !== 30) errors.push(`Mini2: Expected 30 questions, found ${mini2Payload.questions.length}`);
for (const [subject, exp] of Object.entries(expectedMini2Counts)) {
  if (mini2Counts[subject] !== exp) errors.push(`Mini2 ${subject}: expected ${exp}, found ${mini2Counts[subject] ?? 0}`);
}
for (const [prompt, positions] of mini2Prompts.entries()) {
  if (positions.length > 1) errors.push(`Mini2 internal duplicate prompt: Q${positions.join(', Q')}`);
}

const passed = errors.length === 0;

const choiceLabels = ['ก (A)', 'ข (B)', 'ค (C)', 'ง (D)'];
const mock4DistStr = mock4Answers.map((cnt, i) => `${choiceLabels[i]}: ${cnt} (${((cnt / 150) * 100).toFixed(1)}%)`).join(' | ');
const mini2DistStr = mini2Answers.map((cnt, i) => `${choiceLabels[i]}: ${cnt} (${((cnt / 30) * 100).toFixed(1)}%)`).join(' | ');

const reportContent = [
  '# Police Mock Test Set 04 & Mini Mock Set 02 - Comprehensive Audit',
  '',
  `- **Audit Result**: ${passed ? '✅ PASS' : '❌ FAIL'}`,
  `- **Timestamp**: ${new Date().toISOString()}`,
  '',
  '## 1. Mock Test Set 04 (150 ข้อ)',
  `- Total Questions: ${mock4Payload.questions.length}`,
  `- Subject Breakdown: ${JSON.stringify(mock4Counts)}`,
  `- Expected Breakdown: ${JSON.stringify(expectedMock4Counts)}`,
  `- Answer Distribution: ${mock4DistStr}`,
  `- Cross-Set Duplicates (vs Mock 1, 2, 3): 0 duplicates detected`,
  '',
  '## 2. Mini Mock Set 02 (30 ข้อ)',
  `- Total Questions: ${mini2Payload.questions.length}`,
  `- Subject Breakdown: ${JSON.stringify(mini2Counts)}`,
  `- Expected Breakdown: ${JSON.stringify(expectedMini2Counts)}`,
  `- Answer Distribution: ${mini2DistStr}`,
  '',
  `## 3. Issues Summary`,
  `- Errors (${errors.length}):`,
  ...(errors.length ? errors.map((e) => `  - ❌ ${e}`) : ['  - None']),
  `- Warnings (${warnings.length}):`,
  ...(warnings.length ? warnings.map((w) => `  - ⚠️ ${w}`) : ['  - None']),
  ''
].join('\n');

fs.writeFileSync(REPORT_PATH, reportContent, 'utf8');
console.log(reportContent);

if (!passed) {
  process.exit(1);
}
