'use client';

import { useState, type ReactNode } from 'react';
import type { PracticeVolume } from '@/lib/practiceVolume';

type Period = keyof PracticeVolume;
const PERIODS: Array<{ id: Period; label: string; empty: string }> = [
  { id: 'today', label: 'วันนี้', empty: 'วันนี้ยังไม่ได้ทำข้อสอบ' },
  { id: 'week', label: 'สัปดาห์นี้', empty: 'สัปดาห์นี้ยังไม่ได้ทำข้อสอบ' },
  { id: 'month', label: 'เดือนนี้', empty: 'เดือนนี้ยังไม่ได้ทำข้อสอบ' }
];

export function PracticeVolumeCard({ volume, subjectTitle, subjectTag, color }: {
  volume: PracticeVolume;
  subjectTitle: (subjectId: string) => string;
  subjectTag?: (subjectId: string) => ReactNode;
  color: (subjectId: string) => string;
}) {
  const [period, setPeriod] = useState<Period>(volume.today.answered > 0 ? 'today' : volume.week.answered > 0 ? 'week' : 'month');
  const current = volume[period];
  const meta = PERIODS.find((item) => item.id === period)!;
  const max = Math.max(1, ...current.subjects.map((subject) => subject.answered));
  const accuracy = current.answered > 0 ? Math.round((current.correct / current.answered) * 100) : 0;

  return (
    <section className="dbx-section pv-card" aria-labelledby="practice-volume-title">
      <div className="dbx-section-head"><h2 id="practice-volume-title">จำนวนข้อที่ทำ</h2><span>นับเฉพาะข้อที่ตอบ · เวลาไทย · สัปดาห์เริ่มวันจันทร์</span></div>
      <div className="pv-tabs" role="tablist" aria-label="ช่วงเวลา">
        {PERIODS.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={period === item.id} className={period === item.id ? 'is-active' : ''} onClick={() => setPeriod(item.id)}>
            <small>{item.label}</small>
            <strong>{volume[item.id].answered.toLocaleString('th-TH')}<em>ข้อ</em></strong>
          </button>
        ))}
      </div>
      {current.answered > 0 ? (
        <div className="pv-body">
          <p className="pv-summary">{meta.label}ทำไป <b>{current.answered.toLocaleString('th-TH')} ข้อ</b> · ตอบถูก {current.correct.toLocaleString('th-TH')} ข้อ ({accuracy}%)</p>
          <ul className="pv-list">
            {current.subjects.map((subject) => (
              <li key={subject.subjectId}>
                <span className="pv-name">{subjectTag?.(subject.subjectId)}{subjectTitle(subject.subjectId)}</span>
                <span className="pv-track"><i style={{ width: `${(subject.answered / max) * 100}%`, background: color(subject.subjectId) }} /></span>
                <span className="pv-count"><span><b>{subject.answered.toLocaleString('th-TH')}</b> ข้อ</span><small>ถูก {subject.correct}</small></span>
              </li>
            ))}
          </ul>
        </div>
      ) : <p className="pv-empty">{meta.empty}</p>}
    </section>
  );
}
