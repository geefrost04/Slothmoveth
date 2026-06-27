/**
 * Games Result Storage (Local only)
 *
 * Centralized API for all games (quiz/flashcard/match/cloze/series/...)
 * to save their session result into the browser's localStorage.
 *
 * Key shape: `slothmove-game-result:<course>:<subject>:<game>`
 *   - One record per (course, subject, game) — the most recent result.
 *   - Each game decides its own score shape (pct, correct, wrong, etc.).
 *
 * Future: when login system ships, swap this with Supabase sync.
 * For now, the data lives in localStorage only.
 */

const STORAGE_PREFIX = 'slothmove-game-result';
const MAX_HISTORY_PER_GAME = 20;

export type GameResultPayload = {
  score: number;
  pct: number;
  correct: number;
  wrong: number;
  total: number;
  durationSec: number;
  meta?: Record<string, unknown>;
};

export type SavedGameResult = {
  id: string;
  game: string;
  score: number;
  pct: number;
  correct: number;
  wrong: number;
  total: number;
  durationSec: number;
  savedAt: string;
  meta?: Record<string, unknown>;
};

function buildKey(courseId: string, subjectId: string, gameId: string): string {
  return `${STORAGE_PREFIX}:${courseId}:${subjectId}:${gameId}`;
}

function safeSlug(input?: string): string {
  if (!input) return 'unknown';
  return input
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

export function loadGameResults(
  courseId: string,
  subjectId: string,
  gameId: string
): SavedGameResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = buildKey(safeSlug(courseId), safeSlug(subjectId), safeSlug(gameId));
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedGameResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGameResult(
  courseId: string,
  subjectId: string,
  gameId: string,
  payload: GameResultPayload
): SavedGameResult {
  const entry: SavedGameResult = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    game: gameId,
    score: payload.score,
    pct: payload.pct,
    correct: payload.correct,
    wrong: payload.wrong,
    total: payload.total,
    durationSec: payload.durationSec,
    savedAt: new Date().toISOString(),
    meta: payload.meta
  };

  if (typeof window === 'undefined') return entry;

  const key = buildKey(safeSlug(courseId), safeSlug(subjectId), safeSlug(gameId));
  const existing = loadGameResults(courseId, subjectId, gameId);
  const next = [entry, ...existing].slice(0, MAX_HISTORY_PER_GAME);
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // localStorage full or disabled — silently fail
  }
  return entry;
}

export function clearGameResults(
  courseId: string,
  subjectId: string,
  gameId: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const key = buildKey(safeSlug(courseId), safeSlug(subjectId), safeSlug(gameId));
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
