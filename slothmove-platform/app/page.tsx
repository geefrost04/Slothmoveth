import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductShowcase } from '@/components/ProductShowcase';
import { Why } from '@/components/Why';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { FAQ_ITEMS } from '@/lib/faq';
import { isCourseOpen, VISIBLE_COURSES } from '@/courses/registry';
import { absoluteUrl, buildMetadata, serializeJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ติวสอบนายสิบตำรวจ ข้อสอบออนไลน์พร้อมเฉลย',
  description:
    'เตรียมสอบนายสิบตำรวจครบ 6 วิชา ฝึกข้อสอบออนไลน์ จับเวลา ดูเฉลยละเอียด ทำ Mock Test 150 ข้อ และวิเคราะห์จุดอ่อนรายวิชา',
  path: '/',
  keywords: ['ติวสอบนายสิบตำรวจ', 'แนวข้อสอบตำรวจ', 'ข้อสอบคณิตศาสตร์ตำรวจ', 'เตรียมสอบตำรวจ'],
});

export default function PlatformHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['CollectionPage', 'WebPage'],
    '@id': `${siteConfig.baseUrl}/#home`,
    name: 'SlothMoveTH แพลตฟอร์มเตรียมสอบนายสิบตำรวจ',
    url: siteConfig.baseUrl,
    description:
      'เตรียมสอบนายสิบตำรวจครบ 6 วิชา พร้อมข้อสอบออนไลน์ เฉลยละเอียด Mock Test 150 ข้อ และระบบวิเคราะห์ผล',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: VISIBLE_COURSES.filter((course) => isCourseOpen(course.id)).map((course, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: course.title,
        url: absoluteUrl(`/courses/${course.id}`),
      })),
    },
    about: {
      '@type': 'EducationalOccupationalProgram',
      name: 'เตรียมสอบนายสิบตำรวจ สายอำนวยการ',
      provider: { '@id': `${siteConfig.baseUrl}/#organization` },
      educationalCredentialAwarded: 'การเตรียมความพร้อมสอบนายสิบตำรวจ'
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };

  return (
    <div className="home-shell" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }} />
      <a href="#main-content" className="skip-link">
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <ProductShowcase />
        <Why />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
