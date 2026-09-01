import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { getExamAccessSummary, getPublishedExamBundle } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Mini Mock นายสิบตำรวจ 30 ข้อ ฟรี',
  description: 'ทดลองทำ Mini Mock นายสิบตำรวจ 30 ข้อ ครบ 6 วิชา จับเวลา 35 นาที พร้อมเฉลยและผลวิเคราะห์',
  noIndex: true
});

export default async function PoliceMiniMockExamPage({
  params
}: {
  params: Promise<{ examSetId: string }>;
}) {
  const { examSetId } = await params;
  if (examSetId !== 'police-mini_mock-set-01') notFound();

  const access = await getExamAccessSummary(examSetId);
  if (!access?.canAccess) notFound();

  const initialData = await getPublishedExamBundle(examSetId);
  if (!initialData) notFound();

  return <ExamRunner examSetId={examSetId} initialData={initialData} />;
}
