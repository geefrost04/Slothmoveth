"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CourseConfig } from '@/lib/course-types';

export function PoliceMockupSubjectGrid({
  course,
  catalogs,
  subjects
}: {
  course: CourseConfig;
  catalogs: Record<string, React.ReactNode>;
  subjects: Array<{
    id: string;
    title: string;
    iconText?: string;
    iconCustom?: React.ReactNode;
    desc: string;
    active: boolean;
    quizzes?: Array<{
      title: string;
      price: string;
      href: string;
      isFormula: boolean;
    }>;
  }>;
}) {
  const [activeSubject, setActiveSubject] = useState<any | null>(null);

  useEffect(() => {
    if (!activeSubject) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveSubject(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeSubject]);

  // Helper icons copied from CourseLanding
  const MathGraphIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px' }}>
      <rect x="3" y="3" width="42" height="42" rx="8" fill="none" />
      <path d="M9 39h30" />
      <path d="M9 9v30" />
      <path d="M9 39c4-8 8-16 14-16s8 6 16-14" />
      <circle cx="23" cy="23" r="3" fill="currentColor" />
      <circle cx="39" cy="9" r="3" fill="currentColor" />
    </svg>
  );

  const DocIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="police-v2-quiz-doc-icon">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  return (
    <>
      <div className="police-v2-subject-grid">
        {subjects.map((subj) => (
          <div
            key={subj.id}
            className={`police-v2-subject-card ${subj.active ? 'has-popup' : 'is-locked'}`}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            onClick={() => {
              if (subj.active) {
                setActiveSubject(subj);
              }
            }}
          >
            <div className="police-v2-subject-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1, marginBottom: '20px' }}>
              <div className="police-v2-subject-info" style={{ flexGrow: 1 }}>
                <div className="police-v2-subject-title-row">
                  <h3>{subj.title}</h3>
                </div>
                <p className="police-v2-subject-desc">{subj.desc}</p>
              </div>
              <div className="police-v2-subject-icon-box" style={{ flexShrink: 0, marginLeft: '12px' }}>
                {subj.id === 'math' ? '▦' : subj.id === 'computer' ? '▣' : subj.iconText ? subj.iconText : subj.iconCustom}
              </div>
            </div>

            {subj.active ? (
              <button
                type="button"
                className="police-v2-action-button is-active"
                style={{ marginTop: 'auto' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSubject(subj);
                }}
              >
                ดูวิชา
              </button>
            ) : (
              <button type="button" className="police-v2-action-button is-disabled" style={{ marginTop: 'auto' }} disabled>
                เร็ว ๆ นี้
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Popup Overlay */}
      {activeSubject && (
        <div className="police-v2-modal-overlay" onClick={() => setActiveSubject(null)}>
          <div
            className="police-v2-modal-container"
            role="dialog"
            aria-modal="true"
            aria-label={`เลือกเนื้อหาวิชา${activeSubject.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="police-v2-modal-close"
              onClick={() => setActiveSubject(null)}
              aria-label="ปิดหน้าต่าง"
            >
              ✕
            </button>

            <div className="police-v2-subject-card is-active" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
              <div className="police-v2-featured-header" style={{ marginBottom: '20px' }}>
                <span className="police-v2-featured-icon">
                  {activeSubject.id === 'math' ? <MathGraphIcon /> : activeSubject.iconText ? activeSubject.iconText : activeSubject.iconCustom}
                </span>
                <div className="police-v2-subject-info">
                  <div className="police-v2-subject-title-row">
                    <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{activeSubject.title}</h3>
                  </div>
                  <p className="police-v2-subject-desc" style={{ fontSize: '13px', marginTop: '4px' }}>{activeSubject.desc}</p>
                </div>
              </div>

              <>
                  {(activeSubject.quizzes ?? []).filter((q: any) => q.isFormula).map((quiz: any, qIdx: number) => (
                    <Link
                      href={`/courses/${course.id}/${activeSubject.id}`}
                      key={`formula-${qIdx}`}
                      className="police-v2-quiz-item police-v2-formula-card"
                      style={{ marginBottom: '12px' }}
                    >
                      <div className="police-v2-quiz-item-left">
                        <DocIcon />
                        <div className="police-v2-quiz-item-info">
                          <strong>{quiz.title}</strong>
                          <span>ดาวน์โหลดชีทสรุปสี่สี (PDF) ที่หน้าวิชา</span>
                        </div>
                      </div>
                      <div className="police-v2-quiz-item-right">
                        <span className="police-v2-price-tag">ฟรี</span>
                        <span className="police-v2-chevron">&gt;</span>
                      </div>
                    </Link>
                  ))}

                  {catalogs[activeSubject.id] && (
                    <div style={{ margin: '12px 0 20px' }}>
                      {catalogs[activeSubject.id]}
                    </div>
                  )}

                  <Link
                    href={`/courses/${course.id}/${activeSubject.id}`}
                    className="police-v2-action-button is-active"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  >
                    <span aria-hidden="true">◇</span> ดูทั้งหมด <b aria-hidden="true">›</b>
                  </Link>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
