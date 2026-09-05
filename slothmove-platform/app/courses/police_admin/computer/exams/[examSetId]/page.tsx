import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { PurchaseGate } from '@/components/commerce/PurchaseGate';
import { getExamAccessSummary, getPublishedExamBundle } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

function resolveDatabaseExamSetId(examSetId: string) {
  if (!/^police-computer-set-\d{2}$/.test(examSetId)) return null;
  return examSetId;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ examSetId: string }>;
}): Promise<Metadata> {
  const { examSetId } = await params;
  const setNumber = Number(examSetId.match(/(\d{2})$/)?.[1] ?? 1);

  return buildMetadata({
    title: `คอมพิวเตอร์ ชุดที่ ${setNumber} - นายสิบตำรวจ`,
    description: `ข้อสอบคอมพิวเตอร์นายสิบตำรวจ ชุดที่ ${setNumber} จำนวน 30 ข้อ พร้อมจับเวลาและเฉลย`,
    path: `/courses/police_admin/computer/exams/police-computer-set-${String(setNumber).padStart(2, '0')}`,
    noIndex: true
  });
}

export default async function PoliceComputerExamPage({
  params
}: {
  params: Promise<{ examSetId: string }>;
}) {
  const { examSetId } = await params;
  const databaseExamSetId = resolveDatabaseExamSetId(examSetId);
  if (!databaseExamSetId) notFound();

  const access = await getExamAccessSummary(databaseExamSetId);
  if (!access) notFound();
  if (!access.canAccess) {
    if (!access.product_id) notFound();
    return (
      <PurchaseGate
        title={access.title}
        description={access.description}
        price={access.price}
        productId={access.product_id}
      />
    );
  }

  const initialData = await getPublishedExamBundle(databaseExamSetId);
  if (!initialData) notFound();

  return (
    <ExamRunner
      examSetId={databaseExamSetId}
      initialData={initialData}
      freeCompletionOffer={access.access_type === 'free' ? {
        catalogHref: '/courses/police_admin/computer',
        catalogLabel: 'เลือกชุดคอมพิวเตอร์เป็นรายชุด'
      } : undefined}
    />
  );
}
