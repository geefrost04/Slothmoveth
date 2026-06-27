export function Hero() {
  return (
    <section className="home-hero">
      <div className="container">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <div className="home-hero-badge">
              เรียนฟรีทุกคอร์ส · คอร์สใหม่ทยอยอัปเดต
            </div>
            <div className="home-hero-kicker">แพลตฟอร์มเตรียมสอบราชการออนไลน์</div>
            <h1 className="home-hero-title">
              <span>Being Better</span>
              <span>with little move</span>
              <small>SlothMove</small>
            </h1>
            <p className="home-hero-desc">
              ก้าวเล็กๆ ที่สม่ำเสมอ คือจุดเริ่มต้นของความสำเร็จที่ยิ่งใหญ่
              เรียนฟรี เตรียมสอบได้ทุกที่ทุกเวลา
            </p>
            <div className="home-hero-actions">
              <a href="#courses" className="home-btn-primary">
                เริ่มเรียนเลย <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="home-hero-mascot">
            <img
              src="/pic/slothmove_hero_study.png"
              alt="สลอธนักเรียนสอบราชการ SlothMove — เรียนฟรี เตรียมสอบราชการแบบเข้าใจง่าย"
              width={1100}
              height={614}
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
