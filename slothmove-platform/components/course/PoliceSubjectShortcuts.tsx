import Link from 'next/link';
import styles from './PoliceSubjectShortcuts.module.css';

// Quick links to each subject so the subject list is reachable without scrolling past the mock sections.
export function PoliceSubjectShortcuts({ courseId, subjects }: { courseId: string; subjects: { id: string; title: string }[] }) {
  return (
    <nav className={styles.shortcuts} aria-label="ไปที่วิชา">
      <span>ไปที่วิชา</span>
      <div>
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/courses/${courseId}/${subject.id}`}>{subject.title}</Link>
        ))}
      </div>
    </nav>
  );
}
