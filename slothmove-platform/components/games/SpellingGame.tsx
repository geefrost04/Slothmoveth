'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { SpellingItem } from '@/lib/course-types';
import { saveGameResult } from '@/lib/games-storage';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';

// Helper to scramble array
function scramble(word: string): string[] {
  const chars = word.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars;
}



// Helper to format time (mm:ss)
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function SpellingGame({
  items,
  courseId,
  subjectId
}: {
  items: SpellingItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const isBombDefusal = items.length > 0 && items[0].isCorrectSpelling !== undefined;

  if (isBombDefusal) {
    return <BombDefusalGame items={items} courseId={courseId} subjectId={subjectId} />;
  }

  return <AnagramSpellingGame items={items} />;
}

// ──────────────────────────────────────────────────────────────────────────
// BOMB DEFUSAL GAME (Thai Subject Style)
// ──────────────────────────────────────────────────────────────────────────
function BombDefusalGame({
  items,
  courseId,
  subjectId
}: {
  items: SpellingItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const MAX_QUESTIONS = 10;
  const TIME_PER_QUESTION = 10; // seconds

  // Game States
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<SpellingItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeoutCount, setTimeoutCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [questionLocked, setQuestionLocked] = useState(false);
  
  // Timer States
  const [remainingTime, setRemainingTime] = useState(TIME_PER_QUESTION);
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentIsCorrect, setCurrentIsCorrect] = useState(false);
  const [currentIsTimeout, setCurrentIsTimeout] = useState(false);
  
  // Flash effect state
  const [flashType, setFlashType] = useState<'correct' | 'wrong' | 'timeout' | null>(null);

  // Results log
  const [resultsLog, setResultsLog] = useState<{
    word: string;
    correctSpelling: string;
    rule: string;
    userAnswer: 'correct' | 'wrong' | null;
    isCorrect: boolean;
    timeout: boolean;
  }[]>([]);

  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and start a new game session
  const startNewGame = () => {
    const selectedPool = buildDistinctRandomSession(
      distinctScope('spelling', courseId, subjectId, items.length),
      () => shuffleArray(items).slice(0, Math.min(MAX_QUESTIONS, items.length))
    );
    setQuestions(selectedPool);
    setIdx(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeoutCount(0);
    setLives(3);
    setElapsed(0);
    setDone(false);
    setIsWin(false);
    setQuestionLocked(false);
    setShowFeedback(false);
    setFlashType(null);
    setResultsLog([]);
    setRemainingTime(TIME_PER_QUESTION);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  // Total elapsed timer effect
  useEffect(() => {
    if (isPlaying && !done) {
      const startTime = Date.now() - elapsed * 1000;
      totalTimerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (totalTimerRef.current) {
        clearInterval(totalTimerRef.current);
        totalTimerRef.current = null;
      }
    }
    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [isPlaying, done]);

  // Question countdown timer effect
  useEffect(() => {
    if (isPlaying && !done && !questionLocked) {
      setRemainingTime(TIME_PER_QUESTION);
      const deadline = Date.now() + TIME_PER_QUESTION * 1000;
      
      questionTimerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        setRemainingTime(remaining);
        
        if (remaining <= 0) {
          if (questionTimerRef.current) clearInterval(questionTimerRef.current);
          handleTimeout();
        }
      }, 250);
    } else {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    }
    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [isPlaying, done, idx, questionLocked]);

  // Trigger brief screen flash overlay
  const triggerFlash = (type: 'correct' | 'wrong' | 'timeout') => {
    setFlashType(type);
    setTimeout(() => {
      setFlashType(null);
    }, 250);
  };

  // Handle timeout (time runs out)
  const handleTimeout = () => {
    if (questionLocked || done) return;
    setQuestionLocked(true);
    triggerFlash('timeout');
    
    const currentQuestion = questions[idx];
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setIsWin(false);
        setTimeout(() => {
          setDone(true);
          setIsPlaying(false);
        }, 900);
      }
      return nextLives;
    });
    
    setTimeoutCount((c) => c + 1);
    setCurrentIsCorrect(false);
    setCurrentIsTimeout(true);
    setShowFeedback(true);

    setResultsLog((prev) => [
      ...prev,
      {
        word: currentQuestion.word,
        correctSpelling: currentQuestion.correctSpelling || currentQuestion.word,
        rule: currentQuestion.rule || '',
        userAnswer: null,
        isCorrect: false,
        timeout: true
      }
    ]);

    feedbackTimeoutRef.current = setTimeout(() => {
      moveToNextQuestion();
    }, 900);
  };

  // Submit Answer handler
  const submitAnswer = (userSaysCorrect: boolean) => {
    if (questionLocked || done) return;
    setQuestionLocked(true);

    const currentQuestion = questions[idx];
    const isAnswerCorrect = userSaysCorrect === currentQuestion.isCorrectSpelling;

    if (isAnswerCorrect) {
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 10);
      triggerFlash('correct');
      setCurrentIsCorrect(true);
      setCurrentIsTimeout(false);
    } else {
      setWrongCount((w) => w + 1);
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setIsWin(false);
          setTimeout(() => {
            setDone(true);
            setIsPlaying(false);
          }, 900);
        }
        return nextLives;
      });
      triggerFlash('wrong');
      setCurrentIsCorrect(false);
      setCurrentIsTimeout(false);
    }

    setResultsLog((prev) => [
      ...prev,
      {
        word: currentQuestion.word,
        correctSpelling: currentQuestion.correctSpelling || currentQuestion.word,
        rule: currentQuestion.rule || '',
        userAnswer: userSaysCorrect ? 'correct' : 'wrong',
        isCorrect: isAnswerCorrect,
        timeout: false
      }
    ]);

    setShowFeedback(true);

    feedbackTimeoutRef.current = setTimeout(() => {
      moveToNextQuestion();
    }, 900);
  };

  const moveToNextQuestion = () => {
    setShowFeedback(false);
    
    setLives((currentLives) => {
      if (currentLives <= 0) return 0;
      
      setIdx((currentIdx) => {
        const nextIdx = currentIdx + 1;
        if (nextIdx >= questions.length) {
          setIsWin(true);
          setDone(true);
          setIsPlaying(false);
        } else {
          setQuestionLocked(false);
        }
        return nextIdx;
      });
      
      return currentLives;
    });
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || done || questionLocked) return;
      if (e.key === '1' || e.key === 'ArrowLeft') {
        e.preventDefault();
        submitAnswer(true);
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        e.preventDefault();
        submitAnswer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, done, questionLocked, idx, questions]);

  // Persist result when finished
  useEffect(() => {
    if (done && courseId && subjectId) {
      saveGameResult(courseId, subjectId, 'spelling', {
        score,
        pct: Math.round((correctCount / Math.min(MAX_QUESTIONS, questions.length)) * 100),
        correct: correctCount,
        wrong: wrongCount + timeoutCount,
        total: Math.min(MAX_QUESTIONS, questions.length),
        durationSec: elapsed
      });
    }
  }, [done, courseId, subjectId, questions.length, score, correctCount, wrongCount, timeoutCount, elapsed]);

  // Render lives heart indicator
  const renderLives = (n: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className={i < n ? 'text-red-600' : 'opacity-25 grayscale'}>
        ❤️
      </span>
    ));
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 1: Intro Splash
  // ──────────────────────────────────────────────────────────────────────────
  if (!isPlaying && !done) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <style>{`
          .sp-brutal-card {
            border: 2px solid var(--color-text);
            box-shadow: 6px 6px 0 var(--color-text);
          }
          .sp-btn-start {
            border: 2px solid var(--color-text);
            box-shadow: 4px 4px 0 var(--color-text);
            background: var(--color-primary);
            color: #fff;
            transition: all 0.15s ease;
          }
          .sp-btn-start:hover {
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0 var(--color-text);
          }
          .sp-btn-start:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 var(--color-text);
          }
        `}</style>
        
        <div className="sp-brutal-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-700 via-amber-500 to-red-700"></div>
          
          <span className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/40 text-xs font-bold uppercase tracking-wider">
            💣 เกมกู้ระเบิดสะกดคำ
          </span>
          
          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-zinc-50 mb-3">
            พร้อมกู้ระเบิดสะกดคำไทย?
          </h2>
          
          <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed mb-8">
            ตัดสินใจให้เร็วว่าคำที่เห็นสะกดถูกหรือผิด — มีเฉลยอธิบายกฎการสะกดทุกข้อ เพื่อเตรียมตัวสอบนายสิบตำรวจ สายอำนวยการอย่างรวดเร็ว
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
            <div className="p-4 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">📖</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100">1. ดูคำ</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                คำศัพท์ปรากฏตรงกลางจอ พร้อมจับเวลา 10 วินาทีต่อข้อ
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">🧐</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100">2. วิเคราะห์</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                พิจารณาตัวสะกดและสระว่าสะกดถูกต้องตามหลักภาษาไทยหรือไม่
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">💣</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100">3. เลือก</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                กดปุ่ม ถูกต้อง / ผิด หรือใช้ปุ่มคีย์บอร์ด 1 / 2 ก่อนที่เวลาจะหมด
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-8 mb-8 py-3 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200/50 dark:border-red-900/30">
            <div className="text-center">
              <span className="block text-2xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">จำนวนโจทย์</span>
              <span className="text-lg font-display font-black text-slate-900 dark:text-zinc-50">{Math.min(MAX_QUESTIONS, items.length)} ข้อ</span>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-zinc-800 px-8">
              <span className="block text-2xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">พลังชีวิต</span>
              <span className="text-lg font-display font-black text-red-600">3 ดวง ❤️</span>
            </div>
            <div className="text-center">
              <span className="block text-2xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">เวลาต่อข้อ</span>
              <span className="text-lg font-display font-black text-amber-600 dark:text-amber-400">10 วินาที ⏱️</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={startNewGame}
              className="sp-btn-start px-8 py-3.5 rounded-2xl text-base font-bold flex items-center gap-2"
            >
              💣 เริ่มกู้ระเบิดสะกดคำ
            </button>
            <Link
              href={`/courses/${courseId}/${subjectId}/practices`}
              className="text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline"
            >
              ← กลับไปลานฝึก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 3: Done / Results Page (Win / Fail Overlay)
  // ──────────────────────────────────────────────────────────────────────────
  if (done) {
    const accuracyPct = Math.round((correctCount / Math.min(MAX_QUESTIONS, questions.length)) * 100);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <style>{`
          .sp-win-card {
            border: 2px solid var(--color-text);
            box-shadow: 6px 6px 0 var(--color-text);
          }
          .sp-results-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
          }
          .sp-results-table th, .sp-results-table td {
            padding: 10px 12px;
            border-bottom: 1px solid var(--color-border);
            text-align: left;
          }
          .sp-results-table th {
            font-family: var(--font-display);
            font-weight: 700;
            background: var(--color-bg-warm, #f8f6f0);
            color: var(--color-text);
          }
        `}</style>

        <div className="sp-win-card bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-700 via-amber-500 to-red-700"></div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{isWin ? '🏆' : '💥'}</div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-zinc-50 mb-1">
              {isWin ? 'กู้ระเบิดสำเร็จ!' : 'ระเบิดทำงาน!'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              {isWin ? 'คุณมีความแม่นยำและรวดเร็วในการสะกดคำภาษาไทยสูงมาก' : 'พลังชีวิตคุณหมดลงเสียก่อน ทบทวนการสะกดแล้วลองใหม่อีกครั้ง'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl">
              <span className="block text-3xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">เวลา</span>
              <span className="text-lg font-display font-black text-slate-900 dark:text-zinc-50">{formatTime(elapsed)}</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl">
              <span className="block text-3xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">คะแนนรวม</span>
              <span className="text-lg font-display font-black text-amber-700 dark:text-amber-400">{score} แต้ม</span>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-2xl">
              <span className="block text-3xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">ตอบถูก</span>
              <span className="text-lg font-display font-black text-green-700 dark:text-green-400">{correctCount} ข้อ</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl">
              <span className="block text-3xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">ความแม่นยำ</span>
              <span className="text-lg font-display font-black text-slate-700 dark:text-zinc-300">{accuracyPct}%</span>
            </div>
          </div>

          <div className="mb-8 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
            <div className="px-4 py-3 bg-slate-100 dark:bg-zinc-800 border-b-2 border-slate-200 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              📊 สรุปประวัติการกู้ระเบิด
            </div>
            <div className="overflow-x-auto">
              <table className="sp-results-table">
                <thead>
                  <tr>
                    <th>คำศัพท์ที่ตรวจ</th>
                    <th>สถานะ</th>
                    <th>คำสะกดที่ถูกต้อง</th>
                  </tr>
                </thead>
                <tbody>
                  {resultsLog.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-900">
                      <td className="font-display font-semibold text-slate-900 dark:text-zinc-50">{log.word}</td>
                      <td>
                        {log.timeout ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold">
                            ⏰ หมดเวลา
                          </span>
                        ) : log.isCorrect ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 text-xs font-bold">
                            ✅ ถูกต้อง
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 text-xs font-bold">
                            ❌ ผิดพลาด
                          </span>
                        )}
                      </td>
                      <td className="text-xs">
                        <strong className="font-display text-sm text-green-700 dark:text-green-400 block mb-1">
                          {log.correctSpelling}
                        </strong>
                        <span className="text-slate-600 dark:text-zinc-400 leading-relaxed block">
                          {log.rule}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={startNewGame}
              className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white font-bold text-sm border-2 border-slate-900 dark:border-zinc-700 hover:opacity-90 transition-opacity"
            >
              🔀 ลองอีกรอบ
            </button>
            <Link
              href={`/courses/${courseId}/${subjectId}/practices`}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors inline-block text-center"
            >
              ← กลับไปลานฝึก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 2: Active Gameplay Screen
  // ──────────────────────────────────────────────────────────────────────────
  const currentQuestion = questions[idx];
  const timeBarPct = (remainingTime / TIME_PER_QUESTION) * 100;
  const isTimeUrgent = remainingTime <= 3;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <style>{`
        .sp-game-card {
          border: 2px solid var(--color-text);
          box-shadow: 6px 6px 0 var(--color-text);
          background: var(--color-surface);
        }
        .sp-bar-panel {
          border: 2px solid var(--color-text);
          box-shadow: 4px 4px 0 var(--color-text);
          background: var(--color-surface);
        }
        .sp-bomb-panel {
          border: 2px solid var(--color-text);
          background: var(--color-surface);
        }
        .sp-word-box {
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
        }
        .sp-btn-ans {
          border: 2px solid var(--color-text);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sp-btn-ans:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 4px 4px 0 var(--color-text);
        }
        .sp-btn-ans:active:not(:disabled) {
          transform: translateY(1px);
          box-shadow: 1px 1px 0 var(--color-text);
        }
        .sp-btn-ans.correct:hover:not(:disabled) {
          background: #e7f5ec;
          border-color: #10b981;
        }
        .sp-btn-ans.wrong:hover:not(:disabled) {
          background: #fdebed;
          border-color: #ef4444;
        }
        .sp-flash-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          animation: fadeOut 0.25s forwards;
        }
        @keyframes fadeOut {
          0% { opacity: 0.35; }
          100% { opacity: 0; }
        }
        .sp-shake-word {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>

      {/* Screen flash feedback overlay */}
      {flashType === 'correct' && <div className="sp-flash-overlay bg-emerald-500"></div>}
      {flashType === 'wrong' && <div className="sp-flash-overlay bg-red-500"></div>}
      {flashType === 'timeout' && <div className="sp-flash-overlay bg-amber-500"></div>}

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3 mb-6 text-center">
        <div className="sp-bar-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">⏱ เวลาทั้งหมด</span>
          <span className="text-lg font-display font-black text-slate-900 dark:text-zinc-50">{formatTime(elapsed)}</span>
        </div>
        <div className="sp-bar-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">🎯 คะแนน</span>
          <span className="text-lg font-display font-black text-slate-900 dark:text-zinc-50">{score}</span>
        </div>
        <div className="sp-bar-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">✅ ถูก</span>
          <span className="text-lg font-display font-black text-green-700 dark:text-green-400">{correctCount}</span>
        </div>
        <div className="sp-bar-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">❌ ผิด / ข้าม</span>
          <span className="text-lg font-display font-black text-red-700 dark:text-red-400">{wrongCount + timeoutCount}</span>
        </div>
      </div>

      {/* Bomb Timer panel */}
      <div className="sp-bomb-panel rounded-3xl p-5 mb-6 border-2 shadow-[4px_4px_0_var(--color-text)]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-bold text-xs uppercase text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
            <span className={`text-lg ${isTimeUrgent ? 'animate-bounce' : ''}`}>💣</span> 
            ระเบิดจะระเบิดใน
          </span>
          <div className="sp-lives flex gap-1 text-sm md:text-base select-none">
            {renderLives(lives)}
          </div>
        </div>
        <div className="relative h-4 bg-slate-100 dark:bg-zinc-800 border-2 border-slate-900 dark:border-zinc-700 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-linear ${
              isTimeUrgent ? 'bg-red-600 animate-pulse' : 'bg-amber-500'
            }`}
            style={{ width: `${timeBarPct}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center font-display text-2xs font-extrabold text-slate-900 dark:text-zinc-100 text-shadow-sm">
            {remainingTime} วินาที
          </span>
        </div>
      </div>

      {/* Instruction shortcut help */}
      <div className="bg-amber-50/50 dark:bg-amber-950/10 border-2 border-amber-500/30 rounded-2xl p-3 mb-6 text-center text-xs text-slate-700 dark:text-zinc-400">
        💡 <strong>คีย์บอร์ดชอร์ตคัต:</strong> กดปุ่ม <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border-2 rounded">1</kbd> = <strong>สะกดถูก</strong> · กดปุ่ม <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border-2 rounded">2</kbd> = <strong>สะกดผิด</strong>
      </div>

      {/* Word Card */}
      {currentQuestion && (
        <div className="sp-game-card rounded-3xl p-6 md:p-8 relative overflow-hidden border-2 mb-6">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-700 via-amber-500 to-red-700"></div>

          <div className="sp-card-meta flex justify-between items-center mb-6">
            <span className="inline-flex px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 text-2xs font-bold uppercase tracking-wider">
              สะกดคำ
            </span>
            <span className="font-display font-bold text-xs text-slate-500">
              คำถามข้อที่ <strong className="text-lg text-slate-900 dark:text-zinc-50">{idx + 1}</strong> / {questions.length}
            </span>
          </div>

          <div
            className={`sp-word-box text-center font-serif font-black text-4xl md:text-5xl py-8 mb-6 ${
              showFeedback
                ? currentQuestion.isCorrectSpelling
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400 sp-shake-word'
                : 'text-slate-900 dark:text-zinc-50'
            }`}
          >
            {currentQuestion.word}
          </div>

          {/* Feedback banner inside card */}
          {showFeedback && (
            <div
              className={`p-4 border-2 rounded-2xl mb-6 text-center animate-pulse ${
                currentIsTimeout
                  ? 'bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400'
                  : currentIsCorrect
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400'
                    : 'bg-red-50 border-red-500 text-red-800 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400'
              }`}
            >
              <span className="block font-display font-black text-sm uppercase mb-1">
                {currentIsTimeout
                  ? '⏰ หมดเวลา! เสียหัวใจ 1 ดวง'
                  : currentIsCorrect
                    ? '✓ ถูกต้อง! +10 คะแนน'
                    : '✗ ผิดพลาด! เสียหัวใจ 1 ดวง'}
              </span>
              <p className="text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                คำที่ถูกต้องคือ <strong className="font-display underline text-sm text-green-700 dark:text-green-400">{currentQuestion.correctSpelling}</strong> — {currentQuestion.rule}
              </p>
            </div>
          )}

          {/* Answer buttons */}
          <div className="sp-answers grid grid-cols-2 gap-4">
            <button
              disabled={questionLocked}
              onClick={() => submitAnswer(true)}
              className="sp-btn-ans correct bg-white dark:bg-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center disabled:opacity-55"
            >
              <span className="text-2xl">✅</span>
              <strong className="font-display font-black text-sm text-slate-800 dark:text-zinc-100">ถูกต้อง</strong>
              <span className="text-3xs text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">กด 1 หรือ Left</span>
            </button>
            <button
              disabled={questionLocked}
              onClick={() => submitAnswer(false)}
              className="sp-btn-ans wrong bg-white dark:bg-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center disabled:opacity-55"
            >
              <span className="text-2xl">❌</span>
              <strong className="font-display font-black text-sm text-slate-800 dark:text-zinc-100">สะกดผิด</strong>
              <span className="text-3xs text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">กด 2 หรือ Right</span>
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => {
            if (confirm('สับเปลี่ยนโจทย์และเริ่มใหม่?')) startNewGame();
          }}
          className="px-5 py-2.5 rounded-xl border-2 font-bold text-xs bg-white dark:bg-zinc-900 border-slate-900 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          🔀 สับโจทย์ใหม่
        </button>
        <button
          onClick={() => {
            if (confirm('เริ่มเล่นเกมใหม่? สถิติปัจจุบันจะรีเซ็ต')) startNewGame();
          }}
          className="px-5 py-2.5 rounded-xl border-2 font-bold text-xs bg-white dark:bg-zinc-900 border-slate-900 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
        >
          ↻ เริ่มใหม่
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ANAGRAM GAME (Legacy/Fallback Spelling Style)
// ──────────────────────────────────────────────────────────────────────────
function AnagramSpellingGame({ items }: { items: SpellingItem[] }) {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!items.length) return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีข้อมูล</p>;
  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: 32 }}>
        <h2>เสร็จแล้ว!</h2>
        <p style={{ fontSize: 24, marginTop: 12 }}>คะแนน: {score}/{items.length}</p>
        <button
          className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl border-2 border-slate-900 hover:opacity-90"
          onClick={() => { setIdx(0); setPicks([]); setShowResult(false); setScore(0); setDone(false); }}
        >
          เริ่มใหม่
        </button>
      </div>
    );
  }

  const item = items[idx];
  const scrambled = scramble(item.word);

  function pickChar(char: string, idx: number) {
    if (showResult || picks.includes(`${char}-${idx}`)) return;
    setPicks([...picks, `${char}-${idx}`]);
  }

  function unpick(charKey: string) {
    if (showResult) return;
    setPicks(picks.filter((p) => p !== charKey));
  }

  function check() {
    const attempt = picks.map((k) => k.split('-')[0]).join('');
    if (attempt === item.word) setScore((s) => s + 1);
    setShowResult(true);
  }

  function next() {
    if (idx + 1 >= items.length) setDone(true);
    else { setIdx(idx + 1); setPicks([]); setShowResult(false); }
  }

  function reset() { setPicks([]); }

  const attempt = picks.map((k) => k.split('-')[0]).join('');
  const isCorrect = attempt === item.word;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>
        ข้อ {idx + 1} / {items.length} · คะแนน {score}
      </p>
      <h2 style={{ fontSize: 20, color: 'var(--color-primary)', marginBottom: 16 }}>
        ✍️ เรียงตัวอักษรเป็นคำที่ตรงกับความหมาย
      </h2>
      <p style={{ fontSize: 18, color: 'var(--color-text-muted)', marginBottom: 8 }}>
        "{item.definition}"
      </p>
      {item.hint && <p style={{ fontSize: 13, color: 'var(--color-accent)', marginBottom: 20 }}>💡 {item.hint}</p>}

      <div style={{
        minHeight: 56, padding: '12px 16px',
        background: 'var(--color-surface)',
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 24, fontSize: 24, fontWeight: 700, letterSpacing: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        color: showResult ? (isCorrect ? 'var(--color-success)' : 'var(--color-accent)') : 'var(--color-primary)'
      }}>
        {picks.length === 0 ? (
          <span style={{ color: 'var(--color-text-muted)', fontSize: 14, fontWeight: 400 }}>กดตัวอักษรด้านล่างเพื่อเรียงคำ</span>
        ) : (
          picks.map((k, i) => {
            const ch = k.split('-')[0];
            return (
              <button key={i} onClick={() => unpick(k)} disabled={showResult}
                style={{
                  width: 36, height: 44,
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-primary)',
                  borderRadius: 6, fontSize: 22, fontWeight: 700,
                  cursor: showResult ? 'default' : 'pointer'
                }}>{ch}</button>
            );
          })
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
        {scrambled.map((char, i) => {
          const used = picks.includes(`${char}-${i}`);
          return (
            <button key={i} onClick={() => pickChar(char, i)} disabled={used || showResult}
              style={{
                width: 48, height: 56,
                background: used ? 'var(--color-border)' : 'var(--color-surface)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 24, fontWeight: 700,
                color: used ? 'var(--color-text-muted)' : 'var(--color-primary)',
                opacity: used ? 0.4 : 1,
                cursor: used || showResult ? 'default' : 'pointer'
              }}>{char}</button>
          );
        })}
      </div>

      {showResult && (
        <p style={{ padding: 12, background: isCorrect ? '#d4edda' : '#f8d7da', borderRadius: 8, marginBottom: 16, fontSize: 15 }}>
          {isCorrect ? '✅ ถูกต้อง!' : `❌ คำตอบที่ถูก: "${item.word}"`}
        </p>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {!showResult ? (
          <>
            <button className="px-5 py-2.5 font-bold rounded-xl border-2 border-slate-300 hover:bg-slate-55" onClick={reset}>↺ ลองใหม่</button>
            <button className="px-5 py-2.5 font-bold rounded-xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-55" onClick={check} disabled={picks.length === 0}>ตรวจคำตอบ</button>
          </>
        ) : (
          <button className="px-5 py-2.5 font-bold rounded-xl bg-slate-900 text-white hover:opacity-90" onClick={next}>
            {idx + 1 >= items.length ? 'ดูคะแนน' : 'ข้อถัดไป →'}
          </button>
        )}
      </div>
    </div>
  );
}
