export function Hero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <h1 className="home-hero-title" id="home-hero-title">
              <span>เตรียมสอบนายสิบตำรวจ</span>
              <span>ครบ 6 วิชา ให้เป็นระบบ</span>
            </h1>
            <p className="home-hero-desc">
              ฝึกข้อสอบตำรวจออนไลน์ จับเวลา ดูเฉลยละเอียด ทำ Mock Test 150 ข้อ และกลับมาฝึกจุดที่พลาดได้
            </p>
            <div className="home-hero-actions">
              <a href="#exam-selection" className="home-btn-primary">
                เริ่มเลือกสนามสอบ
              </a>
              <a href="#why-slothmove" className="home-btn-secondary">
                ดูวิธีใช้งาน
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
