#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/exams');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MOCK5_PATH = path.join(CONTENT, 'police-mock-test-set-05.json');
const REPORT_PATH = path.join(CONTENT, 'police-mock-test-set-05-audit.md');

const expectedCounts = { math: 20, thai: 20, computer: 40, saraban: 30, law: 25, english: 15 };

function normalizeText(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function loadComparisonSets() {
  const comparisons = {};
  for (const file of fs.readdirSync(CONTENT)) {
    if (!file.endsWith('.json') || file === path.basename(MOCK5_PATH)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(path.join(CONTENT, file), 'utf8'));
      if (Array.isArray(data.questions)) comparisons[file] = data.questions;
    } catch {
      // Ignore malformed or non-exam JSON files in the content directory.
    }
  }
  return comparisons;
}

if (!fs.existsSync(MOCK5_PATH)) {
  console.error(`Error: File not found: ${MOCK5_PATH}`);
  process.exit(1);
}

const mock5Payload = JSON.parse(fs.readFileSync(MOCK5_PATH, 'utf8'));
const comparisonSets = loadComparisonSets();

const errors = [];
const warnings = [];

const mock5Counts = {};
const mock5Answers = [0, 0, 0, 0];
const mock5Prompts = new Map();
let visualCount = 0;
const visualQuestions = [];

