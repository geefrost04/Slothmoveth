#!/usr/bin/env node
/**
 * migrate-opsd.mjs
 *
 * Reads OPSD content from ~/Documents/SlothMove/Page/source/OPSD/
 *   - Quiz_<subject>.questions.js  →  quiz data
 *
 * Generates TypeScript files at src/courses/opsd/data/<subject>.ts
 * (Read-only — does NOT modify the source folder)
 *
 * Format notes vs PAB:
 *   - OPSD uses short form: `{q, opts, ans, exp}` (not `question/choices/answer/explanation`)
 *   - English file (`English.questions.js`) uses `const englishQuestions = [...]`
 *     (no `window.` prefix) and adds `passage_title` / `passage` fields.
 *   - Each source file uses a different variable name; we list them
 *     explicitly per subject so the loader is deterministic.
 *
 * Subjects migrated (4 of 7 — see README "Course migration status"):
 *   ✅ info_act            ← Quiz_information_act.questions.js
 *   ✅ saraban             ← Quiz_saraban_regulation.questions.js
 *   ✅ english             ← English.questions.js
 *   ✅ general_knowledge   ← general_ability_quiz.questions.js
 *
 * Subjects NOT in source (3):
 *   ❌ admin_act           — no source file, kept as placeholder count 0
 *   ❌ defense_policy      — no source file
 *   ❌ computer            — no source file
 *
 * Subjects in source but NOT registered in config (ignored):
 *   ⏭ Security, Revolving, Ethics — out of scope (config is single source of truth)
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_ROOT = '/Users/geefrost/Documents/SlothMove/Page/source/OPSD';
const TARGET_ROOT = '/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/opsd/data';

/**
 * Map of subjectId → { file, varName, shape }.
 *  - `file`   : filename relative to SOURCE_ROOT
 *  - `varName`: name of the variable holding the array (or `window.<varName>`)
 *  - `shape`  : 'short' (q/opts/ans/exp) or 'english' (passage_title/passage + short)
 */
const SUBJECTS = [
  {
    id: 'info_act',
    file: 'Quiz_information_act.questions.js',
    varName: 'INFO_QUESTIONS',
    shape: 'short'
  },
  {
    id: 'saraban',
    file: 'Quiz_saraban_regulation.questions.js',
    varName: 'SARABAN_QUESTIONS',
    shape: 'short'
  },
  {
    id: 'english',
    file: 'English.questions.js',
    // English file uses `const englishQuestions = [...]` (no window prefix).
    varName: 'englishQuestions',
    shape: 'english'
  },
  {
    id: 'general_knowledge',
    file: 'general_ability_quiz.questions.js',
    varName: 'GENERAL_KNOWLEDGE_QUESTIONS',
    shape: 'short'
  }
];

/**
 * Evaluate a JS file in an isolated context to extract its top-level vars.
 * Supports both `var X = ...` and `window.X = ...` patterns.
 */
function extractGlobal(jsSource, varName) {
  const cleaned = jsSource
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  try {
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
    console.warn(`  Failed to extract ${varName}: ${err.message}`);
    return null;
  }
}

/**
 * Normalize a question object to the long-form
 * { question, choices, answer, explanation } shape.
 *  - Short form: { q, opts, ans, exp }
 *  - English:    { passage_title, passage, q, opts, ans, exp }
 */
function normalizeQuestion(raw, shape) {
  if (!raw || typeof raw !== 'object') return null;

  const q = String(raw.q ?? raw.question ?? '').trim();
  const opts = raw.opts ?? raw.choices;
  const ans = raw.ans ?? raw.answer;
  const exp = String(raw.exp ?? raw.explanation ?? '').trim();

  if (!q || !Array.isArray(opts)) return null;

  const choices = opts.map((c) => String(c ?? ''));
  const answer = Number.isInteger(ans) ? ans : 0;
  if (answer < 0 || answer >= choices.length) return null;

  const out = { question: q, choices, answer, explanation: exp };

  // English carries an optional reading passage per question — preserve
  // as a side-channel field on the quiz item (consumers can ignore if unused).
  if (shape === 'english' && (raw.passage || raw.passage_title)) {
    out.passage = String(raw.passage ?? '');
    out.passage_title = String(raw.passage_title ?? '');
  }

  return out;
}

async function loadQuiz(subject) {
  const filePath = path.join(SOURCE_ROOT, subject.file);
  let source;
  try {
    source = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    console.warn(`  No source file for ${subject.id} (${subject.file})`);
    return null;
  }

  const raw = extractGlobal(source, subject.varName);
  if (!Array.isArray(raw)) {
    console.warn(`  No array at ${subject.varName} in ${subject.file}`);
    return null;
  }

  const normalized = raw
    .map((q) => normalizeQuestion(q, subject.shape))
    .filter((q) => q && q.question && q.choices.length > 0);

  return normalized.length ? normalized : null;
}

/* -------------------------------------------------------------------------- */
/*   Adapters — mirror of src/lib/adapters/quiz-to-games.ts                    */
/* -------------------------------------------------------------------------- */

const MAX_ANSWER_CHARS = 60;
const MIN_QUESTION_CHARS = 12;

