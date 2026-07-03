import Link from 'next/link';

export function ExamSystemPausedNotice() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
        background:
          'radial-gradient(circle at top, rgba(212,167,44,0.18), transparent 32%), linear-gradient(180deg, #fffaf0 0%, #fffdf8 100%)'
      }}
    >
      <div
        style={{
          width: 'min(100%, 820px)',
          position: 'relative',
          padding: '28px'
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            background: 'radial-gradient(circle at top, rgba(180,138,62,0.16), transparent 58%), rgba(18, 24, 38, 0.08)',
            filter: 'blur(6px)'
          }}
        />
        <div
          role="alert"
          aria-live="polite"
          style={{
            position: 'relative',
            padding: '32px clamp(20px, 4vw, 40px)',
            borderRadius: 28,
            border: '1px solid rgba(180, 138, 62, 0.24)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,248,239,0.98))',
            boxShadow: '0 24px 60px rgba(17, 24, 39, 0.12)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 36,
              padding: '0 16px',
              borderRadius: 999,
              border: '1px solid rgba(122, 90, 0, 0.12)',
              background: '#fffdf5',
              color: '#7a5a00',
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 18
            }}
          >
            Sloth x OCSC
          </div>
          <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 14 }}>🚧</div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 34,
              padding: '0 14px',
              borderRadius: 999,
              background: 'rgba(180, 138, 62, 0.14)',
              color: 'var(--color-accent)',
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: '0.08em',
              marginBottom: 16
            }}
          >
            TEMPORARILY UNAVAILABLE
          </div>
          <h1
            style={{
              margin: '0 0 12px',
              color: '#7a5a00',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900,
              lineHeight: 1.08
            }}
          >
            ระบบทำข้อสอบกำลังปรับปรุง
          </h1>
          <p
            style={{
              margin: '0 auto',
              maxWidth: 520,
              color: '#5b6475',
              fontSize: 16,
              lineHeight: 1.8
            }}
          >
            ขอปิดใช้งานชั่วคราวก่อนนะครับ ตอนนี้กำลังปรับปรุงระบบทำข้อสอบอยู่
            รออีกไม่นาน แล้วจะกลับมาเปิดให้ใช้งานตามปกติ
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 24
            }}
          >
            <Link
              href="/courses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 48,
                padding: '0 18px',
                borderRadius: 999,
                background: '#7a5a00',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 800
              }}
            >
              กลับไปเลือกคอร์ส
            </Link>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 48,
                padding: '0 18px',
                borderRadius: 999,
                border: '1px solid rgba(122, 90, 0, 0.18)',
                background: '#fff',
                color: '#1f2937',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
