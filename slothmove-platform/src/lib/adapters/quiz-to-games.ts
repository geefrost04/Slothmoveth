/**
 * Adapters: QuizItem → MatchPair / ClozeItem
 *
 * Pure functions that convert one quiz question into derived game items.
 * These live OUTSIDE the courses folder so they're reusable for any
 * future course that has QuizItem data but no Match/Cloze data.
 *
 * Design philosophy (adapter-first migration):
 *   - Source data is read-only (we never modify the original PAB files)
 *   - Adapters normalize source data into the platform's shared types
 *   - Game components consume the normalized types and don't know
 *     where the data came from
 */

import type { QuizItem, MatchPair, ClozeItem } from '@/lib/course-types';

/* -------------------------------------------------------------------------- */
/*                              Match Adapter                                  */
/* -------------------------------------------------------------------------- */

/**
 * Convert a QuizItem into a MatchPair.
 *   left  = trimmed question (often long — caller may want to truncate)
 *   right = the correct answer text
 *
 * Caller is responsible for batching these into playable sets of 4-6 pairs.
 */
export function quizToMatch(item: QuizItem, maxLeftChars = 80): MatchPair {
  const left = cleanText(item.question);
  const truncated = left.length > maxLeftChars ? left.slice(0, maxLeftChars - 1) + '…' : left;
  return {
    left: truncated,
    right: String(item.choices[item.answer] ?? '')
  };
}

/* -------------------------------------------------------------------------- */
/*                              Cloze Adapter                                  */
/* -------------------------------------------------------------------------- */

/**
 * Convert a QuizItem into a ClozeItem with a single blank.
 *
 *   text   = question + " (คำตอบ: ___)" (or use the explanation)
 *   blanks = [correct answer]
 *   options= [correct answer + distractor choices] (4-5 total)
 *
 * Skip items where:
 *   - The correct answer is too long to be a fill-in-the-blank answer
 *   - The question is too short (already trivially answered by the question text)
 */
const MAX_ANSWER_CHARS = 60;
const MIN_QUESTION_CHARS = 12;

export function quizToCloze(item: QuizItem): ClozeItem | null {
  const question = cleanText(item.question);
  const correctAnswer = cleanText(String(item.choices[item.answer] ?? ''));

  if (!correctAnswer) return null;
  if (correctAnswer.length > MAX_ANSWER_CHARS) return null;
  if (question.length < MIN_QUESTION_CHARS) return null;

  // Distractor pool: other choices + first sentence of explanation
  const distractors = (item.choices || [])
    .filter((_, i) => i !== item.answer)
    .map(cleanText)
    .filter((c) => c && c !== correctAnswer)
    .slice(0, 3);

  // Append a small slice of the explanation if available (gives context)
  const context = item.explanation ? cleanText(item.explanation).slice(0, 100) : '';

  const options = shuffle([correctAnswer, ...distractors]);
  const fullText = context
    ? `${question}\n\n💡 ${context}\n\nคำตอบ: ___`
    : `${question}\n\nคำตอบ: ___`;

  return {
    text: fullText,
    blanks: [correctAnswer],
    options
  };
}

/* -------------------------------------------------------------------------- */
/*                              Helpers                                        */
/* -------------------------------------------------------------------------- */

function cleanText(s: string): string {
  return s
    .replace(/\s+/g, ' ')        // collapse whitespace
    .replace(/\s+\?\s*$/, '?')   // tidy trailing "?" spacing
    .trim();
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
