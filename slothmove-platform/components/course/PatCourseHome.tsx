import type { CourseConfig } from '@/lib/course-types';
import { getPublishedExamCatalog, type CatalogExamSet } from '@/lib/exam-data';
import { PAT_LESSONS } from '@/components/study-sheets/patLessonData';
import { PatCourseHomeClient, type PatSet, type PatSubjectCard } from './PatCourseHomeClient';

async function safeCatalog(courseId: string, subjectId: string): Promise<CatalogExamSet[]> {
  try {
    return await getPublishedExamCatalog(courseId, subjectId);
  } catch {
    return [];
  }
}

const NOTES_ONLY = new Set(['practical', 'interview']);

// Landing for the PAT (กทท.) นักวิชาการ 6 course: exam parts, Mini Mock, the topics of ภาคทั่วไป and
// ภาควิชาการ, and notes-only cards for ภาคปฏิบัติการ and สัมภาษณ์.
export async function PatCourseHome({ course }: { course: CourseConfig }) {
  const topics = course.subjects.filter((subject) => !NOTES_ONLY.has(subject.id));
  const [miniCatalog, ...catalogs] = await Promise.all([
    safeCatalog(course.id, 'mini_mock'),
    ...topics.map((subject) => safeCatalog(course.id, subject.id))
  ]);
  const toSet = (examSet: CatalogExamSet, href: string): PatSet => ({
    id: examSet.id,
    title: examSet.title,
    href,
    questions: examSet.total_questions,
    minutes: examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.2)
  });
  const byId = (a: CatalogExamSet, b: CatalogExamSet) => a.id.localeCompare(b.id);
  const chapters = (id: string) => (PAT_LESSONS[id] ?? []).filter((lesson) => lesson.sectionType === 'chapter');

  const miniMocks = [...miniCatalog].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/mini-mock/${examSet.id}`));
  const subjects: PatSubjectCard[] = topics.map((subject, index) => ({
    id: subject.id,
    title: subject.title,
    desc: subject.desc,
    icon: subject.icon ?? '📘',
    href: `/courses/${course.id}/${subject.id}`,
    lessonCount: chapters(subject.id).length,
    sets: [...catalogs[index]].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/${subject.id}/exams/${examSet.id}`))
  }));
  const notesCard = (id: string) => {
    const lessons = PAT_LESSONS[id] ?? [];
    return lessons.length ? { href: `/courses/${course.id}/${id}/summary/${lessons[0].slug}`, count: chapters(id).length } : null;
  };
  return <PatCourseHomeClient miniMocks={miniMocks} subjects={subjects} practical={notesCard('practical')} interview={notesCard('interview')} />;
}
