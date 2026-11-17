'use client';

import Link from 'next/link';
import type { MCQ } from '@/lib/learn/types';
import { useLearn } from './CourseContext';
import { TestRunner } from './TestRunner';

type Props = {
  /** Progress key: a lesson id, or "topic:<id>" for a topic test. */
  progressKey: string;
  title: string;
  kicker: string;
  questions: MCQ[];
  backHref: string;
  pass: number;
  next?: { href: string; title: string };
  asOf?: string[];
};

export function LessonTest({ progressKey, title, kicker, questions, backHref, pass, next, asOf }: Props) {
  const { course, actions } = useLearn();
  return (
    <TestRunner
      title={title}
      kicker={kicker}
      questions={questions}
      backHref={backHref}
      asOf={asOf}
      onFinish={(score, wrong) => actions.recordTest(progressKey, score, pass, wrong, questions.map((q) => q.id))}
      result={(score, total) => {
        const ok = score >= pass;
        return (
          <>
            <p className="nl-p">
              {ok
                ? `ผ่านแล้ว (เกณฑ์ ${pass}/${total}) ข้อที่ผิดจะถูกเก็บไว้ให้ทบทวนในอีกไม่กี่วัน`
                : `ยังไม่ถึงเกณฑ์ ${pass}/${total} ลองเปิดดูเฉลยด้านล่าง อ่านบทเรียนส่วนที่เกี่ยวข้องอีกรอบ แล้วทำใหม่`}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {ok && next && <Link href={next.href} className="nl-btn">{next.title}</Link>}
              {!ok && <Link href={backHref} className="nl-btn">กลับไปอ่านบทเรียน</Link>}
              <Link href={course.base} className="nl-btn-soft">กลับไปแผนการเรียน</Link>
            </div>
          </>
        );
      }}
    />
  );
}
