'use client';

import Link from 'next/link';
import { useMatchGame, type MatchItem } from './useMatchGame';

export function AuthorityGame({
  items,
  courseId = 'police_admin',
  subjectId = 'saraban'
}: {
  items: MatchItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const game = useMatchGame(items);
  const { roundItems, rightOrder, picks, matched, wrong, score, round, totalRounds, done, pick, reset } = game;
  const isLaw = subjectId === 'law';
  const badgeLabel = isLaw ? 'Law Authority' : 'Saraban Authority';
  const pageTitle = isLaw ? 'จับคู่ศาล หน่วยงาน และอำนาจหน้าที่' : 'จับคู่หน่วยงานกับหน้าที่ให้แม่น';
  const pageSubtitle = isLaw
    ? 'ฝึกแยกบทบาทของศาล หน่วยงานรัฐ คณะกรรมการ และผู้มีอำนาจตามกฎหมาย ให้เห็นภาพชัดก่อนเจอโจทย์สลับตัวเลือกในสนามสอบ'
    : 'โจทย์ชุดนี้เน้นผู้รับผิดชอบ อำนาจหน้าที่ และบทบาทตามระเบียบงานสารบรรณ โดยเฉพาะจุดที่ข้อสอบชอบสลับระหว่างผู้รักษาการ สารบรรณกลาง หน่วยเก็บ และหัวหน้าส่วนราชการ';
  const leftLabel = isLaw ? 'ศาล / หน่วยงาน / ผู้มีอำนาจ' : 'หน่วยงาน / ผู้รับผิดชอบ';
  const rightLabel = isLaw ? 'อำนาจหน้าที่ / ขอบเขตความรับผิดชอบ' : 'หน้าที่ / ภารกิจ';
  const leftChip = isLaw ? 'ผู้มีอำนาจ' : 'ฝั่งหน่วยงาน';
  const rightChip = isLaw ? 'หน้าที่ตามกฎหมาย' : 'ฝั่งภารกิจ';
  const completionSubtitle = isLaw
    ? 'รอบนี้คุณทบทวนคู่ศาล หน่วยงาน และอำนาจหน้าที่ตามกฎหมายครบทุกชุดแล้ว'
    : 'รอบนี้คุณทบทวนคู่คำสำคัญของงานสารบรรณตำรวจครบทุกชุดแล้ว';

  if (!items.length) {
    return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีข้อมูล</p>;
  }

  const totalPairs = items.length;
  const percent = totalPairs ? Math.round((score / totalPairs) * 100) : 0;

  if (done) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <style>{authorityStyles}</style>
        <div className="ag-shell ag-result-card">
          <div className="ag-topbar" />
          <div className="ag-badge">Authority Complete</div>
          <div className="ag-result-icon">🏛️</div>
          <h2 className="ag-title">จับคู่อำนาจหน้าที่ครบแล้ว</h2>
          <p className="ag-subtitle">{completionSubtitle}</p>

          <div className="ag-result-grid">
            <div className="ag-stat-card">
              <strong>{score}/{totalPairs}</strong>
              <span>คู่ที่จับถูก</span>
            </div>
            <div className="ag-stat-card">
              <strong>{percent}%</strong>
              <span>ความแม่นยำ</span>
            </div>
            <div className="ag-stat-card">
              <strong>{totalRounds}</strong>
              <span>จำนวนรอบ</span>
            </div>
          </div>

          <div className="ag-action-row">
            <button
              onClick={reset}
              className="ag-primary-btn"
            >
              เริ่มใหม่อีกครั้ง
            </button>
            <Link href={`/courses/${courseId}/${subjectId}/practices`} className="ag-secondary-btn">
              กลับไปลานฝึก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 ${isLaw ? 'ag-law-mode' : ''}`}>
      <style>{authorityStyles}</style>

      <div className="ag-shell ag-hero">
        <div className="ag-topbar" />
        <div className="ag-hero-watermark" aria-hidden="true">
          {isLaw ? '§' : '↔'}
        </div>
        <div className="ag-hero-main">
          <div className="ag-hero-copy">
            <span className="ag-badge">{badgeLabel}</span>
            <h1 className="ag-title">{pageTitle}</h1>
            <p className="ag-subtitle">{pageSubtitle}</p>
          </div>

          <div className="ag-side-panel">
            <div className="ag-side-stat">
              <strong>{round + 1}/{totalRounds}</strong>
              <span>รอบปัจจุบัน</span>
            </div>
            <div className="ag-side-stat">
              <strong>{matched.size}/{roundItems.length}</strong>
              <span>คู่ที่จับแล้ว</span>
            </div>
            <div className="ag-side-stat">
              <strong>{score}</strong>
              <span>คะแนนสะสม</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ag-choice-guide">
        <div className="ag-guide-item ag-guide-left">
          <span className="ag-guide-dot" />
          <strong>{leftLabel}</strong>
          <span>เลือกต้นทางก่อน เช่น ศาลหรือคณะกรรมการ</span>
        </div>
        <div className="ag-guide-arrow">จับคู่กับ</div>
        <div className="ag-guide-item ag-guide-right">
          <span className="ag-guide-dot" />
          <strong>{rightLabel}</strong>
          <span>เลือกบทบาทที่ตรงกัน แล้วระบบตรวจทันที</span>
        </div>
      </div>

      <div className="ag-board-wrap">
        <div className="ag-board-head">
          <div className="ag-column-label ag-column-label-left">{leftLabel}</div>
          <div className="ag-column-label ag-column-label-right">{rightLabel}</div>
        </div>

        <div className="ag-progress-track">
          <div
            className="ag-progress-fill"
            style={{ width: `${roundItems.length ? (matched.size / roundItems.length) * 100 : 0}%` }}
          />
        </div>

        <div className="ag-grid">
          <div className="ag-column">
            {roundItems.map((item, index) => {
              const state =
                matched.has(index)
                  ? 'matched'
                  : wrong?.left === index
                    ? 'wrong'
                    : picks.left === index
                      ? 'picked'
                      : 'idle';

              return (
                <button
                  key={`left-${index}`}
                  className={`ag-card ag-card-left ag-card-${state}`}
                  disabled={matched.has(index)}
                  onClick={() => pick('left', index)}
                >
                  <span className="ag-card-status" aria-hidden="true">
                    {state === 'matched' ? '✓' : state === 'wrong' ? '!' : state === 'picked' ? 'เลือก' : '1'}
                  </span>
                  <span className="ag-card-chip">{leftChip}</span>
                  <strong>{item.left}</strong>
                </button>
              );
            })}
          </div>

          <div className="ag-column">
            {rightOrder.map((origIdx) => {
              const item = roundItems[origIdx];
              const state =
                matched.has(origIdx)
                  ? 'matched'
                  : wrong?.right === origIdx
                    ? 'wrong'
                    : picks.right === origIdx
                      ? 'picked'
                      : 'idle';

              return (
                <button
                  key={`right-${origIdx}`}
                  className={`ag-card ag-card-right ag-card-${state}`}
                  disabled={matched.has(origIdx)}
                  onClick={() => pick('right', origIdx)}
                >
                  <span className="ag-card-status" aria-hidden="true">
                    {state === 'matched' ? '✓' : state === 'wrong' ? '!' : state === 'picked' ? 'เลือก' : '2'}
                  </span>
                  <span className="ag-card-chip">{rightChip}</span>
                  <strong>{item.right}</strong>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ag-footer-note">
          เลือกฝั่งซ้าย 1 ใบ แล้วจับคู่กับฝั่งขวาที่ตรงกัน ระบบจะเลื่อนไปรอบถัดไปอัตโนมัติเมื่อจับครบทุกคู่
        </div>

        <div className="ag-footer-link">
          <Link href={`/courses/${courseId}/${subjectId}/practices`}>← กลับไปลานฝึก</Link>
        </div>
      </div>
    </div>
  );
}

const authorityStyles = `
  .ag-shell {
    position: relative;
    overflow: hidden;
    border: 2px solid var(--color-text);
    border-radius: 28px;
    box-shadow: 6px 6px 0 var(--color-text);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0 46%, transparent 46% 100%),
      linear-gradient(180deg, #fffdf9 0%, #fff8ef 100%);
  }

  .ag-hero {
    margin-bottom: 22px;
    padding: 28px;
  }

  .ag-topbar {
    position: absolute;
    inset: 0 0 auto 0;
    height: 6px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-primary));
  }

  .ag-hero-watermark {
    position: absolute;
    right: 30px;
    bottom: -34px;
    color: rgba(15, 23, 42, 0.05);
    font-family: var(--font-display);
    font-size: 10rem;
    font-weight: 900;
    line-height: 1;
    pointer-events: none;
  }

  .ag-law-mode .ag-shell {
    background:
      radial-gradient(circle at 18% 20%, rgba(180, 138, 62, 0.18), transparent 30%),
      linear-gradient(135deg, #fffdf8 0%, #eef5f5 54%, #fff7e0 100%);
  }

  .ag-law-mode .ag-topbar {
    background: linear-gradient(90deg, #0f3d45, #c49434, #7a1822);
  }

  .ag-hero-main {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) 260px;
    gap: 20px;
    align-items: start;
  }

  .ag-badge {
    display: inline-flex;
    align-items: center;
    margin-bottom: 12px;
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(122, 24, 34, 0.08);
    border: 1px solid rgba(122, 24, 34, 0.12);
    color: var(--color-primary);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .ag-title {
    margin: 0 0 12px;
    color: var(--color-primary-dark, var(--color-primary));
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3vw, 2.7rem);
    line-height: 1.05;
    font-weight: 900;
  }

  .ag-subtitle {
    margin: 0;
    max-width: 780px;
    color: var(--color-text-muted);
    font-size: 0.98rem;
    line-height: 1.75;
  }

  .ag-side-panel {
    display: grid;
    gap: 12px;
  }

  .ag-side-stat,
  .ag-stat-card {
    padding: 16px 18px;
    border-radius: 20px;
    border: 1px solid color-mix(in srgb, var(--color-border) 80%, white);
    background: rgba(255, 255, 255, 0.85);
  }

  .ag-side-stat strong,
  .ag-stat-card strong {
    display: block;
    margin-bottom: 4px;
    color: var(--color-primary);
    font-family: var(--font-display);
    font-size: 1.45rem;
    font-weight: 900;
  }

  .ag-side-stat span,
  .ag-stat-card span {
    color: var(--color-text-muted);
    font-size: 0.84rem;
    line-height: 1.5;
  }

  .ag-board-wrap {
    padding: 26px;
    border: 2px solid var(--color-text);
    border-radius: 28px;
    box-shadow: 6px 6px 0 var(--color-text);
    background:
      linear-gradient(90deg, rgba(15, 61, 69, 0.04) 0 50%, rgba(196, 148, 52, 0.07) 50% 100%),
      #fff;
  }

  .ag-choice-guide {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 12px;
    align-items: stretch;
    margin: 0 0 18px;
  }

  .ag-guide-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 3px 10px;
    align-items: center;
    min-height: 76px;
    padding: 14px 16px;
    border: 2px solid var(--color-text);
    border-radius: 18px;
    box-shadow: 3px 3px 0 var(--color-text);
    background: #fff;
  }

  .ag-guide-item strong {
    color: var(--color-text);
    font-size: 0.95rem;
    line-height: 1.35;
  }

  .ag-guide-item span:last-child {
    grid-column: 2;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .ag-guide-dot {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid var(--color-text);
  }

  .ag-guide-left .ag-guide-dot {
    background: #0f3d45;
  }

  .ag-guide-right .ag-guide-dot {
    background: #c49434;
  }

  .ag-guide-arrow {
    display: grid;
    place-items: center;
    min-width: 96px;
    padding: 0 14px;
    border-radius: 999px;
    border: 2px solid var(--color-text);
    background: var(--color-text);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 900;
    align-self: center;
    min-height: 38px;
  }

  .ag-board-head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 12px;
  }

  .ag-column-label {
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(122, 24, 34, 0.06);
    color: var(--color-primary);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
  }

  .ag-column-label-left {
    background: rgba(15, 61, 69, 0.1);
    color: #0f3d45;
  }

  .ag-column-label-right {
    background: rgba(196, 148, 52, 0.16);
    color: #805719;
  }

  .ag-progress-track {
    width: 100%;
    height: 10px;
    margin-bottom: 18px;
    border-radius: 999px;
    background: #efe6d7;
    overflow: hidden;
  }

  .ag-progress-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    transition: width 180ms ease;
  }

  .ag-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .ag-column {
    display: grid;
    gap: 12px;
  }

  .ag-card {
    position: relative;
    min-height: 106px;
    padding: 17px 18px 18px 56px;
    border-radius: 18px;
    border: 2px solid var(--color-text);
    background: #fff;
    box-shadow: 4px 4px 0 var(--color-text);
    text-align: left;
    transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
  }

  .ag-card::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 12px;
    border-radius: 16px 0 0 16px;
    background: #0f3d45;
  }

  .ag-card-right::before {
    background: #c49434;
  }

  .ag-card:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 var(--color-text);
  }

  .ag-card:disabled {
    cursor: default;
  }

  .ag-card strong {
    display: block;
    color: var(--color-text);
    font-size: 0.97rem;
    line-height: 1.55;
    font-weight: 700;
  }

  .ag-card-status {
    position: absolute;
    left: 22px;
    top: 18px;
    display: grid;
    place-items: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    border-radius: 999px;
    border: 2px solid var(--color-text);
    background: #eef7f7;
    color: #0f3d45;
    font-size: 0.72rem;
    font-weight: 900;
    line-height: 1;
  }

  .ag-card-right .ag-card-status {
    background: #fff2cf;
    color: #805719;
  }

  .ag-card-chip {
    display: inline-flex;
    margin-bottom: 10px;
    padding: 5px 9px;
    border-radius: 999px;
    background: rgba(15, 61, 69, 0.1);
    color: #0f3d45;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ag-card-right .ag-card-chip {
    background: rgba(196, 148, 52, 0.16);
    color: #805719;
  }

  .ag-card-picked {
    background: linear-gradient(180deg, #e9f7f7 0%, #fff 100%);
    border-color: #0f3d45;
    box-shadow: 0 0 0 4px rgba(15, 61, 69, 0.16), 5px 5px 0 var(--color-text);
    transform: translate(-1px, -1px);
  }

  .ag-card-right.ag-card-picked {
    background: linear-gradient(180deg, #fff2cf 0%, #fff 100%);
    border-color: #c49434;
    box-shadow: 0 0 0 4px rgba(196, 148, 52, 0.22), 5px 5px 0 var(--color-text);
  }

  .ag-card-picked .ag-card-status {
    min-width: 46px;
    left: 18px;
    background: var(--color-text);
    color: #fff;
  }

  .ag-card-matched {
    background: linear-gradient(180deg, #e7f8ed, #f7fff9);
    border-color: #1f8a4c;
    opacity: 0.94;
    box-shadow: 3px 3px 0 #1f8a4c;
  }

  .ag-card-matched .ag-card-status {
    background: #1f8a4c;
    color: #fff;
    border-color: #0f5f32;
  }

  .ag-card-wrong {
    background: linear-gradient(180deg, rgba(201, 58, 58, 0.12), #fff5f5);
    border-color: #d95b5b;
    animation: ag-shake 220ms ease-in-out 2;
  }

  .ag-card-wrong .ag-card-status {
    background: #d63535;
    color: #fff;
    border-color: #9b1c1c;
  }

  @keyframes ag-shake {
    0%, 100% { transform: translateX(0); }
    30% { transform: translateX(-4px); }
    70% { transform: translateX(4px); }
  }

  .ag-footer-note {
    margin-top: 18px;
    color: var(--color-text-muted);
    font-size: 0.88rem;
    line-height: 1.65;
    text-align: center;
  }

  .ag-footer-link {
    margin-top: 14px;
    text-align: center;
  }

  .ag-footer-link a {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
  }

  .ag-footer-link a:hover {
    text-decoration: underline;
  }

  .ag-result-card {
    padding: 32px 28px;
    text-align: center;
  }

  .ag-result-icon {
    margin: 6px auto 14px;
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-size: 2.5rem;
    background: rgba(122, 24, 34, 0.08);
    border: 2px solid rgba(122, 24, 34, 0.12);
  }

  .ag-result-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 22px;
  }

  .ag-action-row {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .ag-primary-btn,
  .ag-secondary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 180px;
    padding: 13px 18px;
    border-radius: 16px;
    border: 2px solid var(--color-text);
    box-shadow: 4px 4px 0 var(--color-text);
    font-weight: 800;
    text-decoration: none;
    transition: transform 120ms ease, box-shadow 120ms ease;
  }

  .ag-primary-btn {
    background: var(--color-primary);
    color: #fff;
  }

  .ag-secondary-btn {
    background: #fff;
    color: var(--color-text);
  }

  .ag-primary-btn:hover,
  .ag-secondary-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 var(--color-text);
  }

  @media (max-width: 860px) {
    .ag-hero-main,
    .ag-grid,
    .ag-board-head,
    .ag-choice-guide,
    .ag-result-grid {
      grid-template-columns: 1fr;
    }

    .ag-guide-arrow {
      justify-self: center;
      min-width: 120px;
    }

    .ag-hero,
    .ag-board-wrap,
    .ag-result-card {
      padding: 20px 16px;
      border-radius: 22px;
    }

    .ag-card {
      min-height: 92px;
      border-radius: 18px;
      padding-left: 54px;
    }

    .ag-hero-watermark {
      right: 8px;
      bottom: -22px;
      font-size: 7rem;
    }
  }
`;
