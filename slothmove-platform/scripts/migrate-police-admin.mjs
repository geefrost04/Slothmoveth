#!/usr/bin/env node
/**
 * migrate-police-admin.mjs
 *
 * Reads police_admin content from
 *   ~/Documents/SlothMove/Page/source/police_admin/<subject>/
 *   (or english/data/) and emits TypeScript files at
 *   src/courses/police_admin/data/<subject>.ts
 *
 * Read-only on the source folder.
 *
 * 6 subjects total: math, thai, computer, saraban, law, english
 * Field name normalization (each subject uses a different convention):
 *   math:      q -> question,  o[] -> choices,  a -> answer,  explanation, hint, category, pattern
 *   thai:      question, choices[], answer, explanation
 *   computer:  question, choices[], answer, explanation
 *   saraban:   q -> question,  choices[],  answer,  explain -> explanation
 *   law:       q -> question,  choices[],  answer,  explain -> explanation
 *   english:   q -> question,  choices[],  answer,  explain -> explanation
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const SOURCE_ROOT = '/Users/geefrost/Documents/SlothMove/Page/source/police_admin';
const TARGET_ROOT = '/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/police_admin/data';

const SUBJECTS = [
  // Math has 10 part arrays (one per topic) — see multiVarNames below.
  { id: 'math',     varName: 'generalAbilityMathPart1', file: 'math/math.questions.js',
    multiVarNames: [
      'generalAbilityMathPart1', 'generalAbilityMathPart2',
      'generalAbilityMathPart3', 'generalAbilityMathPart4',
      'generalAbilityAnalogyPart1', 'generalAbilityAnalogyPart2',
      'generalAbilityMatrixPart1', 'generalAbilityLetterSeriesPart1',
      'generalAbilityLogicPart1', 'generalAbilityFractionSeriesPart1'
    ] },
  { id: 'thai',     varName: 'THAI_QUESTIONS',          file: 'thai/thai.questions.js' },
  { id: 'computer', varName: 'COMPUTER_QUESTIONS',      file: 'computer/computer.questions.js' },
  { id: 'saraban',  varName: 'SARABAN_QUESTIONS',       file: 'saraban/saraban.questions.js' },
  { id: 'law',      varName: 'LAW_QUIZ_DATA',           file: 'law/law.questions.js' },
  { id: 'english',  varName: 'ENGLISH_QUESTIONS',       file: 'english/data/english.questions.js' }
];

/**
 * Extract a global var from a legacy .js file using node:vm.
 * Supports `var X = ...`, `X = ...`, and `window.X = ...` patterns.
 * Strips `export default X;` (illegal in plain JS) before parsing.
 * Wraps source in try/catch and returns [] on parse error so that
 * even partially-valid source files (e.g. law.questions.js which
 * has a stray `;` in one array element) can still yield data.
 */
function extractGlobal(jsSource, varName) {
  // Strip line + block comments.
  let cleaned = jsSource
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  // Strip ES-module exports: `export default X;` and `export { X };`
  // These are illegal in plain JS contexts.
  cleaned = cleaned
    .replace(/^\s*export\s+default\s+\w+\s*;?\s*$/gm, '')
    .replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, '');

  // Stub `window` so legacy `window.X = ...` assignments land on it,
  // and stub `self` for the rare `self.X = ...` pattern.
  const sandbox = {
    window: {},
    self: {},
    console: { log() {}, warn() {}, error() {} }
  };
  try {
    vm.createContext(sandbox);
    vm.runInContext(cleaned, sandbox, { timeout: 5_000 });
    if (sandbox[varName] !== undefined) return sandbox[varName];
    if (sandbox.window[varName] !== undefined) return sandbox.window[varName];
    if (sandbox.self[varName] !== undefined) return sandbox.self[varName];
    return null;
  } catch (err) {
    console.warn(`  Failed to extract ${varName}: ${err.message}`);
    return null;
  }
}

/**
 * Heuristic repair for source files that have small syntax errors
 * (e.g. law.questions.js has a stray `;` after id: 99 in the array
 * literal that prevents vm from parsing the whole file).
 *
 * Strategy: locate the declared array `varName = [ ... ];` and try
 * to extract just that block, then sanitize common issues inside:
 *   1. Stray `;` after an array element close (`},` followed by `;`)
 *   2. Missing `}` before `]` (e.g. `..., "..."\n];` — found in
 *      law.questions.js's last element). Insert a `}` before `];`.
 */
