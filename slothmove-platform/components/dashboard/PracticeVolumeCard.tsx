'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import type { PracticeVolume } from '@/lib/practiceVolume';

type Period = keyof PracticeVolume;
const PERIODS: Array<{ id: Period; label: string }> = [
  { id: 'today', label: 'วันนี้' },
  { id: 'week', label: 'สัปดาห์นี้' },
  { id: 'month', label: 'เดือนนี้' }
];

export type VolumeCourse = { id: string; name: string; accent: string; soft: string; mark: ReactNode; subjects: string[] };

type Picked = { courseId: string; subjectId: string };

// One column per agency, every subject underneath with a bar of questions answered. Tap a subject for details.
export function PracticeVolumeCard({ volume, courses, courseOf, subjectTitle, practiceHref }: {
  volume: PracticeVolume;
  courses: VolumeCourse[];
  courseOf: (subjectId: string) => string;
  subjectTitle: (subjectId: string) => string;
  practiceHref: (subjectId: string) => string;
}) {
  const [period, setPeriod] = useState<Period>(volume.week.answered > 0 ? 'week' : volume.month.answered > 0 ? 'month' : 'today');
  const [picked, setPicked] = useState<Picked | null>(null);
  const current = volume[period];
  const stats = new Map(current.subjects.map((subject) => [subject.subjectId, subject]));
  const max = Math.max(1, ...current.subjects.map((subject) => subject.answered));

  // Every topic of the course, plus anything else answered in it (e.g. its mini mock).
  const columns = courses.map((course) => {
    const extra = current.subjects.map((subject) => subject.subjectId).filter((id) => courseOf(id) === course.id && !course.subjects.includes(id));
    const ids = [...course.subjects, ...extra];
    const answered = ids.reduce((total, id) => total + (stats.get(id)?.answered ?? 0), 0);
    return { course, ids, answered };
  });

  useEffect(() => {
    if (!picked) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setPicked(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [picked]);

  const pickedCourse = picked ? courses.find((course) => course.id === picked.courseId) : undefined;
  const pickedStats = picked ? stats.get(picked.subjectId) : undefined;
  const answered = pickedStats?.answered ?? 0;
  const correct = pickedStats?.correct ?? 0;

  return (
    <section className="dbx-section pv-card" aria-labelledby="practice-volume-title">
      <div className="pv-head">
        <h2 id="practice-volume-title">ทำไปแล้วแต่ละวิชา</h2>
        <div className="pv-seg" role="tablist" aria-label="ช่วงเวลา">
          {PERIODS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={period === item.id} className={period === item.id ? 'is-active' : ''} onClick={() => setPeriod(item.id)}>
              {item.label} <b>{volume[item.id].answered.toLocaleString('th-TH')}</b>
            </button>
          ))}
        </div>
      </div>

      <div className="pv-grid">
        {columns.map(({ course, ids, answered: total }) => (
          <div className="pv-col" key={course.id} style={{ '--c': course.accent, '--cs': course.soft } as React.CSSProperties}>
            <div className="pv-col-head">{course.mark}<strong>{course.name}</strong><span>{total.toLocaleString('th-TH')} ข้อ</span></div>
            <ul>
              {ids.map((id) => {
                const count = stats.get(id)?.answered ?? 0;
                return (
                  <li key={id}>
                    <button type="button" className={count === 0 ? 'is-zero' : ''} onClick={() => setPicked({ courseId: course.id, subjectId: id })}>
                      <span className="pv-row-name">{subjectTitle(id)}</span>
                      <span className="pv-row-count">{count.toLocaleString('th-TH')}</span>
                      <span className="pv-row-bar" aria-hidden="true"><i style={{ width: `${(count / max) * 100}%` }} /></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {picked && pickedCourse ? (
        <div className="pv-modal" role="presentation" onClick={() => setPicked(null)}>
          <div className="pv-dialog" role="dialog" aria-modal="true" aria-labelledby="pv-dialog-title" onClick={(event) => event.stopPropagation()} style={{ '--c': pickedCourse.accent, '--cs': pickedCourse.soft } as React.CSSProperties}>
            <button type="button" className="pv-close" aria-label="ปิด" onClick={() => setPicked(null)}>×</button>
            <small>{pickedCourse.name} · {PERIODS.find((item) => item.id === period)!.label}</small>
            <h3 id="pv-dialog-title">{subjectTitle(picked.subjectId)}</h3>
            <div className="pv-stats">
              <div><span>ทำไป</span><strong>{answered.toLocaleString('th-TH')}</strong></div>
              <div className="is-right"><span>ถูก</span><strong>{correct.toLocaleString('th-TH')}</strong></div>
              <div className="is-wrong"><span>ผิด</span><strong>{(answered - correct).toLocaleString('th-TH')}</strong></div>
            </div>
            {answered > 0 ? <p className="pv-rate">ตอบถูก {Math.round((correct / answered) * 100)}%</p> : <p className="pv-rate">ยังไม่ได้ทำในช่วงนี้</p>}
            <Link href={practiceHref(picked.subjectId)} className="pv-go">ฝึกวิชานี้ →</Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
