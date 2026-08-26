import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourse, isCourseOpen } from '@/courses/registry';
import { CourseLayout } from '@/components/course/CourseLayout';
import { CourseHero } from '@/components/course/CourseHero';
import { SubjectCard } from '@/components/course/SubjectCard';
import { CourseLanding } from '@/components/course/CourseLanding';
import { CourseMaintenancePage } from '@/components/course/CourseMaintenancePage';
import { buildMetadata } from '@/lib/seo';
import { absoluteUrl, serializeJsonLd, siteConfig } from '@/lib/seo';

// Police exam catalog is database-backed; render at runtime while its data
// loader keeps the published catalog cached for five minutes.
export const dynamic = 'force-dynamic';

export default async function CoursePage({
  params
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();
  const isOpen = isCourseOpen(course.id);

  // Course-level migration banner — only show if explicitly marked
  // `migrated: false`. Courses that don't set the field default to
  // 'truthful unknown' (i.e. we treat missing as not-yet-migrated).
  const isMigrated = course.meta.migrated === true;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: `${course.title} ${course.tagline}`,
        description: course.meta.description,
        url: absoluteUrl(`/courses/${course.id}`),
        inLanguage: 'th-TH',
        provider: { '@id': `${siteConfig.baseUrl}/#organization` },
        about: course.subjects.map((subject) => subject.title),
        educationalLevel: 'เตรียมสอบราชการ'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: course.title, item: absoluteUrl(`/courses/${course.id}`) }
        ]
      }
    ]
  };

  return (
    <CourseLayout course={course}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      {!isOpen ? (
        <CourseMaintenancePage course={course} />
      ) : (
        <>
      {course.meta.landing ? <CourseLanding course={course} /> : <CourseHero course={course} />}

      {!course.meta.landing && !isMigrated && (
        <div style={{
          background: 'var(--color-amber-bg, #fdf3e8)',
          borderTop: '1px solid rgba(201, 125, 58, 0.2)',
          borderBottom: '1px solid rgba(201, 125, 58, 0.2)',
          padding: '16px 0'
        }}>
          <div className="container" style={{
            display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: 28 }}>🚧</div>
            <div style={{ flex: '1 1 400px', minWidth: 280 }}>
              <strong style={{ color: 'var(--color-amber, #c97d3a)', fontSize: 16 }}>
                คอร์สนี้ยังไม่พร้อมให้บริการ
              </strong>
              <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                {course.meta.migrationNote ||
                  'ข้อมูลวิชาและเกมของคอร์สนี้ยังอยู่ระหว่างการย้ายเข้าสู่แพลตฟอร์ม Next.js — counts ที่แสดงเป็นตัวเลขจากแผนงาน ไม่ใช่ข้อมูลจริง'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!course.meta.landing && (
        <section id="subjects" style={{ padding: '64px 0', background: 'var(--color-surface)' }}>
          <div className="container">
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
              color: 'var(--color-primary)', marginBottom: 8
            }}>
              วิชาทั้งหมด
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
              {isMigrated
                ? 'เลือกวิชาที่ต้องการเรียน — คลิกเพื่อดูเกมทั้งหมดที่รองรับ'
                : 'รายชื่อวิชาด้านล่างเป็นแผนงาน — คลิกเพื่อดูสถานะของแต่ละวิชา'}
            </p>
            <div className="subject-grid">
              {course.subjects.map((s) => (
                <SubjectCard
                  key={s.id}
                  courseId={course.id}
                  subject={s}
                  hideCount={course.meta.hideQuestionCounts}
                  disabled={!isMigrated}
                />
              ))}
            </div>
          </div>
        </section>
      )}
        </>
      )}
    </CourseLayout>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    return buildMetadata({
      title: 'ไม่พบคอร์ส',
      description: 'ไม่พบหน้าคอร์สที่ต้องการ',
      path: `/courses/${courseId}`,
      noIndex: true
    });
  }

  return buildMetadata({
    title: `${course.title} ${course.tagline} ข้อสอบพร้อมเฉลย`,
    description: course.meta.description,
    path: `/courses/${course.id}`,
    keywords: [
      course.title,
      course.tagline,
      course.category,
      course.type,
      ...course.meta.keywords
    ],
    noIndex: !isCourseOpen(course.id)
  });
}
