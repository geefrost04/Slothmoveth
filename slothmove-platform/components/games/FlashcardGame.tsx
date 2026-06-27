'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { FlashcardItem } from '@/lib/course-types';
import { buildDistinctRandomSession, distinctScope } from '@/lib/randomization';

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Simple markdown renderer for bold text and bullet points
function renderMarkdown(text: string) {
  if (!text) return '';
  const boldRegex = /\*\*(.*?)\*\*/g;
  
  return text.split('\n').map((line, i) => {
    // Replace **text** with HTML bold tag
    const parts = [];
    let lastIndex = 0;
    let match;
    boldRegex.lastIndex = 0;
    
    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    if (line.trim().startsWith('•')) {
      // Render as bullet list item
      const bulletContent = line.replace(/^\s*•\s*/, '');
      const innerParts = [];
      let subMatch;
      boldRegex.lastIndex = 0;
      let subLastIndex = 0;
      while ((subMatch = boldRegex.exec(bulletContent)) !== null) {
        if (subMatch.index > subLastIndex) {
          innerParts.push(bulletContent.substring(subLastIndex, subMatch.index));
        }
        innerParts.push(<strong key={subMatch.index}>{subMatch[1]}</strong>);
        subLastIndex = boldRegex.lastIndex;
      }
      if (subLastIndex < bulletContent.length) {
        innerParts.push(bulletContent.substring(subLastIndex));
      }

      return (
        <li key={i} className="list-none pl-5 relative mb-1 text-left before:content-['•'] before:absolute before:left-1 before:text-red-700 before:font-bold">
          {innerParts.length ? innerParts : bulletContent}
        </li>
      );
    }

    return (
      <p key={i} className="mb-1 last:mb-0 text-left">
        {parts.length ? parts : line}
      </p>
    );
  });
}

