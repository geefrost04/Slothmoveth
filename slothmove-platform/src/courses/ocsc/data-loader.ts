import * as OCSCData from './data';
import type { CourseConfig, GameId } from '@/lib/course-types';
import { quizToMatch, quizToCloze } from '@/lib/adapters/quiz-to-games';

type OCSCModule = { [k: string]: any };
const OCSC_MODULES = OCSCData as OCSCModule;

export function getSubjectData(
  course: CourseConfig,
  subjectId: string,
  game: GameId
): any[] {
  if (course.id !== 'ocsc') return [];

  // Game-to-key alias map: some game IDs don't match export variable names 1:1.
  // Key format: `${subjectId}_${normalized_game_id}` → actual export key suffix.
  const GAME_KEY_ALIASES: Partial<Record<GameId, string>> = {
    'reading-detective': 'reading',
  };
  const normalizedGame = (GAME_KEY_ALIASES[game] ?? game).replace(/-/g, '_');
  const key = `${subjectId}_${normalizedGame}`;
  const moduleData = OCSC_MODULES[key];
  if (Array.isArray(moduleData)) {
    return moduleData;
  }

  if (subjectId === 'english' && game === 'dialogue') {
    const quiz = OCSC_MODULES['english_quiz'];
    return Array.isArray(quiz) ? englishQuizByCategory(quiz, 'conversation') : [];
  }

  // Derived games: when quiz data exists for a subject but the requested
  // game (flashcard / match / cloze) has no dedicated export, derive it
  // from the quiz pool. Matches the pattern in courses/police_admin.
  const DERIVED_FROM_QUIZ = new Set<GameId>(['flashcard', 'match', 'cloze']);
  if (!DERIVED_FROM_QUIZ.has(game)) return [];

  const quiz = OCSC_MODULES[`${subjectId}_quiz`];
  if (!Array.isArray(quiz) || quiz.length === 0) return [];
  const sanitized = quiz.map((q: any) =>
    typeof q?.explanation === 'string'
      ? { ...q, explanation: sanitizeExplanation(q.explanation) }
      : q
  );

  if (game === 'flashcard') {
    return deriveFlashcardFromQuiz(sanitized);
  }
  if (game === 'match') {
    return sanitized
      .map((item: any) => {
        if (!item || typeof item.question !== 'string' || !Array.isArray(item.choices)) return null;
        return quizToMatch(item);
      })
      .filter((x: any) => x && x.left && x.right)
      .slice(0, 60);
  }
  if (game === 'cloze') {
    if (subjectId === 'english') {
      return deriveEnglishClozeFromQuiz(sanitized);
    }
    return sanitized
      .map((item: any) => {
        if (!item || typeof item.question !== 'string' || !Array.isArray(item.choices)) return null;
        return quizToCloze(item);
      })
      .filter((x: any) => x !== null)
      .slice(0, 60);
  }

  return [];
}

export function getSubjectItemCount(subjectId: string, game: GameId): number {
  if (courseIdMatch(subjectId, game)) {
    // Prevent TS unused imports warnings if any
  }
  const key = `${subjectId}_${game}`.replace(/-/g, '_');
  const data = OCSC_MODULES[key];
  if (Array.isArray(data)) return data.length;

  if (subjectId === 'english' && game === 'dialogue') {
    const quiz = OCSC_MODULES['english_quiz'];
    return Array.isArray(quiz) ? quiz.filter((q: any) => q?.category === 'conversation').length : 0;
  }

  // Derived games derive their count from the quiz pool.
  const DERIVED_FROM_QUIZ = new Set<GameId>(['flashcard', 'match', 'cloze']);
  if (!DERIVED_FROM_QUIZ.has(game)) return 0;
  if (subjectId === 'english' && game === 'cloze') {
    const quiz = OCSC_MODULES['english_quiz'];
    return Array.isArray(quiz) ? deriveEnglishClozeFromQuiz(quiz).length : 0;
  }
  const quiz = OCSC_MODULES[`${subjectId}_quiz`];
  return Array.isArray(quiz) ? quiz.length : 0;
}

function courseIdMatch(subjectId: string, game: GameId) {
  return subjectId && game;
}

/**
 * Build a flashcard set from quiz data:
 *   front = question
 *   back  = "<correct choice> — <first line of explanation>"
 *
 * Mirrors the implementation in courses/police_admin so both course
 * families follow the same derived-from-quiz contract.
 */
function deriveFlashcardFromQuiz(quiz: any[]): { front: string; back: string }[] {
  const result: { front: string; back: string }[] = [];
  for (const q of quiz) {
    if (!q || typeof q.question !== 'string' || !Array.isArray(q.choices)) continue;
    const correct = String(q.choices[q.answer] ?? '');
    if (!correct) continue;
    const explain = (typeof q.explanation === 'string' ? q.explanation : '').trim();
    const firstLine = explain
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(/[.\n]/)[0]
      .trim();
    const back = firstLine ? `${correct} — ${firstLine}` : correct;
    result.push({
      front: q.question.length > 200 ? q.question.slice(0, 199) + '…' : q.question,
      back
    });
    if (result.length >= 60) break;
  }
  return result;
}

/**
 * Strip the raw HTML (`<br>`, `<strong>`, etc.) that some explanations
 * carry over from the source quiz data. React text nodes escape HTML,
 * so we sanitize BEFORE the data reaches the game components.
 */
function sanitizeExplanation(s: string): string {
  if (!s || typeof s !== 'string') return s || '';
  return s
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*br\s*>/gi, '\n')
    .replace(/<\s*strong\s*>(.*?)<\s*\/\s*strong\s*>/gi, '**$1**')
    .replace(/<\s*\/\s*strong\s*>/gi, '')
    .replace(/<\s*b\s*>(.*?)<\s*\/\s*b\s*>/gi, '**$1**')
    .replace(/<\s*\/\s*b\s*>/gi, '')
    .replace(/<\s*em\s*>(.*?)<\s*\/\s*em\s*>/gi, '_$1_')
    .replace(/<\s*\/\s*em\s*>/gi, '')
    .replace(/<\s*i\s*>(.*?)<\s*\/\s*i\s*>/gi, '_$1_')
    .replace(/<\s*\/\s*i\s*>/gi, '');
}

function deriveEnglishClozeFromQuiz(quiz: any[]): any[] {
  return quiz
    .filter((q: any) =>
      q &&
      typeof q.question === 'string' &&
      q.question.includes('___') &&
      Array.isArray(q.choices) &&
      ['vocabulary', 'grammar'].includes(q.category)
    )
    .map((q: any) => ({
      text: q.question,
      blanks: [String(q.choices[q.answer] ?? '')],
      options: q.choices.map((choice: string) => String(choice)),
      explanation: sanitizeExplanation(q.explanation || ''),
      hint: q.hint || '',
      category: q.category === 'grammar' ? 'Grammar / Structure' : 'Vocabulary / Collocation'
    }))
    .slice(0, 80);
}

function englishQuizByCategory(quiz: any[], category: string): any[] {
  return quiz
    .filter((q: any) => q?.category === category)
    .map((q: any) => ({
      ...q,
      explanation: sanitizeExplanation(q.explanation)
    }));
}
