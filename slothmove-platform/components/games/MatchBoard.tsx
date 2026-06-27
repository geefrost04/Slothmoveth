'use client';

import type { MatchItem } from './useMatchGame';

/**
 * Shared match-game board UI — used by MatchGame and AuthorityGame.
 * Renders two columns (left = questions, right = answers) with a
 * fixed-height row layout so short/long text stays aligned.
 */
export function MatchBoard({
  title,
  roundItems,
  rightOrder,
  picks,
  matched,
  wrong,
  score,
  round,
  totalRounds,
  done,
  pick,
  reset,
}: {
  title: string;
  roundItems: MatchItem[];
  rightOrder: number[];
  picks: { left?: number; right?: number };
  matched: Set<number>;
  wrong: { left: number; right: number } | null;
  score: number;
  round: number;
  totalRounds: number;
  done: boolean;
  pick: (side: 'left' | 'right', idx: number) => void;
  reset: () => void;
}) {
  if (done) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: 8 }}>จับคู่สำเร็จ!</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>
          คะแนน: <strong style={{ color: 'var(--color-accent)' }}>{score}</strong>
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
          ผ่านครบ {totalRounds} ชุด
        </p>
        <button className="btn btn-primary" onClick={reset}>
          เริ่มใหม่
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <p
        style={{
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          marginBottom: 16,
          fontSize: 14,
        }}
      >
        🧩 {title} · ชุดที่ {round + 1}/{totalRounds} · จับคู่แล้ว {matched.size}/{roundItems.length}
        {' · '}คะแนน{' '}
        <strong style={{ color: 'var(--color-accent)' }}>{score}</strong>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roundItems.map((p, i) => {
            const isMatched = matched.has(i);
            const isPicked = picks.left === i;
            const isWrong = wrong?.left === i;
            return (
              <MatchButton
                key={`l-${i}`}
                onClick={() => pick('left', i)}
                disabled={isMatched}
                state={
                  isMatched ? 'matched' : isWrong ? 'wrong' : isPicked ? 'picked' : 'idle'
                }
              >
                {p.left}
              </MatchButton>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rightOrder.map((origIdx) => {
            const p = roundItems[origIdx];
            const isMatched = matched.has(origIdx);
            const isPicked = picks.right === origIdx;
            const isWrong = wrong?.right === origIdx;
            return (
              <MatchButton
                key={`r-${origIdx}`}
                onClick={() => pick('right', origIdx)}
                disabled={isMatched}
                state={
                  isMatched ? 'matched' : isWrong ? 'wrong' : isPicked ? 'picked' : 'idle'
                }
              >
                {p.right}
              </MatchButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MatchButton({
  children,
  onClick,
  disabled,
  state,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  state: 'idle' | 'picked' | 'matched' | 'wrong';
}) {
  const bg =
    state === 'matched'
      ? '#d4edda'
      : state === 'wrong'
        ? '#f8d7da'
        : state === 'picked'
          ? 'var(--color-accent-soft)'
          : 'var(--color-surface)';
  const border =
    state === 'picked' || state === 'matched'
      ? 'var(--color-accent)'
      : state === 'wrong'
        ? '#dc3545'
        : 'var(--color-border)';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 72,
        padding: '12px 14px',
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 'var(--radius-md)',
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.4,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'background 120ms ease, border-color 120ms ease',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
      >
        {children}
      </span>
    </button>
  );
}
