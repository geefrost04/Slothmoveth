'use client';

import { useMemo, useState } from 'react';
import type { QuizItem } from '@/lib/course-types';
import { useDonatePromptOnDone } from '@/lib/donate-prompt';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';

const MODE_OPTIONS = [10, 20, 30] as const;

type ReviewEntry = {
  item: QuizItem;
  picked: number;
  focus: string;
};

function inferFocus(item: QuizItem): string {
  const text = `${item.question} ${item.explanation ?? ''} ${item.hint ?? ''}`.toLowerCase();
  if (/perfect|continuous|simple past|simple present|future|tense|v3|v-ing|past/.test(text)) return 'Tense';
  if (/subject-verb|เอกพจน์|พหูพจน์|no one|everyone|police \+\s*are|information|equipment/.test(text)) return 'Agreement';
  if (/preposition|since|for|in|on|at|during|while/.test(text)) return 'Preposition';
  if (/passive|must be|should be|modal/.test(text)) return 'Voice / Modal';
  if (/noun|adjective|adverb|verb|part of speech|รูปคำ/.test(text)) return 'Word Form';
  return 'Grammar Structure';
}

function focusTone(focus: string) {
  switch (focus) {
    case 'Tense':
      return { bg: '#fff2df', border: '#d3922e', text: '#8f4d00' };
    case 'Agreement':
      return { bg: '#eef7e9', border: '#6d9f55', text: '#31551f' };
    case 'Preposition':
      return { bg: '#e9f2ff', border: '#5d88c7', text: '#204c89' };
    case 'Voice / Modal':
      return { bg: '#f6ebff', border: '#8b67ba', text: '#5f3a8f' };
    default:
      return { bg: '#fceef0', border: '#c56d7b', text: '#8a3245' };
  }
}

