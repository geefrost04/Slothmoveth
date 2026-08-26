import type { Metadata } from 'next';
import Link from 'next/link';
import { CourseLayout } from '@/components/course/CourseLayout';
import { PoliceMockTestCatalog } from '@/components/course/PoliceMockTestCatalog';
import { getCourse } from '@/courses/registry';
import { buildMetadata } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { absoluteUrl, siteConfig } from '@/lib/seo';
import styles from '@/components/course/PoliceMockTestCatalog.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Mock Test นายสิบตำรวจ 150 ข้อ พร้อมเฉลย',
  description: 'รวม Mock Test นายสิบตำรวจ 6 วิชา ชุดละ 150 ข้อ จับเวลา 180 นาที พร้อมเฉลยละเอียดและวิเคราะห์คะแนนแยกรายวิชา',
  path: '/courses/police_admin/mock-test',
  keywords: ['Mock Test นายสิบตำรวจ', 'ข้อสอบตำรวจ 150 ข้อ', 'ข้อสอบจำลองนายสิบตำรวจ', 'แนวข้อสอบตำรวจพร้อมเฉลย']
});

export default function PoliceMockTestCatalogPage() {
  const course = getCourse('police_admin');
  if (!course) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Mock Test นายสิบตำรวจ 150 ข้อ',
        url: absoluteUrl('/courses/police_admin/mock-test'),
        description: 'ชุดข้อสอบจำลองนายสิบตำรวจ 6 วิชา จับเวลา 180 นาที พร้อมเฉลยและวิเคราะห์ผล',
        isPartOf: { '@id': `${siteConfig.baseUrl}/#website` },
        about: { '@type': 'Thing', name: 'การสอบนายสิบตำรวจ' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'นายสิบตำรวจ', item: absoluteUrl('/courses/police_admin') },
          { '@type': 'ListItem', position: 3, name: 'Mock Test', item: absoluteUrl('/courses/police_admin/mock-test') }
        ]
      }
    ]
  };

  return (
    <CourseLayout course={course}>
      <StructuredData data={jsonLd} />
      <div className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href="/courses/police_admin">สนามสอบ</Link><span>›</span><strong>Mock Test</strong>
          </nav>
          <header className={styles.pageHero}>
            <div>
              <span>FULL EXAM SIMULATION</span>
              <h1>Mock Test จำลองสนามจริง</h1>
              <p>เลือกซื้อแยกเป็นรายชุด ทุกชุดรวม 6 วิชาตามสัดส่วนสนามสอบ พร้อมเฉลยและผลวิเคราะห์แยกรายวิชา</p>
            </div>
            <div className={styles.pageStats}>
              <span><strong>150</strong>ข้อ</span>
              <span><strong>180</strong>นาที</span>
              <span><strong>6</strong>วิชา</span>
            </div>
          </header>
          <main className={styles.pageBody}>
            <section className={styles.guide}>
              <span>รูปแบบการสอบ</span>
              <h2>ซื้อครั้งเดียว ทำซ้ำได้ตลอด</h2>
              <p>เวลาจะเดินต่อเนื่อง 180 นาที ระบบบันทึกคำตอบให้อัตโนมัติ และสรุปจุดอ่อนหลังส่งข้อสอบ</p>
              <ul>
                <li>ความรู้ทั่วไป 20 ข้อ</li><li>ภาษาไทย 20 ข้อ</li><li>คอมพิวเตอร์ 40 ข้อ</li>
                <li>งานสารบรรณ 30 ข้อ</li><li>กฎหมาย 25 ข้อ</li><li>ภาษาอังกฤษ 15 ข้อ</li>
              </ul>
            </section>
            <PoliceMockTestCatalog courseId="police_admin" />
          </main>
        </div>
      </div>
    </CourseLayout>
  );
}
