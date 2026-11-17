// Route-page factories shared by the learn courses. Each course's route files stay one-liners
// (Next needs `dynamic` / `dynamicParams` as literals in the file itself) and call these.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DiagnosticView } from '@/components/learn/DiagnosticView';
import { LearnHome } from '@/components/learn/LearnHome';
import { LessonTest } from '@/components/learn/LessonTest';
import { LessonView } from '@/components/learn/LessonView';
import { ReviewView } from '@/components/learn/ReviewView';
import { SummaryView } from '@/components/learn/SummaryView';
import { buildMetadata } from '@/lib/seo';
import type { Course } from './course';
import { lessonAsOf, questionIndex, topicAsOf, topicTestQuestions } from './questions';
import type { MCQ, Topic } from './types';

type TopicParams = Promise<{ topic: string }>;
type LessonParams = Promise<{ topic: string; lesson: string }>;

const topicOf = (c: Course, id: string) => c.topics.find((t) => t.id === id);
const lessonOf = (c: Course, topic: string, lesson: string) => topicOf(c, topic)?.lessons.find((l) => l.id === lesson);

/** The topic test: the topic's own fresh test if it has one, else drawn evenly from the lesson tests. */
export function topicTestOf(c: Course, t: Topic): MCQ[] {
  return t.test?.length ? t.test : topicTestQuestions(t, c.meta.topicTestSize);
}

export function homePage(c: Course, title: string, description: string) {
  return {
    metadata: buildMetadata({ title, description, path: c.meta.base, noIndex: true }) as Metadata,
    Page: function Home() {
      return <LearnHome />;
    }
  };
}

export function lessonPage(c: Course) {
  return {
    generateStaticParams: () => c.topics.flatMap((t) => t.lessons.map((l) => ({ topic: t.id, lesson: l.id }))),
    generateMetadata: async ({ params }: { params: LessonParams }): Promise<Metadata> => {
      const { topic, lesson } = await params;
      const l = lessonOf(c, topic, lesson);
      return buildMetadata({
        title: `${l?.title ?? 'บทเรียน'} - ${c.meta.shortName}`,
        description: l?.lead ?? `บทเรียนเตรียมสอบ ${c.meta.shortName}`,
        path: `${c.meta.base}/${topic}/${lesson}`,
        noIndex: true
      });
    },
    Page: async function Lesson({ params }: { params: LessonParams }) {
      const { topic, lesson } = await params;
      const t = topicOf(c, topic);
      const l = lessonOf(c, topic, lesson);
      if (!t || !l) notFound();
      return <LessonView lesson={l} topic={t} />;
    }
  };
}

export function lessonTestPage(c: Course) {
  const B = c.meta.base;
  return {
    generateStaticParams: () => c.topics.flatMap((t) => t.lessons.map((l) => ({ topic: t.id, lesson: l.id }))),
    generateMetadata: async ({ params }: { params: LessonParams }): Promise<Metadata> => {
      const { topic, lesson } = await params;
      const l = lessonOf(c, topic, lesson);
      return buildMetadata({
        title: `แบบทดสอบท้ายบท: ${l?.title ?? ''} - ${c.meta.shortName}`,
        description: `แบบทดสอบท้ายบท ${c.meta.testSize} ข้อ พร้อมคำอธิบาย`,
        path: `${B}/${topic}/${lesson}/test`,
        noIndex: true
      });
    },
    Page: async function LessonTestPage({ params }: { params: LessonParams }) {
      const { topic, lesson } = await params;
      const t = topicOf(c, topic);
      const l = lessonOf(c, topic, lesson);
      if (!t || !l) notFound();
      const next = t.lessons[l.order];
      const nextLink = next
        ? { href: `${B}/${t.id}/${next.id}`, title: `ไปบทถัดไป: ${next.title}` }
        : t.summary
          ? { href: `${B}/${t.id}/summary`, title: 'เปิดหน้าสรุปของหัวข้อนี้' }
          : undefined;
      return (
        <LessonTest
          progressKey={l.id}
          title={l.title}
          kicker={`แบบทดสอบท้ายบท · บทที่ ${l.order}`}
          questions={l.test}
          backHref={`${B}/${t.id}/${l.id}`}
          pass={c.meta.testPass}
          next={nextLink}
          asOf={lessonAsOf(l)}
        />
      );
    }
  };
}

