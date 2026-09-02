import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { PurchaseGate } from '@/components/commerce/PurchaseGate';
import { getExamAccessSummary, getPublishedExamBundle } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

function resolveDatabaseExamSetId(examSetId: string) {
  if (/^police-math-category-[a-z-]+$/.test(examSetId)) return examSetId;
  if (!/^police-math-set-\d{2}$/.test(examSetId)) return null;
  // Keep the original database ID while exposing it publicly as Set 1.
  return examSetId === 'police-math-set-01' ? 'police-math-set-04' : examSetId;
}

function resolvePublicSetNumber(examSetId: string) {
  const databaseSetId = resolveDatabaseExamSetId(examSetId);
  const publicNumbers: Record<string, number> = {
    'police-math-set-04': 1,
    'police-math-set-02': 2,
    'police-math-set-03': 3,
    'police-math-set-05': 4,
    'police-math-set-06': 5,
    'police-math-set-07': 6
  };
  return databaseSetId ? publicNumbers[databaseSetId] : undefined;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ examSetId: string }>;
}): Promise<Metadata> {
  const { examSetId } = await params;
  const setNumber = resolvePublicSetNumber(examSetId) ?? 1;
  const isCategorySet = examSetId.startsWith('police-math-category-');

  return buildMetadata({
    title: isCategorySet ? 'แบบฝึกความรู้ทั่วไป - นายสิบตำรวจ' : `ความรู้ทั่วไป ชุดที่ ${setNumber} - นายสิบตำรวจ`,
    description: isCategorySet ? 'แบบฝึกความรู้ทั่วไปแยกหมวด พร้อมจับเวลาและเฉลย' : `ข้อสอบความรู้ทั่วไปนายสิบตำรวจ ชุดที่ ${setNumber} จำนวน 30 ข้อ พร้อมจับเวลาและเฉลย`,
    path: `/courses/police_admin/math/exams/${examSetId}`,
    noIndex: true
  });
}

export default async function PoliceMathExamPage({
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

  return <ExamRunner examSetId={databaseExamSetId} initialData={initialData} />;
}
