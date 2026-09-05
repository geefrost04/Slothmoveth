import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubject, isCourseOpen } from '@/courses/registry';
import { getCourseKnowledgeData } from '@/courses/content-registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { CourseMaintenancePage } from '@/components/course/CourseMaintenancePage';
import { CourseSubjectPage } from '@/components/course/CourseSubjectPage';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl, serializeJsonLd, siteConfig } from '@/lib/seo';
import { getPublishedExamCatalog, type CatalogExamSet } from '@/lib/exam-data';
import { getSupabaseServer } from '@/lib/supabase-server';
import { getOwnedExamSetIds } from '@/lib/catalog-access';

export default async function SubjectPage({
  params
}: {
  params: Promise<{ course: string; subject: string }>;
}) {
  const { course: courseId, subject: subjectId } = await params;
  const result = getSubject(courseId, subjectId);
  if (!result) notFound();

  const { course, subject } = result;
  if (!isCourseOpen(course.id)) {
    return (
      <CourseLayout course={course}>
        <CourseMaintenancePage course={course} />
      </CourseLayout>
    );
  }
  const knowledge = getCourseKnowledgeData(course.id, subject.id);
  const hasExamCatalog = course.id === 'police_admin';
  let examSets: CatalogExamSet[] = [];
  if (hasExamCatalog) {
    try {
      examSets = await getPublishedExamCatalog(course.id, subject.id);
    } catch (error) {
      console.warn(`Unable to load the ${subject.id} exam catalog`, error);
    }
  }
  let ownedExamSetIds: string[] = [];

  if (examSets.length > 0) {
    try {
      const supabase = await getSupabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        ownedExamSetIds = await getOwnedExamSetIds(supabase, user.id, subject.id, examSets);
      }
    } catch (error) {
      console.warn('Unable to load subject entitlements', error);
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        name: `${subject.title} สำหรับสอบ${course.title}`,
        description: subject.desc,
        url: absoluteUrl(`/courses/${course.id}/${subject.id}`),
        inLanguage: 'th-TH',
        learningResourceType: ['ข้อสอบออนไลน์', 'ชีทสรุป', 'แบบฝึกหัด'],
        educationalUse: 'Exam preparation',
        provider: { '@id': `${siteConfig.baseUrl}/#organization` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: course.title, item: absoluteUrl(`/courses/${course.id}`) },
          { '@type': 'ListItem', position: 3, name: subject.title, item: absoluteUrl(`/courses/${course.id}/${subject.id}`) }
        ]
      }
    ]
  };

  return (
    <CourseLayout course={course}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <CourseSubjectPage
        course={course}
        subject={subject}
        knowledge={knowledge}
        examSets={examSets}
        ownedExamSetIds={ownedExamSetIds}
      />
    </CourseLayout>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ course: string; subject: string }>;
}): Promise<Metadata> {
  const { course: courseId, subject: subjectId } = await params;
  const result = getSubject(courseId, subjectId);

  if (!result) {
    return buildMetadata({
      title: 'ไม่พบวิชา',
      description: 'ไม่พบหน้าวิชาที่ต้องการ',
      path: `/courses/${courseId}/${subjectId}`,
      noIndex: true
    });
  }

  const { course, subject } = result;

  return buildMetadata({
    title: `ข้อสอบ${subject.title} ${course.title} พร้อมเฉลย`,
    description: `${subject.desc} ฝึกทำข้อสอบออนไลน์พร้อมเฉลย ทบทวนเนื้อหา และติดตามผลการฝึกในคอร์ส ${course.title} บน SlothMove`,
    path: `/courses/${course.id}/${subject.id}`,
    keywords: [course.title, subject.title, course.tagline, ...course.meta.keywords],
    noIndex: !isCourseOpen(course.id)
  });
}
