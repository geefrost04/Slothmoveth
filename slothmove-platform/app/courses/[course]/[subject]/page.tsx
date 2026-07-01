import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COURSES, getSubject, isCourseOpen } from '@/courses/registry';
import { getCourseKnowledgeData } from '@/courses/content-registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { CourseMaintenancePage } from '@/components/course/CourseMaintenancePage';
import { CourseSubjectPage } from '@/components/course/CourseSubjectPage';
import { buildMetadata } from '@/lib/seo';

export default async function SubjectPage({
  params
}: {
  params: Promise<{ course: string; subject: string }>;
}) {
  const { course: courseId, subject: subjectId } = await params;
  const result = getSubject(courseId, subjectId);
  if (!result) notFound();

  const { course, subject } = result;
  if (!isCourseOpen(course.id)) {
    return (
      <CourseLayout course={course}>
        <CourseMaintenancePage course={course} />
      </CourseLayout>
    );
  }
  const knowledge = getCourseKnowledgeData(course.id, subject.id);

  return (
    <CourseLayout course={course}>
      <CourseSubjectPage course={course} subject={subject} knowledge={knowledge} />
    </CourseLayout>
  );
}

export function generateStaticParams() {
  return COURSES.flatMap((course) =>
    course.subjects.map((subject) => ({ course: course.id, subject: subject.id }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ course: string; subject: string }>;
}): Promise<Metadata> {
  const { course: courseId, subject: subjectId } = await params;
  const result = getSubject(courseId, subjectId);

  if (!result) {
    return buildMetadata({
      title: 'ไม่พบวิชา',
      description: 'ไม่พบหน้าวิชาที่ต้องการ',
      path: `/courses/${courseId}/${subjectId}`,
      noIndex: true
    });
  }

  const { course, subject } = result;

  return buildMetadata({
    title: `${subject.title} - ${course.title}`,
    description: `${subject.desc} ฝึกทำข้อสอบ ทบทวนเนื้อหา และเล่นเกมการเรียนรู้ในคอร์ส ${course.title} บน SlothMove`,
    path: `/courses/${course.id}/${subject.id}`,
    keywords: [course.title, subject.title, course.tagline, ...course.meta.keywords]
  });
}