function extractGlobalHeuristic(jsSource, varName) {
  // Find the `... varName = [ ... ];` block.
  const openIdx = jsSource.indexOf(`${varName} = [`);
  if (openIdx === -1) return null;
  let depth = 0;
  let start = -1;
  let end = -1;
  let inString = null;
  let escaped = false;
  for (let i = openIdx; i < jsSource.length; i++) {
    const ch = jsSource[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (inString) {
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue; }
    if (ch === '[') { if (start === -1) start = i; depth++; continue; }
    if (ch === ']') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (start === -1 || end === -1) return null;
  let arrayLiteral = jsSource.slice(openIdx + varName.length + 3, end + 1);
  // Sanitize stray `;` after an array element close. Pattern: `},` or `]` followed by `;` then next `{`.
  arrayLiteral = arrayLiteral.replace(/\}\s*;\s*(?=\{)/g, '},\n  ');
  // Sanitize missing `}` before the FINAL `]` (e.g. `..."explanation"\n]`).
  // The original law.questions.js ends with `..."บัญญัติ"\n]` — no semicolon
  // after the closing bracket. We patch the LAST `]` in the array. If the
  // last non-whitespace char before `]` is `"` (a string close), we need
  // to insert `}`. If it's already `}`, no patch needed.
  const finalIdx = arrayLiteral.lastIndexOf(']');
  if (finalIdx !== -1) {
    const before = arrayLiteral.slice(0, finalIdx);
    const after = arrayLiteral.slice(finalIdx);
    const trimmed = before.replace(/\s+$/, '');
    if (trimmed.endsWith('"') || trimmed.endsWith("'") || trimmed.endsWith('`')) {
      arrayLiteral = trimmed + '}' + after;
    }
  }
  try {
    // Wrap in parens to coerce to value, eval via Function.
    const fn = new Function(`"use strict"; return (${arrayLiteral});`);
    return fn();
  } catch (err) {
    console.warn(`  Heuristic extract failed for ${varName}: ${err.message}`);
    return null;
  }
}

/**
 * Normalize a raw question to the canonical QuizItem shape.
 * Returns null if the item is missing required fields.
 *
 * Preserves metadata fields when present:
 *   - hint     → string|null
 *   - category → string|null
 *   - pattern  → string|null
 *
 * These are used by Phase B derived games (analogy, series,
 * compare-values, word-problem, speed-percent) to route questions
 * to the correct game and to surface a pattern badge in the UI.
 */
function normalizeQuestion(raw) {
  if (!raw || typeof raw !== 'object') return null;

  // Canonical long-form: { question, choices, answer, explanation }
  // We also accept the other shapes used by police_admin.
  const question = typeof raw.question === 'string'
    ? raw.question
    : (typeof raw.q === 'string' ? raw.q : null);
  if (!question) return null;

  const choices = Array.isArray(raw.choices)
    ? raw.choices
    : (Array.isArray(raw.o) ? raw.o : null);
  if (!choices || choices.length === 0) return null;

  const answer = Number.isInteger(raw.answer)
    ? raw.answer
    : (Number.isInteger(raw.a) ? raw.a : 0);

  const explanation = typeof raw.explanation === 'string'
    ? raw.explanation
    : (typeof raw.explain === 'string' ? raw.explain : '');

  // Optional metadata fields
  const hint = typeof raw.hint === 'string' ? raw.hint : '';
  const category = typeof raw.category === 'string' ? raw.category : '';
  const pattern = typeof raw.pattern === 'string' ? raw.pattern : '';

  return {
    question,
    choices: choices.map((c) => String(c ?? '')),
    answer,
    explanation,
    hint,
    category,
    pattern
  };
}

async function loadQuestionsForSubject(subject) {
  const filePath = path.join(SOURCE_ROOT, subject.file);
  let source;
  try {
    source = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    console.warn(`  No file for ${subject.id}: ${filePath}`);
    return null;
  }

  // Single-var subjects: extract the named var (with heuristic fallback).
  // Multi-var subjects (math has 10 parts): extract each part and concat.
  let raw = null;
  if (subject.multiVarNames && subject.multiVarNames.length > 0) {
    const parts = [];
    for (const v of subject.multiVarNames) {
      const part = extractGlobal(source, v) || extractGlobalHeuristic(source, v);
      if (Array.isArray(part)) parts.push(...part);
    }
    raw = parts.length ? parts : null;
  } else {
    raw = extractGlobal(source, subject.varName)
      || extractGlobalHeuristic(source, subject.varName);
  }
  if (!Array.isArray(raw)) {
    console.warn(`  ${subject.id}: var ${subject.varName} not found or not array`);
    return null;
  }

  const normalized = raw
    .map(normalizeQuestion)
    .filter((q) => q && q.question && q.choices.length > 0);

  if (normalized.length === 0) {
    console.warn(`  ${subject.id}: 0 valid questions after normalize`);
    return null;
  }

  console.log(`  ${subject.id}: ${normalized.length} questions (raw: ${raw.length})`);
  return normalized;
}

/** Format an array of objects as a TypeScript source file. */
function emitQuizTS(subjectId, items) {
  const header = `// AUTO-GENERATED by scripts/migrate-police-admin.mjs — DO NOT EDIT
// Source: ~/Documents/SlothMove/Page/source/police_admin/  (read-only)
// Subject: ${subjectId}

import type { QuizItem } from "../../../lib/course-types";

export const ${subjectId}_quiz: QuizItem[] = ${JSON.stringify(items, null, 2)};
`;
  return header;
}

async function writeFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
  console.log(`  wrote ${path.relative(process.cwd(), filePath)}`);
}

async function main() {
  console.log('=== migrate-police-admin ===');
  let totalItems = 0;
  for (const subject of SUBJECTS) {
    console.log(`\n[${subject.id}]`);
    const items = await loadQuestionsForSubject(subject);
    if (!items) continue;
    const outPath = path.join(TARGET_ROOT, `${subject.id}.ts`);
    await writeFile(outPath, emitQuizTS(subject.id, items));
    totalItems += items.length;
  }
  console.log(`\n=== done — ${totalItems} questions across ${SUBJECTS.length} subjects ===`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});