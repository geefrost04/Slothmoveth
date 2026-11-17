'use client';

import Link from 'next/link';
import type { MCQ } from '@/lib/learn/types';
import type { Progress } from '@/lib/learn/progress';
import { useLearn } from './CourseContext';
import { TestRunner } from './TestRunner';

type ByTopic = NonNullable<Progress['diagnostic']>['byTopic'];

export type DiagnosticQuestion = MCQ & { topic: string };

function tally(questions: DiagnosticQuestion[], answers: number[]): ByTopic {
  const by: ByTopic = {};
  questions.forEach((q, i) => {
    const cur = by[q.topic] ?? { right: 0, total: 0 };
    by[q.topic] = { right: cur.right + (answers[i] === q.answer ? 1 : 0), total: cur.total + 1 };
  });
  return by;
}

export function DiagnosticView({ questions, title, kicker }: { questions: DiagnosticQuestion[]; title: string; kicker: string }) {
  const { course, actions } = useLearn();
  let last: ByTopic = {};
  return (
    <TestRunner
      title={title}
      kicker={kicker}
      questions={questions}
      backHref={course.base}
      onFinish={(_score, _wrong, answers) => {
        last = tally(questions, answers);
        actions.recordDiagnostic(last);
      }}
      result={() => (
        <>
          <p className="nl-p">ผลนี้ใช้จัดลำดับความสำคัญเท่านั้น หัวข้อที่ได้ต่ำกว่าร้อยละ 60 ควรใช้เวลามากเป็นพิเศษ</p>
          <div style={{ width: '100%' }}>
            {course.outline.map((t) => {
              const r = last[t.id];
              if (!r) return null;
              const pct = Math.round((r.right / r.total) * 100);
              return (
                <div className="nl-topic-row" key={t.id}>
                  <span className="nl-topic-name">{t.title}</span>
                  <span className="nl-topic-meta">{r.right}/{r.total}{pct < 60 ? ' · ควรเน้น' : ''}</span>
                  <span className="nl-bar"><span style={{ width: `${pct}%`, background: pct < 60 ? 'var(--nl-amber-ink)' : undefined }} /></span>
                </div>
              );
            })}
          </div>
          <Link href={course.base} className="nl-btn" style={{ width: '100%' }}>ไปที่แผนการเรียน</Link>
        </>
      )}
    />
  );
}
