export function Footer() {
  return (
    <footer className="course-footer home-footer">
      <div className="container course-footer-inner">
        <div className="course-footer-brand">
          <img src="/pic/slothmove_mascot.png" alt="" aria-hidden="true" />
          <div>
            <strong>Sloth<span>Move</span></strong>
            <p>Being Better with little move · แพลตฟอร์มเรียนฟรีเตรียมสอบราชการ</p>
          </div>
        </div>
        <div className="course-footer-links">
          <a href="#courses">คอร์สเรียน</a>
          <a href="#faq">คำถามที่พบบ่อย</a>
          <a href="https://www.facebook.com/profile.php?id=61589670089745" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>
      <div className="container course-footer-bottom">
        <span>© 2026 SlothMove · เนื้อหาทุกอย่างให้เรียนฟรี</span>
        <a href="#top">กลับด้านบน ↑</a>
      </div>
    </footer>
  );
}
