export function Why() {
  return (
    <section className="why-section" id="why">
      <div className="container">
        <div className="why-header" style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>ทำไมต้อง SlothMove?</div>
          <h2 className="section-title">
            เราเชื่อว่าทุกคนมีสิทธิ์<br />
            เข้าถึงความรู้ดีๆ ฟรี
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            ไม่มีค่าใช้จ่าย ไม่มีเงื่อนไข เรียนได้ทุกที่ทุกเวลา
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon-wrap">🎯</div>
            <div className="why-card-content">
              <h3 className="why-title">เนื้อหาตรงประเด็น</h3>
              <p className="why-desc">
                สรุปเฉพาะส่วนที่มักออกสอบ คัดกรองแล้วว่าสำคัญจริง ไม่เสียเวลากับข้อมูลที่ไม่จำเป็น
                โฟกัสได้เร็ว ทบทวนได้ทันที
              </p>
              <div className="why-tags">
                <span className="why-tag"><span aria-hidden="true">✓</span> สรุปครบ ทุกวิชา</span>
              </div>
            </div>
            <div className="why-number">01</div>
          </div>

          <div className="why-card">
            <div className="why-icon-wrap">✏️</div>
            <div className="why-card-content">
              <h3 className="why-title">ข้อสอบพร้อมเฉลย</h3>
              <p className="why-desc">
                คลังข้อสอบ 1,000+ ข้อ พร้อมเฉลยและคำอธิบายละเอียดทุกข้อ ซ้อมได้ไม่จำกัด
                เข้าใจได้ด้วยตัวเองโดยไม่ต้องพึ่งติวเตอร์
              </p>
              <div className="why-tags">
                <span className="why-tag"><span aria-hidden="true">✓</span> เฉลยละเอียด ทุกข้อ</span>
              </div>
            </div>
            <div className="why-number">02</div>
          </div>

          <div className="why-card">
            <div className="why-icon-wrap">💸</div>
            <div className="why-card-content">
              <h3 className="why-title">ฟรี 100% ไม่มีเงื่อนไข</h3>
              <p className="why-desc">
                ไม่มีค่าสมัคร ไม่ล็อกเนื้อหา ไม่มีหมดอายุ เปิดให้เรียนได้ทันทีไม่ต้องรอ
                เพราะเราเชื่อว่าการศึกษาควรเข้าถึงได้ทุกคน
              </p>
              <div className="why-tags">
                <span className="why-tag"><span aria-hidden="true">✓</span> ฟรีตลอด ไม่มีหมดอายุ</span>
              </div>
            </div>
            <div className="why-number">03</div>
          </div>
        </div>
      </div>
    </section>
  );
}
