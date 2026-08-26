import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { CourseGrid } from '@/components/CourseGrid';
import { Footer } from '@/components/Footer';
import { DonatePopup } from '@/components/DonatePopup';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'คอร์สเตรียมสอบราชการและนายสิบตำรวจ',
  description: 'รวมคอร์สเตรียมสอบราชการ เริ่มจากนายสิบตำรวจครบ 6 วิชา พร้อมชีทสรุป ชุดทดลองฟรี ข้อสอบพร้อมเฉลย และ Mock Test',
  path: '/courses',
});

export default function CoursesPage() {
  return (
    <div className="home-shell" id="top">
      <Navbar />
      <main id="main-content" className="pt-24 pb-16">
        <CourseGrid previewOnly={false} />
      </main>
      <Footer />
      <DonatePopup />
    </div>
  );
}
