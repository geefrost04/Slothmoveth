function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="footer" data-analytics-section="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand-section">
            <a href="/" className="footer-brand-logo">
              <img
                src="/pic/slothmove_mascot.png"
                alt="SlothMove"
                width={28}
                height={28}
                style={{ objectFit: 'contain' }}
              />
              <strong>Sloth<span>Move</span></strong>
            </a>
            <span className="footer-brand-tagline">เรียนฟรี ทบทวนได้ทุกเวลา</span>
          </div>

          <div className="footer-navigation">
            <a href="/">หน้าแรก</a>
            <span className="separator">·</span>
            <a href="#courses">คอร์สเรียน</a>
            <span className="separator">·</span>
            <a
              href="https://www.facebook.com/profile.php?id=61589670089745"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="click_social"
              data-analytics-label="footer_facebook"
              data-analytics-section-name="footer"
              data-analytics-destination="facebook"
            >
              Facebook
            </a>
            <span className="separator">·</span>
            <a href="#navbar">กลับด้านบน ↑</a>
          </div>

          <div className="footer-copyright">
            <span>© 2026 SlothMove. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
