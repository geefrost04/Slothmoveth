'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics';

export function PoliceMiniMockCallout() {
  const trackedImpression = useRef(false);

  useEffect(() => {
    if (trackedImpression.current) return;
    trackedImpression.current = true;
    trackAnalyticsEvent('mini_mock_impression', {
      exam_set_id: 'police-mini_mock-set-01',
      placement: 'police_course_landing',
      question_count: 30,
      duration_minutes: 35
    });
  }, []);

  return (
    <section className="police-v2-mini-mock" aria-labelledby="police-mini-mock-title">
      <div className="police-v2-mini-mock-copy">
        <span>MINI MOCK ฟรี</span>
        <h2 id="police-mini-mock-title">ลองสนามสั้น ๆ ก่อน 30 ข้อ</h2>
        <p>ครบ 6 วิชา ใช้เวลาประมาณ 35 นาที พร้อมเฉลยและผลวิเคราะห์หลังส่งข้อสอบ</p>
      </div>
      <div className="police-v2-mini-mock-action">
        <div className="police-v2-mini-mock-meta" aria-label="รายละเอียด Mini Mock">
          <span><strong>30</strong> ข้อ</span>
          <span><strong>35</strong> นาที</span>
          <span><strong>6</strong> วิชา</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            href="/courses/police_admin/mini-mock/police-mini_mock-set-01"
            className="police-v2-mini-mock-button"
            onClick={() => trackAnalyticsEvent('mini_mock_start_click', {
              exam_set_id: 'police-mini_mock-set-01',
              source: 'course_landing_primary'
            })}
          >
            เริ่ม Mini Mock ฟรี <span aria-hidden="true">›</span>
          </Link>
          <Link
            href="/courses/police_admin/mini-mock/police-mini_mock-set-02"
            className="police-v2-mini-mock-button police-v2-mini-mock-button-secondary"
            title="Mini Mock ชุดนี้เป็นตัวอย่าง 30 ข้อจาก Mock Test ชุด 4"
            onClick={() => trackAnalyticsEvent('mini_mock_start_click', {
              exam_set_id: 'police-mini_mock-set-02',
              source: 'course_landing_secondary'
            })}
          >
            ทำชุดที่ 2 ต่อ <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
      <div className="police-mini-drill-section">
        <div className="police-mini-drill-heading"><span>MINI DRILL ฟรี</span><strong>ฝึกเฉพาะวิชา 20 ข้อ · 25 นาที</strong></div>
        <div className="police-mini-drill-grid">
          {[
            ['police-mini_mock-set-03', 'คณิต ชุด 1'], ['police-mini_mock-set-09', 'คณิต ชุด 2'],
            ['police-mini_mock-set-04', 'ภาษาไทย ชุด 1'], ['police-mini_mock-set-10', 'ภาษาไทย ชุด 2'],
            ['police-mini_mock-set-05', 'คอมพิวเตอร์ ชุด 1'], ['police-mini_mock-set-11', 'คอมพิวเตอร์ ชุด 2'],
            ['police-mini_mock-set-06', 'งานสารบรรณ ชุด 1'], ['police-mini_mock-set-12', 'งานสารบรรณ ชุด 2'],
            ['police-mini_mock-set-07', 'กฎหมาย ชุด 1'], ['police-mini_mock-set-13', 'กฎหมาย ชุด 2'],
            ['police-mini_mock-set-08', 'ภาษาอังกฤษ ชุด 1'], ['police-mini_mock-set-14', 'ภาษาอังกฤษ ชุด 2']
          ].map(([id, title]) => (
            <Link key={id} href={`/courses/police_admin/mini-mock/${id}`} className="police-mini-drill-card" onClick={() => trackAnalyticsEvent('mini_drill_start_click', { exam_set_id: id, source: 'course_landing' })}>
              <span>{title}</span><b>20 ข้อ <i aria-hidden="true">→</i></b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
