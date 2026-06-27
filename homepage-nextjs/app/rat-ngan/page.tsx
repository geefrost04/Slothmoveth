import type { Metadata } from 'next';
import { FACEBOOK_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ข่าวรับสมัครงานราชการ | SlothMove',
  description: 'ติดตามข่าวรับสมัครงานราชการและอัปเดตล่าสุดจาก SlothMove',
  alternates: { canonical: '/rat-ngan' },
  robots: { index: false, follow: true }
};

export default function JobsPage() {
  return (
    <main className="container" style={{ paddingBlock: 'clamp(6rem, 8vw, 8rem)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
        <div className="section-label">Jobs</div>
        <h1 className="section-title">ข่าวรับสมัครงานราชการ</h1>
        <p className="section-subtitle" style={{ margin: 0 }}>
          หน้ารวมประกาศกำลังเตรียมระบบอยู่ ระหว่างนี้สามารถติดตามอัปเดตได้ทาง Facebook ของ SlothMove
        </p>
        <p>
          เรากำลังจัดทำหน้ารวมประกาศรับสมัครให้ค้นหาและติดตามได้ง่ายขึ้น เมื่อหน้าเต็มพร้อมใช้งานจะอัปเดตผ่านช่องทางหลักของโครงการ
        </p>
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: 'fit-content' }}>
          ไปที่ Facebook ของ SlothMove
        </a>
      </div>
    </main>
  );
}
