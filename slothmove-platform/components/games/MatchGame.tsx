'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDonatePromptOnDone } from '@/lib/donate-prompt';
import { saveGameResult } from '@/lib/games-storage';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';
import type { MatchItem } from './useMatchGame';



// Helper to format time (mm:ss)
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function MatchGame({
  items,
  courseId,
  subjectId
}: {
  items: MatchItem[];
  courseId?: string;
  subjectId?: string;
}) {
  return (
    <Suspense fallback={<div className="text-center py-12">กำลังโหลด...</div>}>
      <MatchGameContent items={items} courseId={courseId} subjectId={subjectId} />
    </Suspense>
  );
}

function MatchGameContent({
  items,
  courseId,
  subjectId
}: {
  items: MatchItem[];
  courseId?: string;
  subjectId?: string;
}) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');

  // Discover distinct categories
  const categories = Array.from(
    new Set(items.map((item) => (item as any).category).filter((cat): cat is string => Boolean(cat)))
  );

  const hasMultipleTopics = categories.length > 1;
  const isSarabanMatch = subjectId === 'saraban';

  // Game States
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [pairs, setPairs] = useState<MatchItem[]>([]);
  const [leftItems, setLeftItems] = useState<{ id: number; text: string; pairId: number }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: number; text: string; pairId: number }[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);

  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useDonatePromptOnDone(done);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Map category code to actual display name
  const getMappedCategory = (param: string | null) => {
    if (!param) return null;
    const catMap: { [key: string]: string } = {
      'idiom': 'สำนวนไทย',
      'vocabulary': 'คำศัพท์ภาษาไทย',
      'royal': 'คำราชาศัพท์'
    };
    return catMap[param.toLowerCase()] || null;
  };

  // Shuffles and starts the matching game
  const startNewGame = (topic: string | null) => {
    let filtered = [...items];
    if (topic && topic !== '__all__') {
      filtered = items.filter((item) => (item as any).category === topic);
    }
    const chosenPairs = buildDistinctRandomSession(
      distinctScope('match', courseId, subjectId, topic ?? '__all__', filtered.length),
      () => shuffleArray(filtered).slice(0, Math.min(8, filtered.length))
    );
    
    // Shuffled left items
    const lefts = shuffleArray(chosenPairs.map((p, i) => ({ id: i, text: p.left, pairId: i })));
    // Shuffled right items
    const rights = shuffleArray(chosenPairs.map((p, i) => ({ id: i, text: p.right, pairId: i })));

    setPairs(chosenPairs);
    setLeftItems(lefts);
    setRightItems(rights);
    
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrong(null);
    setWrongAttempts(0);
    setCorrectStreak(0);
    setBestStreak(0);
    setScore(0);
    setElapsed(0);
    setDone(false);
    setIsLocked(false);
    setSelectedTopic(topic);
    setIsRunning(true);
    startTimeRef.current = Date.now();
  };

  // Initialize selectedTopic and start game if param exists on mount
  useEffect(() => {
    if (hasMultipleTopics) {
      const mapped = getMappedCategory(categoryParam);
      if (mapped && categories.includes(mapped)) {
        setSelectedTopic(mapped);
        startNewGame(mapped);
      } else {
        setSelectedTopic(null);
      }
    } else {
      setSelectedTopic('__all__');
      startNewGame('__all__');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  // Timer Effect
  useEffect(() => {
    if (isRunning && !done) {
      const startTime = Date.now() - elapsed * 1000;
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 250);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, done]);

  // Persist result when finished
  useEffect(() => {
    if (done && courseId && subjectId) {
      saveGameResult(courseId, subjectId, 'match', {
        score,
        pct: 100,
        correct: pairs.length,
        wrong: wrongAttempts,
        total: pairs.length,
        durationSec: elapsed
      });
    }
  }, [done, courseId, subjectId, pairs.length, score, wrongAttempts, elapsed]);

  // Card Pick Handler with Deselection support
  const handleCardClick = (side: 'left' | 'right', id: number, pairId: number) => {
    if (isLocked || matched.has(pairId)) return;

    if (side === 'left') {
      if (selectedLeft === id) {
        // Deselect
        setSelectedLeft(null);
      } else {
        setSelectedLeft(id);
        if (selectedRight !== null) {
          setIsLocked(true);
          tryMatch(id, selectedRight);
        }
      }
    } else {
      if (selectedRight === id) {
        // Deselect
        setSelectedRight(null);
      } else {
        setSelectedRight(id);
        if (selectedLeft !== null) {
          setIsLocked(true);
          tryMatch(selectedLeft, id);
        }
      }
    }
  };

  const tryMatch = (leftId: number, rightId: number) => {
    const leftItem = leftItems.find((item) => item.id === leftId);
    const rightItem = rightItems.find((item) => item.id === rightId);

    if (!leftItem || !rightItem) {
      setIsLocked(false);
      return;
    }

    if (leftItem.pairId === rightItem.pairId) {
      // Correct Match!
      setCorrectStreak((prev) => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        const bonus = 10 + (next - 1) * 2;
        setScore((s) => s + bonus);
        return next;
      });

      setMatched((prev) => {
        const next = new Set(prev);
        next.add(leftItem.pairId);
        
        // Check win condition
        if (next.size === pairs.length) {
          setTimeout(() => {
            setDone(true);
            setIsRunning(false);
          }, 500);
        }
        return next;
      });

      setSelectedLeft(null);
      setSelectedRight(null);
      setIsLocked(false);
    } else {
      // Incorrect Match!
      setCorrectStreak(0);
      setWrongAttempts((w) => w + 1);
      setScore((s) => Math.max(0, s - 2));
      setWrong({ left: leftId, right: rightId });

      setTimeout(() => {
        setWrong(null);
        setSelectedLeft(null);
        setSelectedRight(null);
        setIsLocked(false);
      }, 600);
    }
  };

  // Get Topic Presets/Meta
  const getTopicMeta = (tag: string) => {
    const count = items.filter((item) => (item as any).category === tag).length;
    if (tag === 'อำนาจหน้าที่ ใครทำอะไร') {
      return {
        icon: '🏛️',
        kicker: 'Saraban Roles Match',
        desc: 'จับคู่ผู้มีอำนาจหรือผู้รับผิดชอบ กับหน้าที่ตามระเบียบงานสารบรรณให้แม่นยำ',
        count: `${count} คู่`
      };
    }
    if (tag === 'กำหนดเวลา และจำนวนวัน') {
      return {
        icon: '⏱️',
        kicker: 'Saraban Timeline Match',
        desc: 'ทบทวนกำหนดเวลา จำนวนวัน และเงื่อนไขสำคัญที่มักสับสนในงานสารบรรณ',
        count: `${count} คู่`
      };
    }
    if (tag === 'ชนิดหนังสือราชการ') {
      return {
        icon: '📚',
        kicker: 'Document Types Match',
        desc: 'จับคู่ชนิดหนังสือราชการกับความหมายและลักษณะการใช้งานที่ถูกต้อง',
        count: `${count} คู่`
      };
    }
    if (tag === 'องค์ประกอบ และหลักฐาน') {
      return {
        icon: '🗂️',
        kicker: 'Forms & Records Match',
        desc: 'ทบทวนองค์ประกอบ ทะเบียน และหลักฐานที่ต้องใช้ในงานสารบรรณประจำวัน',
        count: `${count} คู่`
      };
    }
    if (tag === 'สำนวนไทย') {
      return {
        icon: '🗣️',
        kicker: 'Thai Idiom Match',
        desc: 'จับคู่สำนวนสุภาษิตคำพังเพยไทยกับความหมายที่ถูกต้อง ท้าทายความจำเป็นเลิศ',
        count: `${count} คู่`
      };
    }
    if (tag === 'คำศัพท์ภาษาไทย') {
      return {
        icon: '📖',
        kicker: 'Vocabulary Match',
        desc: 'ทบทวนคำศัพท์ภาษาไทยความหมายทางวิชาการและงานราชการที่มักออกสอบ',
        count: `${count} คู่`
      };
    }
    if (tag === 'คำราชาศัพท์') {
      return {
        icon: '👑',
        kicker: 'Royal Vocab Match',
        desc: 'จับคู่คำราชาศัพท์ยอดนิยมกับคำสามัญทั่วไป ฝึกให้แม่นยำและรวดเร็ว',
        count: `${count} คู่`
      };
    }
    return {
      icon: '📝',
      kicker: 'Match Practice',
      desc: 'จับคู่คำศัพท์หรือประโยคที่สัมพันธ์กัน เพื่อเพิ่มความจำแบบรวดเร็ว',
      count: `${count} คู่`
    };
  };

  const selectorBadge = isSarabanMatch ? 'Saraban Match Practice' : 'Thai Match Pairs';
  const selectorDesc = isSarabanMatch
    ? 'เลือกหัวข้อย่อยเพื่อฝึกจับคู่ความรู้สารบรรณ ทั้งอำนาจหน้าที่ กำหนดเวลา ชนิดหนังสือ และองค์ประกอบสำคัญ'
    : 'เลือกวิชาเฉพาะเพื่อจับคู่ประลองความเร็ว ทบทวนสำนวนไทย คำศัพท์ และคำราชาศัพท์อย่างรวดเร็ว';
  const mixedDesc = isSarabanMatch
    ? 'สุ่ม 8 คู่คละจากทุกหัวข้อของงานสารบรรณ เพื่อทดสอบความแม่นยำและความเร็วในการจดจำ'
    : 'สุ่ม 8 คู่คละจากทุกสำนวน คำราชาศัพท์ และความหมายคำศัพท์ เพื่อประลองสมองและความเร็วเสมือนจริง';
  const leftColumnLabel = isSarabanMatch ? 'โจทย์ / รายการ' : 'คำศัพท์ / สำนวน / คำราชาศัพท์';
  const rightColumnLabel = isSarabanMatch ? 'คำตอบ / รายละเอียด' : 'ความหมาย / คำแปล';

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 1: Topic Selector
  // ──────────────────────────────────────────────────────────────────────────
  if (hasMultipleTopics && selectedTopic === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <style>{`
          .mg-brutal-card {
            border: 2px solid var(--color-text);
            box-shadow: 6px 6px 0 var(--color-text);
            transition: all 0.2s ease;
          }
          .mg-brutal-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0 var(--color-text);
          }
          .mg-brutal-card:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 var(--color-text);
          }
        `}</style>
        
        <div className="relative mb-8 p-6 md:p-8 border-2 border-slate-900 rounded-3xl bg-amber-50 dark:bg-zinc-900 overflow-hidden shadow-[6px_6px_0_var(--color-text)]">
          <div className="relative z-10">
            <span className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-display text-xs font-bold uppercase tracking-wider">
              {selectorBadge}
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-zinc-50 mb-2">
              ✦ เลือกหัวข้อการจับคู่
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
              {selectorDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categories.map((tag) => {
            const meta = getTopicMeta(tag);
            return (
              <button
                key={tag}
                onClick={() => startNewGame(tag)}
                className="mg-brutal-card flex flex-col text-left p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-xl">
                    {meta.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold">
                    {meta.count}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase mb-1">
                  {meta.kicker}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-zinc-50 mb-2">
                  {tag}
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4 flex-1">
                  {meta.desc}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs font-bold text-red-700 dark:text-red-400">
                  <span>สุ่มรอบละ 8 คู่</span>
                  <span>เริ่มท้าทาย →</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => startNewGame('__all__')}
          className="mg-brutal-card w-full p-6 rounded-2xl bg-slate-900 dark:bg-zinc-800 text-white border-2 border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
        >
          <div>
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-1 block">
              Mixed Challenge
            </span>
            <h3 className="font-display font-bold text-lg mb-1">
              เล่นจับคู่รวมทุกหัวข้อ
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              {mixedDesc}
            </p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="px-3 py-1 rounded-full bg-slate-800 dark:bg-zinc-700 text-xs font-bold">
              {items.length} คู่
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

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 3: Results / Win Modal Overlay
  // ──────────────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <style>{`
          .mg-win-modal {
            border: 3px solid var(--color-text);
            box-shadow: 8px 8px 0 var(--color-text);
            background: var(--color-surface);
            animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
        
        <div className="mg-win-modal max-w-md w-full p-8 rounded-3xl text-center relative border-2">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="font-display font-black text-2xl text-slate-900 dark:text-zinc-50 mb-1">
            สุดยอดมากครับ!
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
            คุณจับคู่ได้ถูกต้องทั้งหมดครบถ้วนแล้ว
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl">
              <span className="block text-2xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">เวลา</span>
              <span className="text-xl font-display font-black text-red-700 dark:text-red-400">
                {formatTime(elapsed)}
              </span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl">
              <span className="block text-2xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">คะแนน</span>
              <span className="text-xl font-display font-black text-amber-700 dark:text-amber-400">
                {score}
              </span>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-2xl">
              <span className="block text-2xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">Streak สูงสุด</span>
              <span className="text-xl font-display font-black text-green-700 dark:text-green-400">
                {bestStreak}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl">
              <span className="block text-2xs text-slate-500 dark:text-zinc-400 uppercase font-bold mb-1">ทำผิด</span>
              <span className="text-xl font-display font-black text-slate-700 dark:text-zinc-300">
                {wrongAttempts} ครั้ง
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startNewGame(selectedTopic)}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white font-bold text-sm border-2 border-slate-900 dark:border-zinc-700 hover:opacity-90 transition-opacity"
            >
              สับเปลี่ยนและเล่นอีกรอบ
            </button>
            {hasMultipleTopics && (
              <button
                onClick={() => setSelectedTopic(null)}
                className="w-full py-3 rounded-xl bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-300 font-bold text-sm border-2 border-slate-900 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                เปลี่ยนหัวข้อ
              </button>
            )}
            <Link
              href={`/courses/${courseId}/${subjectId}/practices`}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors inline-block"
            >
              ← กลับไปลานฝึก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 2: Gameplay view
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <style>{`
        .mg-stats-panel {
          border: 2px solid var(--color-text);
          box-shadow: 4px 4px 0 var(--color-text);
          background: var(--color-surface);
        }
        .mg-pair-card {
          width: 100%;
          min-height: 72px;
          padding: 12px 16px;
          border: 1px solid var(--color-border);
          border-radius: 14px 4px 14px 4px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.92rem;
          line-height: 1.4;
          text-align: left;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          color: var(--color-text);
          box-shadow: 0 2px 8px rgba(122, 24, 34, 0.02);
          overflow: hidden;
        }
        .mg-pair-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 4px; height: 100%;
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mg-pair-card.left-card {
          border-left: 2px solid rgba(122, 24, 34, 0.2);
        }
        .mg-pair-card.left-card::before {
          background: var(--color-primary);
        }
        .mg-pair-card.right-card {
          border-left: 2px solid rgba(180, 138, 62, 0.2);
        }
        .mg-pair-card.right-card::before {
          background: var(--color-accent);
        }
        .mg-pair-card:hover:not(:disabled):not(.matched) {
          background: var(--color-surface);
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .mg-pair-card.right-card:hover:not(:disabled):not(.matched) {
          border-color: var(--color-accent);
        }
        .mg-pair-card:hover:not(:disabled):not(.matched)::before {
          transform: scaleY(1);
        }
        .mg-pair-card.selected {
          background: var(--color-primary);
          border-color: var(--color-primary-dark);
          box-shadow: 0 0 16px rgba(122, 24, 34, 0.35);
          transform: translateY(-2px) scale(1.02);
        }
        .mg-pair-card.selected::before {
          transform: scaleY(1);
          background: var(--color-accent);
        }
        .mg-pair-card.selected .card-text-val {
          color: #ffffff;
        }
        .mg-pair-card.selected .card-num-val {
          background: var(--color-accent);
          color: var(--color-primary-dark);
          border-color: var(--color-accent);
        }
        
        .mg-pair-card.right-card.selected {
          background: var(--color-accent);
          border-color: var(--color-accent-light, #d4ad5c);
          box-shadow: 0 0 16px rgba(180, 138, 62, 0.45);
        }
        .mg-pair-card.right-card.selected::before {
          transform: scaleY(1);
          background: var(--color-primary);
        }
        .mg-pair-card.right-card.selected .card-text-val {
          color: var(--color-primary-dark);
        }
        .mg-pair-card.right-card.selected .card-num-val {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }
        .mg-pair-card.matched {
          background: var(--color-success-bg, #e8f5ef);
          border-color: var(--color-success, #3d8c6c);
          cursor: default;
          pointer-events: none;
          opacity: 0.6;
          transform: scale(0.97);
          box-shadow: none;
        }
        .mg-pair-card.matched::before {
          transform: scaleY(1);
          background: var(--color-success, #3d8c6c);
        }
        .mg-pair-card.matched .card-num-val {
          background: var(--color-success, #3d8c6c);
          color: #ffffff;
          border-color: var(--color-success, #3d8c6c);
        }
        .mg-pair-card.matched .card-text-val {
          color: var(--color-text);
          text-decoration: line-through;
          opacity: 0.6;
        }
        .mg-pair-card.wrong {
          background: #fde8e8;
          border-color: #ef4444;
          animation: shake 0.5s ease-in-out;
        }
        .mg-pair-card.wrong .card-text-val {
          color: #991b1b;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .card-num-val {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.68rem;
          padding: 3px 6px;
          border-radius: 4px;
          flex-shrink: 0;
          letter-spacing: 0.05em;
          min-width: 28px;
          text-align: center;
          transition: all 0.2s;
        }
        .card-num-left {
          color: var(--color-accent);
          background: var(--color-accent-soft);
          border: 1px solid var(--color-accent);
        }
        .card-num-right {
          color: var(--color-primary);
          background: var(--color-primary-bg, #fbeef0);
          border: 1px solid var(--color-primary-light, #b5495b);
        }
        .mg-column-header {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.88rem;
          color: #ffffff;
          padding: 10px 16px;
          text-align: center;
          border-radius: 16px 4px 0 0;
          letter-spacing: 0.04em;
          box-shadow: var(--shadow-sm);
          position: relative;
          text-shadow: 0 1px 2px rgba(0,0,0,0.15);
          margin-bottom: 8px;
        }
        .mg-column-header.left-side {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          border-bottom: 2px solid var(--color-accent);
        }
        .mg-column-header.right-side {
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light, #d4ad5c) 100%);
          color: var(--color-primary-dark);
          border-bottom: 2px solid var(--color-primary);
        }
        .mg-instr-box {
          border: 2px solid var(--color-text);
          background: var(--color-bg-warm, #fcf6e8);
        }
      `}</style>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3 mb-6 text-center">
        <div className="mg-stats-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">⏱ เวลา</span>
          <span className="text-lg font-display font-black text-slate-900 dark:text-zinc-50">
            {formatTime(elapsed)}
          </span>
        </div>
        <div className="mg-stats-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">🎯 คะแนน</span>
          <span className="text-lg font-display font-black text-slate-900 dark:text-zinc-50">
            {score}
          </span>
        </div>
        <div className="mg-stats-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">🔥 Streak</span>
          <span className="text-lg font-display font-black text-red-700 dark:text-red-400">
            {correctStreak}
          </span>
        </div>
        <div className="mg-stats-panel p-3 rounded-2xl border-2">
          <span className="block text-3xs font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">✅ จับคู่</span>
          <span className="text-lg font-display font-black text-green-700 dark:text-green-400">
            {matched.size} / {pairs.length}
          </span>
        </div>
      </div>

      {/* Instruction alert */}
      <div className="mg-instr-box p-4 rounded-2xl mb-6 flex gap-3 items-start border-2 text-sm text-slate-800 dark:text-zinc-300">
        <span className="text-xl">💡</span>
        <div className="leading-relaxed">
          <strong>วิธีเล่น:</strong> แตะการ์ดฝั่งซ้าย 1 ใบ แล้วแตะการ์ดเฉลยฝั่งขวาที่จับคู่สอดคล้องกัน · จับคู่ถูกต้องต่อเนื่องเพื่อสะสม Streak โบนัสคะแนนคูณสอง!
        </div>
      </div>

      {/* Grid Columns */}
      <div className="grid grid-cols-7 gap-4 items-stretch mb-8">
        {/* Left Column (col-span-3) */}
        <div className="col-span-3 flex flex-col gap-3">
          <div className="mg-column-header left-side">
            {leftColumnLabel}
          </div>
          <div className="flex flex-col gap-3">
            {leftItems.map((item, index) => {
              const isMatched = matched.has(item.pairId);
              const isSelected = selectedLeft === item.id;
              const isWrong = wrong?.left === item.id;
              return (
                <button
                  key={`l-${item.id}`}
                  disabled={isMatched}
                  onClick={() => handleCardClick('left', item.id, item.pairId)}
                  className={`mg-pair-card left-card flex items-center justify-between text-left ${
                    isMatched ? 'matched' : isWrong ? 'wrong' : isSelected ? 'selected' : ''
                  }`}
                >
                  <span className="card-text-val font-semibold">{item.text}</span>
                  <span className="card-num-val card-num-left select-none">L{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Connector Column (col-span-1) */}
        <div className="col-span-1 flex flex-col items-center justify-center text-slate-400 select-none text-xl font-bold">
          <div className="w-0.5 h-full bg-slate-200 dark:bg-zinc-800 relative flex justify-center items-center">
            <span className="absolute bg-white dark:bg-zinc-950 p-2 border-2 border-slate-300 dark:border-zinc-800 rounded-full text-sm">
              ↔
            </span>
          </div>
        </div>

        {/* Right Column (col-span-3) */}
        <div className="col-span-3 flex flex-col gap-3">
          <div className="mg-column-header right-side">
            {rightColumnLabel}
          </div>
          <div className="flex flex-col gap-3">
            {rightItems.map((item, index) => {
              const isMatched = matched.has(item.pairId);
              const isSelected = selectedRight === item.id;
              const isWrong = wrong?.right === item.id;
              return (
                <button
                  key={`r-${item.id}`}
                  disabled={isMatched}
                  onClick={() => handleCardClick('right', item.id, item.pairId)}
                  className={`mg-pair-card right-card flex items-center justify-between text-left ${
                    isMatched ? 'matched' : isWrong ? 'wrong' : isSelected ? 'selected' : ''
                  }`}
                >
                  <span className="card-text-val font-semibold">{item.text}</span>
                  <span className="card-num-val card-num-right select-none">R{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 justify-center">
        {hasMultipleTopics && (
          <button
            onClick={() => {
              if (confirm('ต้องการยกเลิกและเปลี่ยนหัวข้อทบทวนใหม่?')) setSelectedTopic(null);
            }}
            className="px-5 py-3 rounded-xl border-2 font-bold text-sm bg-white dark:bg-zinc-900 border-slate-900 dark:border-zinc-700 hover:bg-slate-55 transition-colors"
          >
            ← เปลี่ยนหัวข้อ
          </button>
        )}
        <button
          onClick={() => {
            if (confirm('สุ่มการ์ดชุดใหม่ในหัวข้อนี้?')) startNewGame(selectedTopic);
          }}
          className="px-5 py-3 rounded-xl border-2 font-bold text-sm bg-white dark:bg-zinc-900 border-slate-900 dark:border-zinc-700 hover:bg-slate-55 transition-colors"
        >
          🔀 สับการ์ดใหม่
        </button>
        <button
          onClick={() => {
            if (confirm('เริ่มเกมใหม่บนการ์ดชุดเดิม?')) {
              // Re-shuffle order of the current pairs
              setLeftItems(shuffleArray(pairs.map((p, i) => ({ id: i, text: p.left, pairId: i }))));
              setRightItems(shuffleArray(pairs.map((p, i) => ({ id: i, text: p.right, pairId: i }))));
              
              setSelectedLeft(null);
              setSelectedRight(null);
              setMatched(new Set());
              setWrong(null);
              setWrongAttempts(0);
              setCorrectStreak(0);
              setBestStreak(0);
              setScore(0);
              setElapsed(0);
              setDone(false);
              setIsLocked(false);
              setIsRunning(true);
              startTimeRef.current = Date.now();
            }
          }}
          className="px-5 py-3 rounded-xl border-2 font-bold text-sm bg-white dark:bg-zinc-900 border-slate-900 dark:border-zinc-700 hover:bg-slate-55 transition-colors"
        >
          ↻ เริ่มใหม่
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/courses/${courseId}/${subjectId}/practices`}
          className="text-slate-600 dark:text-zinc-400 text-xs font-bold hover:underline"
        >
          ← กลับไปลานฝึก
        </Link>
      </div>
    </div>
  );
}
