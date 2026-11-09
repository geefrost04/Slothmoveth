import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { getExamAccessSummary, getPublishedExamBundle, getPublishedExamCatalog } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

// NESDC Mini Mock: mixed 30-question sets covering all 7 topics.
export const dynamic = 'force-dynamic';

const ID_PATTERN = /^nesdc-mini_mock-set-\d{2}$/;

export async function generateMetadata({ params }: { params: Promise<{ examSetId: string }> }): Promise<Metadata> {
  const { examSetId } = await params;
  const access = ID_PATTERN.test(examSetId) ? await getExamAccessSummary(examSetId).catch(() => null) : null;
  return buildMetadata({
    title: `${access?.title ?? 'Mini Mock'} - สศช. งานวิเคราะห์นโยบายและแผน`,
    description: 'Mini Mock 30 ข้อ คละครบทุกหัวข้อสอบ สศช. จับเวลา พร้อมเฉลยละเอียด',
    path: `/courses/nesdc/mini-mock/${examSetId}`,
    noIndex: true
  });
}

export default async function NesdcMiniMockPage({ params }: { params: Promise<{ examSetId: string }> }) {
  const { examSetId } = await params;
  if (!ID_PATTERN.test(examSetId)) notFound();

  const access = await getExamAccessSummary(examSetId);
  if (!access?.canAccess) notFound();
  const initialData = await getPublishedExamBundle(examSetId);
  if (!initialData) notFound();

  const catalog = await getPublishedExamCatalog('nesdc', 'mini_mock').catch(() => []);
  const sets = [...catalog].sort((a, b) => a.id.localeCompare(b.id));
  const index = sets.findIndex((examSet) => examSet.id === examSetId);
  const next = sets.length > 1 ? sets[(index + 1) % sets.length] : undefined;

  return (
    <ExamRunner
      examSetId={examSetId}
      initialData={initialData}
      course={{ id: 'nesdc', subjectId: 'mini_mock', subjectTitle: 'Mini Mock' }}
      freeCompletionOffer={{
        catalogHref: '/courses/nesdc',
        catalogLabel: 'กลับหน้าคอร์ส สศช.',
        nextSet: next && next.id !== examSetId ? {
          href: `/courses/nesdc/mini-mock/${next.id}`,
          title: next.title,
          totalQuestions: next.total_questions,
          durationMinutes: next.duration_minutes
        } : undefined
      }}
    />
  );
}
