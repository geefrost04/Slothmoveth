import { notFound } from 'next/navigation';
import { QuizGame } from '@/components/games/QuizGame';
import { getPublishedExamBundle, getPublishedExamCatalog } from '@/lib/exam-data';
import type { QuizItem } from '@/lib/course-types';

const FREE_PRACTICE_SUBJECT_IDS = new Set(['math', 'thai', 'english', 'law', 'computer', 'social', 'saraban', 'analytical_thinking']);

export const dynamic = 'force-dynamic';

async function getFreeExamSet(subjectId: string) {
  const catalog = await getPublishedExamCatalog('police_admin', subjectId);
  return catalog.find((examSet) => examSet.access_type === 'free') ?? null;
}

export default async function DailyPracticePage({
  params
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const requestedSubject = FREE_PRACTICE_SUBJECT_IDS.has(subject) ? subject : 'math';
  const requestedFreeSet = await getFreeExamSet(requestedSubject);
  const freeSet = requestedFreeSet ?? (requestedSubject === 'math' ? null : await getFreeExamSet('math'));
  if (!freeSet) notFound();

  const bundle = await getPublishedExamBundle(freeSet.id);
  if (!bundle || bundle.questions.length < 10) notFound();

  const items: QuizItem[] = bundle.questions.map((question) => ({
    id: question.id,
    question: question.prompt,
    choices: question.choices,
    answer: question.correctChoiceIndex,
    explanation: question.explanation,
    hint: question.tip ?? undefined,
    category: question.category
  }));
  const sourceSubject = requestedFreeSet ? requestedSubject : 'math';

  return (
    <QuizGame
      items={items}
      title="ควิซฟรี 10 ข้อ"
      subtitle={`สุ่มจาก ${bundle.examSet.title} ซึ่งเป็นชุดข้อสอบฟรี`}
      courseId="police_admin"
      subjectId={sourceSubject}
      examSetId={freeSet.id}
      autoStart
      isDailyPractice
      introChip="FREE DAILY PRACTICE"
      introTitle="ควิซฟรี 10 ข้อ"
      introDescription="สุ่มเฉพาะจากชุดข้อสอบฟรี ไม่รวมข้อจากชุดที่ต้องซื้อ"
      introStats={['10 ข้อต่อรอบ', 'เฉพาะชุดข้อสอบฟรี', 'พร้อมเฉลยหลังทำ']}
      modeOptions={[{ count: 10, label: 'เริ่มควิซฟรี 10 ข้อ', desc: 'สุ่มจากชุดข้อสอบฟรีที่เปิดให้ฝึกได้ทันที', badge: 'ฟรี', primaryIcon: 'quiz' }]}
    />
  );
}
