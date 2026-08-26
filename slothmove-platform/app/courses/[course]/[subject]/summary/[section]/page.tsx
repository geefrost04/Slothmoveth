import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourse, getSubject } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { StudySheetReader } from '@/components/study-sheets/StudySheetReader';
import { getPublishedStudySheet } from '@/lib/study-sheets';
import { buildMetadata } from '@/lib/seo';
import type { StudySheetBundle } from '@/lib/study-sheet-types';

export const revalidate = 300;

export default async function StudySheetSectionPage({ params }: { params: Promise<{ course: string; subject: string; section: string }> }) {
  const { course: courseId, subject: subjectId, section: sectionSlug } = await params;
  const course = getCourse(courseId);
  const subject = getSubject(courseId, subjectId);
  if (!course || !subject) notFound();

  let bundle: StudySheetBundle | null = null;
  if (courseId === 'police_admin' && subjectId === 'math') {
    const localData = require('@/content/study-sheets/police-general-ability-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections.map((s: any, idx: number) => ({ ...s, id: s.id || `local-section-${idx}` })),
      assets: localData.assets.map((a: any, idx: number) => ({ ...a, id: a.id || `local-asset-${idx}` }))
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && subjectId === 'computer') {
    const localData = require('@/content/study-sheets/police-computer-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections.map((s: any, idx: number) => ({ ...s, id: s.id || `local-computer-section-${idx}` })),
      assets: localData.assets.map((a: any, idx: number) => ({ ...a, id: a.id || `local-computer-asset-${idx}` }))
    } as StudySheetBundle;
  } else {
    bundle = await getPublishedStudySheet(courseId, subjectId);
  }

  const current = bundle?.sections.find((section) => section.slug === sectionSlug);
  if (!bundle || !current) notFound();

  return <CourseLayout course={course}><StudySheetReader bundle={bundle} current={current} /></CourseLayout>;
}

export async function generateMetadata({ params }: { params: Promise<{ course: string; subject: string; section: string }> }): Promise<Metadata> {
  const { course: courseId, subject: subjectId, section: sectionSlug } = await params;

  let bundle: StudySheetBundle | null = null;
  if (courseId === 'police_admin' && subjectId === 'math') {
    const localData = require('@/content/study-sheets/police-general-ability-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && subjectId === 'computer') {
    const localData = require('@/content/study-sheets/police-computer-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else {
    bundle = await getPublishedStudySheet(courseId, subjectId);
  }

  const section = bundle?.sections.find((item: any) => item.slug === sectionSlug);
  if (!bundle || !section) return buildMetadata({ title: 'ไม่พบชีทสรุป', description: 'ไม่พบเนื้อหาที่ต้องการ', path: `/courses/${courseId}/${subjectId}/summary/${sectionSlug}`, noIndex: true });

  return buildMetadata({
    title: `${section.title} - ${bundle.sheet.title}`,
    description: bundle.sheet.description,
    path: `/courses/${courseId}/${subjectId}/summary/${sectionSlug}`,
    keywords: ['สอบตำรวจ', subjectId, 'ชีทสรุป', section.title]
  });
}
