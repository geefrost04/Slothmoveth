import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { getExamAccessSummary, getPublishedExamBundle, getPublishedExamCatalog } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

// NESDC Mini Drill: quick 10-question themed drills.
export const dynamic = 'force-dynamic';

const ID_PATTERN = /^nesdc-mini_drill-set-\d{2}$/;

export async function generateMetadata({ params }: { params: Promise<{ examSetId: string }> }): Promise<Metadata> {
  const { examSetId } = await params;
  const access = ID_PATTERN.test(examSetId) ? await getExamAccessSummary(examSetId).catch(() => null) : null;
  return buildMetadata({
    title: `${access?.title ?? 'Mini Drill'} - สศช. งานวิเคราะห์นโยบายและแผน`,
    description: 'Mini Drill 10 ข้อ ทวนเร็วเรื่องที่ออกสอบบ่อย สศช. พร้อมเฉลยละเอียด',
    path: `/courses/nesdc/mini-drill/${examSetId}`,
    noIndex: true
  });
}

export default async function NesdcMiniDrillPage({ params }: { params: Promise<{ examSetId: string }> }) {
  const { examSetId } = await params;
  if (!ID_PATTERN.test(examSetId)) notFound();

  const access = await getExamAccessSummary(examSetId);
  if (!access?.canAccess) notFound();
  const initialData = await getPublishedExamBundle(examSetId);
  if (!initialData) notFound();

  const catalog = await getPublishedExamCatalog('nesdc', 'mini_drill').catch(() => []);
  const sets = [...catalog].sort((a, b) => a.id.localeCompare(b.id));
  const index = sets.findIndex((examSet) => examSet.id === examSetId);
  const next = sets.length > 1 ? sets[(index + 1) % sets.length] : undefined;

  return (
    <ExamRunner
      examSetId={examSetId}
      initialData={initialData}
      course={{ id: 'nesdc', subjectId: 'mini_drill', subjectTitle: 'Mini Drill' }}
      freeCompletionOffer={{
        catalogHref: '/courses/nesdc',
        catalogLabel: 'กลับหน้าคอร์ส สศช.',
        nextSet: next && next.id !== examSetId ? {
          href: `/courses/nesdc/mini-drill/${next.id}`,
          title: next.title,
          totalQuestions: next.total_questions,
          durationMinutes: next.duration_minutes
        } : undefined
      }}
    />
  );
}