// Helper to format time (mm:ss)
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function FlashcardGame({
  items,
  courseId,
  subjectId
}: {
  items: FlashcardItem[];
  courseId?: string;
  subjectId?: string;
}) {
  // Discover distinct tags
  const tags = Array.from(
    new Set(items.map((item) => item.tag).filter((tag): tag is string => Boolean(tag)))
  );

  const isSarabanFlashcard = subjectId === 'saraban';
  const hasMultipleTopics = !isSarabanFlashcard && tags.length > 1;
  const deckSize = isSarabanFlashcard ? 20 : 10;

  // Game States
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    hasMultipleTopics ? null : '__all__'
  );
  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffles and starts the deck
  const startDeck = (topic: string | null) => {
    let filtered = [...items];
    if (topic && topic !== '__all__') {
      filtered = items.filter((item) => item.tag === topic);
    }
    const shuffled = buildDistinctRandomSession(
      distinctScope('flashcard', courseId, subjectId, topic ?? '__all__', deckSize, filtered.length),
      () => shuffleArray(filtered).slice(0, deckSize)
    );
    setDeck(shuffled);
    setIdx(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
    setElapsed(0);
    setDone(false);
    setSelectedTopic(topic);
    setIsRunning(true);
  };

  // Subjects like saraban/law derive a plain flashcard deck without tags.
  // Auto-start one mixed deck so the page does not land on an empty play state.
  useEffect(() => {
    if (!items.length || hasMultipleTopics || deck.length > 0 || done || isRunning) return;
    startDeck('__all__');
  }, [items, hasMultipleTopics, deck.length, done, isRunning]);

  // Timer Effect
  useEffect(() => {
    if (isRunning && !done) {
      const startTime = Date.now() - elapsed * 1000;
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
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

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isRunning || done) return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idx, isRunning, done, deck]);

  if (!items.length) {
    return <p className="text-center p-8">ยังไม่มีแฟลชการ์ด</p>;
  }

  if (!hasMultipleTopics && selectedTopic !== null && deck.length === 0) {
    return <p className="text-center p-8 text-slate-500">กำลังเตรียมชุดแฟลชการ์ด...</p>;
  }

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setFlipped(false);
    }
  };

  const handleNext = () => {
    if (idx < deck.length - 1) {
      setIdx(idx + 1);
      setFlipped(false);
    } else {
      setDone(true);
      setIsRunning(false);
    }
  };

  const markKnown = () => {
    setKnown((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setUnknown((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
    handleNext();
  };

  const markUnknown = () => {
    setUnknown((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setKnown((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
    handleNext();
  };

  const reshuffleDeck = () => {
    startDeck(selectedTopic);
  };

  // Get Topic Presets/Meta
  const getTopicMeta = (tag: string) => {
    const count = items.filter((item) => item.tag === tag).length;
    if (tag === 'อำนาจหน้าที่ ใครทำอะไร') {
      return {
        icon: '🏛️',
        kicker: 'Saraban Roles Review',
        desc: 'ทบทวนผู้มีอำนาจ หน้าที่รับผิดชอบ และบทบาทของหน่วยงานตามระเบียบงานสารบรรณ',
        count: `${count} ใบ`
      };
    }
    if (tag === 'กำหนดเวลา และจำนวนวัน') {
      return {
        icon: '⏱️',
        kicker: 'Saraban Timeline Review',
        desc: 'ไล่จำตัวเลข ระยะเวลา และกำหนดวันสำคัญที่ชอบออกสอบในงานสารบรรณ',
        count: `${count} ใบ`
      };
    }
    if (tag === 'ชนิดหนังสือราชการ') {
      return {
        icon: '📚',
        kicker: 'Document Types Review',
        desc: 'แยกชนิดหนังสือราชการให้ชัด ทั้งความหมาย ลักษณะ และการใช้งาน',
        count: `${count} ใบ`
      };
    }
    if (tag === 'องค์ประกอบ และหลักฐาน') {
      return {
        icon: '🗂️',
        kicker: 'Records Review',
        desc: 'ทบทวนทะเบียน ตรารับ สำเนา และองค์ประกอบเอกสารที่ใช้จริงในงานสารบรรณ',
        count: `${count} ใบ`
      };
    }
    if (tag === 'คำราชาศัพท์') {
      return {
        icon: '👑',
        kicker: 'Royal Vocabulary',
        desc: 'ทบทวนคำราชาศัพท์ที่ออกสอบบ่อย พร้อมจุดหลอกที่ชอบใช้ในข้อสอบ',
        count: `${count} ใบ`
      };
    }
    if (tag === 'ลักษณนาม') {
      return {
        icon: '🏷️',
        kicker: 'Classifier Drill',
        desc: 'ซ้อมลักษณนามที่มักสับสน ให้ตอบไวขึ้นเวลาทำข้อสอบจริง',
        count: `${count} ใบ`
      };
    }
    // Law tags
    if (tag === 'ความรู้ทั่วไปและระบบศาล') {
      return {
        icon: '⚖️',
        kicker: 'General Law & Courts',
        desc: 'ทบทวนศักดิ์ของกฎหมาย การประกาศใช้ และโครงสร้างกับความต่างของระบบศาลต่างๆ',
        count: `${count} ใบ`
      };
    }
    if (tag === 'กฎหมายแพ่งและพาณิชย์') {
      return {
        icon: '💼',
        kicker: 'Civil & Commercial Law',
        desc: 'ทบทวนหลักสภาพบุคคล ความสามารถของผู้เยาว์ นิติกรรม โมฆะ/โมฆียะ สัญญา และการค้ำประกัน/จำนอง',
        count: `${count} ใบ`
      };
    }
    if (tag === 'กฎหมายอาญา') {
      return {
        icon: '⛓️',
        kicker: 'Criminal Law',
        desc: 'ทบทวนโทษ 5 สถาน ความรับผิดทางอาญา ลหุโทษ การป้องกันโดยชอบ และเหตุจำเป็น',
        count: `${count} ใบ`
      };
    }
    if (tag === 'กฎหมายที่ดิน') {
      return {
        icon: '🗺️',
        kicker: 'Land Law',
        desc: 'แยกแยะใบจอง น.ส.3 โฉนด การครอบครองปรปักษ์ และหลักเกณฑ์การเวนคืน/ยึดคืนที่ดิน',
        count: `${count} ใบ`
      };
    }
    if (tag === 'การบริหารกิจการบ้านเมืองที่ดี') {
      return {
        icon: '🏛️',
        kicker: 'Good Governance',
        desc: 'สรุป พ.ร.ฎ. การบริหารกิจการบ้านเมืองที่ดี เป้าหมายหลัก และแนวทางปฏิบัติราชการภาครัฐ',
        count: `${count} ใบ`
      };
    }
    if (tag === 'กฎหมายวิธีพิจารณาความอาญา') {
      return {
        icon: '🔍',
        kicker: 'Criminal Procedure',
        desc: 'ทบทวนสิทธิ์ผู้ต้องหา หลักการจับ ค้น ควบคุมตัวโดยไม่มีหมาย และกรอบเวลาฝากขังศาล',
        count: `${count} ใบ`
      };
    }
    if (tag === 'กฎหมายวิธีปฏิบัติราชการทางปกครอง') {
      return {
        icon: '📋',
        kicker: 'Administrative Law',
        desc: 'ทำความเข้าใจคำสั่งทางปกครอง การยื่นอุทธรณ์คำสั่ง และหลักความรับผิดทางละเมิดของเจ้าหน้าที่',
        count: `${count} ใบ`
      };
    }
    if (tag === 'กฎหมายตำรวจและวินัยข้าราชการตำรวจ') {
      return {
        icon: '👮',
        kicker: 'Police Act & Discipline',
        desc: 'ทบทวนอำนาจหน้าที่ของตำรวจ บอร์ดบริหาร (ก.ต.ช., ก.ตร., ก.พ.ค.ตร.) และระเบียบวินัยตำรวจ',
        count: `${count} ใบ`
      };
    }
    return {
      icon: '📚',
      kicker: 'Active Recall',
      desc: 'สุ่มแฟลชการ์ดจากหัวข้อนี้เพื่อฝึกจำและกระตุ้นการดึงข้อมูล',
      count: `${count} ใบ`
    };
  };

  const isLawFlashcard = subjectId === 'law';
  const selectorBadge = isSarabanFlashcard 
    ? 'Saraban Flashcard Deck' 
    : isLawFlashcard 
    ? 'Law Flashcard Deck' 
    : 'Thai Flashcard Deck';
  const selectorTitle = isSarabanFlashcard 
    ? '✦ เลือกชุดทบทวนสารบรรณ' 
    : isLawFlashcard 
    ? '✦ เลือกชุดทบทวนกฎหมาย' 
    : '✦ เลือกชุดทบทวนที่อยากลุยก่อน';
  const selectorDesc = isSarabanFlashcard
    ? 'เริ่มจากหัวข้อที่ยังไม่แม่น หรือสุ่มรวมทุกหัวข้อเพื่อซ้อมจำสาระสำคัญของงานสารบรรณแบบ active recall'
    : isLawFlashcard
    ? 'เริ่มจากหัวข้อที่ยังไม่แม่น หรือสุ่มรวมทุกหัวข้อเพื่อซ้อมจำตัวบทกฎหมายและข้อควรจำสำคัญแบบ active recall'
    : 'เริ่มจากหัวข้อที่ยังไม่แม่น หรือสลับรวมทุกหัวข้อเพื่อซ้อมจำคำศัพท์และลักษณนามแบบสุ่มคละแนว';
  const mixedLabel = isSarabanFlashcard 
    ? 'Mixed Saraban Review' 
    : isLawFlashcard 
    ? 'Mixed Law Review' 
    : 'Mixed Review';
  const mixedTitle = isSarabanFlashcard 
    ? 'เล่นรวมทุกหัวข้อสารบรรณ' 
    : isLawFlashcard 
    ? 'เล่นรวมทุกหัวข้อกฎหมาย' 
    : 'เล่นรวมทุกหัวข้อ';
  const mixedDesc = isSarabanFlashcard
    ? 'สุ่ม 20 ใบจากทุกหมวดของงานสารบรรณ เพื่อซ้อมดึงข้อมูลสลับหัวข้อเหมือนตอนทำข้อสอบจริง'
    : isLawFlashcard
    ? 'สุ่ม 10 ใบจากทุกหมวดกฎหมาย เพื่อซ้อมดึงข้อมูลสลับหัวข้อตามแนวข้อสอบจริง'
    : 'สุ่ม 10 ใบจากคลังทั้งหมด เพื่อซ้อมดึงข้อมูลสลับแนวไปมาในแบบเดียวกับสนามสอบจริง';

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 1: Topic Selector
  // ──────────────────────────────────────────────────────────────────────────
  if (hasMultipleTopics && selectedTopic === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <style>{`
          .fc-brutal-card {
            border: 2px solid var(--color-text);
            box-shadow: 6px 6px 0 var(--color-text);
            transition: all 0.2s ease;
          }
          .fc-brutal-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0 var(--color-text);
          }
          .fc-brutal-card:active {
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
              {selectorTitle}
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
              {selectorDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tags.map((tag) => {
            const meta = getTopicMeta(tag);
            const roundCount = Math.min(10, items.filter((item) => item.tag === tag).length);
            return (
              <button
                key={tag}
                onClick={() => startDeck(tag)}
                className="fc-brutal-card flex flex-col text-left p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2"
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
                  <span>สุ่ม {roundCount} ใบต่อรอบ</span>
                  <span>เริ่มทบทวน →</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => startDeck('__all__')}
          className="fc-brutal-card w-full p-6 rounded-2xl bg-slate-900 dark:bg-zinc-800 text-white border-2 border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
        >
          <div>
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-1 block">
              {mixedLabel}
            </span>
            <h3 className="font-display font-bold text-lg mb-1">
              {mixedTitle}
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              {mixedDesc}
            </p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="px-3 py-1 rounded-full bg-slate-800 dark:bg-zinc-700 text-xs font-bold">
              {items.length} ใบ
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
  // SCREEN 3: Results
  // ──────────────────────────────────────────────────────────────────────────
  if (done) {
    const total = deck.length;
    const knownCount = known.size;
    const pct = total ? Math.round((knownCount / total) * 100) : 0;

    let evaluation = 'อย่าท้อ ลองใหม่';
    let ringColor = 'stroke-red-600';
    let textColorClass = 'text-red-600';
    if (pct >= 85) {
      evaluation = 'สุดยอดมาก!';
      ringColor = 'stroke-green-600';
      textColorClass = 'text-green-600';
    } else if (pct >= 60) {
      evaluation = 'ทำได้ดี';
      ringColor = 'stroke-amber-500';
      textColorClass = 'text-amber-500';
    } else if (pct >= 40) {
      evaluation = 'พยายามอีกนิด';
      ringColor = 'stroke-yellow-500';
      textColorClass = 'text-yellow-500';
    }

    const circumference = 2 * Math.PI * 45; // r=45 -> ~282.74
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <style>{`
          .fc-result-card {
            border: 2px solid var(--color-text);
            box-shadow: 6px 6px 0 var(--color-text);
            background: var(--color-surface);
          }
        `}</style>
        
        <div className="fc-result-card p-8 rounded-2xl border-2">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-400 block mb-4">
            ทบทวนเสร็จสิ้น
          </span>

          <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="72"
                cy="72"
                r="45"
                className="stroke-slate-100 dark:stroke-zinc-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="72"
                cy="72"
                r="45"
                className={`${ringColor} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="block font-display font-black text-3xl text-slate-900 dark:text-zinc-50">
                {pct}%
              </span>
            </div>
          </div>

          <h3 className={`font-display font-black text-2xl ${textColorClass} mb-1`}>
            {evaluation}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
            {pct >= 85 ? 'ความจำดีเยี่ยม พร้อมลงสนามสอบจริงแล้ว' : pct >= 60 ? 'เกือบเต็มร้อยแล้ว ทบทวนซ้ำอีกหน่อย!' : 'ลองกลับไปจำศัพท์แล้วเล่นใหม่อีกรอบนะ'}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-xl">
              <span className="block text-xl font-bold text-green-700 dark:text-green-400">
                {knownCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">จำได้</span>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
              <span className="block text-xl font-bold text-red-700 dark:text-red-400">
                {unknown.size}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">จำไม่ได้</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl">
              <span className="block text-xl font-bold text-amber-700 dark:text-amber-400">
                {formatTime(elapsed)}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">เวลาที่ใช้</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl">
              <span className="block text-xl font-bold text-slate-700 dark:text-zinc-300">
                {total}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">ทั้งหมด</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={reshuffleDeck}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white font-bold text-sm border-2 border-slate-900 dark:border-zinc-700 hover:opacity-90 transition-opacity"
            >
              {`สุ่มใหม่ ${deckSize} ใบ`}
            </button>
            {hasMultipleTopics && (
              <button
                onClick={() => setSelectedTopic(null)}
                className="w-full py-3 rounded-xl bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-300 font-bold text-sm border-2 border-slate-900 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                เปลี่ยนหัวข้อทบทวน
              </button>
            )}
            <Link
              href={`/courses/${courseId}/${subjectId}/practices`}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors inline-block"
            >
              กลับไปลานฝึก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 2: Flashcard Deck View
  // ──────────────────────────────────────────────────────────────────────────
  const card = deck[idx];
  const progressPercent = deck.length ? (idx / deck.length) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <style>{`
        .fc-perspective {
          perspective: 1000px;
        }
        .fc-flip-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fc-flip-card.is-flipped {
          transform: rotateY(180deg);
        }
        .fc-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 20px;
          border: 2px solid var(--color-text);
          box-shadow: 6px 6px 0 var(--color-text);
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .fc-front {
          background: var(--color-surface);
        }
        .fc-back {
          transform: rotateY(180deg);
          background: var(--color-accent-soft);
          border-color: var(--color-accent);
        }
        .fc-brutal-btn {
          border: 2px solid var(--color-text);
          box-shadow: 3px 3px 0 var(--color-text);
          transition: all 0.1s ease;
        }
        .fc-brutal-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 var(--color-text);
        }
        .fc-brutal-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0 var(--color-text);
        }
        .fc-brutal-btn:disabled {
          opacity: 0.4;
          transform: none;
          box-shadow: 1px 1px 0 var(--color-text);
          cursor: not-allowed;
        }
      `}</style>

      {/* Progress & Stats Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2">
          <span>ใบที่ {idx + 1} / {deck.length}</span>
          <span>⏱ {formatTime(elapsed)}</span>
          <span className="text-green-600 dark:text-green-400">✅ {known.size} จำได้</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full border-2 border-slate-900 dark:border-zinc-700 overflow-hidden">
          <div
            className="h-full bg-red-700 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card */}
      <div className="fc-perspective mb-4 relative" style={{ height: 320 }}>
        <div
          onClick={() => setFlipped(!flipped)}
          className={`fc-flip-card ${flipped ? 'is-flipped' : ''} cursor-pointer`}
        >
          {card && (
            <>
              {/* FRONT FACE */}
              <div className="fc-face fc-front">
                <span className="absolute top-4 left-4 text-2xs font-extrabold tracking-widest text-slate-400 uppercase">
                  คำถาม (Q)
                </span>
                <div className="text-center font-display font-bold text-slate-900 dark:text-zinc-50 text-2xl md:text-3xl leading-relaxed max-w-lg">
                  {renderMarkdown(card.front)}
                </div>
                {card.tag && (
                  <span className="absolute bottom-4 right-4 text-3xs font-extrabold tracking-wider bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-slate-500">
                    {card.tag}
                  </span>
                )}
              </div>

              {/* BACK FACE */}
              <div className="fc-face fc-back">
                <span className="absolute top-4 left-4 text-2xs font-extrabold tracking-widest text-red-700/80 uppercase">
                  คำตอบ (A)
                </span>
                <div className="text-center font-body font-medium text-slate-950 text-xl md:text-2xl leading-relaxed max-w-lg">
                  {renderMarkdown(card.back)}
                </div>
                {card.tag && (
                  <span className="absolute bottom-4 right-4 text-3xs font-extrabold tracking-wider bg-red-100/60 px-3 py-1 rounded-full text-red-900/80">
                    {card.tag}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-zinc-400 mb-8">
        {flipped ? '💡 แตะการ์ดเพื่อย้อนกลับไปดูคำถาม' : '💡 แตะการ์ดเพื่อเฉลยคำตอบ (หรือกดสเปซบาร์)'}
      </div>

      {/* Controller Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={handlePrev}
          disabled={idx === 0}
          className="fc-brutal-btn py-3 rounded-xl bg-white dark:bg-zinc-900 font-bold text-sm text-slate-800 dark:text-zinc-300"
        >
          ← ก่อนหน้า
        </button>
        <button
          onClick={markUnknown}
          className="fc-brutal-btn py-3 col-span-1 rounded-xl bg-red-500 text-white font-bold text-sm"
        >
          จำไม่ได้
        </button>
        <button
          onClick={markKnown}
          className="fc-brutal-btn py-3 col-span-1 rounded-xl bg-green-500 text-white font-bold text-sm"
        >
          จำได้
        </button>
        <button
          onClick={handleNext}
          className="fc-brutal-btn py-3 rounded-xl bg-white dark:bg-zinc-900 font-bold text-sm text-slate-800 dark:text-zinc-300"
        >
          {idx === deck.length - 1 ? '🏁 ดูผล' : 'ข้าม →'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={reshuffleDeck}
          className="text-slate-600 dark:text-zinc-400 text-xs font-bold hover:underline"
        >
          {`↻ สุ่มใหม่อีก ${deckSize} ใบ`}
        </button>
      </div>

      {hasMultipleTopics && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setSelectedTopic(null)}
            className="text-slate-600 dark:text-zinc-400 text-xs font-bold hover:underline"
          >
            ← เลือกหัวข้อทบทวนใหม่
          </button>
        </div>
      )}
    </div>
  );
}
