'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TrueFalseItem } from '@/lib/course-types';
import { useDonatePromptOnDone } from '@/lib/donate-prompt';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TrueFalseGame({
  items,
  courseId = 'police_admin',
  subjectId = 'law'
}: {
  items: TrueFalseItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionPool, setQuestionPool] = useState<TrueFalseItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const questionCount = Math.min(10, items.length);
  const currentItem = questionPool[idx];
  const hasAnswered = picked !== null;
  const isCorrect = currentItem ? picked === currentItem.answer : false;
  const answeredCount = idx + (hasAnswered ? 1 : 0);

  useDonatePromptOnDone(done);

  useEffect(() => {
    if (!isPlaying || done) return undefined;
    const interval = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [done, isPlaying]);

  if (!items.length) return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีข้อมูลสำหรับเกมนี้</p>;

  function startGame() {
    setQuestionPool(
      buildDistinctRandomSession(
        distinctScope('truefalse', courseId, subjectId, items.length),
        () => shuffleArray(items).slice(0, questionCount)
      )
    );
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setSeconds(0);
    setIsPlaying(true);
  }

  function handlePick(answer: boolean) {
    if (picked !== null || !currentItem) return;
    setPicked(answer);
    if (answer === currentItem.answer) setScore((current) => current + 1);
  }

  function handleNext() {
    if (idx + 1 >= questionPool.length) {
      setDone(true);
      return;
    }
    setIdx((current) => current + 1);
    setPicked(null);
  }

  if (!isPlaying && !done) {
    return (
      <div className="course-layout" data-course={courseId}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <style>{trueFalseStyles}</style>

          <div className="tf-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
            <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200 dark:border-red-900/40">
              <span className="text-4xl">⚖️</span>
            </div>
            <span className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/40 text-xs font-bold uppercase tracking-wider">
              เกมตัดสินถูกหรือผิด
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-zinc-50 mb-3">
              True / False · กฎหมาย
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
              ระบบจะสุ่มข้อความกฎหมายให้ตัดสินว่าถูกหรือผิด หลังเลือกคำตอบจะเฉลยทันที
              แล้วค่อยกดไปข้อถัดไป เหมาะสำหรับจับจุดหลอกและทบทวนหลักจำสำคัญ
            </p>
            <div className="my-6 p-5 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-900 dark:border-zinc-700 rounded-2xl text-left">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                ⚖️ ชุดข้อความกฎหมายที่ควรรู้
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-zinc-400">
                <span>• กฎหมายแพ่งและพาณิชย์</span>
                <span>• กฎหมายอาญา</span>
                <span>• กฎหมายที่ดิน</span>
                <span>• วิธีพิจารณาความอาญา</span>
                <span>• การบริหารกิจการบ้านเมืองที่ดี</span>
                <span>• กฎหมายตำรวจและวินัย</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="text-2xl">🎯</span>
                <strong className="block text-slate-900 dark:text-zinc-50 mt-1">{questionCount} ข้อ</strong>
                <small className="text-slate-500 dark:text-zinc-400 text-xs">สุ่มต่อรอบ</small>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="text-2xl">⚡</span>
                <strong className="block text-slate-900 dark:text-zinc-50 mt-1">เฉลยทันที</strong>
                <small className="text-slate-500 dark:text-zinc-400 text-xs">หลังเลือกคำตอบ</small>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="text-2xl">📚</span>
                <strong className="block text-slate-900 dark:text-zinc-50 mt-1">{items.length} ข้อ</strong>
                <small className="text-slate-500 dark:text-zinc-400 text-xs">คลังข้อความทั้งหมด</small>
              </div>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <Link href={`/courses/${courseId}/${subjectId}/practices`} className="text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline">
                ← กลับไปลานฝึก
              </Link>
              <button onClick={startGame} className="tf-btn-start px-8 py-3.5 rounded-2xl text-base font-bold cursor-pointer">
                🚀 เริ่มเล่นเกม
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    const pct = questionPool.length ? Math.round((score / questionPool.length) * 100) : 0;
    return (
      <div className="course-layout" data-course={courseId}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <style>{trueFalseStyles}</style>
          <div className="tf-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-zinc-50 mb-1">สรุปผลการตัดสิน</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">คุณทบทวนข้อความกฎหมายครบชุดแล้ว</p>
            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="block text-slate-500 dark:text-zinc-400 text-xs mb-1">คะแนนที่ได้</span>
                <strong className="text-xl font-display font-black text-red-700 dark:text-red-400">{score} / {questionPool.length}</strong>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="block text-slate-500 dark:text-zinc-400 text-xs mb-1">เวลาที่ใช้</span>
                <strong className="text-xl font-display font-black text-red-700 dark:text-red-400">{formatTime(seconds)}</strong>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="block text-slate-500 dark:text-zinc-400 text-xs mb-1">ความแม่นยำ</span>
                <strong className="text-xl font-display font-black text-red-700 dark:text-red-400">{pct}%</strong>
              </div>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <button onClick={startGame} className="text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline">🔀 เล่นอีกรอบ</button>
              <Link href={`/courses/${courseId}/${subjectId}/practices`} className="tf-btn-start px-8 py-3.5 rounded-2xl text-base font-bold cursor-pointer text-white no-underline inline-block">
                ← กลับไปลานฝึก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="course-layout" data-course={courseId}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <style>{trueFalseStyles}</style>
        <div className="flex justify-between items-center mb-6 text-sm font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-4 rounded-xl border-2 border-slate-900 dark:border-zinc-700 shadow-[4px_4px_0_var(--color-text)]">
          <Link href={`/courses/${courseId}/${subjectId}/practices`} className="text-slate-500 dark:text-zinc-400 hover:underline">← กลับลานฝึก</Link>
          <div className="flex items-center gap-4">
            <span>⏱️ เวลา: {formatTime(seconds)}</span>
            <span>🎯 คะแนน: {score} / {answeredCount}</span>
          </div>
        </div>

        <div className="tf-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
          <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ height: '100%', width: `${(answeredCount / questionPool.length) * 100}%`, background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)', transition: 'width 0.3s ease' }} />
          </div>
          <div className="mb-6">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase mb-1 block">
              คำถามข้อที่ {idx + 1} จาก {questionPool.length}
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl my-4 text-slate-900 dark:text-zinc-50">
              ข้อความนี้ถูกหรือผิด?
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">อ่านให้จบก่อนตัดสิน เพราะบางข้อมีคำหลอกเรื่องเงื่อนไขหรือระยะเวลา</p>
          </div>
          <div className="rounded-2xl border-2 border-slate-900 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-6 text-left mb-6">
            <p className="text-lg md:text-xl leading-relaxed text-slate-800 dark:text-zinc-100 m-0">{currentItem.statement}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {[
              { value: true, mark: 'T', label: 'ถูกต้อง', desc: 'ข้อความนี้ตรงกับหลักกฎหมาย' },
              { value: false, mark: 'F', label: 'ผิด', desc: 'ข้อความนี้มีจุดคลาดเคลื่อนหรือสลับเงื่อนไข' }
            ].map((choice) => {
              const selected = picked === choice.value;
              const stateClass = !hasAnswered
                ? ''
                : choice.value === currentItem.answer
                  ? ' is-correct'
                  : selected
                    ? ' is-wrong'
                    : ' is-muted';
              return (
                <button
                  key={choice.label}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handlePick(choice.value)}
                  className={`tf-choice ${choice.value ? 'is-true' : 'is-false'}${stateClass} rounded-2xl p-5 text-left cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <span className="tf-choice-mark">{choice.mark}</span>
                    <div>
                      <strong className="tf-choice-label">{choice.label}</strong>
                      <p className="tf-choice-desc">{choice.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {hasAnswered && (
            <div className={`mt-6 p-4 rounded-[14px_4px_14px_4px] text-left border border-dashed ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/40 text-rose-800 dark:text-rose-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{isCorrect ? '✅ ถูกต้อง!' : '❌ ยังไม่ถูก!'}</span>
                <strong className={`font-bold text-sm ${isCorrect ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}`}>
                  คำตอบที่ถูกคือ: {currentItem.answer ? 'ถูกต้อง' : 'ผิด'}
                </strong>
              </div>
              {currentItem.explain && (
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed m-0">
                  {currentItem.explain}
                </p>
              )}
            </div>
          )}
          {hasAnswered && (
            <div className="flex justify-center mt-6">
              <button onClick={handleNext} className="tf-btn-start px-8 py-3 rounded-xl font-bold cursor-pointer">
                {idx + 1 >= questionPool.length ? 'ดูผลการฝึกซ้อม →' : 'ข้อถัดไป →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const trueFalseStyles = `
  .tf-card {
    border: 2px solid var(--color-text);
    box-shadow: 6px 6px 0 var(--color-text);
  }
  .tf-btn-start {
    border: 2px solid var(--color-text);
    box-shadow: 4px 4px 0 var(--color-text);
    background: var(--color-primary);
    color: #fff;
    transition: all 0.15s ease;
  }
  .tf-btn-start:hover {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 var(--color-text);
  }
  .tf-choice {
    position: relative;
    overflow: hidden;
    border: 2px solid rgba(15, 23, 42, 0.9);
    box-shadow: 5px 5px 0 rgba(15, 23, 42, 0.95);
    min-height: 128px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  }
  .tf-choice:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 rgba(15, 23, 42, 0.95);
  }
  .tf-choice.is-true {
    background: linear-gradient(135deg, rgba(236, 253, 245, 0.96), rgba(209, 250, 229, 0.78)), #ffffff;
    color: #064e3b;
  }
  .tf-choice.is-false {
    background: linear-gradient(135deg, rgba(255, 241, 242, 0.98), rgba(254, 226, 226, 0.82)), #ffffff;
    color: #881337;
  }
  .tf-choice::after {
    content: '';
    position: absolute;
    inset: auto -20% -45% 42%;
    height: 120px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.52);
    transform: rotate(-14deg);
    pointer-events: none;
  }
  .tf-choice.is-correct {
    border-color: #10b981;
    color: #065f46;
    box-shadow: 5px 5px 0 #047857;
  }
  .tf-choice.is-wrong {
    border-color: #f43f5e;
    color: #9f1239;
    box-shadow: 5px 5px 0 #be123c;
  }
  .tf-choice.is-muted {
    opacity: 0.58;
    filter: grayscale(0.35);
  }
  .tf-choice-mark {
    width: 56px;
    height: 56px;
    border: 2px solid rgba(255, 255, 255, 0.72);
    border-radius: 18px;
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.16);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 900;
    flex-shrink: 0;
  }
  .tf-choice.is-true .tf-choice-mark {
    background: #059669;
    color: #ffffff;
  }
  .tf-choice.is-false .tf-choice-mark {
    background: #e11d48;
    color: #ffffff;
  }
  .tf-choice-label {
    display: block;
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 900;
    line-height: 1.1;
  }
  .tf-choice-desc {
    margin: 6px 0 0;
    color: currentColor;
    opacity: 0.78;
    font-size: 0.92rem;
    line-height: 1.5;
  }
`;
