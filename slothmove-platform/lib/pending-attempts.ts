export type PendingAttempt = {
  id: string;
  subject_id: string;
  quiz_id: string;
  exam_set_id: string;
  score: number;
  total_questions: number;
  answers: Array<{
    question_id: string;
    category: string;
    selected_choice_index: number | null;
    correct_choice_index: number;
    is_correct: boolean;
  }>;
  category_results: Array<{
    category: string;
    total: number;
    answered: number;
    correct: number;
  }>;
  duration_seconds: number;
  completion_reason: 'submitted' | 'timeout';
  created_at: string;
};

const STORAGE_KEY = 'slothmove:pending-attempts';
const SYNCED_HISTORY_KEY = 'slothmove:synced-attempt-history';
const HISTORY_PREFIX = 'slothmove:exam-history:';
const MAX_PENDING_ATTEMPTS = 10;

function readSyncedHistoryIds() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SYNCED_HISTORY_KEY) ?? '[]');
    return new Set<string>(Array.isArray(value) ? value : []);
  } catch {
    return new Set<string>();
  }
}

function readLegacyAttempts(): PendingAttempt[] {
  const syncedIds = readSyncedHistoryIds();
  const attempts: PendingAttempt[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith(HISTORY_PREFIX)) continue;

    try {
      const history = JSON.parse(window.localStorage.getItem(key) ?? '[]');
      if (!Array.isArray(history)) continue;

      for (const entry of history) {
        if (!entry?.examSetId || !entry?.completedAt || !Number.isFinite(entry?.score)) continue;
        const id = `${entry.examSetId}:${entry.completedAt}`;
        if (syncedIds.has(id)) continue;

        attempts.push({
          id,
          subject_id: 'math',
          quiz_id: entry.examSetId,
          exam_set_id: entry.examSetId,
          score: entry.score,
          total_questions: entry.total,
          answers: [],
          category_results: Array.isArray(entry.categoryResults) ? entry.categoryResults : [],
          duration_seconds: Number.isFinite(entry.durationSeconds) ? entry.durationSeconds : 0,
          completion_reason: entry.reason === 'timeout' ? 'timeout' : 'submitted',
          created_at: entry.completedAt
        });
      }
    } catch {
      // Ignore malformed legacy history and continue with other exam sets.
    }
  }

  return attempts;
}

export function readPendingAttempts(): PendingAttempt[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    const pending = Array.isArray(value) ? value as PendingAttempt[] : [];
    const combined = [...pending, ...readLegacyAttempts()];
    return Array.from(new Map(combined.map((attempt) => [attempt.id, attempt])).values());
  } catch {
    return readLegacyAttempts();
  }
}

export function queuePendingAttempt(attempt: PendingAttempt) {
  try {
    const current = readPendingAttempts().filter((item) => item.id !== attempt.id);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([attempt, ...current].slice(0, MAX_PENDING_ATTEMPTS))
    );
  } catch {
    // The result page remains usable when browser storage is unavailable.
  }
}

export function removePendingAttempts(attemptIds: string[]) {
  if (attemptIds.length === 0) return;

  try {
    const removedIds = new Set(attemptIds);
    const remaining = readPendingAttempts().filter((attempt) => !removedIds.has(attempt.id));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    const syncedIds = readSyncedHistoryIds();
    attemptIds.forEach((attemptId) => syncedIds.add(attemptId));
    window.localStorage.setItem(SYNCED_HISTORY_KEY, JSON.stringify(Array.from(syncedIds).slice(-100)));
  } catch {
    // A later dashboard visit can retry the sync.
  }
}
