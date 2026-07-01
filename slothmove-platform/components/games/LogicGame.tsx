'use client';

import { useState } from 'react';
import type { LogicItem } from '@/lib/course-types';
import { useDonatePromptOnDone } from '@/lib/donate-prompt';

export function LogicGame({ items }: { items: LogicItem[] }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useDonatePromptOnDone(done);

  if (!items.length) return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีข้อมูล</p>;
  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: 32 }}>
        <h2>เสร็จแล้ว!</h2>
        <p style={{ fontSize: 24, marginTop: 12 }}>คะแนน: {score}/{items.length}</p>
        <button className="btn btn-primary" onClick={() => { setIdx(0); setPicked(null); setScore(0); setDone(false); }}>
          เริ่มใหม่
        </button>
      </div>
    );
  }

  const item = items[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === item.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= items.length) setDone(true);
      else { setIdx(idx + 1); setPicked(null); }
    }, 1500);
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>
        ข้อ {idx + 1} / {items.length} · คะแนน {score}
      </p>
      <div style={{
        background: 'var(--color-accent-soft)',
        padding: '24px', borderRadius: 'var(--radius-md)',
        marginBottom: 24, fontSize: 17, color: 'var(--color-primary)',
        textAlign: 'center', minHeight: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        🧠 {item.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {item.options.map((opt, i) => {
          const isCorrect = i === item.answer;
          const isPicked = i === picked;
          const showResult = picked !== null;
          const bg = !showResult ? 'var(--color-surface)'
            : isCorrect ? '#d4edda'
            : isPicked ? '#f8d7da'
            : 'var(--color-surface)';
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              style={{
                padding: '14px 18px',
                background: bg,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left', fontSize: 15,
                cursor: picked === null ? 'pointer' : 'default'
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && item.explain && (
        <p style={{ marginTop: 16, padding: 12, background: 'var(--color-accent-soft)', borderRadius: 8, fontSize: 14 }}>
          💡 {item.explain}
        </p>
      )}
    </div>
  );
}
