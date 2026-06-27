import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เงื่อนไขการใช้งาน | SlothMove',
  description: 'เงื่อนไขการใช้งานเว็บไซต์ SlothMove สำหรับผู้เรียนและผู้เข้าชม',
  alternates: { canonical: '/terms' }
};

export default function TermsPage() {
  return (
    <main className="container" style={{ paddingBlock: 'clamp(6rem, 8vw, 8rem)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
        <div className="section-label">Terms</div>
        <h1 className="section-title">เงื่อนไขการใช้งาน</h1>
        <p className="section-subtitle" style={{ margin: 0 }}>
          การใช้งานเว็บไซต์ SlothMove ถือว่าผู้ใช้ยอมรับเงื่อนไขพื้นฐานของการเข้าถึงเนื้อหาและการใช้งานระบบ
        </p>
        <p>
          เนื้อหาบนเว็บไซต์จัดทำขึ้นเพื่อช่วยเตรียมสอบและทบทวนความรู้ ผู้ใช้ควรตรวจสอบประกาศรับสมัคร,
          กฎหมาย, ระเบียบ, และข้อมูลจากหน่วยงานต้นทางอีกครั้งก่อนนำไปใช้อ้างอิงอย่างเป็นทางการ
        </p>
        <p>
          SlothMove ขอสงวนสิทธิ์ในการปรับปรุงเนื้อหา โครงสร้างเว็บไซต์ และบริการต่าง ๆ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
        </p>
      </div>
    </main>
  );
}
