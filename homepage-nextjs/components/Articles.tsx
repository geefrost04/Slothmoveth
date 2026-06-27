export function Articles() {
  return (
    <section id="articles" className="articles-section" data-analytics-section="articles">
      <div className="container">
        <div className="articles-header">
          <div>
            <div className="section-label">รับสมัครงาน</div>
            <h2 className="section-title">ข่าวรับสมัครงานราชการ</h2>
            <p className="section-subtitle">รวมประกาศรับสมัครงานราชการล่าสุดจากทุกหน่วยงาน</p>
          </div>
          <a
            href="/rat-ngan"
            className="section-link"
            data-analytics-event="click_view_all_jobs"
            data-analytics-label="articles_view_all_jobs"
            data-analytics-section-name="articles"
            data-analytics-destination="/rat-ngan"
          >
            ดูตำแหน่งงานทั้งหมด
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="articles-grid">
          <div className="article-card coming-soon-card">
            <div className="article-image">
              <div
                className="placeholder"
                style={{ background: 'linear-gradient(135deg, #fef3ec, #fde8d8)' }}
              >
                📖
              </div>
            </div>
            <div className="article-body">
              <div className="article-meta">
                <span
                  className="article-tag"
                  style={{
                    background: 'var(--color-amber-bg)',
                    color: 'var(--color-accent)'
                  }}
                >
                  เร็วๆ นี้
                </span>
              </div>
              <h3 className="article-title" style={{ color: 'var(--color-text)' }}>
                เคล็ดลับเตรียมสอบราชการ
              </h3>
              <div className="article-footer">
                <div className="article-date" style={{ color: 'var(--color-text-muted)' }}>
                  กำลังเตรียมเนื้อหา · ติดตามได้ที่เพจ SlothMove
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
