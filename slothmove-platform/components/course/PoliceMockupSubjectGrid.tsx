import Link from 'next/link';
import type { CourseConfig } from '@/lib/course-types';
import { SubjectIcon } from '@/components/icons/SubjectIcons';

type SubjectCard = {
  id: string;
  title: string;
  iconText?: string;
  iconCustom?: React.ReactNode;
  desc: string;
  active: boolean;
};

export function PoliceMockupSubjectGrid({
  course,
  subjects
}: {
  course: CourseConfig;
  subjects: SubjectCard[];
}) {
  return (
    <div className="police-v2-subject-grid">
      {subjects.map((subject) => {
        const cardContent = (
          <>
            <div className="police-v2-subject-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1, marginBottom: '20px' }}>
              <div className="police-v2-subject-info" style={{ flexGrow: 1 }}>
                <span className="police-v2-track-badge">นายสิบตำรวจ · สายอำนวยการ</span>
                <div className="police-v2-subject-title-row">
                  <h3>{subject.title}</h3>
                </div>
                <p className="police-v2-subject-desc">{subject.desc}</p>
              </div>
              <div className="police-v2-subject-icon-box" style={{ flexShrink: 0, marginLeft: '12px' }}>
                {subject.iconCustom ?? <SubjectIcon subjectId={subject.id} size={22} />}
              </div>
            </div>
            <span className={`police-v2-action-button ${subject.active ? 'is-active' : 'is-disabled'}`} style={{ marginTop: 'auto' }}>
              {subject.active ? 'ดูวิชา' : 'เร็ว ๆ นี้'}
            </span>
          </>
        );

        return subject.active ? (
          <Link
            key={subject.id}
            href={`/courses/${course.id}/${subject.id}`}
            className="police-v2-subject-card has-popup"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            aria-label={`เปิดวิชา${subject.title}`}
          >
            {cardContent}
          </Link>
        ) : (
          <div
            key={subject.id}
            className="police-v2-subject-card is-locked"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            aria-disabled="true"
          >
            {cardContent}
          </div>
        );
      })}
    </div>
  );
}
