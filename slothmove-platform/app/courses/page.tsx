import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { CourseGrid } from '@/components/CourseGrid';
import { Footer } from '@/components/Footer';
import { DonatePopup } from '@/components/DonatePopup';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'คอร์สเรียนทั้งหมด - SlothMove',
  description: 'คอร์สเรียนเตรียมสอบราชการทั้งหมด สรุปเนื้อหาตรงประเด็น ข้อสอบพร้อมเฉลย เข้าเรียนฟรีไม่มีค่าใช้จ่าย',
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
