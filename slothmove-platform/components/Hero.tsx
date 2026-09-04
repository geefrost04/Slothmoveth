import { TrackedLink } from '@/components/analytics/TrackedLink';

export function Hero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <h1 className="home-hero-title" id="home-hero-title">
              <span>เตรียมสอบนายสิบตำรวจ สายอำนวยการ</span>
              <span>ครบ 6 วิชา ให้เป็นระบบ</span>
            </h1>
            <p className="home-hero-desc">
              เริ่มทำชุดทดลองฟรีได้ทันที ฝึกข้อสอบตำรวจสายอำนวยการออนไลน์ จับเวลา ดูเฉลยละเอียด และกลับมาฝึกจุดที่พลาดได้
            </p>
            <div className="home-hero-actions">
              <TrackedLink
                href="/courses/police_admin"
                className="home-btn-primary"
                eventName="start_free_practice_click"
                parameters={{ location: 'home_hero' }}
              >
                ทดลองทำข้อสอบฟรี
              </TrackedLink>
              <TrackedLink href="/register" className="home-btn-secondary" eventName="register_cta_click" parameters={{ location: 'home_hero' }}>สมัครเพื่อบันทึกผล</TrackedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
