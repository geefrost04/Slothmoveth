'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import type { QuickJudgeItem } from '@/lib/course-types';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';



function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function QuickJudgeGame({
  items,
  subjectTitle = 'คิดวิเคราะห์',
  courseTitle = 'สอบ ก.พ. ภาค ก.',
  courseId = 'ocsc',
  subjectId = 'analytical_thinking'
}: {
  items: QuickJudgeItem[];
  subjectTitle?: string;
  courseTitle?: string;
  courseId?: string;
  subjectId?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'practice' | 'survival'>('practice');
  const [questionPool, setQuestionPool] = useState<QuickJudgeItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);

  // Current question states
  const [picked1, setPicked1] = useState<'true' | 'false' | 'uncertain' | null>(null);
  const [picked2, setPicked2] = useState<'true' | 'false' | 'uncertain' | null>(null);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  const questionCount = mode === 'practice' ? Math.min(10, items.length) : items.length;
  const currentItem = questionPool[idx];

  // Load best streak from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`slothmove:streak:quickjudge:${subjectId}`);
      if (saved) setBestStreak(parseInt(saved, 10));
    } catch (e) {
      console.warn(e);
    }
  }, [subjectId]);

  // Game timer
  useEffect(() => {
    if (!isPlaying || done) return undefined;
    const interval = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [done, isPlaying]);

  if (!items.length) {
    return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีข้อมูลสำหรับเกมนี้</p>;
  }

  function startNewGame(selectedMode: 'practice' | 'survival') {
    setMode(selectedMode);
    const pool = buildDistinctRandomSession(
      distinctScope('quickjudge', courseId, subjectId, selectedMode, items.length),
      () => selectedMode === 'practice'
        ? shuffleArray(items).slice(0, questionCount)
        : shuffleArray(items)
    );
    setQuestionPool(pool);
    setIdx(0);
    setScore(0);
    setSeconds(0);
    setDone(false);
    setPicked1(null);
    setPicked2(null);
    setPickedOption(null);
    setShowExplanation(false);
    if (selectedMode === 'survival') {
      setCurrentStreak(0);
    }
    setIsPlaying(true);
  }

  function handleSelectConclusion1(val: 'true' | 'false' | 'uncertain') {
    if (showExplanation) return;
    setPicked1(val);
  }

  // Helper to get selected option based on evaluations
  function getSelectedOptionLabel(p1: typeof picked1, p2: typeof picked2) {
    if (p1 === null || p2 === null) return '';
    if (p1 === 'true' && p2 === 'true') return 'ตอบ 1 (จริงทั้งคู่)';
    if (p1 === 'false' && p2 === 'false') return 'ตอบ 2 (เท็จทั้งคู่)';
    if (p1 === 'uncertain' && p2 === 'uncertain') return 'ตอบ 3 (ไม่แน่ชัดทั้งคู่)';
    return 'ตอบ 4 (คำตอบไม่ซ้ำกัน)';
  }

  function handleSelectConclusion2(val: 'true' | 'false' | 'uncertain') {
    if (showExplanation) return;
    setPicked2(val);
  }

  function handleSelectOption(optNum: number) {
    if (showExplanation) return;
    if (picked1 === null || picked2 === null) return; // Must select evaluations first
    setPickedOption(optNum);
  }

  function handleSubmitAnswer() {
    if (!currentItem || picked1 === null || picked2 === null || pickedOption === null) return;

    const optIsCorrect = pickedOption === currentItem.correctOption;
    const c1IsCorrect = picked1 === currentItem.answer1;
    const c2IsCorrect = picked2 === currentItem.answer2;

    const fullyCorrect = optIsCorrect && c1IsCorrect && c2IsCorrect;

    if (fullyCorrect) {
      setScore((s) => s + 1);
      if (mode === 'survival') {
        const nextStreak = currentStreak + 1;
        setCurrentStreak(nextStreak);
        if (nextStreak > bestStreak) {
          setBestStreak(nextStreak);
          try {
            window.localStorage.setItem(`slothmove:streak:quickjudge:${subjectId}`, String(nextStreak));
          } catch (e) {
            console.warn(e);
          }
        }
      }
    } else {
      if (mode === 'survival') {
        // In survival, any mistake ends the run
        setTimeout(() => {
          setDone(true);
        }, 1500);
      }
    }
    setShowExplanation(true);
  }

  function handleNext() {
    if (mode === 'survival' && showExplanation) {
      // If they survived (got it fully correct), they can continue. Otherwise, game is already set to done.
      const fullyCorrect = pickedOption === currentItem.correctOption &&
                            picked1 === currentItem.answer1 &&
                            picked2 === currentItem.answer2;
      if (!fullyCorrect) {
        setDone(true);
        return;
      }
    }

    if (idx + 1 >= questionPool.length) {
      setDone(true);
      return;
    }

    setIdx((current) => current + 1);
    setPicked1(null);
    setPicked2(null);
    setPickedOption(null);
    setShowExplanation(false);
  }

  // Option text templates
  const optionList = [
    { num: 1, label: 'ตอบ 1', desc: 'หากข้อสรุปทั้งสองเป็นจริง' },
    { num: 2, label: 'ตอบ 2', desc: 'หากข้อสรุปทั้งสองเป็นเท็จ' },
    { num: 3, label: 'ตอบ 3', desc: 'หากข้อสรุปทั้งสองไม่สามารถสรุปได้แน่ชัด' },
    { num: 4, label: 'ตอบ 4', desc: 'หากข้อสรุปทั้งสองมีคำตอบไม่ซ้ำกัน' }
  ];

  const translation = {
    true: 'จริง',
    false: 'เท็จ',
    uncertain: 'ไม่แน่ชัด'
  };

  // Intro menu before starting
  if (!isPlaying && !done) {
    return (
      <div className="course-layout" data-course={courseId}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <style>{customStyles}</style>
          <div className="qj-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-200 dark:border-amber-900/40">
              <span className="text-4xl">⚡</span>
            </div>
            <span className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 text-xs font-bold uppercase tracking-wider">
              เกมเงื่อนไขสัญลักษณ์
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-zinc-50 mb-3">
              Quick Judge · {subjectTitle}
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
              ฝึกยุบเงื่อนไขและสรุปความสัมพันธ์ของเครื่องหมายวิชา ก.พ. อย่างแม่นยำ 
              โดยตอบค่าความจริงของข้อสรุปย่อย แล้วคำนวณข้อสอบสรุปส่งคำตอบแบบ 4 ตัวเลือกหลัก
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <div className="mode-card p-6 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-900 dark:border-zinc-700 rounded-2xl text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⚙️</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-zinc-50">โหมดฝึกซ้อมทั่วไป</strong>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
                    ตอบคำถามสบาย ๆ จำนวน 10 ข้อต่อรอบ แสดงเฉลยพร้อมวิถียุบเส้นสัญลักษณ์แบบละเอียดเพื่อปูพื้นฐานความเข้าใจ
                  </p>
                </div>
                <button onClick={() => startNewGame('practice')} className="qj-btn-start w-full py-2.5 rounded-xl font-bold cursor-pointer text-center">
                  เริ่มฝึกซ้อม
                </button>
              </div>

              <div className="mode-card p-6 bg-slate-50 dark:bg-zinc-800 border-2 border-slate-900 dark:border-zinc-700 rounded-2xl text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔥</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-zinc-50">โหมดเอาชีวิตรอด (Survival)</strong>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
                    ตอบคำถามแบบไร้ขีดจำกัดไปเรื่อย ๆ หากวิเคราะห์ข้อความหรือคำตอบข้อใดผิดแม้แต่จุดเดียว เกมจะจบทันที!
                  </p>
                </div>
                <button onClick={() => startNewGame('survival')} className="qj-btn-start is-survival w-full py-2.5 rounded-xl font-bold cursor-pointer text-center">
                  ท้าทาย Survival
                </button>
              </div>
            </div>

            {bestStreak > 0 && (
              <div className="mb-6 py-2.5 px-4 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl inline-flex items-center gap-2 text-sm font-bold">
                🔥 สถิติ Streak สูงสุดของคุณ: {bestStreak} ข้อซ้อน!
              </div>
            )}

            <div className="flex justify-center items-center mt-2">
              <Link href={`/courses/${courseId}/${subjectId}`} className="text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline">
                ← กลับไปหน้าวิชา
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // End result screen
  if (done) {
    const pct = questionPool.length ? Math.round((score / questionPool.length) * 100) : 0;
    return (
      <div className="course-layout" data-course={courseId}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <style>{customStyles}</style>
          <div className="qj-card bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-zinc-50 mb-1">
              {mode === 'survival' ? 'เกมโอเวอร์!' : 'สรุปผลการประเมิน'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              {mode === 'survival' 
                ? 'คุณทำข้อสอบผิดกฎสัญลักษณ์เกมจึงจบลง' 
                : 'คุณฝึกซ้อมสรุปเงื่อนไขสัญลักษณ์ครบถ้วนแล้ว'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="block text-slate-500 dark:text-zinc-400 text-xs mb-1">คะแนนรวม</span>
                <strong className="text-xl font-display font-black text-amber-700 dark:text-amber-400">
                  {score} / {mode === 'survival' ? idx + 1 : questionPool.length}
                </strong>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <span className="block text-slate-500 dark:text-zinc-400 text-xs mb-1">เวลาทั้งหมด</span>
                <strong className="text-xl font-display font-black text-amber-700 dark:text-amber-400">
                  {formatTime(seconds)}
                </strong>
              </div>
              {mode === 'survival' ? (
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl col-span-2 md:col-span-1">
                  <span className="block text-slate-500 dark:text-zinc-400 text-xs mb-1">Streak รอบนี้</span>
                  <strong className="text-xl font-display font-black text-red-600 dark:text-red-400">
                    🔥 {currentStreak}
                  </strong>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl col-span-2 md:col-span-1">
                  <span className="block text-slate-500 dark:text-zinc-400 text-xs mb-1">ความถูกต้อง</span>
                  <strong className="text-xl font-display font-black text-amber-700 dark:text-amber-400">
                    {pct}%
                  </strong>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center items-center">
              <button onClick={() => setIsPlaying(false)} className="text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline">
                ⚙️ เปลี่ยนโหมด
              </button>
              <button onClick={() => startNewGame(mode)} className="qj-btn-start px-8 py-3 rounded-2xl text-base font-bold cursor-pointer text-white">
                🔀 เล่นใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  const hasAnsweredAll = picked1 !== null && picked2 !== null && pickedOption !== null;
  const isC1Correct = picked1 === currentItem.answer1;
  const isC2Correct = picked2 === currentItem.answer2;
  const isOptCorrect = pickedOption === currentItem.correctOption;
  const isAllCorrect = isC1Correct && isC2Correct && isOptCorrect;

  return (
    <div className="course-layout" data-course={courseId}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <style>{customStyles}</style>

        {/* Top Header Panel */}
        <div className="flex justify-between items-center mb-6 text-sm font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-4 rounded-xl border-2 border-slate-900 dark:border-zinc-700 shadow-[4px_4px_0_var(--color-text)]">
          <Link href={`/courses/${courseId}/${subjectId}/practices`} className="text-slate-500 dark:text-zinc-400 hover:underline">
            ← กลับลานฝึก
          </Link>
          <div className="flex items-center gap-4">
            {mode === 'survival' && <span className="text-red-500 font-black">🔥 Streak: {currentStreak}</span>}
            <span>⏱️ เวลา: {formatTime(seconds)}</span>
            <span>🎯 ถูก: {score} / {mode === 'survival' ? idx : idx}</span>
          </div>
        </div>

        {/* Main Game Card */}
        <div className="qj-card bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
          
          {/* Progress Bar */}
          {mode === 'practice' && (
            <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ height: '100%', width: `${((idx) / questionCount) * 100}%`, background: 'var(--color-primary)', transition: 'width 0.3s ease' }} />
            </div>
          )}

          {/* Question Meta */}
          <div className="mb-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase mb-1 block">
              โจทย์เงื่อนไขข้อที่ {idx + 1} {mode === 'practice' ? `จาก ${questionCount}` : '(Survival Mode)'}
            </span>
          </div>

          {/* 1. The Symbolic Condition Statements */}
          <div className="statement-box rounded-2xl border-2 border-slate-900 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 p-5 md:p-6 mb-6">
            <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/40 uppercase tracking-wide inline-block mb-3">
              เงื่อนไขหลัก (Symbolic Statement)
            </span>
            <div className="font-mono text-lg md:text-xl font-black tracking-wide text-slate-800 dark:text-zinc-100 whitespace-pre-line leading-relaxed">
              {currentItem.statement}
            </div>
          </div>

          {/* 2. Interactive Conclusions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Conclusion 1 */}
            <div className="conclusion-panel p-4 border-2 border-slate-900 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ข้อสรุปที่ 1 (Conclusion 1)</span>
                {showExplanation && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isC1Correct ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                  }`}>
                    {isC1Correct ? 'ถูกต้อง' : `เฉลย: ${translation[currentItem.answer1]}`}
                  </span>
                )}
              </div>
              <h3 className="font-display font-extrabold text-lg md:text-xl text-slate-900 dark:text-zinc-50 mb-4 text-center">
                {currentItem.conclusion1}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['true', 'false', 'uncertain'] as const).map((choiceVal) => {
                  const isSelected = picked1 === choiceVal;
                  let btnClass = '';
                  if (isSelected) btnClass = 'is-selected';
                  if (showExplanation) {
                    if (choiceVal === currentItem.answer1) {
                      btnClass = 'is-correct';
                    } else if (isSelected) {
                      btnClass = 'is-wrong';
                    } else {
                      btnClass = 'is-disabled';
                    }
                  }
                  return (
                    <button
                      key={`c1-${choiceVal}`}
                      type="button"
                      disabled={showExplanation}
                      onClick={() => handleSelectConclusion1(choiceVal)}
                      className={`btn-eval eval-${choiceVal} ${btnClass} py-2 rounded-xl text-xs font-bold cursor-pointer border`}
                    >
                      {translation[choiceVal]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conclusion 2 */}
            <div className="conclusion-panel p-4 border-2 border-slate-900 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ข้อสรุปที่ 2 (Conclusion 2)</span>
                {showExplanation && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isC2Correct ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                  }`}>
                    {isC2Correct ? 'ถูกต้อง' : `เฉลย: ${translation[currentItem.answer2]}`}
                  </span>
                )}
              </div>
              <h3 className="font-display font-extrabold text-lg md:text-xl text-slate-900 dark:text-zinc-50 mb-4 text-center">
                {currentItem.conclusion2}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['true', 'false', 'uncertain'] as const).map((choiceVal) => {
                  const isSelected = picked2 === choiceVal;
                  let btnClass = '';
                  if (isSelected) btnClass = 'is-selected';
                  if (showExplanation) {
                    if (choiceVal === currentItem.answer2) {
                      btnClass = 'is-correct';
                    } else if (isSelected) {
                      btnClass = 'is-wrong';
                    } else {
                      btnClass = 'is-disabled';
                    }
                  }
                  return (
                    <button
                      key={`c2-${choiceVal}`}
                      type="button"
                      disabled={showExplanation}
                      onClick={() => handleSelectConclusion2(choiceVal)}
                      className={`btn-eval eval-${choiceVal} ${btnClass} py-2 rounded-xl text-xs font-bold cursor-pointer border`}
                    >
                      {translation[choiceVal]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Combined Option Selection (Choice 1-4) */}
          <div className={`option-panel border-2 border-slate-900 dark:border-zinc-700 rounded-2xl p-5 bg-slate-50 dark:bg-zinc-800 text-left transition-opacity duration-300 ${
            picked1 === null || picked2 === null ? 'opacity-40 pointer-events-none' : 'opacity-100'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-500 dark:text-zinc-400 block">
                3. เลือกตัวเลือกคำตอบตามหลักเกณฑ์ ก.พ. (Combined Option)
              </span>
              {picked1 !== null && picked2 !== null && !showExplanation && (
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 animate-pulse bg-amber-500/10 px-2 py-0.5 rounded">
                  คำแนะนำตามผลประเมินของคุณ: {getSelectedOptionLabel(picked1, picked2)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {optionList.map((opt) => {
                const isSelected = pickedOption === opt.num;
                let btnClass = '';
                if (isSelected) btnClass = 'is-selected';
                if (showExplanation) {
                  if (opt.num === currentItem.correctOption) {
                    btnClass = 'is-correct';
                  } else if (isSelected) {
                    btnClass = 'is-wrong';
                  } else {
                    btnClass = 'is-disabled';
                  }
                }
                return (
                  <button
                    key={`opt-${opt.num}`}
                    type="button"
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(opt.num)}
                    className={`btn-opt ${btnClass} p-3 rounded-xl border text-left cursor-pointer flex items-center justify-between`}
                  >
                    <div>
                      <strong className="text-sm font-black block text-slate-900 dark:text-zinc-100">{opt.label}</strong>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">{opt.desc}</span>
                    </div>
                    {isSelected && <span className="text-lg">✔️</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons / Result Details */}
          {!showExplanation ? (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                disabled={picked1 === null || picked2 === null || pickedOption === null}
                onClick={handleSubmitAnswer}
                className="qj-btn-start px-10 py-3.5 rounded-2xl text-base font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                📥 ตรวจคำตอบ (Submit)
              </button>
            </div>
          ) : (
            <div className="mt-8">
              {/* Overall feedback banner */}
              <div className={`p-5 rounded-2xl text-left border border-dashed mb-6 ${
                isAllCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/40 text-rose-800 dark:text-rose-300'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{isAllCorrect ? '🎉 ถูกต้องครบถ้วน!' : '❌ เกือบถูกต้อง!'}</span>
                  <strong className={`font-bold text-base ${isAllCorrect ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}`}>
                    {isAllCorrect ? 'วิเคราะห์ได้ดีมาก ได้รับคะแนนสะสม' : 'มีบางจุดสรุปผิดพลาด ลองพิจารณาทางเดินสัญลักษณ์ใหม่'}
                  </strong>
                </div>

                {/* Score update inside survival */}
                {mode === 'survival' && !isAllCorrect && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-bold mb-3">
                    💀 ลื่นหลุด Streak! จบเกมเอาชีวิตรอดที่ {currentStreak} ข้อ
                  </p>
                )}

                {/* Explanation text */}
                {currentItem.explanation && (
                  <div className="mt-2 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                    <strong className="block mb-1 text-slate-800 dark:text-zinc-200 font-bold">💡 แนวคิดการยุบสัญลักษณ์:</strong>
                    <div className="qj-explain-content" dangerouslySetInnerHTML={{ __html: currentItem.explanation }} />
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button onClick={handleNext} className="qj-btn-start px-8 py-3 rounded-xl font-bold cursor-pointer">
                  {idx + 1 >= questionPool.length || (mode === 'survival' && !isAllCorrect)
                    ? 'ดูผลการฝึกซ้อม →' 
                    : 'ข้อถัดไป →'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const customStyles = `
  .qj-card {
    border: 2px solid var(--color-text);
    box-shadow: 6px 6px 0 var(--color-text);
  }
  .qj-btn-start {
    border: 2px solid var(--color-text);
    box-shadow: 4px 4px 0 var(--color-text);
    background: var(--color-primary);
    color: #fff;
    transition: all 0.15s ease;
  }
  .qj-btn-start:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 var(--color-text);
  }
  .qj-btn-start.is-survival {
    background: #ef4444;
  }
  .mode-card {
    transition: transform 0.2s ease;
  }
  .mode-card:hover {
    transform: translateY(-2px);
  }
  .btn-eval {
    background: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
    transition: all 0.15s ease;
  }
  .btn-eval:hover:not(:disabled) {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
  }
  .btn-eval.is-selected {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: #fff;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }
  .btn-eval.is-correct {
    border-color: #10b981 !important;
    background: #d1fae5 !important;
    color: #065f46 !important;
    font-weight: 800;
  }
  .btn-eval.is-wrong {
    border-color: #f43f5e !important;
    background: #ffe4e6 !important;
    color: #9f1239 !important;
  }
  .btn-eval.is-disabled {
    opacity: 0.4;
    filter: grayscale(0.5);
  }
  .btn-opt {
    background: var(--color-surface);
    border-color: var(--color-border);
    transition: all 0.15s ease;
  }
  .btn-opt:hover:not(:disabled) {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
  }
  .btn-opt.is-selected {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: #fff !important;
  }
  .btn-opt.is-selected strong {
    color: #fff !important;
  }
  .btn-opt.is-selected span {
    color: #fff !important;
  }
  .btn-opt.is-correct {
    border-color: #10b981 !important;
    background: #d1fae5 !important;
    color: #065f46 !important;
  }
  .btn-opt.is-correct strong {
    color: #065f46 !important;
  }
  .btn-opt.is-correct span {
    color: #047857 !important;
  }
  .btn-opt.is-wrong {
    border-color: #f43f5e !important;
    background: #ffe4e6 !important;
    color: #9f1239 !important;
  }
  .btn-opt.is-wrong strong {
    color: #9f1239 !important;
  }
  .btn-opt.is-wrong span {
    color: #be123c !important;
  }
  .btn-opt.is-disabled {
    opacity: 0.4;
    filter: grayscale(0.5);
  }
  .qj-explain-content p {
    margin-bottom: 8px;
  }
  .qj-explain-content strong {
    font-weight: 700;
  }
`;
