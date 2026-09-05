import { notFound, redirect } from 'next/navigation';
import { getCourse, getSubject } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { getPublishedStudySheet } from '@/lib/study-sheets';
import type { StudySheetBundle } from '@/lib/study-sheet-types';

export default async function StudySheetIndex({ params }: { params: Promise<{ course: string; subject: string }> }) {
  const { course: courseId, subject: subjectId } = await params;
  const course = getCourse(courseId);
  const subject = getSubject(courseId, subjectId);
  if (!course || !subject) notFound();

  let bundle: StudySheetBundle | null = null;
  const normalizedSubjectId = subjectId === 'sarabum' ? 'saraban' : subjectId;

  if (courseId === 'police_admin' && normalizedSubjectId === 'math') {
    const localData = require('@/content/study-sheets/police-general-ability-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && normalizedSubjectId === 'computer') {
    const localData = require('@/content/study-sheets/police-computer-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && normalizedSubjectId === 'saraban') {
    const localData = require('@/content/study-sheets/police-saraban-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else if (courseId === 'police_admin' && (normalizedSubjectId === 'law' || normalizedSubjectId === 'police_law')) {
    const localData = require('@/content/study-sheets/police-law-summary.json');
    bundle = {
      sheet: localData.sheet,
      sections: localData.sections,
      assets: localData.assets
    } as StudySheetBundle;
  } else {
    bundle = await getPublishedStudySheet(courseId, normalizedSubjectId);
  }

  const firstSection = bundle?.sections[0];
  if (!firstSection) {
    return <CourseLayout course={course}><div className="study-sheet-empty"><h1>ยังไม่มีชีทสรุปที่เผยแพร่</h1><p>กรุณากลับมาตรวจสอบอีกครั้งภายหลัง</p></div></CourseLayout>;
  }
  redirect(`/courses/${courseId}/${subjectId}/summary/${firstSection.slug}`);
}
