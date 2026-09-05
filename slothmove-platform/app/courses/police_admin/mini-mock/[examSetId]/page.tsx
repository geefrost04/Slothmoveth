import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { getExamAccessSummary, getPublishedExamBundle } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ examSetId: string }>;
}): Promise<Metadata> {
  const { examSetId } = await params;
  const isSet2 = examSetId === 'police-mini_mock-set-02';
  return buildMetadata({
    title: isSet2 ? 'Mini Mock นายสิบตำรวจ ชุดที่ 2 (30 ข้อ ฟรี)' : 'Mini Mock นายสิบตำรวจ 30 ข้อ ฟรี',
    description: isSet2
      ? 'Mini Mock ชุดนี้เป็นตัวอย่าง 30 ข้อจาก Mock Test ชุด 4 ครบ 6 วิชา จับเวลา 35 นาที พร้อมเฉลยและผลวิเคราะห์'
      : 'ทดลองทำ Mini Mock นายสิบตำรวจ 30 ข้อ ครบ 6 วิชา จับเวลา 35 นาที พร้อมเฉลยและผลวิเคราะห์',
    noIndex: true
  });
}

export default async function PoliceMiniMockExamPage({
  params
}: {
  params: Promise<{ examSetId: string }>;
}) {
  const { examSetId } = await params;
  if (!/^police-mini_mock-set-\d{2}$/.test(examSetId)) notFound();

  const access = await getExamAccessSummary(examSetId);
  if (!access?.canAccess) notFound();

  const initialData = await getPublishedExamBundle(examSetId);
  if (!initialData) notFound();

  const targetMockId = examSetId === 'police-mini_mock-set-02'
    ? 'police-mock_test-set-04'
    : 'police-mock_test-set-02';
  const targetSummary = await getExamAccessSummary(targetMockId);
  const nextMockOffer = targetSummary?.product_id ? {
    examSetId: targetSummary.id,
    title: targetSummary.title,
    productId: targetSummary.product_id,
    price: targetSummary.price
  } : undefined;

  return (
    <ExamRunner
      examSetId={examSetId}
      initialData={initialData}
      nextMockOffer={nextMockOffer}
      freeCompletionOffer={{
        catalogHref: '/courses/police_admin/mock-test',
        catalogLabel: 'เลือก Mock Test เป็นรายชุด'
      }}
    />
  );
}
