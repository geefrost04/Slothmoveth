#!/usr/bin/env node
/**
 * migrate-pab.mjs
 *
 * Reads PAB content from ~/Documents/SlothMove/Page/source/PAB/<subject>/
 *   - <subject>.questions.js  →  quiz data
 *   - ../flashcards/<subject>.json.js → flashcard data
 *
 * Generates TypeScript files at src/courses/pab/data/<subject>.ts
 * (Read-only — does NOT modify the source folder)
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_ROOT = '/Users/geefrost/Documents/SlothMove/Page/source/PAB';
const TARGET_ROOT = '/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/pab/data';

// Subset of subjects we want to migrate. Add more by extending this list.
const SUBJECTS = [
  'admin_act',
  'info_act',
  'civil_service_act',
  'saraban_regulation',
  'budget_act',
  'disaster_act',
  'volunteer_regulation',
  'policy_analysis',
  'warning_regulation',
  'national_accident_regulation',
  'national_disaster_plan',
  'ministry_act',
  'disaster_situation',
  'disaster_department',
  'emergency_fund_regulation',
  // Phase D additions (2026-06-18): the 4 missing-data subjects
  // that had real source files in PAB/ but weren't in the original list.
  // 'computer' intentionally absent — no PAB source file exists.
  'budget_knowledge',
  'english',
  'political_economy',
  'national_plan',
  'road_safety_regulation'
];

/**
 * Evaluate a JS file in an isolated context to extract its global vars.
 * We don't need full JS — only `var QUESTIONS = [...]` or
 * `window.FLASHCARD_DATA_X = {...}` patterns.
 *
 * Approach: extract the array/object literal by regex + eval safely.
 * Safer approach: use Function() in a sandbox.
 */
function extractGlobal(jsSource, varName) {
  // Strip line + block comments first.
  const cleaned = jsSource
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  // Resolve the value via Function() in an isolated scope.
  // Supports any top-level name: `var X = ...`, `X = ...`, or `window.X = ...`.
  try {
    // Build a lookup that prefers the literal `varName`, then `window[varName]`.
    // The "window" object is stubbed so legacy `window.X = ...` assignments land on it.
    const wrapped = `
      "use strict";
      var window = (typeof window === "undefined") ? {} : window;
      ${cleaned}
      if (typeof ${varName} !== "undefined") return ${varName};
      if (typeof window !== "undefined" && typeof window["${varName}"] !== "undefined") return window["${varName}"];
      return null;
    `;
    const fn = new Function(wrapped);
    return fn();
  } catch (err) {
    console.warn(`Failed to extract ${varName}: ${err.message}`);
    return null;
  }
}

/**
 * Normalize a question object from either schema to the long-form
 * { question, choices, answer, explanation } shape.
 *  - Long form:  { question, choices, answer, explanation }
 *  - Short form: { q, opts, ans, exp }  (info_act + a few others)
 * Returns null if unrecognized.
 */
function normalizeQuestion(raw) {
  if (!raw || typeof raw !== 'object') return null;
  // Already long-form
  if (typeof raw.question === 'string' && Array.isArray(raw.choices)) {
    return {
      question: String(raw.question),
      choices: raw.choices.map((c) => String(c ?? '')),
      answer: Number.isInteger(raw.answer) ? raw.answer : 0,
      explanation: raw.explanation ? String(raw.explanation) : ''
    };
  }
  // Short form
  if (typeof raw.q === 'string' && Array.isArray(raw.opts)) {
    return {
      question: String(raw.q),
      choices: raw.opts.map((c) => String(c ?? '')),
      answer: Number.isInteger(raw.ans) ? raw.ans : 0,
      explanation: raw.exp ? String(raw.exp) : ''
    };
  }
  return null;
}

/**
 * Try multiple strategies to load data from a JS file.
 * Supports both `var QUESTIONS = [...]` and `window.X_QUESTIONS = [...]`
 * patterns, plus both long-form and short-form question schemas.
 */
