import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ExamRunner } from '@/components/exams/ExamRunner';
import { getSubject, isCourseOpen } from '@/courses/registry';
import { getExamAccessSummary, getPublishedExamBundle, getPublishedExamCatalog } from '@/lib/exam-data';
import { buildMetadata } from '@/lib/seo';

// Exam sets for courses other than police_admin (police has its own routes).
// Set ids follow `<course>-<subject>-<kind>-NN`, e.g. onwr-water-set-01.
export const dynamic = 'force-dynamic';

function belongsTo(courseId: string, subjectId: string, examSetId: string) {
  return new RegExp(`^${courseId}-${subjectId}-[a-z]+-\\d{2}$`).test(examSetId);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ course: string; subject: string; examSetId: string }>;
}): Promise<Metadata> {
  const { course: courseId, subject: subjectId, examSetId } = await params;
  const result = getSubject(courseId, subjectId);
  const access = result && belongsTo(courseId, subjectId, examSetId) ? await getExamAccessSummary(examSetId).catch(() => null) : null;
  return buildMetadata({
    title: `${access?.title ?? 'ข้อสอบ'} - ${result?.course.title ?? ''}`,
    description: `${access?.title ?? 'ชุดข้อสอบ'} ${access?.total_questions ?? ''} ข้อ พร้อมจับเวลาและเฉลยละเอียด`,
    path: `/courses/${courseId}/${subjectId}/exams/${examSetId}`,
    noIndex: true
  });
}

export default async function CourseExamPage({
  params
}: {
  params: Promise<{ course: string; subject: string; examSetId: string }>;
}) {
  const { course: courseId, subject: subjectId, examSetId } = await params;
  const result = getSubject(courseId, subjectId);
  if (!result || !isCourseOpen(courseId) || !belongsTo(courseId, subjectId, examSetId)) notFound();

  const access = await getExamAccessSummary(examSetId);
  if (!access?.canAccess) notFound();
  const initialData = await getPublishedExamBundle(examSetId);
  if (!initialData) notFound();

  // Offer the next set of the same subject when this one is done.
  const catalog = await getPublishedExamCatalog(courseId, subjectId).catch(() => []);
  // Chain within the same kind only (set → set, drill → drill).
  const kind = examSetId.split('-').at(-2);
  const sets = catalog.filter((examSet) => examSet.id.split('-').at(-2) === kind).sort((a, b) => a.id.localeCompare(b.id));
  const index = sets.findIndex((examSet) => examSet.id === examSetId);
  const next = sets.length > 1 ? sets[(index + 1) % sets.length] : undefined;

  return (
    <ExamRunner
      examSetId={examSetId}
      initialData={initialData}
      course={{ id: courseId, subjectId, subjectTitle: result.subject.title }}
      freeCompletionOffer={{
        catalogHref: `/courses/${courseId}/${subjectId}`,
        catalogLabel: `เลือกชุด${result.subject.title}`,
        nextSet: next && next.id !== examSetId ? {
          href: `/courses/${courseId}/${subjectId}/exams/${next.id}`,
          title: next.title,
          totalQuestions: next.total_questions,
          durationMinutes: next.duration_minutes
        } : undefined
      }}
    />
  );
}
