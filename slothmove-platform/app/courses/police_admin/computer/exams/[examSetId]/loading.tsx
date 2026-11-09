import { PageLoader } from '@/components/loading/PageLoader';

export default function Loading() {
  return <PageLoader variant="exam" label="กำลังเตรียมชุดข้อสอบ…" hint="อีกไม่กี่วินาทีก็เริ่มทำได้" />;
}
