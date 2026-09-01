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
        <Link
          href="/courses/police_admin/mini-mock/police-mini_mock-set-01"
          className="police-v2-mini-mock-button"
          onClick={() => trackAnalyticsEvent('mini_mock_start_click', {
            exam_set_id: 'police-mini_mock-set-01',
            source: 'course_landing'
          })}
        >
          เริ่ม Mini Mock ฟรี <span aria-hidden="true">›</span>
        </Link>
      </div>
    </section>
  );
}
