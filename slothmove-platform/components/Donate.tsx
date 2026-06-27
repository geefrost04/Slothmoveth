'use client';

export function Donate() {
  function openDonate() {
    window.dispatchEvent(new CustomEvent('slothmove:donate'));
  }

  return (
    <section id="donate" className="donate-section">
      <div className="deco-1" />
      <div className="deco-2" />
      <div className="deco-3" />
      <div className="container">
        <div className="donate-inner">
          <div className="donate-label">เลี้ยงกาแฟผมหน่อยครับ</div>
          <h2 className="donate-title">
            ช่วยกันทำให้
            <br />
            <span className="highlight">SlothMove เดินต่อไป</span>
          </h2>
          <p className="donate-desc">
            SlothMove ตั้งใจผลิตเนื้อหาให้ทุกคนเรียนฟรี
            <br />
            หากได้รับประโยชน์ ร่วมสนับสนุนได้ตามกำลังครับ
          </p>
          <button type="button" className="donate-cta" onClick={openDonate}>
            เปิด QR สำหรับสนับสนุน
          </button>
        </div>
      </div>
    </section>
  );
}