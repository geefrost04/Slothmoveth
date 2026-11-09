import type { CourseConfig } from '@/lib/course-types';
import { getPublishedExamCatalog, type CatalogExamSet } from '@/lib/exam-data';
import { NESDC_LESSONS } from '@/components/study-sheets/nesdcLessonData';
import { NesdcCourseHomeClient, type NesdcSet, type NesdcSubjectCard } from './NesdcCourseHomeClient';

async function safeCatalog(courseId: string, subjectId: string): Promise<CatalogExamSet[]> {
  try {
    return await getPublishedExamCatalog(courseId, subjectId);
  } catch {
    return [];
  }
}

// Landing for the NESDC policy-and-plan course: exam facts and key dates, Mini Mock, then the 7 topics.
export async function NesdcCourseHome({ course }: { course: CourseConfig }) {
  const [miniCatalog, ...catalogs] = await Promise.all([
    safeCatalog(course.id, 'mini_mock'),
    ...course.subjects.map((subject) => safeCatalog(course.id, subject.id))
  ]);
  const toSet = (examSet: CatalogExamSet, href: string): NesdcSet => ({
    id: examSet.id,
    title: examSet.title,
    href,
    questions: examSet.total_questions,
    minutes: examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.2)
  });
  const byId = (a: CatalogExamSet, b: CatalogExamSet) => a.id.localeCompare(b.id);

  const miniMocks = [...miniCatalog].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/mini-mock/${examSet.id}`));
  const subjects: NesdcSubjectCard[] = course.subjects.map((subject, index) => {
    const lessons = NESDC_LESSONS[subject.id] ?? [];
    return {
      id: subject.id,
      title: subject.title,
      desc: subject.desc,
      icon: subject.icon ?? '📘',
      href: `/courses/${course.id}/${subject.id}`,
      lessonCount: lessons.filter((lesson) => lesson.sectionType === 'chapter').length,
      sets: [...catalogs[index]].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/${subject.id}/exams/${examSet.id}`))
    };
  });
  return <NesdcCourseHomeClient miniMocks={miniMocks} subjects={subjects} />;
}