for (const [index, q] of mock5Payload.questions.entries()) {
  const label = `Mock5 Q${index + 1}`;
  mock5Counts[q.subjectId] = (mock5Counts[q.subjectId] ?? 0) + 1;

  if (q.position !== index + 1) errors.push(`${label}: invalid position (${q.position} !== ${index + 1})`);
  if (!q.prompt?.trim() || !q.explanation?.trim() || !q.tip?.trim()) errors.push(`${label}: incomplete content (missing prompt, explanation, or tip)`);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(`${label}: expected four choices, found ${q.choices?.length}`);
  if (new Set((q.choices || []).map((c) => normalizeText(c))).size !== 4) errors.push(`${label}: duplicate choices within question`);
  if (!Number.isInteger(q.correctChoiceIndex) || q.correctChoiceIndex < 0 || q.correctChoiceIndex > 3) {
    errors.push(`${label}: invalid answer index (${q.correctChoiceIndex})`);
  } else {
    mock5Answers[q.correctChoiceIndex] += 1;
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
    } else if (!/(ข้อ|มาตรา|หมวด|ภาคผนวก|ฉบับที่|ทฤษฎี|พระราชบัญญัติ|ระเบียบ)/.test(q.verificationRef)) {
      warnings.push(`${label}: verificationRef '${q.verificationRef}' lacks specific clause/article citation`);
    }
  }

  // Media / visual check
  let hasVisual = false;
  if (q.media?.src) {
    hasVisual = true;
    const mediaPath = path.join(PUBLIC_DIR, q.media.src.replace(/^\//, ''));
    if (!fs.existsSync(mediaPath)) {
      errors.push(`${label}: referenced media.src not found: ${q.media.src}`);
    }
  }
  if (Array.isArray(q.media?.choiceImages) && q.media.choiceImages.length > 0) {
    hasVisual = true;
    for (const [ci, cImg] of q.media.choiceImages.entries()) {
      const srcStr = typeof cImg === 'string' ? cImg : cImg?.src;
      if (!srcStr) {
        errors.push(`${label}: choice image [${ci}] missing src`);
        continue;
      }
      const choiceImgPath = path.join(PUBLIC_DIR, srcStr.replace(/^\//, ''));
      if (!fs.existsSync(choiceImgPath)) {
        errors.push(`${label}: choice image [${ci}] not found: ${srcStr}`);
      }
    }
  }
  if (hasVisual) {
    visualCount++;
    visualQuestions.push({ position: q.position, subject: q.subjectId, src: q.media?.src, choiceImages: q.media?.choiceImages });
  }

  const norm = normalizeText(q.prompt);
  mock5Prompts.set(norm, [...(mock5Prompts.get(norm) ?? []), q.position]);
}

if (mock5Payload.questions.length !== 150) errors.push(`Mock5: Expected 150 questions, found ${mock5Payload.questions.length}`);
for (const [subject, exp] of Object.entries(expectedCounts)) {
  if (mock5Counts[subject] !== exp) errors.push(`Mock5 ${subject}: expected ${exp}, found ${mock5Counts[subject] ?? 0}`);
}
for (const [prompt, positions] of mock5Prompts.entries()) {
  if (positions.length > 1) errors.push(`Mock5 internal duplicate prompt: Q${positions.join(', Q')}`);
}

// Compare against every exam source file, not only prior mock tests. A paid
// mock must not reproduce a question a learner can already encounter in a
// subject pack or free category set.
let crossSetDuplicateCount = 0;
let crossSetVisualReuseCount = 0;
const duplicateSources = new Map();
const visualReuseSources = new Map();
for (const [file, prior] of Object.entries(comparisonSets)) {
  for (const q5 of mock5Payload.questions) {
    const norm5 = normalizeText(q5.prompt);
    for (const qPrior of prior) {
      if (norm5 === normalizeText(qPrior.prompt)) {
        errors.push(`Mock5 Q${q5.position} is an exact duplicate of ${file} Q${qPrior.position}`);
        crossSetDuplicateCount++;
        duplicateSources.set(file, (duplicateSources.get(file) ?? 0) + 1);
      }

      const samePrimaryAsset = Boolean(q5.media?.src) && q5.media.src === qPrior.media?.src;
      const q5ChoiceAssets = q5.media?.choiceImages ?? [];
      const priorChoiceAssets = qPrior.media?.choiceImages ?? [];
      const sameChoiceAssets = q5ChoiceAssets.length > 0
        && JSON.stringify(q5ChoiceAssets) === JSON.stringify(priorChoiceAssets);
      if (samePrimaryAsset || sameChoiceAssets) {
        const assetLabel = samePrimaryAsset ? q5.media.src : 'the same choice-image set';
        errors.push(`Mock5 Q${q5.position} reuses visual asset ${assetLabel} from ${file} Q${qPrior.position}`);
        crossSetVisualReuseCount++;
        visualReuseSources.set(file, (visualReuseSources.get(file) ?? 0) + 1);
      }
    }
  }
}

const passed = errors.length === 0;

const choiceLabels = ['ก (A)', 'ข (B)', 'ค (C)', 'ง (D)'];
const mock5DistStr = mock5Answers.map((cnt, i) => `${choiceLabels[i]}: ${cnt} (${((cnt / 150) * 100).toFixed(1)}%)`).join(' | ');

const reportContent = [
  '# Police Mock Test Set 05 - Comprehensive Audit Report',
  '',
  `- **Audit Result**: ${passed ? '✅ PASS' : '❌ FAIL'}`,
  `- **Timestamp**: ${new Date().toISOString()}`,
  '',
  '## 1. Exam Structure & Subject Breakdown',
  `- Total Questions: ${mock5Payload.questions.length}`,
  `- Subject Breakdown: ${JSON.stringify(mock5Counts)}`,
  `- Expected Breakdown: ${JSON.stringify(expectedCounts)}`,
  `- Answer Distribution: ${mock5DistStr}`,
  '',
  '## 2. Visual / Diagram Integration (Premium Features)',
  `- Total Visual Questions: ${visualCount} / 150`,
  ...visualQuestions.map((vq) => `  - Q${vq.position} (${vq.subject}): ${vq.src || 'Choice Diagrams'} ${vq.choiceImages ? `(4 choice SVGs)` : ''}`),
  '',
  '## 3. Catalog-wide Duplication Audit',
  `- Exact duplicates against all other exam files: ${crossSetDuplicateCount} matches detected`,
  ...(duplicateSources.size
    ? [...duplicateSources.entries()].map(([file, count]) => `  - ${file}: ${count}`)
    : ['  - None']),
  `- Reused visual assets against all other exam files: ${crossSetVisualReuseCount} matches detected`,
  ...(visualReuseSources.size
    ? [...visualReuseSources.entries()].map(([file, count]) => `  - ${file}: ${count}`)
    : ['  - None']),
  `- Internal Duplicate Prompts: ${Array.from(mock5Prompts.values()).filter((p) => p.length > 1).length}`,
  '',
  '## 4. Issues & Quality Verification',
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
