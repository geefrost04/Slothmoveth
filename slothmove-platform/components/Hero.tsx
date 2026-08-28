import { TrackedLink } from '@/components/analytics/TrackedLink';

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
              เริ่มทำชุดทดลองฟรีได้ทันที ฝึกข้อสอบตำรวจออนไลน์ จับเวลา ดูเฉลยละเอียด และกลับมาฝึกจุดที่พลาดได้
            </p>
            <div className="home-hero-actions">
              <TrackedLink
                href="/register"
                className="home-btn-primary"
                eventName="register_cta_click"
                parameters={{ location: 'home_hero' }}
              >
                สมัครฟรี เริ่มฝึกได้เลย
              </TrackedLink>
              <a href="#exam-selection" className="home-btn-secondary">
                เริ่มเลือกสนามสอบ
              </a>
              <a href="#why-slothmove" className="home-btn-secondary home-hero-howto">
                ดูวิธีใช้งาน
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
