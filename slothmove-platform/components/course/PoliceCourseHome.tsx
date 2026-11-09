import type { CourseConfig } from '@/lib/course-types';
import { getPublishedExamCatalog, type CatalogExamSet } from '@/lib/exam-data';
import { PoliceCourseHomeClient, type HomeSet, type HomeSubject } from './PoliceCourseHomeClient';

const SUBJECTS: { id: string; title: string; desc: string; hasSheet: boolean; drillKey: string }[] = [
  { id: 'math', title: 'ความรู้ทั่วไป', desc: 'อนุกรม อุปมาอุปไมย คณิตพื้นฐาน ความน่าจะเป็น สถิติ', hasSheet: true, drillKey: 'คณิต' },
  { id: 'thai', title: 'ภาษาไทย', desc: 'อ่านจับใจความ หลักภาษา การใช้คำ การสรุปและตีความ', hasSheet: false, drillKey: 'ภาษาไทย' },
  { id: 'english', title: 'ภาษาอังกฤษ', desc: 'Reading, Grammar, Vocabulary, Conversation', hasSheet: false, drillKey: 'ภาษาอังกฤษ' },
  { id: 'law', title: 'กฎหมาย', desc: 'รัฐธรรมนูญ แพ่ง อาญา และกฎหมายที่ประชาชนควรรู้', hasSheet: true, drillKey: 'กฎหมาย' },
  { id: 'computer', title: 'คอมพิวเตอร์', desc: 'ฮาร์ดแวร์ ซอฟต์แวร์ เครือข่าย และโปรแกรมสำนักงาน', hasSheet: true, drillKey: 'คอมพิวเตอร์' },
  { id: 'saraban', title: 'งานสารบรรณ', desc: 'ระเบียบสำนักนายกฯ 2526 และลักษณะที่ 54 สารบรรณตำรวจ', hasSheet: true, drillKey: 'สารบรรณ' }
];

async function safeCatalog(courseId: string, subjectId: string): Promise<CatalogExamSet[]> {
  try {
    return await getPublishedExamCatalog(courseId, subjectId);
  } catch {
    return [];
  }
}

function toSet(examSet: CatalogExamSet, href: string): HomeSet {
  return {
    id: examSet.id,
    title: examSet.title,
    href,
    questions: examSet.total_questions,
    minutes: examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.2)
  };
}

// Police course landing: Mock Test, Mini Mock, Mini Drill and subjects as separate sections.
export async function PoliceCourseHome({ course }: { course: CourseConfig }) {
  const [mockSets, miniSets, ...subjectCatalogs] = await Promise.all([
    safeCatalog(course.id, 'mock_test'),
    safeCatalog(course.id, 'mini_mock'),
    ...SUBJECTS.map((subject) => safeCatalog(course.id, subject.id))
  ]);

  const byId = (a: CatalogExamSet, b: CatalogExamSet) => a.id.localeCompare(b.id);
  const mocks = [...mockSets].sort(byId).map((examSet) => toSet(examSet, `/courses/${course.id}/mock-test/${examSet.id}`));
  const miniHref = (examSet: CatalogExamSet) => `/courses/${course.id}/mini-mock/${examSet.id}`;
  const miniMocks = miniSets.filter((examSet) => !examSet.title.includes('Mini Drill')).sort(byId).map((examSet) => toSet(examSet, miniHref(examSet)));
  const drills = miniSets.filter((examSet) => examSet.title.includes('Mini Drill'));

  const subjects: HomeSubject[] = SUBJECTS.map((subject, index) => ({
    id: subject.id,
    title: subject.title,
    desc: subject.desc,
    hasSheet: subject.hasSheet,
    href: `/courses/${course.id}/${subject.id}`,
    setCount: subjectCatalogs[index].length,
    drills: drills
      .filter((examSet) => examSet.title.includes(subject.drillKey))
      .sort(byId)
      .map((examSet) => toSet(examSet, miniHref(examSet)))
  }));

  return <PoliceCourseHomeClient courseId={course.id} mocks={mocks} miniMocks={miniMocks} subjects={subjects} />;
}
