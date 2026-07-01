import Image from 'next/image';

export function Hero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <div className="home-hero-badge">
              เรียนฟรีทุกคอร์ส · คอร์สใหม่ทยอยอัปเดต
            </div>
            <div className="home-hero-kicker">แพลตฟอร์มเตรียมสอบราชการออนไลน์</div>
            <h1 className="home-hero-title" id="home-hero-title">
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

          <div className="home-hero-mascot" aria-hidden="true">
            <Image
              src="/pic/slothmove_hero_study.png"
              alt=""
              width={1100}
              height={614}
              priority
              fetchPriority="high"
              sizes="(max-width: 800px) min(100vw - 40px, 320px), 480px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
