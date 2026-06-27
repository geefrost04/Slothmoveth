/**
 * Railway course data loader — skeleton.
 *
 * No real per-subject content has been migrated yet. Every game returns []
 * so the UI shows the honest "ยังไม่มีข้อมูล" placeholder.
 *
 * Once content is curated, replace these empty returns with typed loaders
 * (see `ocsc/data-loader.ts` or `police_admin/data-loader.ts` for the
 * pattern).
 */

import type {
  AuthorityItem,
  ClozeItem,
  FlashcardItem,
  LogicItem,
  MatchPair,
  OrderItem,
  QuizItem,
  SortingItem,
  SpellingItem,
  TrueFalseItem
} from '@/lib/course-types';

export function getSubjectItemCount(_subjectId: string, _gameId: string): number {
  return 0;
}

export function getQuiz(_subjectId: string): QuizItem[] {
  return [];
}

export function getFlashcards(_subjectId: string): FlashcardItem[] {
  return [];
}

export function getMatchPairs(_subjectId: string): MatchPair[] {
  return [];
}

export function getCloze(_subjectId: string): ClozeItem[] {
  return [];
}

export function getSorting(_subjectId: string): SortingItem[] {
  return [];
}

export function getOrder(_subjectId: string): OrderItem[] {
  return [];
}

export function getSpelling(_subjectId: string): SpellingItem[] {
  return [];
}

export function getTrueFalse(_subjectId: string): TrueFalseItem[] {
  return [];
}

export function getAuthority(_subjectId: string): AuthorityItem[] {
  return [];
}

export function getLogic(_subjectId: string): LogicItem[] {
  return [];
}
