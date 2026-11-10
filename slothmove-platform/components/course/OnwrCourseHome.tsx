import type { CourseConfig } from '@/lib/course-types';
import { getPublishedExamCatalog, type CatalogExamSet } from '@/lib/exam-data';
import { ONWR_LESSONS } from '@/components/study-sheets/onwrLessonData';
import { OnwrCourseHomeClient, type OnwrSet, type OnwrSubjectCard } from './OnwrCourseHomeClient';

async function safeCatalog(courseId: string, subjectId: string): Promise<CatalogExamSet[]> {
  try {
    return await getPublishedExamCatalog(courseId, subjectId);
  } catch {
    return [];
  }
}

// Landing for the ONWR policy-and-plan analyst course: exam facts and key dates, Mini Mock, Mini Drill,
// then the 9 written-exam topics (notes + sets) grouped as in the announcement.
export async function OnwrCourseHome({ course }: { course: CourseConfig }) {
  // Notes-only sections (pre-exam review, interview prep) get their own cards, not topic tiles.
  const topics = course.subjects.filter((subject) => subject.id !== 'review' && subject.id !== 'interview');
  const [miniCatalog, drillCatalog, ...catalogs] = await Promise.all([
    safeCatalog(course.id, 'mini_mock'),
    safeCatalog(course.id, 'mini_drill'),
    ...topics.map((subject) => safeCatalog(course.id, subject.id))
  ]);
  const toSet = (examSet: CatalogExamSet, href: string): OnwrSet => ({
    id: examSet.id,
    title: examSet.title,
    href,
    questions: examSet.total_questions,
    minutes: examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.2)
  });
  const byId = (a: CatalogExamSet, b: CatalogExamSet) => a.id.localeCompare(b.id);

  const miniMocks = [...miniCatalog].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/mini-mock/${examSet.id}`));
  const drills = [...drillCatalog].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/mini-drill/${examSet.id}`));
  const subjects: OnwrSubjectCard[] = topics.map((subject, index) => {
    const lessons = ONWR_LESSONS[subject.id] ?? [];
    return {
      id: subject.id,
      title: subject.title,
      desc: subject.desc,
      icon: subject.icon ?? '📘',
      href: `/courses/${course.id}/${subject.id}`,
      summaryHref: lessons.length ? `/courses/${course.id}/${subject.id}/summary/${lessons[0].slug}` : null,
      lessonCount: lessons.filter((lesson) => lesson.sectionType === 'chapter').length,
      sets: [...catalogs[index]].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/${subject.id}/exams/${examSet.id}`))
    };
  });
  const review = ONWR_LESSONS.review ?? [];
  const reviewHref = review.length ? `/courses/${course.id}/review/summary/${review[0].slug}` : null;
  const interview = ONWR_LESSONS.interview ?? [];
  const interviewHref = interview.length ? `/courses/${course.id}/interview/summary/${interview[0].slug}` : null;
  return <OnwrCourseHomeClient miniMocks={miniMocks} drills={drills} subjects={subjects} reviewHref={reviewHref} reviewCount={review.length} interviewHref={interviewHref} interviewCount={interview.filter((lesson) => lesson.sectionType === 'chapter').length} />;
}
