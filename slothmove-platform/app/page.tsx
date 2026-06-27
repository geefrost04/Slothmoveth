import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CourseGrid } from '@/components/CourseGrid';
import { Articles } from '@/components/Articles';
import { Why } from '@/components/Why';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { DonatePopup } from '@/components/DonatePopup';
import { VISIBLE_COURSES } from '@/courses/registry';
import { absoluteUrl, buildMetadata, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'เตรียมสอบราชการออนไลน์ฟรี ข้อสอบพร้อมเฉลย',
  description:
    'รวมคอร์สเตรียมสอบราชการฟรี ข้อสอบพร้อมเฉลย สรุปเนื้อหา และแนวข้อสอบหลายสายงานของ SlothMove สำหรับคนกำลังเตรียมสอบ ก.พ. และหน่วยงานราชการ',
  path: '/',
  keywords: ['คอร์สสอบราชการ', 'แนวข้อสอบราชการ', 'สรุปสอบราชการ', 'สอบ ก.พ. ฟรี'],
});

export default function PlatformHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.baseUrl}/#home`,
    name: 'คอร์สเตรียมสอบราชการออนไลน์ฟรี',
    url: siteConfig.baseUrl,
    description:
      'รวมคอร์สเตรียมสอบราชการฟรี ข้อสอบพร้อมเฉลย สรุปเนื้อหา และแนวข้อสอบหลายสายงานของ SlothMove',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: VISIBLE_COURSES.map((course, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: course.title,
        url: absoluteUrl(`/courses/${course.id}`),
      })),
    },
  };

  return (
    <div className="home-shell" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <CourseGrid />
        <Articles />
        <Why />
        <FAQ />
      </main>
      <Footer />
      <DonatePopup />
    </div>
  );
}
