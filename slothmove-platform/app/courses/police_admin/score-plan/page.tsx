import type { Metadata } from 'next';
import Link from 'next/link';
import { CourseLayout } from '@/components/course/CourseLayout';
import { PoliceScorePlanner } from '@/components/course/PoliceScorePlanner';
import { getCourse } from '@/courses/registry';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'วางแผนคะแนนสอบนายสิบตำรวจ ต้องได้กี่คะแนนถึงติด',
  description: 'ตั้งเป้าคะแนนสอบนายสิบตำรวจสายอำนวยการ ดูว่าต้องได้กี่คะแนนถึงผ่านเกณฑ์และติดอันดับ แบ่งคะแนนรายวิชา 6 วิชา เทียบกับคะแนน Mock Test ของคุณ ฟรี',
  path: '/courses/police_admin/score-plan',
  keywords: ['คะแนนสอบนายสิบตำรวจ', 'นายสิบตำรวจต้องได้กี่คะแนน', 'เกณฑ์ผ่านสอบตำรวจ', 'คะแนนติดตำรวจสายอำนวยการ']
});

// Score planner: pick a target, split it across the 6 subjects, check the 60% rule for both parts.
export default function PoliceScorePlanPage() {
  const course = getCourse('police_admin');
  if (!course) return null;
  return (
    <CourseLayout course={course}>
      <div className={styles.page}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="breadcrumb">
            <Link href="/courses/police_admin">นายสิบตำรวจ</Link><span>›</span><strong>วางแผนคะแนน</strong>
          </nav>
          <header className={styles.hero}>
            <span>SCORE PLANNER</span>
            <h1>วางแผนคะแนน<br />ต้องได้กี่ข้อถึงติด?</h1>
            <p>ตั้งเป้าคะแนน แล้วดูว่าแต่ละวิชาต้องตอบถูกกี่ข้อ ผิดได้กี่ข้อ ผ่านเกณฑ์ภาค ก และภาค ข ไหม และอยู่ช่วงอันดับไหนเมื่อเทียบกับสถิติรอบก่อน</p>
          </header>
          <PoliceScorePlanner />
        </div>
      </div>
    </CourseLayout>
  );
}