async function loadQuestions(subject) {
  const filePath = path.join(SOURCE_ROOT, subject, `${subject}.questions.js`);
  let source;
  try {
    source = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    console.warn(`  No questions.js for ${subject}`);
    return null;
  }

  // Strategy A: `var QUESTIONS = [...]` (long-form or short-form items)
  let raw = extractGlobal(source, 'QUESTIONS');
  // Strategy B: `window.<SOMETHING>_QUESTIONS = [...]`
  // We try several common naming patterns. The first that resolves wins.
  if (!raw) {
    const candidates = [
      `${subject.toUpperCase()}_QUESTIONS`,
      'QUIZ_QUESTIONS', // Phase D: english.js uses this generic name
      subject.toUpperCase().replace(/_ACT$|_REGULATION$/, '') + '_QUESTIONS'
    ];
    for (const v of candidates) {
      raw = extractGlobal(source, v);
      if (raw) break;
    }
  }
  // Strategy C: any window.*_QUESTIONS assignment in the file
  // (Phase D: handles unusual generic names like QUIZ_QUESTIONS).
  if (!raw) {
    const windowVars = source.match(/window\.(\w*_?QUESTIONS)\s*=/g) || [];
    for (const m of windowVars) {
      const v = m.replace('window.', '').replace('=', '').trim();
      raw = extractGlobal(source, v);
      if (raw) break;
    }
  }
  if (!Array.isArray(raw)) return null;

  const normalized = raw
    .map(normalizeQuestion)
    .filter((q) => q && q.question && q.choices.length > 0);
  return normalized.length ? normalized : null;
}

