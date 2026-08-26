import { ImageResponse } from 'next/og';

export const alt = 'SlothMove Police Exam Preparation with online practice tests';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 82px',
          color: '#111827',
          background: 'linear-gradient(135deg, #fffdfa 0%, #f8fafc 58%, #f6e9eb 100%)',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 42, fontWeight: 800 }}>
          <span>SLOTH</span><span style={{ color: '#8f1f2d' }}>MOVE</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 980 }}>
          <div style={{ color: '#8f1f2d', fontSize: 28, fontWeight: 700 }}>ROYAL THAI POLICE EXAM PREP</div>
          <div style={{ fontSize: 62, lineHeight: 1.12, fontWeight: 800 }}>PRACTICE ALL 6 SUBJECTS</div>
          <div style={{ color: '#475569', fontSize: 30 }}>150Q Mock Tests  /  Timed Practice  /  Detailed Solutions</div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 22, color: '#64748b' }}>
          <span>slothmoveth.com</span><span>/</span><span>Practice with a system. Enter the exam with confidence.</span>
        </div>
      </div>
    ),
    size
  );
}
