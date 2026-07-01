import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { COURSES, getSubject, isCourseOpen } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { CourseMaintenancePage } from '@/components/course/CourseMaintenancePage';
import { CoursePracticeHubPage } from '@/components/course/CoursePracticeHubPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ศูนย์รวมแบบฝึก',
  description: 'หน้าศูนย์รวมแบบฝึกสำหรับผู้ใช้งานในแพลตฟอร์ม SlothMove',
  noIndex: true
});

export default async function SubjectPracticesPage({
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

  if (courseId !== 'police_admin' && courseId !== 'ocsc') {
    redirect(`/courses/${courseId}/${subjectId}/quiz`);
  }

  return (
    <CourseLayout course={course}>
      <CoursePracticeHubPage course={course} subject={subject} />
    </CourseLayout>
  );
}

export function generateStaticParams() {
  return COURSES.flatMap((course) =>
    course.subjects.map((subject) => ({ course: course.id, subject: subject.id }))
  );
}
