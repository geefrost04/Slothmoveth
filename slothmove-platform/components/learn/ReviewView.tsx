'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { MCQ } from '@/lib/learn/types';
import { useLearn } from './CourseContext';
import { TestRunner } from './TestRunner';
import { BackIcon } from './LessonView';

/** Brings back questions answered wrong at least 2 days ago; right answers leave the list. */
export function ReviewView({ bank }: { bank: MCQ[] }) {
  const { course, progress, hydrated, actions } = useLearn();
  const BASE = course.base;
  const index = useMemo(() => new Map(bank.map((q) => [q.id, q])), [bank]);
  // Freeze the list when the page opens so answering does not reshuffle it.
  const questions = useMemo(() => {
    const cutoff = Date.now() - 2 * 86400000;
    return progress.mistakes
      .filter((m) => new Date(m.at + 'T00:00:00').getTime() <= cutoff)
      .map((m) => index.get(m.qid))
      .filter((q): q is NonNullable<typeof q> => !!q)
      .slice(0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, index]);

  if (!hydrated) return null;
  if (!questions.length) {
    return (
      <div className="nl-wrap">
        <header className="nl-head">
          <div className="nl-head-row">
            <Link href={BASE} className="nl-back" aria-label="กลับไปแผนการเรียน"><BackIcon /></Link>
            <div className="nl-head-text"><span className="nl-head-title">ทวนข้อที่เคยตอบผิด</span></div>
          </div>
        </header>
        <section className="nl-card">
          <p className="nl-p">ยังไม่มีข้อที่ถึงรอบทบทวน ข้อที่ตอบผิดในแบบทดสอบท้ายบทจะกลับมาที่นี่หลังผ่านไป 2 วัน</p>
          <Link href={BASE} className="nl-btn-soft">กลับไปแผนการเรียน</Link>
        </section>
      </div>
    );
  }
  return (
    <TestRunner
      title="ทวนข้อที่เคยตอบผิด"
      kicker={`ทบทวน ${questions.length} ข้อ`}
      questions={questions}
      backHref={BASE}
      onFinish={(_s, _w, answers) =>
        actions.clearMistakes(
          questions.filter((q, i) => answers[i] === q.answer).map((q) => q.id),
          questions.filter((q, i) => answers[i] !== q.answer).map((q) => q.id)
        )
      }
      result={(score, total) => (
        <>
          <p className="nl-p">ข้อที่ตอบถูกรอบนี้ ({score} ข้อ) ออกจากรายการทบทวนแล้ว ข้อที่ยังผิด ({total - score} ข้อ) จะกลับมาให้ทวนอีกครั้งในอีก 2 วัน</p>
          <Link href={BASE} className="nl-btn" style={{ width: '100%' }}>กลับไปแผนการเรียน</Link>
        </>
      )}
    />
  );
}
