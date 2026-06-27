#!/usr/bin/env node
/**
 * migrate-industry.mjs
 *
 * Reads Industry content from ~/Documents/SlothMove/Page/source/Industry/
 *   - <name>.questions.js  →  quiz data
 *
 * Generates TypeScript files at src/courses/industry/data/<subject>.ts
 * (Read-only — does NOT modify the source folder)
 *
 * Format notes (DIFFERENT from PAB + OPSD):
 *   - Industry uses `const <camelCase>Questions = [...]` (no `window.` prefix)
 *   - Fields are short form: { q, o, a, exp } (NOT q/opts/ans/exp like OPSD)
 *     • `o` is the choices array (OPSD uses `opts`, PAB uses `choices`)
 *     • `a` is the answer index (OPSD uses `ans`, PAB uses `answer`)
 *     • `exp` is optional (some files omit it entirely)
 *   - Some files use different var names like `allQ` for `national_plan`
 *
 * Subject-id mapping (config is single source of truth):
 *
 *   Migrated (5/9):
 *     ✅ admin_act           ← admin_act.questions.js       (adminActQuestions)
 *     ✅ factory_act         ← factory_act.questions.js     (factoryActQuestions)
 *     ✅ info_act            ← info_act.questions.js        (infoActQuestions)
 *     ✅ governance          ← good_governance.questions.js (goodGovQuestions)
 *     ✅ industrial_strategy ← strategy_planning.questions.js (strategyQuestions)
 *                              [note: filename differs from subject.id — config kept as-is]
 *
 *   Subjects in config but NOT in source (4):
 *     ❌ economic_analysis   — no source file
 *     ❌ english             — no source file
 *     ❌ computer            — no source file
 *     ❌ general_knowledge   — no source file
 *
 *   Source files NOT registered in config (ignored — config is SoT):
 *     ⏭ official_letter, national_plan, industry_volunteer, industry_knowledge
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_ROOT = '/Users/geefrost/Documents/SlothMove/Page/source/Industry';
const TARGET_ROOT = '/Users/geefrost/Desktop/SlothMove/slothmove-platform/src/courses/industry/data';

/**
 * Map of subjectId → { file, varName }.
 *  - `subjectId` : matches industryConfig.subjects[].id (single source of truth)
 *  - `file`      : filename relative to SOURCE_ROOT
 *  - `varName`   : name of the const holding the array
 */
const SUBJECTS = [
  {
    id: 'admin_act',
    file: 'admin_act.questions.js',
    varName: 'adminActQuestions'
  },
  {
    id: 'factory_act',
    file: 'factory_act.questions.js',
    varName: 'factoryActQuestions'
  },
  {
    id: 'info_act',
    file: 'info_act.questions.js',
    varName: 'infoActQuestions'
  },
  {
    id: 'governance',
    // Source file uses "good_governance" naming; config uses "governance" — kept as-is.
    file: 'good_governance.questions.js',
    varName: 'goodGovQuestions'
  },
  {
    id: 'industrial_strategy',
    // Source file uses "strategy_planning" naming; config uses "industrial_strategy".
    file: 'strategy_planning.questions.js',
    varName: 'strategyQuestions'
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
 *
 * Industry short form: { q, o, a, exp }
 *   - `q`   : question text
 *   - `o`   : array of choices  (Industry-specific naming)
 *   - `a`   : 0-based index of correct answer  (Industry-specific naming)
 *   - `exp` : optional explanation
 */
function normalizeQuestion(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const q = String(raw.q ?? raw.question ?? '').trim();
  const o = raw.o ?? raw.opts ?? raw.choices;
  const a = raw.a ?? raw.ans ?? raw.answer;
  const exp = String(raw.exp ?? raw.explanation ?? '').trim();

  if (!q || !Array.isArray(o)) return null;

  const choices = o.map((c) => String(c ?? ''));
  const answer = Number.isInteger(a) ? a : 0;
  if (answer < 0 || answer >= choices.length) return null;

  return {
    question: q,
    choices,
    answer,
    explanation: exp
  };
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
    .map(normalizeQuestion)
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
 * (No flashcard data source exists in the Industry legacy — derive what we can.)
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
 * Mirrors scripts/migrate-pab.mjs + scripts/migrate-opsd.mjs output shape.
 */
function generateModule(subject, quizData, flashcardData, matchData, clozeData) {
  const lines = [
    '// AUTO-GENERATED by scripts/migrate-industry.mjs — DO NOT EDIT',
    '// Source: ~/Documents/SlothMove/Page/source/Industry/  (read-only)',
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
    '// AUTO-GENERATED by scripts/migrate-industry.mjs',
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
      console.log(`  ✓ ${s.id.padEnd(22)} quiz=${s.quiz} flash=${s.flashcard} match=${s.match} cloze=${s.cloze}`);
    } else {
      console.log(`  ⚠ ${s.id.padEnd(22)} no data`);
    }
  }
  console.log(`\nWrote ${migrated.length} subject files + index.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
