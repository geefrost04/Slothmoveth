'use client';

import { useCourseToc } from './CourseTocContext';

export function CourseMobileTocSheet() {
  const { items } = useCourseToc();

  if (!items.length) return null;

  return (
    <details className="course-mobile-toc-root">
      <summary className="course-mobile-toc-trigger" aria-controls="course-mobile-toc-sheet">
        <span className="course-mobile-toc-trigger-icon" aria-hidden="true">☰</span>
        <span className="course-mobile-toc-trigger-copy">
          <strong>สารบัญ</strong>
          <small>{items.length} หัวข้อ</small>
        </span>
      </summary>

      <div className="course-mobile-toc-backdrop" aria-hidden="true" />

      <section
        id="course-mobile-toc-sheet"
        className="course-mobile-toc-sheet"
      >
        <div className="course-mobile-toc-sheet-head">
          <div>
            <strong>สารบัญบทเรียน</strong>
            <span>แตะเพื่อไปยังหัวข้อที่ต้องการ</span>
          </div>
          <button
            type="button"
            onClick={(event) => {
              const root = event.currentTarget.closest('details');
              if (root) root.open = false;
            }}
            aria-label="ปิดสารบัญ"
          >
            ✕
          </button>
        </div>
        <div className="course-mobile-toc-sheet-list">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                const root = event.currentTarget.closest('details');
                if (root) root.open = false;
              }}
            >
              <span>{item.shortLabel}</span>
              <strong>{item.label}</strong>
            </a>
          ))}
        </div>
      </section>
    </details>
  );
}
