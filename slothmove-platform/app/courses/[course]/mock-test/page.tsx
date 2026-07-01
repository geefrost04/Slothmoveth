import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourse, COURSES, isCourseOpen } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { CourseMaintenancePage } from '@/components/course/CourseMaintenancePage';
import { MockTestClient } from './MockTestClient';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ข้อสอบจำลอง',
  description: 'หน้าข้อสอบจำลองสำหรับผู้ใช้งานในแพลตฟอร์ม SlothMove',
  noIndex: true
});

export default async function Page({
  params
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);

  // Mock test is available for police_admin and ocsc.
  // Touch this route so the dev server picks up the new mock-test path.
  if (!course) {
    notFound();
  }
  if (!isCourseOpen(course.id)) {
    return (
      <CourseLayout course={course}>
        <CourseMaintenancePage course={course} />
      </CourseLayout>
    );
  }
  if (course.id !== 'police_admin' && course.id !== 'ocsc') {
    notFound();
  }

  return (
    <CourseLayout course={course}>
      <MockTestClient course={course} />
    </CourseLayout>
  );
}

export function generateStaticParams() {
  return COURSES.map((course) => ({ course: course.id }));
}
