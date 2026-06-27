export function Hero() {
  return (
    <section className="hero" data-analytics-section="hero">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot" />
              เปิดให้เรียนฟรี · PAB พร้อมแล้ว · คอร์สอื่นทยอยอัปเดต
            </div>
            <h1 className="hero-title">
              เตรียมสอบราชการฟรี
              <br />
              กับ&nbsp;<span className="accent">SlothMove</span>
            </h1>
            <p className="hero-subtitle">
              ก้าวเล็กๆ ที่สม่ำเสมอ คือจุดเริ่มต้นของความสำเร็จที่ยิ่งใหญ่
              <br />
              เรียนฟรี เตรียมสอบได้ทุกที่ทุกเวลา
            </p>
            <div className="hero-actions">
              <a
                href="#courses"
                className="btn-primary"
                data-analytics-event="click_cta"
                data-analytics-label="hero_start_learning"
                data-analytics-section-name="hero"
                data-analytics-destination="#courses"
              >
                เริ่มเรียนเลย
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="hero-mascot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pic/slothmove_hero_study.png"
              alt="สลอธนักเรียนสอบราชการ SlothMove — เรียนฟรี เตรียมสอบราชการแบบเข้าใจง่าย"
              width={768}
              height={512}
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
