import Link from 'next/link';
import type { CourseConfig, SubjectMeta } from '@/lib/course-types';
import type { CourseKnowledgeData } from '@/lib/knowledge-types';
import { CourseKnowledgeContent } from './CourseKnowledgeContent';

export function CourseSubjectPage({
  course,
  subject,
  knowledge
}: {
  course: CourseConfig;
  subject: SubjectMeta;
  knowledge: CourseKnowledgeData | null;
}) {
  const courseHasData = course.meta.migrated === true;
  const subjectHasData = subject.count > 0;
  const hasRichLanding = Boolean(course.meta.landing);
  const hasKnowledgeContent = Boolean(
    knowledge?.knowledgeSections?.length ||
    knowledge?.vocabularyGroups?.length ||
    knowledge?.tips?.length
  );
  const showSubjectContent = courseHasData && (subjectHasData || hasKnowledgeContent);
  const isDropdown = course.id === 'police_admin' || course.id === 'ocsc';
  const practiceHref = isDropdown
    ? `/courses/${course.id}/${subject.id}/practices`
    : `/courses/${course.id}/${subject.id}/quiz`;

  return (
    <div className="course-subject-page">
      <div className="course-subject-breadcrumb-wrap">
        <nav className="container course-breadcrumb">
          <Link href={`/courses/${course.id}`}>← กลับไปหน้าคอร์ส</Link>
          <span>/</span>
          <span>{subject.title}</span>
        </nav>
      </div>

      <header className="course-subject-header">
        <div className="course-subject-header-deco" aria-hidden="true">
          <span className="course-subject-deco-symbol">π</span>
          <span className="course-subject-deco-symbol">∑</span>
          <span className="course-subject-deco-symbol">√</span>
          <span className="course-subject-deco-symbol">×</span>
        </div>
        <div className="container course-subject-header-inner">
          <div className="course-subject-icon">{subject.icon ?? '📘'}</div>
          <div className="course-subject-heading">
            {hasRichLanding ? <div className="course-subject-chip">บทเรียน {course.id.toUpperCase()}</div> : null}
            <h1>{subject.title}</h1>
            <p>{subject.desc}</p>
          </div>
          <div className="course-subject-mascot" aria-hidden="true">
            <div className="course-subject-mascot-glow" />
            <img src={subject.mascot || '/pic/slothmove_mascot.png'} alt="" />
          </div>
        </div>
      </header>

      <div className="container course-subject-body">
        {showSubjectContent ? (
          <>
            {hasKnowledgeContent && knowledge ? (
              <CourseKnowledgeContent
                knowledge={knowledge}
                quizHref={practiceHref}
              />
            ) : null}
            {!hasKnowledgeContent ? (
              <section style={{ marginTop: hasKnowledgeContent ? 40 : 0 }}>
                <h2>{isDropdown ? `ลานฝึก ${subject.title}` : `ทำข้อสอบ ${subject.title}`}</h2>
                <p>
                  {isDropdown
                    ? 'รวมเกมฝึกของวิชานี้ไว้ในหน้า Practices แยกต่างหาก เพื่อเลือกซ้อมตามรูปแบบเกมได้ง่ายขึ้น'
                    : 'เริ่มฝึกทำข้อสอบของวิชานี้ เพื่อวัดความรู้ความเข้าใจจากแนวข้อสอบจริงพร้อมเฉลยละเอียด'}
                </p>
                <div className="course-message-actions">
                  <Link href={practiceHref} className="course-action-primary">
                    {isDropdown ? 'เปิดหน้า Practices' : 'เริ่มทำข้อสอบ'}
                  </Link>
                </div>
              </section>
            ) : null}

            {!hasKnowledgeContent ? (
              <section style={{ marginTop: 28 }}>
                <h2>วิชานี้ยังไม่มีสรุปบทเรียน</h2>
                <p>
                  {isDropdown
                    ? 'ตอนนี้หน้าวิชานี้ยังไม่มีเนื้อหาสรุปในรูปแบบเดียวกับ PAB แต่ยังสามารถเริ่มฝึกผ่านหน้า Practices ได้'
                    : 'ตอนนี้ยังไม่มีเนื้อหาสรุปวิชานี้ในระบบ แต่คุณยังสามารถเริ่มฝึกทำข้อสอบได้ทันที'}
                </p>
              </section>
            ) : null}
          </>
        ) : (
          <SubjectNotReady course={course} subject={subject} />
        )}
      </div>
    </div>
  );
}

function SubjectNotReady({ course, subject }: { course: CourseConfig; subject: SubjectMeta }) {
  const courseHasData = course.meta.migrated === true;

  return (
    <section className="is-warning">
      <div className="course-message-icon">🚧</div>
      <h2>
        วิชา {subject.title} {courseHasData ? '— ยังไม่มีข้อมูล' : '— ยังไม่พร้อมให้บริการ'}
      </h2>
      <p>
        {courseHasData
          ? `คอร์ส ${course.title} เปิดแล้ว แต่วิชานี้ยังไม่มีข้อมูลในระบบ`
          : `คอร์ส ${course.title} ยังอยู่ระหว่างย้ายข้อมูลเข้าสู่แพลตฟอร์ม`}
      </p>
      {course.meta.migrationNote ? <p className="course-message-note">{course.meta.migrationNote}</p> : null}
      <div className="course-message-actions">
        <Link href="/courses/pab" className="course-action-primary">เปิดคอร์ส PAB</Link>
        <Link href={`/courses/${course.id}`} className="course-action-secondary">กลับไปหน้าคอร์ส</Link>
      </div>
    </section>
  );
}
