import type { Metadata } from 'next';
import { ExamSystemPausedNotice } from '@/components/course/ExamSystemPausedNotice';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ข้อสอบจำลอง',
  description: 'หน้าข้อสอบจำลองสำหรับผู้ใช้งานในแพลตฟอร์ม SlothMove',
  noIndex: true
});

export default function OcscMockTestPage() {
  return <ExamSystemPausedNotice />;
}
