import Link from 'next/link';
import type { SubjectMeta } from '@/lib/course-types';

export function SubjectCard({
  courseId,
  subject,
  hideCount = false,
  /** When true, render as a non-clickable card so users don't end up on
   *  subject pages with empty data. Still navigable when explicitly
   *  desired — the [subject]/page.tsx renders its own empty-state. */
  disabled = false
}: {
  courseId: string;
  subject: SubjectMeta;
  hideCount?: boolean;
  disabled?: boolean;
}) {
  const href = `/courses/${courseId}/${subject.id}`;
  const className = `subject-card${disabled ? ' is-disabled' : ''}`;

  if (disabled) {
    return (
      <div className={className} aria-disabled="true">
        {subject.icon && <div className="subject-card-icon">{subject.icon}</div>}
        <h3 className="subject-card-title">{subject.title}</h3>
        <p className="subject-card-desc">{subject.desc}</p>
        {!hideCount ? <span className="subject-card-count">{subject.count} ข้อ</span> : null}
        <span className="subject-card-soon-tag">ยังไม่พร้อม</span>
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      {subject.icon && <div className="subject-card-icon">{subject.icon}</div>}
      <h3 className="subject-card-title">{subject.title}</h3>
      <p className="subject-card-desc">{subject.desc}</p>
      {!hideCount ? <span className="subject-card-count">{subject.count} ข้อ</span> : null}
    </Link>
  );
}
