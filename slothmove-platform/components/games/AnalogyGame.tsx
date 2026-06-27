'use client';

/**
 * AnalogyGame
 *
 * Renders analogy-style quiz questions (A : B :: C : ?) with extra
 * pattern/hint metadata that the standard QuizGame doesn't surface.
 *
 * Why a dedicated component?
 *   - Analogy questions in the police math pool have a `hint` field
 *     and a `pattern` tag (relationship / function / etc.). Showing
 *     the pattern helps the user internalize the analogy type.
 *   - The user explicitly prefers active-recall style (per project
 *     memory): "หน้า 1 = โจทย์จริง, หน้า 2 = สูตร/วิธีคิด".
 *     The hint button is the "วิธีคิดลัด" surface, the explanation
 *     after answering is the "วิธีเต็ม".
 *
 * Data shape: QuizItem (from math_analogy.ts). 40 items.
 */

import { useState, useMemo } from 'react';
import type { QuizItem } from '@/lib/course-types';
import { buildDistinctRandomSession, distinctScope } from '@/lib/randomization';

const PATTERN_LABELS: Record<string, string> = {
  relationship: 'ความสัมพันธ์',
  function: 'หน้าที่',
  ratio: 'อัตราส่วน',
  position: 'ตำแหน่ง',
  size: 'ขนาด',
  shape: 'รูปทรง',
  color: 'สี',
  letter: 'อักษร',
  percentage: 'เปอร์เซ็นต์'
};

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function AnalogyGame({ items }: { items: QuizItem[] }) {
  const [sessionItems, setSessionItems] = useState<QuizItem[] | null>(null);
  const [mode, setMode] = useState<number>(10);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState(0);

  if (items.length === 0) {
    return <p className="container" style={{ padding: 32 }}>ยังไม่มีข้อมูล</p>;
  }

  if (!sessionItems) {
    return (
      <div className="container course-subject-body">
        <section className="pab-knowledge-section">
          <div className="pab-knowledge-section-header">
            <div className="pab-knowledge-section-icon">🔗</div>
            <div>
              <div className="pab-knowledge-section-chip">อุปมาอุปไมย</div>
              <h2 className="pab-knowledge-section-title">
                ฝึกจับคู่ความสัมพันธ์ของคู่คำ
              </h2>
              <p className="pab-knowledge-section-desc">
                โจทย์จะให้คู่คำที่มีความสัมพันธ์กัน (A : B) แล้วถามหาคำที่สัมพันธ์กับคำที่สาม (C : ?)
                — มีปุ่มเปิดดู <strong>คำใบ้</strong> เพื่อช่วยเตือนความจำ และมี <strong>คำอธิบาย</strong> หลังตอบ
              </p>
            </div>
          </div>
          <div className="quiz-mode-grid">
            {[10, 20].map((m) => (
              <button
                key={m}
                className="quiz-mode-card"
                onClick={() => {
                  const slice = buildDistinctRandomSession(
                    distinctScope('analogy', m, items.length),
                    () => shuffle(items).slice(0, Math.min(m, items.length))
                  );
                  setSessionItems(slice);
                  setMode(slice.length);
                  setIdx(0);
                  setPicked(null);
                  setScore(0);
                  setDone(false);
                  setShowHint(false);
                  setStartTime(Date.now());
                }}
              >
                <div className="quiz-mode-card-icon">🔗</div>
                <strong className="quiz-mode-card-title">ทำ {m} ข้อ</strong>
                <p className="quiz-mode-card-desc">
                  {m === 10
                    ? 'เหมาะกับการซ้อมเร็ว ใช้เวลาน้อย เช็คความพร้อม'
                    : 'เหมาะกับการฝึกครบทุก pattern'}
                </p>
                <span className="quiz-mode-card-cta">เริ่มชุดนี้ →</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (done) {
    const total = sessionItems.length;
    const pct = Math.round((score / total) * 100);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    return (
      <div className="container course-subject-body">
        <section className="pab-knowledge-section quiz-result-panel">
          <div className="quiz-result-icon">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
          <div className="course-subject-chip quiz-result-chip">สรุปผลอุปมาอุปไมย</div>
          <h2 className="quiz-result-title">เสร็จแล้ว</h2>
          <p className="quiz-result-subtitle">
            {pct >= 80
              ? 'เก่งมาก! ความสัมพันธ์ของคู่คำเป็นจุดแข็งของคุณ'
              : pct >= 60
                ? 'พื้นฐานดีแล้ว ลองทบทวน pattern ที่พลาด'
                : 'ลองเปิดคำใบ้ก่อนตอบ แล้วเก็บ pattern ที่ผิดบ่อยมาทำซ้ำ'}
          </p>
          <div className="quiz-result-score-wrap">
            <p className="quiz-result-score">{score}/{total}</p>
            <p className="quiz-result-percent">{pct}%</p>
          </div>
          <p className="quiz-result-stats">ใช้เวลา {m}:{s}</p>
          <div className="quiz-result-actions">
            <button className="btn btn-primary" onClick={() => {
              setSessionItems(
                buildDistinctRandomSession(
                  distinctScope('analogy', 'retry', mode, items.length),
                  () => shuffle(items).slice(0, mode)
                )
              );
              setIdx(0); setPicked(null); setScore(0); setDone(false);
              setShowHint(false); setStartTime(Date.now());
            }}>
              ทำชุดเดิมอีกครั้ง
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setSessionItems(null); setDone(false);
            }}>
              เลือกจำนวนข้อใหม่
            </button>
          </div>
        </section>
      </div>
    );
  }

  const item = sessionItems[idx];
  const showResult = picked !== null;
  const patternLabel = item.pattern ? (PATTERN_LABELS[item.pattern] || item.pattern) : null;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === item.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= sessionItems!.length) setDone(true);
      else { setIdx(idx + 1); setPicked(null); setShowHint(false); }
    }, i === item.answer ? 1200 : 2400);
  }

  return (
    <div className="container course-subject-body">
      <section className="pab-knowledge-section">
        <div className="quiz-shell-head">
          <div className="course-subject-chip">กำลังทำข้อสอบ</div>
          <button className="btn btn-secondary quiz-reset-button" onClick={() => setSessionItems(null)}>
            เปลี่ยนชุดข้อสอบ
          </button>
        </div>
        <p className="quiz-progress-meta">
          ข้อ {idx + 1} / {sessionItems.length} · คะแนน {score}
        </p>
        <div className="quiz-progress-track" aria-hidden="true">
          <span style={{ width: `${((idx + (picked !== null ? 1 : 0)) / sessionItems.length) * 100}%` }} />
        </div>

        {patternLabel && (
          <div className="quiz-mode-card-cta" style={{
            display: 'inline-block', margin: '8px 0 12px',
            padding: '4px 10px', background: 'var(--color-accent-soft)',
            color: 'var(--color-accent)', borderRadius: 999, fontSize: 12, fontWeight: 700
          }}>
            🏷️ pattern: {patternLabel}
          </div>
        )}

        <h2 className="quiz-question-title" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
          {item.question}
        </h2>

        {item.hint && !showResult && (
          <div style={{ margin: '12px 0' }}>
            {!showHint ? (
              <button className="btn btn-secondary" onClick={() => setShowHint(true)}>
                💡 เปิดคำใบ้
              </button>
            ) : (
              <div className="pab-knowledge-callout" style={{ borderColor: 'var(--color-accent)' }}>
                <strong>💡 คำใบ้:</strong> {item.hint}
              </div>
            )}
          </div>
        )}

        <div className="quiz-choice-list">
          {item.choices.map((choice, i) => {
            const isCorrect = i === item.answer;
            const isPicked = i === picked;
            const stateClass = !showResult ? '' : isCorrect ? ' is-correct' : isPicked ? ' is-wrong' : ' is-muted';
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={`quiz-choice${stateClass}`}
              >
                <span className="quiz-choice-key">{String.fromCharCode(65 + i)}</span>
                <span className="quiz-choice-text">{choice}</span>
              </button>
            );
          })}
        </div>

        {picked !== null && item.explanation && (
          <div className="pab-knowledge-callout quiz-explanation">
            <h3 className="pab-knowledge-callout-title">💡 คำอธิบาย</h3>
            <p className="pab-knowledge-rich">{item.explanation}</p>
          </div>
        )}
      </section>
    </div>
  );
}
