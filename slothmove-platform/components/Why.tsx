export function Why() {
  return (
    <section className="why-section" id="why-slothmove">
      <div className="container">
        <div className="why-header">
          <h2 className="section-title">ทำไมต้อง SlothMove?</h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon-wrap">⏱</div>
            <div className="why-card-content">
              <h3 className="why-title">จับเวลาสอบจริง</h3>
              <p className="why-desc">เสมือนสนามสอบจริง</p>
            </div>
          </div>

          <div className="why-card">
            <div className="why-icon-wrap">📊</div>
            <div className="why-card-content">
              <h3 className="why-title">ดูคะแนนทันที</h3>
              <p className="why-desc">รู้ผลหลังทำข้อสอบ</p>
            </div>
          </div>

          <div className="why-card">
            <div className="why-icon-wrap">🔄</div>
            <div className="why-card-content">
              <h3 className="why-title">ทำซ้ำได้ไม่จำกัด</h3>
              <p className="why-desc">กลับมาฝึกจุดที่พลาดได้</p>
            </div>
          </div>

          <div className="why-card">
            <div className="why-icon-wrap">💡</div>
            <div className="why-card-content">
              <h3 className="why-title">เฉลยละเอียด</h3>
              <p className="why-desc">เข้าใจวิธีคิด ไม่ใช่แค่รู้คำตอบ</p>
            </div>
          </div>
        </div>

        <div className="home-start-cta">
          <div>
            <h2>พร้อมเริ่มฝึกแล้วหรือยัง?</h2>
            <p>เลือกสนามสอบที่ต้องการ แล้วเริ่มจากชุดแรกได้เลย</p>
          </div>
          <a href="#exam-selection" className="home-btn-primary">เลือกสนามสอบ</a>
        </div>
      </div>
    </section>
  );
}
