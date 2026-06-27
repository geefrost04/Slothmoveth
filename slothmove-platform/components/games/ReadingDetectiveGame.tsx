'use client';

/**
 * ReadingDetectiveGame
 *
 * Rank A game for OCSC analytical_thinking — reading comprehension.
 * Shows a question (which may reference an implied passage) with 4 MCQ choices.
 * Groups questions by pattern/topic so the user can focus a session on one skill.
 *
 * Data: analytical_thinking_reading (language_analysis category — 151 items).
 */

import { useState, useMemo } from 'react';
import type { QuizItem } from '@/lib/course-types';
import { buildDistinctRandomSession, distinctScope } from '@/lib/randomization';

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const SKILL_LABELS: Record<string, string> = {
  main_idea:       'จับใจความสำคัญ',
  interpretation:  'ตีความบทความ',
  conclusion:      'สรุปความ',
  inference:       'อนุมาน / ตีความ',
  tone:            'น้ำเสียงและจุดประสงค์',
  detail:          'รายละเอียดข้อเท็จจริง',
};

const MODE_OPTIONS = [10, 20, 30] as const;

export function ReadingDetectiveGame({
  items,
  courseId,
  subjectId,
}: {
  items: QuizItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const [sessionItems, setSessionItems] = useState<QuizItem[] | null>(null);
  const [mode, setMode] = useState<number>(10);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [startTime, setStartTime] = useState(0);

  // Infer a readable skill label from the question text
  function inferSkill(q: QuizItem): string {
    const text = q.question.toLowerCase();
    if (text.includes('ใจความสำคัญ') || text.includes('ใจความหลัก')) return '🔑 จับใจความ';
    if (text.includes('ตีความ') || text.includes('อนุมาน')) return '🔮 ตีความ';
    if (text.includes('สรุปความ') || text.includes('คำสรุป')) return '📝 สรุปความ';
    if (text.includes('เน้นย้ำ') || text.includes('จุดประสงค์')) return '🎯 จุดประสงค์';
    if (text.includes('ผลลัพธ์') || text.includes('ผลที่เกิด')) return '⚡ ผลลัพธ์';
    return '📖 วิเคราะห์ข้อความ';
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 32 }}>
        <p>ยังไม่มีข้อมูลชุดนี้</p>
      </div>
    );
  }

  /* ─── Intro / Mode selection ──────────────────────────────────────────── */
  if (!sessionItems) {
    return (
      <div className="container course-subject-body">
        <section className="pab-knowledge-section">
          <div className="pab-knowledge-section-header">
            <div className="pab-knowledge-section-icon">🔍</div>
            <div>
              <div className="pab-knowledge-section-chip">นักสืบบทความ · Rank A</div>
              <h2 className="pab-knowledge-section-title">นักสืบบทความ</h2>
              <p className="pab-knowledge-section-desc">
                ฝึก<strong>อ่านบทความ</strong>แล้วตอบคำถามประเภท
                จับใจความสำคัญ · ตีความ · สรุปความ · อนุมาน<br />
                ทักษะที่ทดสอบใน ก.พ. (ภาค ก.) ส่วน <em>การคิดวิเคราะห์ทางภาษา</em>
              </p>
            </div>
          </div>

          {/* Skill badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0 24px' }}>
            {['🔑 จับใจความ', '🔮 ตีความ', '📝 สรุปความ', '🎯 จุดประสงค์', '⚡ ผลลัพธ์'].map((s) => (
              <span
                key={s}
                style={{
                  padding: '4px 12px',
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid var(--color-accent)',
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="quiz-mode-grid">
            {MODE_OPTIONS.map((m) => (
              <button
                key={m}
                className="quiz-mode-card"
                onClick={() => {
                  const slice = buildDistinctRandomSession(
                    distinctScope('reading-detective', m, items.length),
                    () => shuffle(items).slice(0, Math.min(m, items.length))
                  );
                  setSessionItems(slice);
                  setMode(slice.length);
                  setIdx(0); setPicked(null); setScore(0); setDone(false);
                  setStartTime(Date.now());
                }}
              >
                <div className="quiz-mode-card-icon">🔍</div>
                <strong className="quiz-mode-card-title">ทำ {m} ข้อ</strong>
                <p className="quiz-mode-card-desc">
                  {m === 10
                    ? 'เหมาะกับการซ้อมเร็ว · ทักษะการอ่านหลัก'
                    : m === 20
                      ? 'ฝึกต่อเนื่อง · ครบทุกประเภทคำถาม'
                      : 'ชุดเต็ม · เสมือนสภาวะสอบจริง'}
                </p>
                <span className="quiz-mode-card-cta">เริ่มชุดนี้ →</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ─── Result screen ───────────────────────────────────────────────────── */
  if (done) {
    const total = sessionItems.length;
    const pct = Math.round((score / total) * 100);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');

    return (
      <div className="container course-subject-body">
        <section className="pab-knowledge-section quiz-result-panel">
          <div className="quiz-result-icon">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
          <div className="course-subject-chip quiz-result-chip">สรุปผลนักสืบบทความ</div>
          <h2 className="quiz-result-title">เสร็จแล้ว!</h2>
          <p className="quiz-result-subtitle">
            {pct >= 80
              ? 'ยอดเยี่ยม! ทักษะการอ่านเชิงวิเคราะห์ระดับสูง'
              : pct >= 60
                ? 'ดีมาก ลองสังเกต keyword ที่บอกประเภทคำถาม (ใจความ / ตีความ / สรุป)'
                : 'ฝึกต่อไปนะครับ — อ่านโครงสร้างบทความและมองหา keyword ในโจทย์'}
          </p>
          <div className="quiz-result-score-wrap">
            <p className="quiz-result-score">{score}/{total}</p>
            <p className="quiz-result-percent">{pct}%</p>
          </div>
          <p className="quiz-result-stats">ใช้เวลา {mm}:{ss}</p>
          <div className="quiz-result-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSessionItems(
                  buildDistinctRandomSession(
                    distinctScope('reading-detective', 'retry', mode, items.length),
                    () => shuffle(items).slice(0, mode)
                  )
                );
                setIdx(0); setPicked(null); setScore(0); setDone(false);
                setStartTime(Date.now());
              }}
            >
              ทำชุดเดิมอีกครั้ง
            </button>
            <button className="btn btn-secondary" onClick={() => { setSessionItems(null); setDone(false); }}>
              เลือกจำนวนข้อใหม่
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* ─── In-game view ────────────────────────────────────────────────────── */
  const item = sessionItems[idx];
  const showResult = picked !== null;
  const skillLabel = inferSkill(item);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === item.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= sessionItems!.length) setDone(true);
      else { setIdx(idx + 1); setPicked(null); }
    }, i === item.answer ? 1200 : 2400);
  }

  return (
    <div className="container course-subject-body">
      <section className="pab-knowledge-section">
        {/* Header */}
        <div className="quiz-shell-head">
          <div className="course-subject-chip">🔍 นักสืบบทความ</div>
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

        {/* Skill badge */}
        <div
          style={{
            display: 'inline-block',
            margin: '10px 0 14px',
            padding: '4px 12px',
            background: 'var(--color-accent-soft)',
            color: 'var(--color-accent)',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            border: '1px solid var(--color-accent)',
          }}
        >
          {skillLabel}
        </div>

        {/* Question */}
        <h2
          className="quiz-question-title"
          style={{ fontSize: 'clamp(1rem, 3.5vw, 1.35rem)', lineHeight: 1.6 }}
        >
          {item.question}
        </h2>

        {/* Choices */}
        <div className="quiz-choice-list">
          {item.choices.map((choice, i) => {
            const isCorrect = i === item.answer;
            const isPicked = i === picked;
            const stateClass = !showResult
              ? ''
              : isCorrect
                ? ' is-correct'
                : isPicked
                  ? ' is-wrong'
                  : ' is-muted';
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

        {/* Explanation */}
        {picked !== null && item.explanation && (
          <div className="pab-knowledge-callout quiz-explanation">
            <h3 className="pab-knowledge-callout-title">💡 คำอธิบาย</h3>
            <p
              className="pab-knowledge-rich"
              dangerouslySetInnerHTML={{ __html: item.explanation }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