function deriveMatchFromQuiz(quiz) {
  const result = [];
  for (const q of quiz) {
    const left = cleanText(q.question || '');
    const right = String(q.choices?.[q.answer] ?? '');
    if (!right) continue;
    const truncated = left.length > 80 ? left.slice(0, 79) + '…' : left;
    result.push({ left: truncated, right });
    if (result.length >= 60) break;
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

/**
 * Derive flashcards from quiz items: front = short answer, back = question stem.
 * (No flashcard data source exists in the OPSD legacy — derive what we can.)
 */
function deriveFlashcardsFromQuiz(quiz) {
  const result = [];
  for (const q of quiz) {
    const answer = String(q.choices?.[q.answer] ?? '').trim();
    const question = cleanText(q.question || '');
    if (!answer || answer.length > 80) continue;
    if (!question) continue;
    result.push({ front: answer, back: question });
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
 * Mirrors scripts/migrate-pab.mjs output shape exactly so that the
 * data-loader.ts can `import * as OPSDData from './data'` and read
 * `<subject>_quiz / <subject>_flashcard / <subject>_match / <subject>_cloze`.
 */
function generateModule(subject, quizData, flashcardData, matchData, clozeData) {
  const lines = [
    '// AUTO-GENERATED by scripts/migrate-opsd.mjs — DO NOT EDIT',
    '// Source: ~/Documents/SlothMove/Page/source/OPSD/  (read-only)',
    `// Subject: ${subject.id}`,
    `// Generated: ${new Date().toISOString()}`,
    '',
    'import type { QuizItem, FlashcardItem, MatchPair, ClozeItem } from "../../../lib/course-types";',
    ''
  ];

  const quizOut = quizData ?? [];
  lines.push(`export const ${subject.id}_quiz: QuizItem[] = ${JSON.stringify(quizOut, null, 2)};`);
  lines.push('');

  const flashOut = flashcardData ?? [];
  lines.push(`export const ${subject.id}_flashcard: FlashcardItem[] = ${JSON.stringify(flashOut, null, 2)};`);
  lines.push('');

  const matchOut = matchData ?? [];
  lines.push(`export const ${subject.id}_match: MatchPair[] = ${JSON.stringify(matchOut, null, 2)};`);
  lines.push('');

  const clozeOut = clozeData ?? [];
  lines.push(`export const ${subject.id}_cloze: ClozeItem[] = ${JSON.stringify(clozeOut, null, 2)};`);
  lines.push('');

  return lines.join('\n');
}

async function main() {
  await fs.mkdir(TARGET_ROOT, { recursive: true });

  // Remove old per-subject files so we don't leave stale data behind
  // (the index.ts re-export will be rewritten next).
  const existing = await fs.readdir(TARGET_ROOT).catch(() => []);
  for (const f of existing) {
    if (f !== 'index.ts' && f.endsWith('.ts')) {
      await fs.unlink(path.join(TARGET_ROOT, f));
    }
  }

  const summary = [];

  for (const subject of SUBJECTS) {
    console.log(`→ ${subject.id} (${subject.file})`);
    const quiz = await loadQuiz(subject);

    if (!quiz) {
      console.log(`  ⚠️  No data — skipping`);
      summary.push({ id: subject.id, status: 'no data', count: 0 });
      continue;
    }

    const flashcard = deriveFlashcardsFromQuiz(quiz);
    const match = deriveMatchFromQuiz(quiz);
    const cloze = deriveClozeFromQuiz(quiz);

    const moduleSource = generateModule(subject, quiz, flashcard, match, cloze);
    const outPath = path.join(TARGET_ROOT, `${subject.id}.ts`);
    await fs.writeFile(outPath, moduleSource, 'utf-8');

    console.log(
      `  ✓ quiz=${quiz.length} flashcard=${flashcard.length} match=${match.length} cloze=${cloze.length} → ${subject.id}.ts`
    );
    summary.push({
      id: subject.id,
      status: 'migrated',
      quiz: quiz.length,
      flashcard: flashcard.length,
      match: match.length,
      cloze: cloze.length
    });
  }

  // Write index.ts that re-exports each migrated subject
  const migrated = summary.filter((s) => s.status === 'migrated').map((s) => s.id);
  const indexLines = [
    '// AUTO-GENERATED by scripts/migrate-opsd.mjs',
    '// Re-exports all migrated subject data for type-safe imports.',
    ''
  ];
  for (const id of migrated) {
    indexLines.push(`export * from './${id}';`);
  }
  await fs.writeFile(path.join(TARGET_ROOT, 'index.ts'), indexLines.join('\n') + '\n', 'utf-8');

  console.log('\n=== Summary ===');
  for (const s of summary) {
    if (s.status === 'migrated') {
      console.log(`  ✓ ${s.id.padEnd(20)} quiz=${s.quiz} flash=${s.flashcard} match=${s.match} cloze=${s.cloze}`);
    } else {
      console.log(`  ⚠ ${s.id.padEnd(20)} no data`);
    }
  }
  console.log(`\nWrote ${migrated.length} subject files + index.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
