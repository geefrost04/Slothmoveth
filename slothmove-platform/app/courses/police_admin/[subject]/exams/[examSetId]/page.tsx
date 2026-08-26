import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { PurchaseGate } from '@/components/commerce/PurchaseGate';
import { getExamAccessSummary, getPublishedExamBundle } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

const SUBJECTS: Record<string, { title: string; pattern: RegExp }> = {
  thai: { title: 'ภาษาไทย', pattern: /^police-thai-set-\d{2}$/ },
  law: { title: 'กฎหมาย', pattern: /^police-law-set-\d{2}$/ },
  saraban: { title: 'งานสารบรรณ', pattern: /^police-saraban-set-\d{2}$/ },
  english: { title: 'ภาษาอังกฤษ', pattern: /^police-english-set-\d{2}$/ }
};

function resolveDatabaseExamSetId(subject: string, examSetId: string) {
  const subjectConfig = SUBJECTS[subject];
  if (!subjectConfig?.pattern.test(examSetId)) return null;
  return examSetId;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subject: string; examSetId: string }>;
}): Promise<Metadata> {
  const { subject, examSetId } = await params;
  const subjectConfig = SUBJECTS[subject];
  const setNumber = Number(examSetId.match(/(\d{2})$/)?.[1] ?? 1);
  const title = subjectConfig?.title ?? 'ข้อสอบ';

  return buildMetadata({
    title: `${title} ชุดที่ ${setNumber} - นายสิบตำรวจ`,
    description: `ข้อสอบ${title}นายสิบตำรวจ ชุดที่ ${setNumber} จำนวน 50 ข้อ พร้อมจับเวลาและเฉลย`,
    path: `/courses/police_admin/${subject}/exams/${examSetId}`,
    noIndex: true
  });
}

export default async function PoliceSubjectExamPage({
  params
}: {
  params: Promise<{ subject: string; examSetId: string }>;
}) {
  const { subject, examSetId } = await params;
  const databaseExamSetId = resolveDatabaseExamSetId(subject, examSetId);
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
