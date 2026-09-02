import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubject } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { PoliceMathSetOneCatalog } from '@/components/course/PoliceMathSetOneCatalog';
import { getPublishedExamCatalog } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

export default async function PoliceMathSetOnePage() {
  const result = getSubject('police_admin', 'math');
  if (!result) notFound();

  const examSets = await getPublishedExamCatalog('police_admin', 'math');
  return (
    <CourseLayout course={result.course}>
      <PoliceMathSetOneCatalog examSets={examSets} />
    </CourseLayout>
  );
}

export const metadata: Metadata = buildMetadata({
  title: 'Set 1 ข้อสอบความรู้ความสามารถทั่วไป แยกหมวด',
  description: 'ฝึกข้อสอบความรู้ความสามารถทั่วไป 140 ข้อ แยกตามหมวด พร้อมเฉลย ฟรีบน SlothMove',
  path: '/courses/police_admin/math/set-1',
  keywords: ['ข้อสอบตำรวจ', 'ข้อสอบความรู้ความสามารถทั่วไป', 'ข้อสอบคณิตตำรวจ', 'แนวข้อสอบนายสิบตำรวจ']
});
