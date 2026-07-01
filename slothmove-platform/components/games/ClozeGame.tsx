'use client';

import { useState, useEffect, useRef } from 'react';
import type { ClozeItem } from '@/lib/course-types';
import { useDonatePromptOnDone } from '@/lib/donate-prompt';
import { saveGameResult } from '@/lib/games-storage';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';
import Link from 'next/link';

export function ClozeGame({
  items,
  courseId,
  subjectId
}: {
  items: ClozeItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [playItems, setPlayItems] = useState<ClozeItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useDonatePromptOnDone(done);

  // Discover distinct categories
  const categories = Array.from(
    new Set(items.map((item) => (item as any).category).filter((cat): cat is string => Boolean(cat)))
  );
  const hasMultipleTopics = categories.length > 1;

  useEffect(() => {
    if (!hasMultipleTopics) {
      setPlayItems(
        buildDistinctRandomSession(
          distinctScope('cloze', courseId, subjectId, '__all__', items.length),
          () => shuffleArray(items).slice(0, 10)
        )
      );
      setSelectedTopic('__all__');
      startTimeRef.current = Date.now();
    }
  }, [items, hasMultipleTopics]);

  const startNewGame = (topic: string | null) => {
    let filtered = [...items];
    if (topic && topic !== '__all__') {
      filtered = items.filter((item) => (item as any).category === topic);
    }
    const shuffled = buildDistinctRandomSession(
      distinctScope('cloze', courseId, subjectId, topic ?? '__all__', filtered.length),
      () => shuffleArray(filtered).slice(0, 10)
    );
    setPlayItems(shuffled); // Play 10 items max
    setSelectedTopic(topic);
    setIdx(0);
    setPicks({});
    setShowResult(false);
    setScore(0);
    setDone(false);
    startTimeRef.current = Date.now();
  };

  // Persist result when the game is finished
  useEffect(() => {
    if (!done || !courseId || !subjectId || playItems.length === 0) return;
    const total = playItems.length;
    const wrong = total - score;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    saveGameResult(courseId, subjectId, 'cloze', {
      score,
      pct,
      correct: score,
      wrong,
      total,
      durationSec: Math.round((Date.now() - startTimeRef.current) / 1000)
    });
  }, [done, courseId, subjectId, playItems.length, score]);

  if (!items.length) return <p className="text-center py-12 text-slate-500">ยังไม่มีแบบฝึกหัดเติมคำสำหรับวิชานี้</p>;

  // SCREEN 1: Topic Selector
  if (hasMultipleTopics && selectedTopic === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <style jsx>{`
          .cg-brutal-card {
            border: 2px solid #0f172a;
            box-shadow: 6px 6px 0 #0f172a;
            transition: all 0.2s ease;
          }
          .cg-brutal-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0 #0f172a;
          }
          .cg-brutal-card:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 #0f172a;
          }
        `}</style>
        
        <div className="relative mb-8 p-6 md:p-8 border-2 border-slate-900 rounded-3xl bg-amber-50 dark:bg-zinc-900 overflow-hidden shadow-[6px_6px_0_#0f172a]">
          <div className="relative z-10">
            <span className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-display text-xs font-bold uppercase tracking-wider">
              Cloze Game
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-zinc-50 mb-2">
              ✦ เลือกชุดแบบฝึกหัดเติมคำ
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
              ทบทวนกฎระเบียบและข้อสอบโดยการเติมคำสำคัญในช่องว่าง แยกทดสอบเป็นหมวดหมู่ตามความถนัด
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((tag) => {
            const count = items.filter((item) => (item as any).category === tag).length;
            const desc = tag === 'อำนาจหน้าที่ ใครทำอะไร' 
              ? 'ทบทวนสิทธิอำนาจในการสั่งการ การลงชื่อ และการแต่งตั้งคณะกรรมการตามระเบียบงานสารบรรณ'
              : 'ฝึกจำกำหนดวัน ระยะเวลาการเก็บรักษาหนังสือ การส่งมอบ และข้อกำหนดเกี่ยวกับเวลา';
            const icon = tag === 'อำนาจหน้าที่ ใครทำอะไร' ? '🏛️' : '⏱️';
            
            return (
              <button
                key={tag}
                onClick={() => startNewGame(tag)}
                className="cg-brutal-card flex flex-col text-left p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-slate-900"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-xl">
                    {icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                    {count} ข้อ
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-zinc-50 mb-2">
                  {tag}
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4 flex-1">
                  {desc}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <span>สุ่มสูงสุด 10 ข้อ</span>
                  <span>เริ่มฝึกฝน →</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => startNewGame('__all__')}
          className="cg-brutal-card w-full p-6 rounded-2xl bg-slate-900 dark:bg-zinc-800 text-white border-2 border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
        >
          <div>
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-1 block">
              Mixed Cloze Challenge
            </span>
            <h3 className="font-display font-bold text-lg mb-1">
              ฝึกเติมคำรวมทุกชุดหัวข้อ
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              สุ่มข้อสอบเติมคำคละรวมจากทุกชุดหัวข้อ (อำนาจหน้าที่ และ กำหนดเวลา) เพื่อทดสอบความจำแบบรอบด้าน
            </p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="px-3 py-1 rounded-full bg-slate-800 dark:bg-zinc-700 text-xs font-bold text-amber-300">
              {items.length} ข้อ
            </span>
            <span className="text-xl">→</span>
          </div>
        </button>

        <div className="mt-8 text-center">
          <Link
            href={`/courses/${courseId}/${subjectId}/practices`}
            className="inline-block text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline"
          >
            ← กลับไปลานฝึก
          </Link>
        </div>
      </div>
    );
  }

  // SCREEN 2: Finished Game View
  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <style jsx>{`
          .btn-brutal {
            border: 2px solid #0f172a;
            box-shadow: 4px 4px 0 #0f172a;
            transition: all 0.15s ease;
          }
          .btn-brutal:hover {
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0 #0f172a;
          }
          .btn-brutal:active {
            transform: translate(1px, 1px);
            box-shadow: 2px 2px 0 #0f172a;
          }
        `}</style>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-4xl mb-6 border-2 border-slate-900 shadow-[4px_4px_0_#0f172a]">
          🏆
        </div>
        <h2 className="font-display font-black text-3xl text-slate-900 dark:text-zinc-50 mb-2">
          เก่งมาก! ฝึกเสร็จสิ้น
        </h2>
        {selectedTopic && selectedTopic !== '__all__' && (
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-4 uppercase tracking-wider">
            {selectedTopic}
          </p>
        )}
        <div className="bg-white dark:bg-zinc-900 border-2 border-slate-900 rounded-2xl p-6 mb-8 shadow-[4px_4px_0_#0f172a]">
          <div className="text-slate-500 dark:text-zinc-400 text-sm mb-1 font-bold">คะแนนรวมของคุณ</div>
          <div className="text-5xl font-black text-slate-900 dark:text-zinc-50 font-display mb-2">
            {score} <span className="text-xl text-slate-500 font-normal">/ {playItems.length}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${playItems.length > 0 ? (score / playItems.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => startNewGame(selectedTopic)}
            className="btn-brutal px-6 py-3 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-900"
          >
            ฝึกซ้ำอีกรอบ ↻
          </button>
          {hasMultipleTopics && (
            <button
              onClick={() => setSelectedTopic(null)}
              className="btn-brutal px-6 py-3 rounded-xl font-bold bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50"
            >
              เลือกหมวดหมู่ใหม่
            </button>
          )}
        </div>
        <div className="mt-8">
          <Link
            href={`/courses/${courseId}/${subjectId}/practices`}
            className="inline-block text-slate-600 dark:text-zinc-400 text-sm font-bold hover:underline"
          >
            ← กลับไปลานฝึก
          </Link>
        </div>
      </div>
    );
  }

  const item = playItems[idx];
  if (!item) return null;

  function check(nextPicks: Record<number, string>) {
    const correct = item.blanks.every((b, i) => nextPicks[i] === b);
    if (correct) setScore((s) => s + 1);
    setShowResult(true);
    setTimeout(() => {
      if (idx + 1 >= playItems.length) setDone(true);
      else { 
        setIdx(idx + 1); 
        setPicks({}); 
        setShowResult(false); 
      }
    }, 2600);
  }

  function pick(blankIdx: number, word: string) {
    if (showResult) return;
    const nextPicks = { ...picks, [blankIdx]: word };
    setPicks(nextPicks);

    if (Object.keys(nextPicks).length === item.blanks.length) {
      check(nextPicks);
    }
  }

  // Render text with blanks replaced by buttons
  const parts = item.text.split('___');
  const options = item.options ?? item.blanks;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <style jsx>{`
        .btn-check {
          border: 2px solid #0f172a;
          box-shadow: 4px 4px 0 #0f172a;
          transition: all 0.15s ease;
        }
        .btn-check:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 #0f172a;
        }
        .btn-check:active:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 2px 2px 0 #0f172a;
        }
        .cloze-word-opt {
          border: 1px solid #cbd5e1;
          transition: all 0.2s ease;
        }
        .cloze-word-opt:hover:not(:disabled) {
          border-color: #0f172a;
          background-color: var(--color-accent-soft, #fef3c7);
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            {selectedTopic === '__all__' ? 'แบบฝึกหัดคละหมวด' : selectedTopic}
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
            ข้อที่ {idx + 1} <span className="text-sm font-normal text-slate-500">/ {playItems.length}</span>
          </h2>
        </div>
        <div className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-800 dark:text-zinc-200">
          คะแนน: {score}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border-2 border-slate-900 rounded-2xl p-6 md:p-8 text-lg md:text-xl font-medium text-slate-800 dark:text-zinc-100 leading-relaxed md:leading-loose mb-8 shadow-[4px_4px_0_#0f172a] min-h-[140px] flex flex-wrap items-center">
        <div>
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <span
                  style={{
                    display: 'inline-block',
                    minWidth: 120,
                    padding: '2px 12px',
                    margin: '0 6px',
                    borderBottom: '2px solid',
                    borderRadius: '8px',
                    textAlign: 'center',
                    borderColor: showResult
                      ? picks[i] === item.blanks[i] ? '#10b981' : '#ef4444'
                      : '#64748b',
                    background: picks[i]
                      ? (showResult
                          ? picks[i] === item.blanks[i] ? '#d1fae5' : '#fee2e2'
                          : '#fef3c7')
                      : 'transparent',
                    color: showResult
                      ? picks[i] === item.blanks[i] ? '#065f46' : '#991b1b'
                      : 'inherit'
                  }}
                  className="font-bold text-sm md:text-base"
                >
                  {picks[i] ?? '.......'}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3 text-center">
          คลิกเลือกคำตอบ ระบบจะตรวจทันทีเมื่อเติมครบทุกช่อง
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {options.map((opt) => {
            const used = Object.values(picks).includes(opt);
            return (
              <button
                key={opt}
                onClick={() => {
                  const emptyIdx = item.blanks.findIndex((_, i) => !picks[i]);
                  if (emptyIdx >= 0) pick(emptyIdx, opt);
                }}
                disabled={used || showResult}
                className={`cloze-word-opt px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border-2 ${
                  used 
                    ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-800' 
                    : 'border-slate-300 dark:border-zinc-700 hover:border-slate-900 dark:hover:border-zinc-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div
          className={`mb-8 rounded-2xl border-2 p-4 shadow-[3px_3px_0_#0f172a] ${
            item.blanks.every((blank, blankIdx) => picks[blankIdx] === blank)
              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100'
              : 'border-red-700 bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100'
          }`}
        >
          <div className="mb-2 text-sm font-black">
            {item.blanks.every((blank, blankIdx) => picks[blankIdx] === blank)
              ? 'ตอบถูก'
              : 'ตอบผิด'}
          </div>
          <div className="text-sm leading-relaxed">
            <span className="font-bold">เฉลย: </span>
            {item.blanks.join(' / ')}
          </div>
          {((item as any).explanation || (item as any).hint) && (
            <div className="mt-3 border-t border-current/20 pt-3 text-sm leading-relaxed">
              {(item as any).explanation ? (
                <p>
                  <span className="font-bold">คำอธิบาย: </span>
                  {(item as any).explanation}
                </p>
              ) : null}
              {(item as any).hint ? (
                <p className="mt-2">
                  <span className="font-bold">จำแบบเร็ว: </span>
                  {(item as any).hint}
                </p>
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 justify-between items-center">
        <button
          onClick={() => {
            if (hasMultipleTopics) {
              setSelectedTopic(null);
            } else {
              setDone(true);
            }
          }}
          className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:underline"
        >
          ← ยอมแพ้ / ออก
        </button>
        <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs md:text-sm font-bold text-amber-800 dark:text-amber-300">
          {showResult ? 'ดูเฉลยสั้น ๆ แล้วไปข้อถัดไป...' : 'เลือกคำตอบให้ครบ ระบบจะตรวจอัตโนมัติ'}
        </div>
      </div>
    </div>
  );
}
