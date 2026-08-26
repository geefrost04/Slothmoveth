'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/lib/faq';

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>FAQ</div>
          <h2 className="section-title">คำถามที่พบบ่อย</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            เรื่องคอร์ส ข้อสอบ และการสนับสนุนโปรเจกต์
          </p>
        </div>

        <div className="faq-inner">
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              className="faq-item"
              open={openIdx === i}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setOpenIdx(openIdx === i ? null : i);
                }}
              >
                {item.q}
                <span className="arrow">⌄</span>
              </summary>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