export function summaryPage(c: Course) {
  return {
    generateStaticParams: () => c.topics.filter((t) => t.summary).map((t) => ({ topic: t.id })),
    generateMetadata: async ({ params }: { params: TopicParams }): Promise<Metadata> => {
      const { topic } = await params;
      const t = topicOf(c, topic);
      return buildMetadata({
        title: `สรุปเพื่อความเข้าใจ: ${t?.title ?? ''} - ${c.meta.shortName}`,
        description: t?.summary?.question ?? 'หน้าสรุปเพื่อความเข้าใจ',
        path: `${c.meta.base}/${topic}/summary`,
        noIndex: true
      });
    },
    Page: async function SummaryPage({ params }: { params: TopicParams }) {
      const { topic } = await params;
      const t = topicOf(c, topic);
      if (!t?.summary) notFound();
      return <SummaryView summary={t.summary} topic={t} />;
    }
  };
}

export function topicTestPage(c: Course) {
  const B = c.meta.base;
  return {
    generateStaticParams: () => c.topics.filter((t) => t.test?.length || t.lessons.length).map((t) => ({ topic: t.id })),
    generateMetadata: async ({ params }: { params: TopicParams }): Promise<Metadata> => {
      const { topic } = await params;
      const t = topicOf(c, topic);
      return buildMetadata({
        title: `ข้อสอบหัวข้อ: ${t?.title ?? ''} - ${c.meta.shortName}`,
        description: `ข้อสอบรวมหัวข้อ ${c.meta.topicTestSize} ข้อ พร้อมคำอธิบาย`,
        path: `${B}/${topic}/test`,
        noIndex: true
      });
    },
    Page: async function TopicTestPage({ params }: { params: TopicParams }) {
      const { topic } = await params;
      const t = topicOf(c, topic);
      if (!t) notFound();
      const questions = topicTestOf(c, t);
      if (!questions.length) notFound();
      return (
        <LessonTest
          progressKey={`topic:${t.id}`}
          title={t.title}
          kicker={`ข้อสอบหัวข้อ ${questions.length} ข้อ`}
          questions={questions}
          backHref={t.summary ? `${B}/${t.id}/summary` : B}
          pass={Math.ceil(questions.length * 0.6)}
          asOf={topicAsOf(t)}
        />
      );
    }
  };
}

export function reviewPage(c: Course) {
  const bank = [...questionIndex(c.topics).values(), ...c.topics.flatMap((t) => t.test ?? [])];
  return {
    metadata: buildMetadata({
      title: `ทวนข้อที่เคยตอบผิด - ${c.meta.shortName}`,
      description: 'ทบทวนข้อที่ตอบผิดในแบบทดสอบท้ายบท',
      path: `${c.meta.base}/review`,
      noIndex: true
    }) as Metadata,
    Page: function Review() {
      return <ReviewView bank={bank} />;
    }
  };
}

export function diagnosticPage(c: Course) {
  const page = c.diagnosticPage ?? { title: 'แบบวัดพื้นฐาน', kicker: 'ก่อนเริ่มแผน', description: 'แบบวัดพื้นฐาน' };
  return {
    metadata: buildMetadata({ title: `${page.title} - ${c.meta.shortName}`, description: page.description, path: `${c.meta.base}/diagnostic`, noIndex: true }) as Metadata,
    Page: function Diagnostic() {
      if (!c.diagnostic?.length) notFound();
      return <DiagnosticView questions={c.diagnostic} title={page.title} kicker={page.kicker} />;
    }
  };
}
