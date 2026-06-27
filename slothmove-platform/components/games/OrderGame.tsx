'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { OrderItem } from '@/lib/course-types';
import { saveGameResult } from '@/lib/games-storage';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';



// Helper to format time (mm:ss)
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const THAI_LETTERS = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ'];

export function OrderGame({
  items,
  courseId,
  subjectId
}: {
  items: OrderItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const MAX_QUESTIONS = 10;

  // Game States
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<OrderItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  // Current Question States
  const [currentOrder, setCurrentOrder] = useState<number[]>([]);
  const [initialShuffledOrder, setInitialShuffledOrder] = useState<number[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // History for final review
  const [history, setHistory] = useState<{
    correctSteps: string[];
    userOrder: number[];
    isCorrect: boolean;
    explanation: string;
  }[]>([]);

  // Initialize Game
  const startGame = () => {
    const shuffled = buildDistinctRandomSession(
      distinctScope('order', courseId, subjectId, items.length),
      () => shuffleArray(items).slice(0, MAX_QUESTIONS)
    );
    setQuestions(shuffled);
    setIdx(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setElapsed(0);
    setDone(false);
    setHistory([]);
    setIsPlaying(true);
  };

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !done) {
      timer = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, done]);

  // Load Question Effect
  useEffect(() => {
    if (questions.length > 0 && idx < questions.length) {
      const stepsCount = questions[idx].steps.length;
      const indices = Array.from({ length: stepsCount }, (_, i) => i);
      
      // Shuffle indices (ensure it's not already in correct order)
      let shuffled = shuffleArray(indices);
      let attempts = 0;
      const isSequential = (arr: number[]) => arr.every((v, i) => v === i);
      while (isSequential(shuffled) && attempts < 15 && stepsCount > 1) {
        shuffled = shuffleArray(indices);
        attempts++;
      }

      setCurrentOrder(shuffled);
      setInitialShuffledOrder(shuffled);
      setIsAnswerChecked(false);
      setIsCurrentCorrect(false);
      setShowExplanation(false);
    }
  }, [idx, questions]);

  // Save Results Effect
  useEffect(() => {
    if (done && courseId && subjectId && questions.length > 0) {
      saveGameResult(courseId, subjectId, 'order', {
        score,
        pct: Math.round((correctCount / Math.min(MAX_QUESTIONS, questions.length)) * 100),
        correct: correctCount,
        wrong: wrongCount,
        total: Math.min(MAX_QUESTIONS, questions.length),
        durationSec: elapsed
      });
    }
  }, [done, courseId, subjectId, questions.length, score, correctCount, wrongCount, elapsed]);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-xl text-gray-500">ยังไม่มีข้อมูลเกมนี้</p>
      </div>
    );
  }

  const currentQuestion = questions[idx];

  // Move Item logic
  const moveUp = (i: number) => {
    if (i === 0 || isAnswerChecked) return;
    const next = [...currentOrder];
    const temp = next[i];
    next[i] = next[i - 1];
    next[i - 1] = temp;
    setCurrentOrder(next);
  };

  const moveDown = (i: number) => {
    if (i === currentOrder.length - 1 || isAnswerChecked) return;
    const next = [...currentOrder];
    const temp = next[i];
    next[i] = next[i + 1];
    next[i + 1] = temp;
    setCurrentOrder(next);
  };

  // Action logic
  const checkAnswer = () => {
    const isCorrect = currentOrder.every((val, i) => val === i);
    setIsCurrentCorrect(isCorrect);
    setIsAnswerChecked(true);
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore((s) => s + 10);
      setCorrectCount((c) => c + 1);
    } else {
      setScore((s) => Math.max(0, s - 1)); // deduct 1 point on wrong
      setWrongCount((w) => w + 1);
    }

    setHistory((prev) => [
      ...prev,
      {
        correctSteps: currentQuestion.steps,
        userOrder: currentOrder,
        isCorrect,
        explanation: currentQuestion.explain || ''
      }
    ]);
  };

  const skipQuestion = () => {
    setWrongCount((w) => w + 1);
    setHistory((prev) => [
      ...prev,
      {
        correctSteps: currentQuestion.steps,
        userOrder: currentOrder,
        isCorrect: false,
        explanation: currentQuestion.explain || ''
      }
    ]);
    moveToNext();
  };

  const moveToNext = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
      setIsPlaying(false);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const resetOrder = () => {
    if (isAnswerChecked) return;
    setCurrentOrder(initialShuffledOrder);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 1: Intro Splash
  // ──────────────────────────────────────────────────────────────────────────
  if (!isPlaying && !done) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <style>{`
          .od-brutal-card {
            border: 2px solid var(--color-text);
            box-shadow: 6px 6px 0 var(--color-text);
          }
          .od-btn-start {
            border: 2px solid var(--color-text);
            box-shadow: 4px 4px 0 var(--color-text);
            background: var(--color-primary);
            color: #fff;
            transition: all 0.15s ease;
          }
          .od-btn-start:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 var(--color-text);
          }
          .od-btn-start:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 var(--color-text);
          }
        `}</style>

        <div className="od-brutal-card bg-white p-8 rounded-xl text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200">
            <span className="text-4xl">📋</span>
          </div>

          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full uppercase tracking-wider">
            วิชาภาษาไทย
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-4 font-display">
            เกมจัดแถวประโยค
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto mb-8 text-base">
            ฝึกทักษะการเรียงลำดับย่อหน้า ข้อความ หรือขั้นตอนการดำเนินงานทางภาษาไทยให้สละสลวย ถูกหลักโครงสร้าง และสมเหตุสมผลตามเนื้อเรื่อง
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm font-bold text-gray-800">{MAX_QUESTIONS} ข้อ</div>
              <div className="text-xs text-gray-500">จำนวนโจทย์ต่อรอบ</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-sm font-bold text-gray-800">จับเวลา</div>
              <div className="text-xs text-gray-500">นับเวลาเดินหน้า</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl mb-1">💡</div>
              <div className="text-sm font-bold text-gray-800">คำอธิบาย</div>
              <div className="text-xs text-gray-500">เฉลยละเอียดทุกข้อ</div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="od-btn-start px-8 py-4 rounded-lg font-bold text-lg cursor-pointer"
          >
            เริ่มเกมจัดแถวประโยค
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 2: Play Loop
  // ──────────────────────────────────────────────────────────────────────────
  if (isPlaying && currentQuestion) {
    const totalQ = Math.min(MAX_QUESTIONS, questions.length);
    const progressPct = ((idx) / totalQ) * 100;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <style>{`
          .od-item-card {
            border: 2px solid var(--color-border);
            transition: all 0.2s ease;
          }
          .od-item-card:hover {
            border-color: var(--color-primary);
            background-color: var(--color-bg-warm);
          }
          .od-item-correct {
            border-color: #10b981 !important;
            background-color: #ecfdf5 !important;
          }
          .od-item-wrong {
            border-color: #ef4444 !important;
            background-color: #fef2f2 !important;
          }
          .od-badge-letter {
            background-color: var(--color-primary);
            color: #fff;
          }
          .od-btn-control {
            border: 1px solid var(--color-border);
            background: #fff;
            transition: all 0.15s ease;
          }
          .od-btn-control:hover:not(:disabled) {
            background: var(--color-bg-warm);
            border-color: var(--color-primary);
          }
        `}</style>

        {/* Top Header stats bar */}
        <div className="flex justify-between items-center mb-4 text-sm font-semibold text-gray-700 bg-white p-4 rounded-lg border border-gray-200">
          <div>
            ข้อ <span className="text-lg text-red-700 font-bold">{idx + 1}</span> / {totalQ}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">⏱️ เวลา:</span>
            <span className="font-mono text-lg font-bold text-red-700">{formatTime(elapsed)}</span>
          </div>
          <div>
            คะแนน: <span className="text-lg text-amber-600 font-bold">{score}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="bg-red-700 h-2 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Prompt Card */}
        <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-2 font-display">
            {currentQuestion.question}
          </h2>
          <p className="text-sm text-gray-500">
            📋 ใช้ปุ่ม ▲ หรือ ▼ สลับลำดับเพื่อเรียงข้อความให้ถูกต้องตามลำดับเหตุการณ์หรือโครงสร้างภาษาไทยที่เหมาะสม
          </p>
        </div>

        {/* Reordering List */}
        <div className="space-y-3 mb-6">
          {currentOrder.map((stepIdx, i) => {
            const isFirst = i === 0;
            const isLast = i === currentOrder.length - 1;

            // Highlight class based on evaluation
            let statusClass = '';
            if (isAnswerChecked) {
              statusClass = stepIdx === i ? 'od-item-correct' : 'od-item-wrong';
            }

            return (
              <div
                key={stepIdx}
                className={`od-item-card flex items-stretch bg-white rounded-lg overflow-hidden shadow-sm ${statusClass}`}
              >
                {/* Badge Column (Displays Position or correct ID) */}
                <div className="w-12 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-100 font-bold text-sm text-gray-600">
                  {isAnswerChecked ? (
                    <div className="od-badge-letter w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold">
                      {THAI_LETTERS[stepIdx] || stepIdx + 1}
                    </div>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 p-4 text-gray-800 text-sm md:text-base flex items-center leading-relaxed font-body">
                  {currentQuestion.steps[stepIdx]}
                </div>

                {/* Controls (Disabled after check) */}
                {!isAnswerChecked && (
                  <div className="w-16 flex flex-col justify-center gap-1 p-2 bg-gray-50 border-l border-gray-100 flex-shrink-0">
                    <button
                      onClick={() => moveUp(i)}
                      disabled={isFirst}
                      className="od-btn-control h-8 rounded text-xs flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="เลื่อนขึ้น"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(i)}
                      disabled={isLast}
                      className="od-btn-control h-8 rounded text-xs flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="เลื่อนลง"
                    >
                      ▼
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Alert box */}
        {showExplanation && (
          <div className="mb-6 animate-fadeIn">
            {isCurrentCorrect ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 mb-3 font-semibold flex items-center gap-2">
                <span className="text-xl">✓</span> ถูกต้องยอดเยี่ยม! ได้รับ +10 คะแนน
              </div>
            ) : (
              <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 mb-3 flex flex-col gap-2">
                <span className="font-semibold text-lg flex items-center gap-2">
                  <span className="text-xl">✗</span> ยังไม่ถูก (หักคะแนน 1 แต้ม)
                </span>
                <span className="text-sm font-semibold">
                  เฉลยที่ถูกต้อง: {currentQuestion.steps.map((_, sIdx) => THAI_LETTERS[sIdx]).join(' ➔ ')}
                </span>
              </div>
            )}

            {currentQuestion.explain && (
              <div className="p-4 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 text-sm leading-relaxed shadow-inner">
                <div className="font-bold mb-1 flex items-center gap-1">
                  <span>💡</span> คำอธิบาย:
                </div>
                <div dangerouslySetInnerHTML={{ __html: currentQuestion.explain }} />
              </div>
            )}
          </div>
        )}

        {/* Buttons Controls */}
        <div className="flex gap-4 justify-center">
          {!isAnswerChecked ? (
            <>
              <button
                onClick={resetOrder}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                ↺ รีเซ็ต
              </button>
              <button
                onClick={skipQuestion}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-500 bg-white hover:bg-gray-50 transition"
              >
                ข้ามข้อ
              </button>
              <button
                onClick={checkAnswer}
                className="px-8 py-3 bg-red-800 text-white rounded-lg font-bold hover:bg-red-900 transition shadow-sm"
              >
                ตรวจคำตอบ
              </button>
            </>
          ) : (
            <button
              onClick={moveToNext}
              className="px-10 py-4 bg-red-800 text-white rounded-lg font-bold hover:bg-red-900 transition shadow-md"
            >
              {idx + 1 >= totalQ ? 'ดูสรุปคะแนน →' : 'ข้อถัดไป →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 3: Final Done / Review Stats
  // ──────────────────────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const passed = pct >= 60;

    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <style>{`
          .od-brutal-card {
            border: 2px solid var(--color-text);
            box-shadow: 6px 6px 0 var(--color-text);
          }
        `}</style>

        <div className="od-brutal-card bg-white p-8 rounded-xl shadow-lg mb-8 text-center">
          <div className="text-6xl mb-4">{passed ? '🎉' : '🛡️'}</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-display">
            {passed ? 'จัดแถวประโยคสำเร็จ!' : 'การฝึกฝนเสร็จสิ้น'}
          </h1>
          <p className="text-gray-500 mb-6">
            คุณได้ทำการทดสอบเกมจัดแถวประโยคครบ {questions.length} ข้อเรียบร้อยแล้ว
          </p>

          <div className="flex items-center justify-center mb-8">
            <div className="relative w-36 h-36 flex flex-col items-center justify-center rounded-full border-8 border-gray-100 bg-gray-50 shadow-inner">
              <span className="text-3xl font-black text-red-800">{score}</span>
              <span className="text-xs text-gray-500 font-semibold mt-1">คะแนนรวม</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto mb-8">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 font-semibold">เวลาทั้งหมด</div>
              <div className="text-base font-bold text-gray-800 mt-1">{formatTime(elapsed)}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-xs text-emerald-600 font-semibold">ถูกต้อง</div>
              <div className="text-base font-bold text-emerald-800 mt-1">{correctCount} ข้อ</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xs text-red-600 font-semibold">ผิด/ข้าม</div>
              <div className="text-base font-bold text-red-800 mt-1">{wrongCount} ข้อ</div>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-xs text-indigo-600 font-semibold">เปอร์เซ็นต์</div>
              <div className="text-base font-bold text-indigo-800 mt-1">{pct}%</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="px-6 py-3 bg-red-800 text-white rounded-lg font-bold hover:bg-red-900 transition shadow-sm"
            >
              🔄 เล่นอีกครั้ง
            </button>
            <Link
              href={`/courses/police_admin/thai`}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              🏠 กลับหน้าวิชา
            </Link>
          </div>
        </div>

        {/* Review Log Panel */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-display flex items-center gap-2">
            <span>📋</span> สรุปบันทึกการทำคำถามทบทวน
          </h2>
          
          <div className="space-y-6">
            {history.map((hist, hIdx) => {
              return (
                <div key={hIdx} className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                    <span className="font-bold text-gray-800 text-sm">
                      ข้อที่ {hIdx + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      hist.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {hist.isCorrect ? '✓ ถูกต้อง' : '✗ ยังไม่ถูก'}
                    </span>
                  </div>

                  {/* Shuffled/User sequence overview */}
                  <div className="mb-4 space-y-1.5">
                    <div className="text-xs text-gray-500 font-semibold mb-1">ลำดับที่ถูกต้อง:</div>
                    {hist.correctSteps.map((stepText, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 bg-white p-2 rounded border border-gray-100 text-sm font-body">
                        <span className="w-5 h-5 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-xs font-bold font-display flex-shrink-0">
                          {THAI_LETTERS[sIdx]}
                        </span>
                        <span className="text-gray-700 leading-relaxed">{stepText}</span>
                      </div>
                    ))}
                  </div>

                  {hist.explanation && (
                    <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded border border-amber-200 leading-relaxed font-body">
                      <span className="font-bold block mb-1">💡 คำอธิบายเฉลย:</span>
                      <div dangerouslySetInnerHTML={{ __html: hist.explanation }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
