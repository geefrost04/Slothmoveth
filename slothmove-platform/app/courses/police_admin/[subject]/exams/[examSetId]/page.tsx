import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { PurchaseGate } from '@/components/commerce/PurchaseGate';
import { getExamAccessSummary, getPublishedExamBundle, getPublishedExamCatalog } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

const SUBJECTS: Record<string, { title: string; pattern: RegExp }> = {
  thai: { title: 'ภาษาไทย', pattern: /^police-thai-set-\d{2}$/ },
  law: { title: 'กฎหมาย', pattern: /^police-law-set-\d{2}$/ },
  saraban: { title: 'งานสารบรรณ', pattern: /^police-saraban-(set|quick)-\d{2}$/ },
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
  const access = subjectConfig?.pattern.test(examSetId) ? await getExamAccessSummary(examSetId).catch(() => null) : null;

  return buildMetadata({
    title: `${access?.title ?? `${title} ชุดที่ ${setNumber}`} - นายสิบตำรวจ`,
    description: `ข้อสอบ${title}นายสิบตำรวจ ${access?.title ?? `ชุดที่ ${setNumber}`} จำนวน ${access?.total_questions ?? 50} ข้อ พร้อมจับเวลาและเฉลย`,
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

  // Quick-review sets chain into the next one so a short session can keep going.
  let nextSet: { href: string; title: string; totalQuestions: number; durationMinutes: number | null } | undefined;
  const quickMatch = databaseExamSetId.match(/^(police-[a-z_]+-quick-)(\d{2})$/);
  if (quickMatch) {
    const catalog = await getPublishedExamCatalog('police_admin', subject).catch(() => []);
    const quickSets = catalog.filter((examSet) => examSet.id.startsWith(quickMatch[1]) && examSet.access_type === 'free');
    const currentIndex = quickSets.findIndex((examSet) => examSet.id === databaseExamSetId);
    const next = quickSets.length > 1 ? quickSets[(currentIndex + 1) % quickSets.length] : undefined;
    if (next) {
      nextSet = {
        href: `/courses/police_admin/${subject}/exams/${next.id}`,
        title: next.title,
        totalQuestions: next.total_questions,
        durationMinutes: next.duration_minutes
      };
    }
  }

  return (
    <ExamRunner
      examSetId={databaseExamSetId}
      initialData={initialData}
      freeCompletionOffer={access.access_type === 'free' ? {
        catalogHref: `/courses/police_admin/${subject}`,
        catalogLabel: `เลือกชุด${SUBJECTS[subject].title}เป็นรายชุด`,
        nextSet
      } : undefined}
    />
  );
}
