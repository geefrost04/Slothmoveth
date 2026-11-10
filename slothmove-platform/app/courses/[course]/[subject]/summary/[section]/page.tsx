import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getCourse, getSubject } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { StudySheetReader } from '@/components/study-sheets/StudySheetReader';
import { getPublishedStudySheet } from '@/lib/study-sheets';
import { buildMetadata } from '@/lib/seo';
import type { StudySheetBundle } from '@/lib/study-sheet-types';

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function readLocalStudySheet(filename: string) {
  const filePath = path.join(process.cwd(), 'content', 'study-sheets', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export default async function StudySheetSectionPage({ params }: { params: Promise<{ course: string; subject: string; section: string }> }) {
  const { course: courseId, subject: subjectId, section: sectionSlug } = await params;
  const course = getCourse(courseId);
  const subject = getSubject(courseId, subjectId);
  if (!course || !subject) notFound();

  let bundle: StudySheetBundle | null = null;
  const normalizedSubjectId = subjectId === 'sarabum' ? 'saraban' : subjectId;

  if (courseId === 'police_admin' && normalizedSubjectId === 'math') {
    const localData = readLocalStudySheet('police-general-ability-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections.map((s: any, idx: number) => ({ ...s, id: s.id || `local-section-${idx}` })),
      assets: localData.assets.map((a: any, idx: number) => ({ ...a, id: a.id || `local-asset-${idx}` }))
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && normalizedSubjectId === 'computer') {
    const localData = readLocalStudySheet('police-computer-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections.map((s: any, idx: number) => ({ ...s, id: s.id || `local-computer-section-${idx}` })),
      assets: localData.assets.map((a: any, idx: number) => ({ ...a, id: a.id || `local-computer-asset-${idx}` }))
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && normalizedSubjectId === 'saraban') {
    const localData = readLocalStudySheet('police-saraban-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections.map((s: any, idx: number) => ({ ...s, id: s.id || `local-saraban-section-${idx}` })),
      assets: localData.assets.map((a: any, idx: number) => ({ ...a, id: a.id || `local-saraban-asset-${idx}` }))
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && (normalizedSubjectId === 'law' || normalizedSubjectId === 'police_law')) {
    const localData = readLocalStudySheet('police-law-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections.map((s: any, idx: number) => ({ ...s, id: s.id || `local-law-section-${idx}` })),
      assets: localData.assets.map((a: any, idx: number) => ({ ...a, id: a.id || `local-law-asset-${idx}` }))
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && (normalizedSubjectId === 'thai' || normalizedSubjectId === 'english')) {
    const localData = readLocalStudySheet(`police-${normalizedSubjectId}-summary.json`);
    bundle = { sheet: localData.sheet, sections: localData.sections, assets: localData.assets } as StudySheetBundle;
  } else if (courseId === 'onwr' || courseId === 'nesdc') {
    // Local-content courses: content/study-sheets/<course>-<subject>-summary.json
    const file = path.join(process.cwd(), 'content', 'study-sheets', `${courseId}-${normalizedSubjectId}-summary.json`);
    if (fs.existsSync(file)) {
      const localData = JSON.parse(fs.readFileSync(file, 'utf-8'));
      bundle = { sheet: localData.sheet, sections: localData.sections, assets: localData.assets } as StudySheetBundle;
    }
  } else {
    bundle = await getPublishedStudySheet(courseId, normalizedSubjectId);
  }

  // The computer sheet moved from 3 "part" pages to syllabus-ordered lessons (Nov 2569).
  const OLD_COMPUTER_SLUGS: Record<string, string> = { 'part-01': 'history', 'part-02': 'lesson-02', 'part-03': 'lesson-03' };
  if (normalizedSubjectId === 'computer' && OLD_COMPUTER_SLUGS[sectionSlug]) {
    permanentRedirect(`/courses/${courseId}/computer/summary/${OLD_COMPUTER_SLUGS[sectionSlug]}`);
  }
  // The law sheet's 6 "part" pages became 7 lessons; parts 4–6 were saraban topics, now in the saraban notes.
  const OLD_LAW_SLUGS: Record<string, string> = { 'part-01': 'lesson-01', 'part-02': 'lesson-03', 'part-03': 'lesson-06' };
  if (normalizedSubjectId === 'law' && /^part-0[1-6]$/.test(sectionSlug)) {
    permanentRedirect(OLD_LAW_SLUGS[sectionSlug] ? `/courses/${courseId}/law/summary/${OLD_LAW_SLUGS[sectionSlug]}` : `/courses/${courseId}/saraban/summary/lesson-02`);
  }

  const current = bundle?.sections.find((section) => section.slug === sectionSlug);
  if (!bundle || !current) notFound();
  // Some local sheet files have no course/subject ids; links are built from them.
  bundle = { ...bundle, sheet: { ...bundle.sheet, course_id: bundle.sheet.course_id ?? courseId, subject_id: bundle.sheet.subject_id ?? subjectId } };

  return <CourseLayout course={course}><StudySheetReader bundle={bundle} current={current} /></CourseLayout>;
}

export async function generateMetadata({ params }: { params: Promise<{ course: string; subject: string; section: string }> }): Promise<Metadata> {
  const { course: courseId, subject: subjectId, section: sectionSlug } = await params;

  let bundle: StudySheetBundle | null = null;
  const normalizedSubjectId = subjectId === 'sarabum' ? 'saraban' : subjectId;

  if (courseId === 'police_admin' && normalizedSubjectId === 'math') {
    const localData = readLocalStudySheet('police-general-ability-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && normalizedSubjectId === 'computer') {
    const localData = readLocalStudySheet('police-computer-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && normalizedSubjectId === 'saraban') {
    const localData = readLocalStudySheet('police-saraban-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && (normalizedSubjectId === 'law' || normalizedSubjectId === 'police_law')) {
    const localData = readLocalStudySheet('police-law-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && (normalizedSubjectId === 'thai' || normalizedSubjectId === 'english')) {
    const localData = readLocalStudySheet(`police-${normalizedSubjectId}-summary.json`);
    bundle = { sheet: localData.sheet, sections: localData.sections, assets: localData.assets } as StudySheetBundle;
  } else if (courseId === 'onwr' || courseId === 'nesdc') {
    // Local-content courses: content/study-sheets/<course>-<subject>-summary.json
    const file = path.join(process.cwd(), 'content', 'study-sheets', `${courseId}-${normalizedSubjectId}-summary.json`);
    if (fs.existsSync(file)) {
      const localData = JSON.parse(fs.readFileSync(file, 'utf-8'));
      bundle = { sheet: localData.sheet, sections: localData.sections, assets: localData.assets } as StudySheetBundle;
    }
  } else {
    bundle = await getPublishedStudySheet(courseId, normalizedSubjectId);
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
