import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว | SlothMove',
  description: 'นโยบายความเป็นส่วนตัวของ SlothMove สำหรับผู้ใช้งานเว็บไซต์และบริการเรียนออนไลน์',
  alternates: { canonical: '/privacy' }
};

export default function PrivacyPage() {
  return (
    <main className="container" style={{ paddingBlock: 'clamp(6rem, 8vw, 8rem)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
        <div className="section-label">Privacy</div>
        <h1 className="section-title">นโยบายความเป็นส่วนตัว</h1>
        <p className="section-subtitle" style={{ margin: 0 }}>
          SlothMove เก็บข้อมูลเท่าที่จำเป็นต่อการวิเคราะห์การใช้งานเว็บไซต์และการพัฒนาประสบการณ์ผู้ใช้
        </p>
        <p>
          เว็บไซต์นี้อาจใช้เครื่องมือวิเคราะห์การใช้งาน เช่น Google Analytics เพื่อดูหน้าที่มีผู้เข้าชม,
          ปุ่มที่ถูกกด, และระยะเวลาการใช้งานโดยรวม ข้อมูลดังกล่าวถูกใช้เพื่อปรับปรุงเนื้อหาและการใช้งานเว็บไซต์
          โดยไม่มุ่งระบุตัวตนของผู้ใช้เป็นรายบุคคล
        </p>
        <p>
          หากมีการเปลี่ยนแปลงนโยบายฉบับนี้ SlothMove จะอัปเดตเนื้อหาในหน้านี้ให้เป็นปัจจุบันตามความเหมาะสม
        </p>
      </div>
    </main>
  );
}