export function ErrorDetectorGame({
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
  const [showHint, setShowHint] = useState(false);
  const [review, setReview] = useState<ReviewEntry[]>([]);

  useDonatePromptOnDone(done);

  const focusSummary = useMemo(() => {
    return review.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.focus] = (acc[entry.focus] ?? 0) + 1;
      return acc;
    }, {});
  }, [review]);

  function startSession(count: number) {
    const next = buildDistinctRandomSession(
      distinctScope('error-detector', courseId, subjectId, count, items.length),
      () => shuffleArray(items).slice(0, Math.min(count, items.length))
    );
    setSessionItems(next);
    setMode(next.length);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setStartTime(Date.now());
    setShowHint(false);
    setReview([]);
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 32 }}>
        <p>ยังไม่มีข้อมูลชุดนี้</p>
      </div>
    );
  }

  if (!sessionItems) {
    return (
      <div className="container course-subject-body">
        <section className="pab-knowledge-section">
          <div className="pab-knowledge-section-header">
            <div className="pab-knowledge-section-icon">🔎</div>
            <div>
              <div className="pab-knowledge-section-chip">Error Detector Lab</div>
              <h2 className="pab-knowledge-section-title">หาจุดผิดของประโยค</h2>
              <p className="pab-knowledge-section-desc">
                โหมดนี้แยกจากควิซปกติ โดยเน้นสแกนประโยคภาษาอังกฤษทีละข้อ
                แล้วจับให้ได้ว่าโครงสร้างไหน “ผิดจุด” หรือควรแก้เป็นอะไร
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '18px 0 24px' }}>
            {['Tense', 'Agreement', 'Preposition', 'Word Form', 'Voice / Modal'].map((label) => {
              const tone = focusTone(label);
              return (
                <span
                  key={label}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 999,
                    border: `1px solid ${tone.border}`,
                    background: tone.bg,
                    color: tone.text,
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {label}
                </span>
              );
            })}
          </div>

          <div className="quiz-mode-grid">
            {MODE_OPTIONS.map((count) => (
              <button key={count} className="quiz-mode-card" onClick={() => startSession(count)}>
                <div className="quiz-mode-card-top">
                  <span className="quiz-mode-card-icon">🧪</span>
                  <span className="quiz-mode-card-badge">{count} ข้อ</span>
                </div>
                <div className="quiz-mode-card-copy">
                  <strong>เริ่มสแกน {count} ข้อ</strong>
                  <p>
                    {count === 10
                      ? 'ซ้อมเร็ว เน้นจับ pattern ให้ไว'
                      : count === 20
                        ? 'ฝึกต่อเนื่อง ครบหลายชนิด grammar'
                        : 'ชุดยาวสำหรับเช็กความแม่นก่อนสอบ'}
                  </p>
                </div>
                <span className="quiz-mode-card-cta">เข้า Error Lab →</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const item = sessionItems[idx];
  const focus = inferFocus(item);
  const tone = focusTone(focus);
  const isAnswered = picked !== null;
  const isCorrect = picked === item.answer;
  const elapsedSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));

  function pickChoice(choiceIndex: number) {
    if (picked !== null) return;
    setPicked(choiceIndex);
    if (choiceIndex === item.answer) {
      setScore((current) => current + 1);
    } else {
      setReview((current) => [...current, { item, picked: choiceIndex, focus }]);
    }
  }

  function nextQuestion() {
    if (!sessionItems) return;
    if (idx + 1 >= sessionItems.length) {
      setDone(true);
      return;
    }
    setIdx((current) => current + 1);
    setPicked(null);
    setShowHint(false);
  }

  if (done) {
    const total = sessionItems.length;
    const pct = Math.round((score / total) * 100);
    const minutes = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const seconds = String(elapsedSec % 60).padStart(2, '0');
    const hardestFocus = Object.entries(focusSummary).sort((a, b) => b[1] - a[1])[0]?.[0];

    return (
      <div className="container course-subject-body">
        <section className="pab-knowledge-section quiz-result-panel">
          <div className="quiz-result-icon">{pct >= 80 ? '🕵️' : pct >= 60 ? '📘' : '🧩'}</div>
          <div className="course-subject-chip quiz-result-chip">Error Detector Summary</div>
          <h2 className="quiz-result-title">สรุปผลการสแกนประโยค</h2>
          <p className="quiz-result-subtitle">
            {pct >= 80
              ? 'แม่นดีมาก คุณเริ่มจับโครงสร้างหลอกได้ไวแล้ว'
              : pct >= 60
                ? 'เริ่มเห็น pattern แล้ว ลองทวนหมวดที่พลาดบ่อยอีกนิด'
                : 'ยังพลาดโครงสร้างพื้นฐานอยู่พอสมควร ควรฝึกแบบช้าและอ่านเหตุผลทุกข้อ'}
          </p>
          <div className="quiz-result-score-wrap">
            <p className="quiz-result-score">{score}/{total}</p>
            <p className="quiz-result-percent">{pct}%</p>
          </div>
          <p className="quiz-result-stats">ใช้เวลา {minutes}:{seconds}</p>

          <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
            <div
              style={{
                border: '1px solid rgba(18, 28, 45, 0.12)',
                borderRadius: 18,
                padding: 16,
                background: 'rgba(255,255,255,0.72)',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6 }}>จุดที่ควรกลับไปเน้น</strong>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {hardestFocus ? `พลาดมากสุดในหมวด ${hardestFocus}` : 'วันนี้ค่อนข้างแม่นทุกหมวด'}
              </span>
            </div>

            {review.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {Object.entries(focusSummary).map(([label, count]) => {
                  const chipTone = focusTone(label);
                  return (
                    <span
                      key={label}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: `1px solid ${chipTone.border}`,
                        background: chipTone.bg,
                        color: chipTone.text,
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      {label} · {count} จุด
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="quiz-result-actions">
            <button className="btn btn-primary" onClick={() => startSession(mode)}>
              สแกนใหม่อีกชุด
            </button>
            <button className="btn btn-secondary" onClick={() => setSessionItems(null)}>
              เปลี่ยนจำนวนข้อ
            </button>
          </div>
        </section>

        {review.length > 0 ? (
          <section className="pab-knowledge-section quiz-review-panel">
            <div className="course-subject-chip quiz-review-chip">ข้อที่พลาด</div>
            <h2 className="quiz-review-title">ทบทวนจุดที่หลุด</h2>
            <p className="quiz-review-subtitle">ระบบนี้จะเก็บเฉพาะข้อที่ตอบผิดไว้ดูย้อนหลัง</p>
            <div className="quiz-review-list">
              {review.slice(0, 6).map((entry, reviewIndex) => (
                <article key={`${entry.item.question}-${reviewIndex}`} className="quiz-review-item">
                  <header className="quiz-review-item-head">
                    <span className="quiz-review-item-num">ข้อพลาด {reviewIndex + 1}</span>
                    <span className="quiz-review-item-tag">{entry.focus}</span>
                  </header>
                  <p className="quiz-review-item-question">{entry.item.question}</p>
                  <ul className="quiz-review-choices">
                    {entry.item.choices.map((choice, choiceIndex) => {
                      const classes = ['quiz-review-choice'];
                      if (choiceIndex === entry.item.answer) classes.push('is-correct');
                      if (choiceIndex === entry.picked && choiceIndex !== entry.item.answer) classes.push('is-wrong');
                      return (
                        <li key={`${choice}-${choiceIndex}`} className={classes.join(' ')}>
                          <span className="quiz-review-choice-label">{String.fromCharCode(65 + choiceIndex)}</span>
                          <span className="quiz-review-choice-text">{choice}</span>
                          {choiceIndex === entry.item.answer ? <span className="quiz-review-badge is-correct">เฉลย</span> : null}
                          {choiceIndex === entry.picked && choiceIndex !== entry.item.answer ? <span className="quiz-review-badge is-wrong">คำตอบคุณ</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="pab-knowledge-rich quiz-review-explain">{entry.item.explanation}</div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="container course-subject-body">
      <section className="pab-knowledge-section">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <div>
            <div className="course-subject-chip">Error Detector</div>
            <p className="quiz-play-progress" style={{ marginTop: 8 }}>
              เคส {idx + 1}/{sessionItems.length} · ถูก {score} ข้อ
            </p>
          </div>
          <button className="btn btn-secondary quiz-reset-button" onClick={() => setSessionItems(null)}>
            ออกจากโหมดนี้
          </button>
        </div>

        <div className="quiz-progress-track" aria-hidden="true">
          <span style={{ width: `${((idx + (isAnswered ? 1 : 0)) / sessionItems.length) * 100}%` }} />
        </div>

        <div
          style={{
            display: 'grid',
            gap: 18,
            marginTop: 20,
          }}
        >
          <div
            style={{
              border: `2px solid ${tone.border}`,
              background: `linear-gradient(180deg, ${tone.bg} 0%, rgba(255,255,255,0.96) 100%)`,
              borderRadius: 22,
              padding: '22px 20px',
              boxShadow: '4px 4px 0 rgba(18, 28, 45, 0.08)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <span
                style={{
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: tone.bg,
                  border: `1px solid ${tone.border}`,
                  color: tone.text,
                  fontWeight: 900,
                  fontSize: 12,
                  letterSpacing: '0.04em',
                }}
              >
                {focus}
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                อ่านประโยค แล้วเลือกคำตอบที่แก้จุดผิดได้ถูกที่สุด
              </span>
            </div>

            <h2 className="quiz-question-title" style={{ marginBottom: 0 }}>
              {item.question}
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setShowHint((current) => !current)}>
              {showHint ? 'ซ่อน hint' : 'เปิด hint'}
            </button>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 13, alignSelf: 'center' }}>
              โหมดนี้จะไม่ข้ามข้ออัตโนมัติ เพื่อให้ดูเหตุผลก่อนไปต่อ
            </span>
          </div>

          {showHint && item.hint ? (
            <div className="pab-knowledge-callout quiz-explanation">
              <strong>Hint:</strong> {item.hint}
            </div>
          ) : null}

          <div className="quiz-choice-list">
            {item.choices.map((choice, choiceIndex) => {
              let stateClass = '';
              if (isAnswered) {
                if (choiceIndex === item.answer) stateClass = ' is-correct';
                else if (choiceIndex === picked) stateClass = ' is-wrong';
                else stateClass = ' is-muted';
              }

              return (
                <button
                  key={`${choice}-${choiceIndex}`}
                  className={`quiz-choice${stateClass}`}
                  onClick={() => pickChoice(choiceIndex)}
                  disabled={isAnswered}
                >
                  <span className="quiz-choice-key">{String.fromCharCode(65 + choiceIndex)}</span>
                  <span className="quiz-choice-text">{choice}</span>
                </button>
              );
            })}
          </div>

          {isAnswered ? (
            <>
              <div className="pab-knowledge-callout quiz-explanation">
                <strong>{isCorrect ? 'ถูกต้อง' : 'จุดที่พลาด'}</strong>
                <div style={{ marginTop: 8 }}>{item.explanation}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={nextQuestion}>
                  {idx + 1 >= sessionItems.length ? 'ดูสรุปผล →' : 'ไปเคสถัดไป →'}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
