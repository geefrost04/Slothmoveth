'use client';

const FAQ_ITEMS = [
  {
    q: 'SlothMove คืออะไร และเรียนฟรีจริงไหม',
    a: 'SlothMove เป็นเว็บรวมสรุปและข้อสอบเพื่อเตรียมสอบราชการ คอร์สทั้งหมดเข้าถึงได้ฟรี ไม่มีค่าสมัครและไม่ล็อกเนื้อหา — ซ้อมทำข้อสอบได้ไม่จำกัดตลอดเวลา'
  },
  {
    q: 'ตอนนี้มีคอร์สอะไรบ้าง',
    a: 'ปัจจุบันมี 4 คอร์ส: นักวิเคราะห์นโยบายและแผน ปภ. (กรมป้องกันและบรรเทาสาธารณภัย) · นักวิเคราะห์นโยบายและแผน สป.อก. (กระทรวงอุตสาหกรรม) · นักวิเคราะห์นโยบายและแผน สป.กห. (กระทรวงกลาโหม) · ตำรวจสายอำนวยการและสนับสนุน (สำนักงานตำรวจแห่งชาติ) แต่ละคอร์สมีสรุปเนื้อหา + คลังข้อสอบพร้อมเฉลย'
  },
  {
    q: 'ข้อสอบอัปเดตบ่อยไหม',
    a: 'อัปเดตเนื้อหาตามกฎหมายและประกาศล่าสุด คอร์สที่อัปเดตล่าสุดจะแสดงก่อน ดูวันที่อัปเดตได้ที่หน้าแต่ละคอร์ส'
  },
  {
    q: 'ต้องมีบัญชีผู้ใช้ไหม',
    a: 'ไม่ต้องสมัครสมาชิก — เข้าเรียนและทำข้อสอบได้ทันทีผ่านเว็บ ข้อมูลการสอบถูกเก็บในเบราว์เซอร์ของคุณเท่านั้น'
  },
  {
    q: 'ขอให้เพิ่มคอร์สใหม่หรือข้อสอบเพิ่มได้ไหม',
    a: 'ส่งข้อเสนอมาทางแฟนเพจ Facebook ของ SlothMove ทีมจะพิจารณาตามความต้องการและแผนการผลิตเนื้อหา'
  },
  {
    q: 'ต้องการสนับสนุน SlothMove ทำอย่างไร',
    a: 'สแกน QR พร้อมเพย์ในส่วน "เลี้ยงกาแฟ" บนเว็บ หรือกดติดตาม Facebook และแชร์ให้เพื่อนที่กำลังเตรียมสอบราชการ'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="faq-section" data-analytics-section="faq">
      <div className="container">
        <div className="faq-section-head" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>FAQ</div>
          <h2 className="section-title">คำถามที่พบบ่อย</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            เรื่องคอร์ส ข้อสอบ และการสนับสนุนโปรเจกต์
          </p>
        </div>

        <div className="faq-inner">
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              className="faq-item"
              open={i === 0}
              data-analytics-faq={item.q}
            >
              <summary>
                {item.q}
                <span className="arrow" aria-hidden>⌄</span>
              </summary>
              <div id={`faq-${i}`} className="faq-answer">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
