import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { COURSES, getCourse, isCourseOpen } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { CourseMaintenancePage } from '@/components/course/CourseMaintenancePage';
import { CourseLeaderboard } from '@/components/course/CourseLeaderboard';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'กระดานคะแนน',
  description: 'หน้ากระดานคะแนนสำหรับผู้ใช้งานในแพลตฟอร์ม SlothMove',
  noIndex: true
});

export default async function CourseLeaderboardPage({
  params
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();
  if (!isCourseOpen(course.id)) {
    return (
      <CourseLayout course={course}>
        <CourseMaintenancePage course={course} />
      </CourseLayout>
    );
  }

  return (
    <CourseLayout course={course}>
      <div className="container">
        <nav style={{ padding: '16px 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
          <Link href={`/courses/${course.id}`}>{course.title}</Link>
          {' / '}
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>กระดานคะแนน</span>
        </nav>
      </div>
      <CourseLeaderboard course={course} />
    </CourseLayout>
  );
}

export function generateStaticParams() {
  return COURSES.map((course) => ({
    course: course.id
  }));
}
