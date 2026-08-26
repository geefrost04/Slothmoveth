import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { PurchaseGate } from '@/components/commerce/PurchaseGate';
import { getExamAccessSummary, getPublishedExamBundle } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Mock Test นายสิบตำรวจ 150 ข้อ',
  description: 'ข้อสอบจำลองสนามจริง 6 วิชา 150 ข้อ จับเวลา 180 นาที พร้อมเฉลย',
  noIndex: true
});

export default async function PoliceMockTestExamPage({
  params
}: {
  params: Promise<{ examSetId: string }>;
}) {
  const { examSetId } = await params;
  if (!/^police-mock_test-set-\d{2}$/.test(examSetId)) notFound();
  const access = await getExamAccessSummary(examSetId);
  if (!access) notFound();

  if (!access.canAccess) {
    if (!access.product_id) notFound();
    return (
      <PurchaseGate
        title={access.title}
        description={access.description}
        price={access.price}
        productId={access.product_id}
        backHref="/courses/police_admin/mock-test"
        backLabel="ดู Mock Test ชุดอื่น"
      />
    );
  }

  const initialData = await getPublishedExamBundle(examSetId);
  if (!initialData) notFound();
  return <ExamRunner examSetId={examSetId} initialData={initialData} />;
}