async function loadFlashcards(subject) {
  // Strategy 2: Read flashcards/<subject>.json.js (window.FLASHCARD_DATA_<SUBJECT>)
  const filePath = path.join(SOURCE_ROOT, 'flashcards', `${subject}.json.js`);
  try {
    const source = await fs.readFile(filePath, 'utf-8');
    // Find all FLASHCARD_DATA_X vars in the file
    const matches = source.match(/window\.(FLASHCARD_DATA_\w+)\s*=/g);
    if (!matches) return null;
    for (const m of matches) {
      const varName = m.replace('window.', '').replace('=', '').trim();
      const data = extractGlobal(source, varName);
      if (data && data.cards) return data.cards;
    }
  } catch (err) {
    console.warn(`  No flashcards for ${subject}`);
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*   Adapters — mirror of src/lib/adapters/quiz-to-games.ts                    */
/*   (Duplicated here because this Node script can't load TypeScript)          */
/* -------------------------------------------------------------------------- */

const MAX_ANSWER_CHARS = 60;
const MIN_QUESTION_CHARS = 12;

function deriveMatchFromQuiz(quiz) {
  // Take every 4th item to avoid duplicates (avoid long match boards)
  const result = [];
  for (let i = 0; i < quiz.length; i += 1) {
    const q = quiz[i];
    const left = cleanText(q.question || '');
    const right = String(q.choices?.[q.answer] ?? '');
    if (!right) continue;
    const truncated = left.length > 80 ? left.slice(0, 79) + '…' : left;
    result.push({ left: truncated, right });
    if (result.length >= 60) break; // cap at 60 pairs per subject
  }
  return result;
}

function deriveClozeFromQuiz(quiz) {
  const result = [];
  for (const q of quiz) {
    const question = cleanText(q.question || '');
    const correctAnswer = cleanText(String(q.choices?.[q.answer] ?? ''));
    if (!correctAnswer) continue;
    if (correctAnswer.length > MAX_ANSWER_CHARS) continue;
    if (question.length < MIN_QUESTION_CHARS) continue;

    const distractors = (q.choices || [])
      .filter((_, i) => i !== q.answer)
      .map(cleanText)
      .filter((c) => c && c !== correctAnswer)
      .slice(0, 3);

    const context = q.explanation ? cleanText(q.explanation).slice(0, 100) : '';
    const options = shuffle([correctAnswer, ...distractors]);
    const fullText = context
      ? `${question}\n\n💡 ${context}\n\nคำตอบ: ___`
      : `${question}\n\nคำตอบ: ___`;

    result.push({ text: fullText, blanks: [correctAnswer], options });
    if (result.length >= 60) break;
  }
  return result;
}

function cleanText(s) {
  return s.replace(/\s+/g, ' ').replace(/\s+\?\s*$/, '?').trim();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate a TypeScript module exporting the subject's data.
 */
function generateModule(subject, quizData, flashcardData, matchData, clozeData) {
  const lines = [
    '// AUTO-GENERATED by scripts/migrate-pab.mjs — DO NOT EDIT',
    '// Source: ~/Documents/SlothMove/Page/source/PAB/  (read-only)',
    `// Subject: ${subject}`,
    `// Generated: ${new Date().toISOString()}`,
    '',
    'import type { QuizItem, FlashcardItem, MatchPair, ClozeItem } from "../../../lib/course-types";',
    ''
  ];

  if (quizData && quizData.length > 0) {
    lines.push(`export const ${subject}_quiz: QuizItem[] = ${JSON.stringify(quizData, null, 2)};`);
    lines.push('');
  } else {
    lines.push(`export const ${subject}_quiz: QuizItem[] = [];`);
    lines.push('');
  }

  if (flashcardData && flashcardData.length > 0) {
    // Trim flashcards to {front, back} only — type is simpler
    const trimmed = flashcardData.map((c) => ({
      front: String(c.front || ''),
      back: String(c.back || '')
    }));
    lines.push(`export const ${subject}_flashcard: FlashcardItem[] = ${JSON.stringify(trimmed, null, 2)};`);
    lines.push('');
  } else {
    lines.push(`export const ${subject}_flashcard: FlashcardItem[] = [];`);
    lines.push('');
  }

  if (matchData && matchData.length > 0) {
    lines.push(`export const ${subject}_match: MatchPair[] = ${JSON.stringify(matchData, null, 2)};`);
    lines.push('');
  } else {
    lines.push(`export const ${subject}_match: MatchPair[] = [];`);
    lines.push('');
  }

  if (clozeData && clozeData.length > 0) {
    lines.push(`export const ${subject}_cloze: ClozeItem[] = ${JSON.stringify(clozeData, null, 2)};`);
    lines.push('');
  } else {
    lines.push(`export const ${subject}_cloze: ClozeItem[] = [];`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Main
 */
async function main() {
  console.log('='.repeat(60));
  console.log('PAB Content Migration — slothmove-platform');
  console.log('='.repeat(60));
  console.log(`Source: ${SOURCE_ROOT}`);
  console.log(`Target: ${TARGET_ROOT}`);
  console.log('');

  // Ensure target dir exists
  await fs.mkdir(TARGET_ROOT, { recursive: true });

  let totalQuiz = 0;
  let totalFlash = 0;
  let totalMatch = 0;
  let totalCloze = 0;
  let migrated = 0;
  const summary = [];

  for (const subject of SUBJECTS) {
    process.stdout.write(`  ${subject} ... `);

    const [quiz, flash] = await Promise.all([
      loadQuestions(subject),
      loadFlashcards(subject)
    ]);

    if (!quiz && !flash) {
      console.log('SKIP (no data)');
      continue;
    }

    // Derive Match + Cloze from Quiz data using adapters.
    // Quiz-to-games logic lives in src/lib/adapters/quiz-to-games.ts
    // We re-implement the small adapter here (instead of importing)
    // because this script runs OUTSIDE the Next.js build (no TS loader).
    const matchData = quiz ? deriveMatchFromQuiz(quiz) : [];
    const clozeData = quiz ? deriveClozeFromQuiz(quiz) : [];

    const ts = generateModule(subject, quiz, flash, matchData, clozeData);
    const targetPath = path.join(TARGET_ROOT, `${subject}.ts`);
    await fs.writeFile(targetPath, ts, 'utf-8');

    const qCount = quiz?.length ?? 0;
    const fCount = flash?.length ?? 0;
    const mCount = matchData.length;
    const cCount = clozeData.length;
    totalQuiz += qCount;
    totalFlash += fCount;
    totalMatch += mCount;
    totalCloze += cCount;
    migrated++;

    console.log(`✓ quiz: ${qCount}, flash: ${fCount}, match: ${mCount}, cloze: ${cCount}`);
    summary.push({ subject, quiz: qCount, flash: fCount, match: mCount, cloze: cCount });
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Subjects migrated: ${migrated}/${SUBJECTS.length}`);
  console.log(`Total quiz items: ${totalQuiz}`);
  console.log(`Total flashcard items: ${totalFlash}`);
  console.log(`Total match pairs: ${totalMatch}`);
  console.log(`Total cloze items: ${totalCloze}`);
  console.log('');

  // Generate/update data index. Preserve any hand-curated exports
  // (e.g. PAB_AUTHORITY, PAB_LOGIC) by re-appending them after rewrite.
  const curatedCandidates = [
    { from: './authority', name: 'PAB_AUTHORITY' },
    { from: './logic', name: 'PAB_LOGIC' }
  ];
  const presentExports = [];
  for (const { from, name } of curatedCandidates) {
    try {
      await fs.access(path.join(TARGET_ROOT, from.replace('./', '') + '.ts'));
      presentExports.push({ from, name });
    } catch {
      // curated file not present — skip
    }
  }

  const indexLines = [
    '// AUTO-GENERATED by scripts/migrate-pab.mjs',
    '// Re-exports all subject data for type-safe imports.',
    '',
    ...SUBJECTS.map((s) => `export * from './${s}';`),
    ''
  ];
  if (presentExports.length > 0) {
    indexLines.push('// Curated datasets (manual, not auto-migrated)');
    for (const { from, name } of presentExports) {
      indexLines.push(`export { ${name} } from '${from}';`);
    }
    indexLines.push('');
  }
  await fs.writeFile(path.join(TARGET_ROOT, 'index.ts'), indexLines.join('\n'), 'utf-8');
  console.log(`  ✓ Generated index.ts (re-exports ${SUBJECTS.length} subjects${presentExports.length ? ` + ${presentExports.length} curated` : ''})`);
  console.log('');
  console.log('Done.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
