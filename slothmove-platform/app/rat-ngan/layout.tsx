import type { Metadata } from 'next';
import { JOBS_DATA } from '@/data/jobs';
import { getActiveOcscJobs } from '@/lib/jobs-board';
import { absoluteUrl, buildMetadata, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'งานราชการที่เปิดรับสมัครล่าสุด',
  description:
    'รวมงานราชการและประกาศรับสมัครที่ยังเปิดรับจาก OCSC ค้นหาตามตำแหน่ง หน่วยงาน ประเภทงาน และวุฒิการศึกษาได้ในหน้าเดียว',
  path: '/rat-ngan',
  keywords: ['งานราชการ', 'สมัครงานราชการ', 'ประกาศรับสมัครราชการ', 'OCSC', 'หางานราชการ'],
});

export default function RatNganLayout({ children }: { children: React.ReactNode }) {
  const activeJobs = getActiveOcscJobs(JOBS_DATA, new Date());
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.baseUrl}/rat-ngan#page`,
    name: 'งานราชการที่เปิดรับสมัครล่าสุด',
    url: absoluteUrl('/rat-ngan'),
    description:
      'รวมงานราชการและประกาศรับสมัครที่ยังเปิดรับจาก OCSC พร้อมตัวกรองตามตำแหน่ง หน่วยงาน ประเภทงาน และวุฒิการศึกษา',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: activeJobs.length,
      itemListElement: activeJobs.slice(0, 12).map((job, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: job['ตำแหน่ง'],
        url: absoluteUrl('/rat-ngan'),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
