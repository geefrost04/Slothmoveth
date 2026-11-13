// Counts answered questions per subject for today, this week (from Monday) and this month, in Bangkok time.

type VolumeAnswer = { category: string; selected_choice_index: number | null; is_correct: boolean };
type VolumeCategory = { category: string; total: number; answered?: number; correct: number };
export type VolumeAttempt = {
  subject_id: string;
  score: number;
  total_questions: number;
  created_at: string;
  answers: VolumeAnswer[] | null;
  category_results: VolumeCategory[];
};

export type SubjectVolume = { subjectId: string; answered: number; correct: number };
export type PeriodVolume = { answered: number; correct: number; subjects: SubjectVolume[] };
export type PracticeVolume = { today: PeriodVolume; week: PeriodVolume; month: PeriodVolume };

export function bangkokDateKey(value: string | Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function weekStartKey(todayKey: string) {
  const date = new Date(`${todayKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}

// One attempt split into per-subject counts. `subjectOfCategory` maps a mock's category to a subject (or null to keep the attempt's subject).
function countAttempt(attempt: VolumeAttempt, subjectOfCategory: (subjectId: string, category: string) => string): SubjectVolume[] {
  const bySubject = new Map<string, SubjectVolume>();
  const add = (subjectId: string, answered: number, correct: number) => {
    const current = bySubject.get(subjectId) ?? { subjectId, answered: 0, correct: 0 };
    current.answered += answered; current.correct += correct; bySubject.set(subjectId, current);
  };

  if (attempt.answers && attempt.answers.length > 0) {
    for (const answer of attempt.answers) {
      if (answer.selected_choice_index === null || answer.selected_choice_index === undefined) continue;
      add(subjectOfCategory(attempt.subject_id, answer.category), 1, answer.is_correct ? 1 : 0);
    }
  } else if (attempt.category_results.length > 0) {
    for (const category of attempt.category_results) {
      add(subjectOfCategory(attempt.subject_id, category.category), category.answered ?? category.total, category.correct);
    }
  } else {
    // Old rows without detail: count the whole set as done.
    add(attempt.subject_id, attempt.total_questions, attempt.score);
  }
  return [...bySubject.values()];
}

function emptyPeriod(): PeriodVolume {
  return { answered: 0, correct: 0, subjects: [] };
}

export function countPracticeVolume(
  attempts: VolumeAttempt[],
  subjectOfCategory: (subjectId: string, category: string) => string,
  now: Date = new Date()
): PracticeVolume {
  const todayKey = bangkokDateKey(now);
  const weekKey = weekStartKey(todayKey);
  const monthKey = todayKey.slice(0, 7);
  const maps = { today: new Map<string, SubjectVolume>(), week: new Map<string, SubjectVolume>(), month: new Map<string, SubjectVolume>() };
  const result: PracticeVolume = { today: emptyPeriod(), week: emptyPeriod(), month: emptyPeriod() };

  for (const attempt of attempts) {
    const key = bangkokDateKey(attempt.created_at);
    const periods: Array<keyof PracticeVolume> = [];
    if (key === todayKey) periods.push('today');
    if (key >= weekKey && key <= todayKey) periods.push('week');
    if (key.startsWith(monthKey)) periods.push('month');
    if (periods.length === 0) continue;

    for (const subject of countAttempt(attempt, subjectOfCategory)) {
      for (const period of periods) {
        const current = maps[period].get(subject.subjectId) ?? { subjectId: subject.subjectId, answered: 0, correct: 0 };
        current.answered += subject.answered; current.correct += subject.correct;
        maps[period].set(subject.subjectId, current);
        result[period].answered += subject.answered;
        result[period].correct += subject.correct;
      }
    }
  }

  for (const period of ['today', 'week', 'month'] as const) {
    result[period].subjects = [...maps[period].values()].filter((s) => s.answered > 0).sort((a, b) => b.answered - a.answered);
  }
  return result;
}
