#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/exams');
const PUBLIC = path.join(ROOT, 'public');
const REPORT = path.join(CONTENT, 'police-mock-tests-all-audit.md');
const EXPECTED_COUNTS = { math: 20, thai: 20, computer: 40, saraban: 30, law: 25, english: 15 };
const SET_FILES = Array.from({ length: 5 }, (_, index) => `police-mock-test-set-0${index + 1}.json`);

const normalize = (value) => String(value ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
const compact = (value) => normalize(value).replace(/[“”‘’'".,!?():;\-–—/\\]/g, '');

function trigrams(value) {
  const text = compact(value);
  const result = new Set();
  for (let index = 0; index <= text.length - 3; index += 1) result.add(text.slice(index, index + 3));
  return result;
}

function jaccard(left, right) {
  const a = trigrams(left);
  const b = trigrams(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

const errors = [];
const warnings = [];
const sets = [];
const exactPrompts = new Map();
const exactFingerprints = new Map();
const visualAssets = new Map();

for (const file of SET_FILES) {
  const filePath = path.join(CONTENT, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`${file}: file not found`);
    continue;
  }

  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    continue;
  }

  const questions = Array.isArray(payload.questions) ? payload.questions : [];
  const counts = {};
  const answers = [0, 0, 0, 0];
  const setLabel = file.replace('.json', '');

  if (questions.length !== 150) errors.push(`${file}: expected 150 questions, found ${questions.length}`);

  for (const [index, question] of questions.entries()) {
    const label = `${setLabel} Q${question.position ?? index + 1}`;
    counts[question.subjectId] = (counts[question.subjectId] ?? 0) + 1;
    if (question.position !== index + 1) errors.push(`${label}: invalid position`);
    if (!question.prompt?.trim() || !question.explanation?.trim() || !question.tip?.trim()) errors.push(`${label}: incomplete content`);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${label}: expected four choices`);
    else if (new Set(question.choices.map(normalize)).size !== 4) errors.push(`${label}: duplicate choices`);
    if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex > 3) errors.push(`${label}: invalid answer index`);
    else answers[question.correctChoiceIndex] += 1;
    const hasDnaMetadata = question.sourceDnaSet && question.sourceMechanism && question.difficulty;
    const hasLegacySourceMetadata = question.sourceExamSetId && question.sourceQuestionId && question.sourceType;
    if (!hasDnaMetadata && !hasLegacySourceMetadata) errors.push(`${label}: incomplete source metadata`);

    const promptKey = normalize(question.prompt);
    exactPrompts.set(promptKey, [...(exactPrompts.get(promptKey) ?? []), label]);
    const fingerprint = JSON.stringify([promptKey, ...(question.choices ?? []).map(normalize)]);
    exactFingerprints.set(fingerprint, [...(exactFingerprints.get(fingerprint) ?? []), label]);

    const assets = [];
    if (question.media?.src) assets.push(question.media.src);
    if (Array.isArray(question.choiceImages)) assets.push(...question.choiceImages.map((image) => image?.src).filter(Boolean));
    for (const asset of assets) {
      visualAssets.set(asset, [...(visualAssets.get(asset) ?? []), label]);
      if (!fs.existsSync(path.join(PUBLIC, asset.replace(/^\//, '')))) errors.push(`${label}: missing local asset ${asset}`);
    }
  }

  for (const [subject, expected] of Object.entries(EXPECTED_COUNTS)) {
    if (counts[subject] !== expected) errors.push(`${file}: ${subject} expected ${expected}, found ${counts[subject] ?? 0}`);
  }
  const answerSpread = Math.max(...answers) - Math.min(...answers);
  if (answerSpread > 12) warnings.push(`${file}: answer distribution is uneven (${answers.join('/')})`);
  sets.push({ file, counts, answers, questions, answerSpread });
}

const duplicatePrompts = [...exactPrompts.entries()].filter(([, labels]) => labels.length > 1);
const duplicateFingerprints = [...exactFingerprints.entries()].filter(([, labels]) => labels.length > 1);
const reusedAssets = [...visualAssets.entries()].filter(([, labels]) => labels.length > 1);
for (const [, labels] of duplicatePrompts) warnings.push(`reused prompt template with different answer context: ${labels.join(' / ')}`);
for (const [, labels] of duplicateFingerprints) errors.push(`duplicate question fingerprint: ${labels.join(' / ')}`);
for (const [asset, labels] of reusedAssets) errors.push(`reused visual asset ${asset}: ${labels.join(' / ')}`);

const nearDuplicates = [];
for (let leftSet = 0; leftSet < sets.length; leftSet += 1) {
  for (let rightSet = leftSet + 1; rightSet < sets.length; rightSet += 1) {
    for (const left of sets[leftSet].questions) {
      for (const right of sets[rightSet].questions) {
        const score = jaccard(left.prompt, right.prompt);
        if (score >= 0.72 && score < 1) nearDuplicates.push({ left: `${sets[leftSet].file} Q${left.position}`, right: `${sets[rightSet].file} Q${right.position}`, score });
      }
    }
  }
}
nearDuplicates.sort((a, b) => b.score - a.score);
if (nearDuplicates.length) warnings.push(`${nearDuplicates.length} near-duplicate prompt pairs require manual review (threshold >= 0.72)`);

const passed = errors.length === 0;
const report = [
  '# Police Mock Tests 1-5 - Consolidated Audit',
  '',
  `- **Audit Result**: ${passed ? '✅ PASS' : '❌ FAIL'}`,
  `- **Timestamp**: ${new Date().toISOString()}`,
  `- **Scope**: ${sets.length} mock tests / ${sets.reduce((sum, set) => sum + set.questions.length, 0)} questions`,
  '',
  '## Per-set checks',
  ...sets.map((set) => `- **${set.file}**: 150 questions | ${JSON.stringify(set.counts)} | answers ${set.answers.join('/')} | spread ${set.answerSpread}`),
  '',
  '## Cross-set checks',
  `- Exact duplicate prompts: ${duplicatePrompts.length}`,
  `- Exact duplicate question fingerprints: ${duplicateFingerprints.length}`,
  `- Reused visual assets: ${reusedAssets.length}`,
  `- Near-duplicate prompt pairs (>= 0.72): ${nearDuplicates.length}`,
  ...(nearDuplicates.length ? nearDuplicates.slice(0, 20).map((item) => `  - ${item.left} ↔ ${item.right}: ${item.score.toFixed(3)}`) : ['  - None']),
  '',
  '## Issues',
  `- Errors (${errors.length}):`,
  ...(errors.length ? errors.map((error) => `  - ${error}`) : ['  - None']),
  `- Warnings (${warnings.length}):`,
  ...(warnings.length ? warnings.map((warning) => `  - ${warning}`) : ['  - None']),
  ''
].join('\n');

fs.writeFileSync(REPORT, report);
console.log(report);
process.exit(passed ? 0 : 1);
