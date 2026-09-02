import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { PurchaseGate } from '@/components/commerce/PurchaseGate';
import { getExamAccessSummary, getPublishedExamBundle, getPublishedExamCatalog } from '@/lib/exam-data';
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
        analyticsEventName="mock_unlock_click"
        analyticsParameters={{
          exam_set_id: examSetId,
          source: 'paid_exam_gate',
          price: access.price / 100
        }}
      />
    );
  }

  const initialData = await getPublishedExamBundle(examSetId);
  if (!initialData) notFound();
  const catalog = access.access_type === 'free'
    ? await getPublishedExamCatalog('police_admin', 'mock_test')
    : [];
  const nextPaidMock = catalog.find((examSet) => examSet.access_type === 'paid' && examSet.product_id);

  return (
    <ExamRunner
      examSetId={examSetId}
      initialData={initialData}
      nextMockOffer={nextPaidMock?.product_id ? {
        examSetId: nextPaidMock.id,
        title: nextPaidMock.title,
        productId: nextPaidMock.product_id,
        price: nextPaidMock.price
      } : undefined}
    />
  );
}
