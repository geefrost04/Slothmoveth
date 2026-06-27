'use client';

import { useEffect, useState } from 'react';
import type { QuizItem } from '@/lib/course-types';
import { getSupabase } from '@/lib/supabase';
import { buildDistinctRandomSession, distinctScope, shuffleArray } from '@/lib/randomization';

const CORRECT_DELAY_MS = 1400;
const WRONG_DELAY_MS = 2600;
const MAX_HISTORY_ITEMS = 6;

type QuizMode = 'standard' | 'survival' | 'speed';

type SavedQuizResult = {
  id: string;
  score: number;
  total: number;
  pct: number;
  wrong: number;
  durationSec: number;
  mode: number;
  savedAt: string;
};

type QuizModeOption = {
  count: number;
  label: string;
  desc: string;
  badge?: string;
  primaryIcon?: string;
  speedSeconds?: number;
};

/** Simple emoji lookup — matches the flat / neo-brutalist design system used
 *  everywhere else on the platform (blocky icons, no gradients, no drop-shadows). */
const QUIZ_EMOJI: Record<string, string> = {
  flame: '🔥',
  bolt: '⚡',
  quiz: '📝',
  trophy: '🏆',
  coffee: '☕',
  key: '🔑',
  stopwatch: '⏱️',
  brain: '🧠',
  target: '🎯',
  history: '🕘',
};

function QuizIcon({ name }: { name: string }) {
  return <span aria-hidden="true">{QUIZ_EMOJI[name] ?? '📋'}</span>;
}

function getStorageKey(title?: string) {
  const safeTitle = (title ?? 'quiz')
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `slothmove-quiz-history:${safeTitle || 'quiz'}`;
}

function getBestStreakKey(title?: string) {
  return `${getStorageKey(title)}:best-streak`;
}

function formatDuration(durationSec: number) {
  const minutes = String(Math.floor(durationSec / 60)).padStart(2, '0');
  const seconds = String(durationSec % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(savedAt));
}

function getReadingPassageKey(item: QuizItem): string | null {
  if (item.passage) return item.passage;
  if (item.category !== 'reading') return null;

  const match = item.question.match(/^Read:\s*'(.+)'\s{2,}/);
  return match?.[1] ?? null;
}

function buildGroupedQuizSession(items: QuizItem[], count: number) {
  const readingGroups = new Map<string, QuizItem[]>();
  const standaloneItems: QuizItem[] = [];

  for (const item of items) {
    const passageKey = getReadingPassageKey(item);
    if (!passageKey) {
      standaloneItems.push(item);
      continue;
    }

    const group = readingGroups.get(passageKey);
    if (group) {
      group.push(item);
    } else {
      readingGroups.set(passageKey, [item]);
    }
  }

  const units = shuffleArray([
    ...Array.from(readingGroups.values()).map((group) => ({ type: 'group' as const, items: group })),
    ...standaloneItems.map((item) => ({ type: 'single' as const, items: [item] }))
  ]);

  const selected: QuizItem[] = [];
  for (const unit of units) {
    if (selected.length >= count) break;
    if (selected.length + unit.items.length > count) continue;
    selected.push(...unit.items);
  }

  if (selected.length < count) {
    const selectedSet = new Set(selected);
    for (const item of shuffleArray(items)) {
      if (selected.length >= count) break;
      if (!selectedSet.has(item) && !getReadingPassageKey(item)) {
        selected.push(item);
        selectedSet.add(item);
      }
    }
  }

  return selected;
}

function parseDialogueQuestion(question: string) {
  const speakerPattern = /\b([A-Z][A-Za-z ]{0,24}|[A-Z]):\s*/g;
  const lines: Array<{ speaker: string; text: string }> = [];
  const matches = Array.from(question.matchAll(speakerPattern));

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const textStart = match.index + match[0].length;
    const textEnd = nextMatch?.index ?? question.length;
    const text = question
      .slice(textStart, textEnd)
      .trim()
      .replace(/^'|'$/g, '')
      .trim();

    if (!text) continue;
    lines.push({
      speaker: match[1],
      text
    });
  }

  return lines.length >= 2 ? lines : null;
}

function DialogueQuestionBlock({ question }: { question: string }) {
  const lines = parseDialogueQuestion(question);
  if (!lines) return <h2 className="quiz-question-title">{question}</h2>;

  return (
    <div className="quiz-question-title" style={{ textAlign: 'left' }}>
      <div
        style={{
          display: 'grid',
          gap: '12px',
          width: '100%'
        }}
      >
        {lines.map((line, index) => (
          <div
            key={`${line.speaker}-${index}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(76px, max-content) 1fr',
              gap: '12px',
              alignItems: 'start',
              padding: '12px 14px',
              border: '2px solid var(--color-text)',
              borderRadius: '12px',
              background: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)',
              boxShadow: '3px 3px 0 var(--color-text)'
            }}
          >
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                color: 'var(--color-primary)',
                whiteSpace: 'nowrap'
              }}
            >
              {line.speaker}
            </span>
            <span style={{ fontWeight: 800, lineHeight: 1.45 }}>
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuizGame({
  items,
  title,
  subtitle,
  courseId,
  leaderboardHref,
  mode = 'standard',
  introChip,
  introTitle,
  introDescription,
  introStats,
  modeOptions,
  speedBaseScore = 10,
  defaultSpeedSeconds = 10,
  subjectMascot,
  gameMascot,
  subjectId
}: {
  items: QuizItem[];
  title?: string;
  subtitle?: string;
  subjectId?: string;
  courseId?: string;
  leaderboardHref?: string;
  mode?: QuizMode;
  introChip?: string;
  introTitle?: string;
  introDescription?: string;
  introStats?: string[];
  modeOptions?: QuizModeOption[];
  speedBaseScore?: number;
  defaultSpeedSeconds?: number;
  subjectMascot?: string;
  gameMascot?: string;
}) {
  const [sessionItems, setSessionItems] = useState<QuizItem[] | null>(null);
  const [modeCount, setModeCount] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [savedResults, setSavedResults] = useState<SavedQuizResult[]>([]);
  const [hasSavedCurrent, setHasSavedCurrent] = useState(false);
  const [nickname, setNickname] = useState('');
  const [remoteSaveState, setRemoteSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [remoteSaveMessage, setRemoteSaveMessage] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [speedSeconds, setSpeedSeconds] = useState<number>(defaultSpeedSeconds);
  const [timeLeft, setTimeLeft] = useState<number>(defaultSpeedSeconds);
  const [didTimeout, setDidTimeout] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<{ item: QuizItem; picked: number | null; questionIndex: number }[]>([]);
  const [showReview, setShowReview] = useState(false);

  const storageKey = getStorageKey(title?.split(' · ')[0]);
  const bestStreakKey = getBestStreakKey(title?.split(' · ')[0]);
  const isSpeed = mode === 'speed';
  const isSurvival = mode === 'survival';

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setSavedResults([]);
      } else {
        const parsed = JSON.parse(raw) as SavedQuizResult[];
        setSavedResults(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setSavedResults([]);
    }

    try {
      const premiumStatus = window.localStorage.getItem('slothmove:premium') === 'true';
      setIsPremium(premiumStatus);
    } catch {
      setIsPremium(false);
    }

    if (!isSurvival) return;

    try {
      const rawBest = window.localStorage.getItem(bestStreakKey);
      setBestStreak(rawBest ? Number(rawBest) || 0 : 0);
    } catch {
      setBestStreak(0);
    }
  }, [bestStreakKey, isSurvival, storageKey]);

  const handleEnterPasscode = () => {
    const code = window.prompt("กรุณากรอกรหัสเปิดใช้งาน Premium:");
    if (code === null) return;
    if (code.toUpperCase() === "SLOTHPREMIUM" || code.toUpperCase() === "SLOTHMOVE2026") {
      try {
        window.localStorage.setItem('slothmove:premium', 'true');
        setIsPremium(true);
        window.alert("ยินดีด้วยครับ! เปิดใช้งานสิทธิ์ Premium และปลดล็อกฟีเจอร์ท้าทายทั้งหมดสำเร็จ 🎉");
      } catch {
        window.alert("ไม่สามารถบันทึกข้อมูลสิทธิ์ลงในเครื่องได้");
      }
    } else {
      window.alert("รหัสผ่านไม่ถูกต้อง กรุณาติดต่อผู้พัฒนาทางแฟนเพจ SlothMove");
    }
  };

  useEffect(() => {
    if (!sessionItems || done) return undefined;
    const intervalId = window.setInterval(() => {
      setElapsedSec((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [sessionItems, done]);

  useEffect(() => {
    if (!sessionItems || done || !isSpeed || picked !== null || didTimeout) return undefined;
    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [didTimeout, done, isSpeed, picked, sessionItems, idx]);

  useEffect(() => {
    if (!isSpeed || done || picked !== null || didTimeout || !sessionItems) return;
    if (timeLeft > 0) return;
    revealAnswer(null, true);
  }, [didTimeout, done, isSpeed, picked, sessionItems, timeLeft]);

  // ESC to close the save popup
  useEffect(() => {
    if (!showSavePopup) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowSavePopup(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showSavePopup]);

  if (!items.length) return <p style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีคำถาม</p>;

  const options = modeOptions ?? (
    isSurvival
      ? [{
          count: items.length,
          label: 'เริ่มเอาชีวิตรอด',
          desc: 'สุ่มข้อจากคลังทั้งหมด ตอบถูกไปต่อ ตอบผิดจบทันที และเก็บสถิติสูงสุดอัตโนมัติ',
          badge: '∞',
          primaryIcon: '🔥'
        }]
      : isSpeed
        ? [
            {
              count: Math.min(10, items.length),
              label: 'สปีดจัด · 5 วินาที',
              desc: 'โหมดเร็วสุด ตัดสินใจไวและเก็บโบนัสจากเวลาที่เหลือ',
              badge: '5s',
              primaryIcon: '⚡',
              speedSeconds: 5
            },
            {
              count: Math.min(10, items.length),
              label: 'มาตรฐาน · 10 วินาที',
              desc: 'จังหวะสมดุล เหมาะกับการซ้อมประจำวัน',
              badge: '10s',
              primaryIcon: '⏱️',
              speedSeconds: 10
            },
            {
              count: Math.min(10, items.length),
              label: 'อ่านสบาย · 15 วินาที',
              desc: 'เผื่อเวลาอ่านมากขึ้น แต่ยังคงแรงกดดันของสปีดเกม',
              badge: '15s',
              primaryIcon: '🧠',
              speedSeconds: 15
            }
          ]
        : [
            {
              count: 10,
              label: 'ทำ 10 ข้อ',
              desc: 'เหมาะกับการซ้อมเร็ว ใช้เวลาน้อยและเช็กความพร้อมแบบไว',
              badge: '10',
              primaryIcon: '⚡'
            },
            {
              count: Math.min(100, items.length),
              label: 'ทำ 100 ข้อ',
              desc: 'เหมาะกับการจับจังหวะสอบจริงและวัดความแม่นแบบจริงจัง',
              badge: `${Math.min(100, items.length)}`,
              primaryIcon: '🎯'
            }
          ]
  );

  function goBackToHub() {
    if (typeof window === 'undefined') return;
    // police_admin has dedicated practice hub → go there
    // other courses fall back to subject page
    const href = courseId === 'police_admin' && subjectId
      ? `/courses/${courseId}/${subjectId}/practices`
      : courseId && subjectId
        ? `/courses/${courseId}/${subjectId}`
        : courseId
          ? `/courses/${courseId}`
          : '/';
    window.location.href = href;
  }

  function resetToIntro() {
    setSessionItems(null);
    setModeCount(null);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setCorrectCount(0);
    setDone(false);
    setElapsedSec(0);
    setHasSavedCurrent(false);
    setNickname('');
    setRemoteSaveState('idle');
    setRemoteSaveMessage('');
    setTimeLeft(defaultSpeedSeconds);
    setSpeedSeconds(defaultSpeedSeconds);
    setDidTimeout(false);
    setWrongAnswers([]);
    setShowReview(false);
    setShowSavePopup(false);
  }

  function startQuiz(count: number, nextSpeedSeconds?: number) {
    const pool = buildDistinctRandomSession(
      distinctScope('quiz', courseId, subjectId, title ?? 'quiz', mode, count, items.length),
      () => buildGroupedQuizSession(items, count),
      {
        signature: (sessionItems) => sessionItems.map((item) => item.question)
      }
    );
    const resolvedSpeedSeconds = nextSpeedSeconds ?? defaultSpeedSeconds;
    setSessionItems(pool);
    setModeCount(count);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setCorrectCount(0);
    setDone(false);
    setElapsedSec(0);
    setHasSavedCurrent(false);
    setNickname('');
    setRemoteSaveState('idle');
    setRemoteSaveMessage('');
    setSpeedSeconds(resolvedSpeedSeconds);
    setTimeLeft(resolvedSpeedSeconds);
    setDidTimeout(false);
    setWrongAnswers([]);
    setShowReview(false);
    setShowSavePopup(false);
  }

  function saveCurrentResult() {
    if (!sessionItems || !done || hasSavedCurrent) return;

    const total = sessionItems.length;
    const nextEntry: SavedQuizResult = {
      id: `${Date.now()}`,
      score,
      total,
      pct: Math.round((correctCount / total) * 100),
      wrong: total - correctCount,
      durationSec: elapsedSec,
      mode: modeCount ?? total,
      savedAt: new Date().toISOString()
    };

    const nextResults = [nextEntry, ...savedResults].slice(0, MAX_HISTORY_ITEMS);
    setSavedResults(nextResults);
    setHasSavedCurrent(true);

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextResults));
    } catch {
      // Ignore storage errors to keep the game flow working.
    }
  }

  function persistBestStreak(streak: number) {
    if (!isSurvival) return;
    const nextBest = Math.max(bestStreak, streak);
    setBestStreak(nextBest);
    try {
      window.localStorage.setItem(bestStreakKey, String(nextBest));
    } catch {
      // Ignore storage errors to keep the game flow working.
    }
  }

  async function saveScoreToSupabase() {
    if (!sessionItems || !done) return;

    const cleanName = nickname.trim();
    if (!cleanName) {
      setRemoteSaveState('error');
      setRemoteSaveMessage('กรอกชื่อเล่นก่อนบันทึกคะแนน');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setRemoteSaveState('error');
      setRemoteSaveMessage('ยังไม่ได้ตั้งค่า Supabase ในโปรเจกต์นี้');
      return;
    }

    setRemoteSaveState('saving');
    setRemoteSaveMessage('');

    const total = sessionItems.length;
    const payload = {
      nickname: cleanName,
      dept: courseId ?? null,
      subject: title ?? 'ข้อสอบ',
      score,
      total,
      pct: Math.round((correctCount / total) * 100),
      mode: modeCount ?? total,
      time_sec: elapsedSec
    };

    try {
      const firstInsert = await supabase.from('scores').insert(payload);
      if (firstInsert.error) {
        if (/dept|schema cache/i.test(firstInsert.error.message)) {
          const fallbackPayload = { ...payload };
          delete (fallbackPayload as { dept?: string | null }).dept;
          const secondInsert = await supabase.from('scores').insert(fallbackPayload);
          if (secondInsert.error) throw secondInsert.error;
        } else {
          throw firstInsert.error;
        }
      }

      saveCurrentResult();
      setRemoteSaveState('saved');
      setRemoteSaveMessage('บันทึกคะแนนขึ้นกระดานแล้ว');
    } catch (error) {
      setRemoteSaveState('error');
      setRemoteSaveMessage(
        error instanceof Error ? `บันทึกไม่สำเร็จ: ${error.message}` : 'บันทึกไม่สำเร็จ'
      );
    }
  }

  function revealAnswer(choiceIndex: number | null, timedOut = false) {
    if (!sessionItems || picked !== null || didTimeout) return;

    const item = sessionItems[idx];
    const isCorrect = choiceIndex === item.answer;
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);
    const nextScore = isSpeed
      ? score + (isCorrect ? speedBaseScore + timeLeft : 0)
      : score + (isCorrect ? 1 : 0);

    setPicked(choiceIndex);
    setDidTimeout(timedOut);
    if (isCorrect) {
      setCorrectCount(nextCorrectCount);
      setScore(nextScore);
    } else {
      // Track wrong answer for review screen
      setWrongAnswers((prev) => [
        ...prev,
        { item, picked: choiceIndex, questionIndex: idx }
      ]);
    }

    const shouldEndNow = isSurvival
      ? !isCorrect || idx + 1 >= sessionItems.length
      : idx + 1 >= sessionItems.length;

    window.setTimeout(() => {
      if (isSurvival && !isCorrect) {
        persistBestStreak(nextCorrectCount);
      }
      if (isSurvival && isCorrect && idx + 1 >= sessionItems.length) {
        persistBestStreak(nextCorrectCount);
      }

      if (shouldEndNow) {
        setDone(true);
        window.dispatchEvent(new CustomEvent('slothmove:donate'));
        return;
      }

      setIdx((current) => current + 1);
      setPicked(null);
      setDidTimeout(false);
      if (isSpeed) setTimeLeft(speedSeconds);
    }, isCorrect ? CORRECT_DELAY_MS : WRONG_DELAY_MS);
  }

  if (!sessionItems) {
    return (
      <div className="quiz-shell">
        <section className="quiz-intro course-subject-page">
          <header className="course-subject-header quiz-intro-header">
            {courseId !== 'police_admin' && (
              <div className="course-subject-header-deco" aria-hidden="true">
                <span className="course-subject-deco-symbol">π</span>
                <span className="course-subject-deco-symbol">∑</span>
                <span className="course-subject-deco-symbol">√</span>
                <span className="course-subject-deco-symbol">×</span>
              </div>
            )}
            <div className="container course-subject-header-inner quiz-intro-header-inner">
              <div className="course-subject-icon quiz-intro-icon">
                <QuizIcon name={isSurvival ? 'flame' : isSpeed ? 'bolt' : 'quiz'} />
              </div>
              <div className="course-subject-heading">
                <div className="course-subject-chip">{introChip ?? (isSurvival ? 'Survival Mode' : isSpeed ? 'Speed Quiz' : 'Quiz Mode')}</div>
                <h1>{introTitle ?? title ?? 'เลือกโหมดทำข้อสอบ'}</h1>
                <p>
                  {introDescription ?? subtitle ?? 'เลือกจำนวนข้อที่ต้องการก่อนเริ่ม ระบบจะสุ่มคำถามจากคลังเดิมเพื่อให้ซ้อมได้หลายรอบแบบไม่จำเจ'}
                </p>
              </div>
              <div className="course-subject-mascot quiz-intro-hero-mascot" aria-hidden="true">
                <div className="course-subject-mascot-glow" />
                <img
                  src={
                    courseId === 'police_admin'
                      ? (isSurvival
                          ? '/pic/quiz-mascot/mascot-survival.png'
                          : isSpeed
                          ? '/pic/quiz-mascot/mascot-speed.png'
                          : '/pic/quiz-mascot/mascot-quiz.png')
                      : (gameMascot || subjectMascot || '/pic/slothmove_mascot.png')
                  }
                  alt=""
                  loading="eager"
                  onError={(e) => {
                    // If game-specific mascot 404s, fall back to subject mascot
                    const target = e.currentTarget;
                    if (gameMascot && subjectMascot && target.src.includes(gameMascot)) {
                      target.src = subjectMascot;
                    }
                  }}
                />
              </div>
            </div>
          </header>

          <div className="container course-subject-body">
            {isSurvival && !isPremium ? (
              <section className="pab-knowledge-section quiz-intro-panel quiz-intro-panel-locked">
                <div className="pab-knowledge-section-header">
                  <div className="pab-knowledge-section-icon">
                    <QuizIcon name="trophy" />
                  </div>
                  <div>
                    <div className="pab-knowledge-section-chip">Survival Mode · ตอบผิดจบเกม</div>
                    <h2 className="pab-knowledge-section-title">โหมดท้าทายสำหรับผู้สนับสนุน Premium</h2>
                    <p className="pab-knowledge-section-desc">
                      ระบบจะสุ่มข้อให้ต่อเนื่อง ตอบถูกไปต่อทันทีและจบเกมเมื่อพลาดข้อแรก — พร้อมเก็บ Best Streak ไว้ในเครื่องนี้
                    </p>
                  </div>
                </div>

                <ul className="quiz-intro-locked-perks">
                  <li>
                    <span className="quiz-intro-locked-check" aria-hidden="true">
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"><path d="M2.5 6.5l2.5 2.5L9.5 3.5" /></svg>
                    </span>
                    <span><strong>เล่น Survival Mode</strong> สุ่มโจทย์ควิซต่อเนื่อง</span>
                  </li>
                  <li>
                    <span className="quiz-intro-locked-check" aria-hidden="true">
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"><path d="M2.5 6.5l2.5 2.5L9.5 3.5" /></svg>
                    </span>
                    <span><strong>บันทึกสถิติสูงสุด</strong> (Best Streak) ไว้ในเครื่องนี้</span>
                  </li>
                  <li>
                    <span className="quiz-intro-locked-check" aria-hidden="true">
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"><path d="M2.5 6.5l2.5 2.5L9.5 3.5" /></svg>
                    </span>
                    <span><strong>ปลดล็อกเล่นได้ถาวร</strong> ใช้ได้ทุกวิชา ไม่จำกัดครั้ง</span>
                  </li>
                </ul>

                <div className="quiz-intro-locked-actions">
                  <button
                    type="button"
                    className="quiz-intro-locked-cta"
                    onClick={() => window.dispatchEvent(new CustomEvent('slothmove:donate'))}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                  >
                    <QuizIcon name="coffee" />
                    เลี้ยงกาแฟปลดล็อก Premium
                  </button>
                  <button
                    type="button"
                    className="quiz-intro-locked-cta-secondary"
                    onClick={handleEnterPasscode}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                  >
                    <QuizIcon name="key" />
                    กรอกรหัสปลดล็อก
                  </button>
                </div>
              </section>
            ) : (
              <section className="pab-knowledge-section quiz-intro-panel">
                <div className="pab-knowledge-section-header">
                  <div className="pab-knowledge-section-icon">
                    <QuizIcon name={isSurvival ? 'flame' : isSpeed ? 'bolt' : 'quiz'} />
                  </div>
                  <div>
                    <div className="pab-knowledge-section-chip">เลือกชุดเกม</div>
                    <h2 className="pab-knowledge-section-title">
                      {isSurvival
                        ? 'เริ่มโหมดตอบผิดจบเกม'
                        : isSpeed
                          ? 'เลือกสปีดที่ต้องการก่อนเริ่ม'
                          : 'เริ่มทำข้อสอบในรูปแบบที่เหมาะกับรอบนี้'}
                    </h2>
                    <p className="pab-knowledge-section-desc">
                      {isSurvival
                        ? 'ระบบจะสุ่มข้อให้ต่อเนื่อง ตอบถูกไปต่อทันทีและจบเกมเมื่อพลาดข้อแรก'
                        : isSpeed
                          ? 'ทุกข้อมีเวลาจำกัด ตอบถูกจะได้คะแนนพื้นฐานพร้อมโบนัสจากเวลาที่เหลือ'
                          : 'ถ้าต้องการซ้อมเร็วให้เลือก 10 ข้อ ถ้าต้องการจำลองจังหวะสอบจริงให้เลือก 100 ข้อ'}
                    </p>
                  </div>
                </div>

                {courseId === 'police_admin' && (savedResults.length > 0 || (isSurvival && bestStreak > 0)) ? (
                  <section className="pab-knowledge-section quiz-history-panel">
                    <div className="pab-knowledge-section-header">
                      <div className="pab-knowledge-section-icon">
                        <QuizIcon name="history" />
                      </div>
                      <div>
                        <div className="pab-knowledge-section-chip">ประวัติคะแนนย้อนหลัง · Local only</div>
                        <h2 className="pab-knowledge-section-title">
                          คะแนนรอบที่ผ่านมา
                        </h2>
                        <p className="pab-knowledge-section-desc">
                          บันทึกไว้ในเครื่องนี้ — เมื่อมีระบบล็อกอิน คะแนนจะ sync ขึ้นบัญชีผู้ใช้อัตโนมัติ
                        </p>
                      </div>
                    </div>

                    {isSurvival && bestStreak > 0 ? (
                      <div className="quiz-history-streak-banner">
                        <span className="quiz-history-streak-icon" aria-hidden="true">🔥</span>
                        <div className="quiz-history-streak-body">
                          <strong>Best Streak {bestStreak} ข้อ</strong>
                          <span>สถิติตอบถูกต่อเนื่องสูงสุดในเครื่องนี้</span>
                        </div>
                      </div>
                    ) : null}

                    {savedResults.length > 0 ? (
                      <>
                        <ul className="quiz-history-list">
                          {savedResults.slice(0, 5).map((result) => (
                            <li key={result.id} className="quiz-history-row">
                              <div className="quiz-history-row-score">
                                <strong>{result.pct}<span>%</span></strong>
                                <span className="quiz-history-row-score-meta">
                                  {isSpeed ? `${result.score} แต้ม` : `${result.total - result.wrong}/${result.total}`}
                                </span>
                              </div>
                              <div className="quiz-history-row-detail">
                                <span className="quiz-history-row-mode">
                                  {isSurvival ? '🔥 Survival' : isSpeed ? '⚡ Speed' : '🎯 Quiz'}
                                </span>
                                <span className="quiz-history-row-info">
                                  ผิด {result.wrong} ข้อ · ใช้เวลา {formatDuration(result.durationSec)}
                                </span>
                                <time className="quiz-history-row-date" dateTime={new Date(result.savedAt).toISOString()}>
                                  {formatSavedAt(result.savedAt)}
                                </time>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {savedResults.length > 5 ? (
                          <p className="quiz-history-foot">
                            + อีก {savedResults.length - 5} รอบที่บันทึกไว้ (แสดง 5 รอบล่าสุด)
                          </p>
                        ) : null}
                      </>
                    ) : null}
                  </section>
                ) : null}

                <div className="quiz-mode-grid">
                  {options.map((option, i) => {
                    const optionIconName = isSurvival
                      ? 'flame'
                      : isSpeed
                        ? (i === 0 ? 'bolt' : i === 1 ? 'stopwatch' : 'brain')
                        : (i === 0 ? 'bolt' : 'target');
                    return (
                      <button
                        key={`${option.label}-${option.count}-${option.speedSeconds ?? 'default'}`}
                        onClick={() => startQuiz(option.count, option.speedSeconds)}
                        className="quiz-mode-card"
                      >
                        <div className="quiz-mode-card-top">
                          <span className="quiz-mode-card-icon">
                            <QuizIcon name={optionIconName} />
                          </span>
                          <span className="quiz-mode-card-badge">{option.badge ?? option.count}</span>
                        </div>
                        <div className="quiz-mode-card-copy">
                          <strong>{option.label}</strong>
                          <p>{option.desc}</p>
                        </div>
                        <span className="quiz-mode-card-cta">เริ่มชุดนี้ →</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

          </div>
        </section>
      </div>
    );
  }

  const activeItems = sessionItems;
  const total = activeItems.length;
  const wrongCount = total - correctCount;
  const pct = Math.round((correctCount / total) * 100);
  const resultTone = pct >= 60 ? 'good' : pct >= 50 ? 'warn' : 'fail';
  const resultImage = pct >= 60
    ? '/pic/result-mascot/result-good.png'
    : pct >= 50
      ? '/pic/result-mascot/result-warn.png'
      : '/pic/result-mascot/result-fail.png';
  const resultChipLabel = pct >= 60
    ? 'ผ่านเกณฑ์'
    : pct >= 50
      ? 'เกือบไม่รอด'
      : 'ยังไม่ผ่าน';
  const resultHeadline = pct >= 60
    ? 'เก่งมาก! เก็บ momentum นี้ไว้'
    : pct >= 50
      ? 'เกือบแล้ว อย่าเพิ่งท้อ'
      : 'ครั้งนี้ยังไม่ผ่าน ลองอีกสักรอบ';
  const resultMessage = isSurvival
    ? correctCount > 0
      ? `ตอบถูกต่อเนื่อง ${correctCount} ข้อ${bestStreak < correctCount ? ' และทำสถิติใหม่' : ''}`
      : 'เริ่มได้แล้ว ลองกดใหม่และเก็บสถิติให้ไกลกว่าเดิม'
    : isSpeed
      ? `จบสปีดรอบนี้ด้วย ${score} แต้ม จาก ${correctCount} ข้อที่ตอบถูก`
      : pct >= 60
        ? 'ผ่านเกณฑ์แล้ว! เก็บ momentum นี้ไว้ลุยชุดยาวหรือจับเวลาต่อ'
          : pct >= 50
          ? 'เกือบไม่รอด — รีวิวข้อที่ผิดแล้วลองอีกรอบ อย่าเพิ่งท้อ'
          : 'ยังไม่ผ่านเกณฑ์ กลับไปทบทวนเนื้อหาแล้วลองใหม่อีกครั้งนะ';

  if (done && !showReview) {
    return (
      <div className="quiz-shell">
        <div className="container course-subject-body">
          <section className={`pab-knowledge-section quiz-result-panel is-${resultTone}`}>
            {/* LEFT — Mascot + message */}
            <div className="quiz-result-hero">
              <div className="quiz-result-icon">
                {/* Progress ring around mascot */}
                <svg className="quiz-result-ring" viewBox="0 0 120 120" aria-hidden="true">
                  <circle className="quiz-result-ring-track" cx="60" cy="60" r="54" />
                  <circle
                    className="quiz-result-ring-fill"
                    cx="60" cy="60" r="54"
                    strokeDasharray={`${(pct / 100) * 339.29} 339.29`}
                  />
                </svg>
                <img src={resultImage} alt="" className="quiz-result-mascot" />
                <div className="quiz-result-pct">
                  <strong>{pct}<span>%</span></strong>
                </div>
              </div>
              <div className="quiz-result-hero-copy">
                <div className="course-subject-chip quiz-result-chip">{resultChipLabel}</div>
                <h2 className="quiz-result-headline">{resultHeadline}</h2>
                <p className="quiz-result-message">{resultMessage}</p>
              </div>
            </div>

            {/* RIGHT — Score + stats */}
            <div className="quiz-result-summary">
              <div className="quiz-result-primary-stat">
                <span className="quiz-result-primary-stat-label">
                  {isSpeed ? 'คะแนนรวม' : 'คะแนน'}
                </span>
                <strong className="quiz-result-primary-stat-value">
                  {isSpeed ? `${score}` : `${correctCount}`}
                  <span className="quiz-result-primary-stat-suffix">
                    {isSpeed ? ' แต้ม' : `/${total} · ${pct}%`}
                  </span>
                </strong>
              </div>

              <div className="quiz-result-meta-grid">
                <div className="quiz-result-meta-item is-correct">
                  <span className="quiz-result-meta-label">ตอบถูก</span>
                  <strong>{correctCount} <small>ข้อ</small></strong>
                </div>
                <div className="quiz-result-meta-item is-wrong">
                  <span className="quiz-result-meta-label">ตอบผิด</span>
                  <strong>{wrongCount} <small>ข้อ</small></strong>
                </div>
                <div className="quiz-result-meta-item">
                  <span className="quiz-result-meta-label">{isSpeed ? 'โบนัส' : 'ใช้เวลา'}</span>
                  <strong>{isSpeed ? `+${score - correctCount * 10}` : formatDuration(elapsedSec)}</strong>
                </div>
                {isSurvival ? (
                  <div className="quiz-result-meta-item is-streak">
                    <span className="quiz-result-meta-label">Best Streak</span>
                    <strong>{Math.max(bestStreak, correctCount)} <small>ข้อ</small></strong>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Actions row */}
            <div className="quiz-result-actions">
              {wrongAnswers.length > 0 ? (
                <button
                  className="btn btn-warn"
                  onClick={() => setShowReview(true)}
                >
                  รีวิวข้อที่ผิด ({wrongAnswers.length})
                </button>
              ) : null}
              <button
                className="btn btn-primary"
                onClick={() => startQuiz(modeCount ?? total, isSpeed ? speedSeconds : undefined)}
              >
                เล่นอีกครั้ง
              </button>
              <button
                className={`btn btn-secondary ${!hasSavedCurrent ? 'quiz-btn-save-score-animate' : ''}`}
                onClick={() => setShowSavePopup(true)}
                disabled={hasSavedCurrent}
              >
                {hasSavedCurrent ? 'บันทึกคะแนนแล้ว' : 'บันทึกคะแนน'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={goBackToHub}
              >
                กลับไปเลือกโหมด
              </button>
            </div>

            <div className="quiz-save-panel">
              <div className="quiz-save-panel-copy">
                <h3>บันทึกขึ้นกระดานคะแนน</h3>
                <p>ใช้ชื่อเล่นสั้น ๆ เพื่อแสดงอันดับรวมของคอร์สนี้</p>
              </div>
              <div className="quiz-save-panel-form">
                <input
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="ชื่อเล่นของคุณ"
                  maxLength={20}
                  disabled={remoteSaveState === 'saving' || remoteSaveState === 'saved'}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    void saveScoreToSupabase();
                  }}
                  disabled={remoteSaveState === 'saving' || remoteSaveState === 'saved'}
                >
                  {remoteSaveState === 'saving' ? 'กำลังบันทึก...' : remoteSaveState === 'saved' ? 'บันทึกแล้ว' : 'บันทึกขึ้นกระดาน'}
                </button>
                {leaderboardHref && (
                  <a className="btn btn-secondary" href={leaderboardHref}>
                    ดูกระดานคะแนน
                  </a>
                )}
              </div>
              {remoteSaveMessage && (
                <p className={`quiz-save-panel-message is-${remoteSaveState}`}>
                  {remoteSaveMessage}
                </p>
              )}
            </div>
          </section>
        </div>

        {showSavePopup ? (
          <div
            className="quiz-save-popup-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-save-popup-title"
            onClick={() => setShowSavePopup(false)}
          >
            <div
              className="quiz-save-popup"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="quiz-save-popup-close"
                aria-label="ปิด"
                onClick={() => setShowSavePopup(false)}
              >
                ×
              </button>
              <div className="quiz-save-popup-copy">
                <div className="course-subject-chip">บันทึกขึ้นกระดานคะแนน</div>
                <h3 id="quiz-save-popup-title">โชว์อันดับของคุณบนกระดาน</h3>
                <p>ใช้ชื่อเล่นสั้น ๆ เพื่อแสดงอันดับรวมของคอร์สนี้</p>
              </div>
              <div className="quiz-save-popup-form">
                <input
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="ชื่อเล่นของคุณ"
                  maxLength={20}
                  disabled={remoteSaveState === 'saving' || remoteSaveState === 'saved'}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    void saveScoreToSupabase();
                  }}
                  disabled={remoteSaveState === 'saving' || remoteSaveState === 'saved'}
                >
                  {remoteSaveState === 'saving' ? 'กำลังบันทึก...' : remoteSaveState === 'saved' ? 'บันทึกแล้ว' : 'บันทึกขึ้นกระดาน'}
                </button>
                {leaderboardHref && (
                  <a className="btn btn-secondary" href={leaderboardHref}>
                    ดูกระดานคะแนน
                  </a>
                )}
              </div>
              {remoteSaveMessage && (
                <p className={`quiz-save-panel-message is-${remoteSaveState}`}>
                  {remoteSaveMessage}
                </p>
              )}
            </div>
          </div>
        ) : null}


      </div>
    );
  }

  // Review screen — show only the wrong answers after a finished quiz
  if (done && showReview) {
    return (
      <div className="quiz-shell">
        <div className="container course-subject-body">
          <section className="pab-knowledge-section quiz-review-panel">
            <div className="course-subject-chip quiz-review-chip">รีวิวข้อที่ผิด</div>
            <h2 className="quiz-review-title">ข้อที่ตอบผิด {wrongAnswers.length} ข้อ</h2>
            <p className="quiz-review-subtitle">ทบทวนเฉลยและคำอธิบายเพื่อเสริมจุดที่พลาด</p>

            <div className="quiz-review-list">
              {wrongAnswers.map(({ item, picked, questionIndex }, index) => (
                <article key={`${questionIndex}-${index}`} className="quiz-review-item">
                  <header className="quiz-review-item-head">
                    <span className="quiz-review-item-num">ข้อ {questionIndex + 1}</span>
                    <span className="quiz-review-item-tag">{title}</span>
                  </header>
                  <h3
                    className="quiz-review-item-question"
                    dangerouslySetInnerHTML={{ __html: item.question }}
                  />
                  <ul className="quiz-review-choices">
                    {item.choices.map((choice, i) => {
                      const isAnswer = i === item.answer;
                      const isPicked = i === picked;
                      const classes = ['quiz-review-choice'];
                      if (isAnswer) classes.push('is-correct');
                      if (isPicked && !isAnswer) classes.push('is-wrong');
                      return (
                        <li key={i} className={classes.join(' ')}>
                          <span className="quiz-review-choice-label">
                            {String.fromCharCode(0x0e01 + i)}
                          </span>
                          <span
                            className="quiz-review-choice-text"
                            dangerouslySetInnerHTML={{ __html: choice }}
                          />
                          {isAnswer ? <span className="quiz-review-badge is-correct">เฉลย</span> : null}
                          {isPicked && !isAnswer ? <span className="quiz-review-badge is-wrong">คำตอบคุณ</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                  {item.explanation ? (
                    <div
                      className="pab-knowledge-rich quiz-review-explain"
                      dangerouslySetInnerHTML={{ __html: item.explanation }}
                    />
                  ) : null}
                </article>
              ))}
            </div>

            <div className="quiz-result-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowReview(false)}
              >
                ← กลับไปสรุปผล
              </button>
              <button
                className="btn btn-primary"
                onClick={() => startQuiz(modeCount ?? total, isSpeed ? speedSeconds : undefined)}
              >
                เล่นอีกครั้ง
              </button>
              <button
                className="btn btn-secondary"
                onClick={goBackToHub}
              >
                กลับไปเลือกโหมด
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const item = activeItems[idx];
  const showResult = picked !== null || didTimeout;
  const isDialogueQuestion = subjectId === 'english' && title?.includes('สนทนา');

  return (
    <div className="quiz-shell">
      <div className="container course-subject-body">
        <section className="pab-knowledge-section quiz-play-panel">
          <div className="quiz-play-top">
            <div>
              <div className="course-subject-chip quiz-play-chip">
                {isSurvival ? 'Survival Mode' : isSpeed ? `Speed Quiz · ${speedSeconds}s` : 'กำลังทำข้อสอบ'}
              </div>
              <p className="quiz-play-progress">
                ข้อ {idx + 1} / {activeItems.length} · ตอบถูก {correctCount} · {isSpeed ? `คะแนน ${score} · เหลือ ${timeLeft} วิ` : `เวลา ${formatDuration(elapsedSec)}`}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary quiz-reset-button"
              onClick={resetToIntro}
            >
              เปลี่ยนชุดข้อสอบ
            </button>
          </div>

          <div className="quiz-progress-track" aria-hidden="true">
            <span style={{ width: `${((idx + (showResult ? 1 : 0)) / activeItems.length) * 100}%` }} />
          </div>

          {(() => {
            const isMatrixQuestion = (q: string) => {
              if (!q || typeof q !== 'string') return false;
              const lines = q.split('\n').map(l => l.trim()).filter(Boolean);
              if (lines.length < 2) return false;
              return lines.every(line => /^[0-9?\s-]+$/.test(line));
            };

            if (isMatrixQuestion(item.question)) {
              const matrixRows = item.question
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean)
                .map(line => line.split(/\s+/));
              return (
                <div className="quiz-matrix-container" style={{ margin: '0 auto 28px', maxWidth: '280px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${matrixRows[0]?.length || 3}, minmax(0, 1fr))`,
                    gap: '10px',
                    background: 'var(--color-surface)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2px solid var(--color-text)',
                    boxShadow: '4px 4px 0 var(--color-text)',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {matrixRows.flatMap((row, rIdx) =>
                      row.map((cell, cIdx) => {
                        const isQuestionMark = cell === '?';
                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              aspectRatio: '1',
                              fontSize: '22px',
                              fontWeight: 800,
                              background: isQuestionMark ? 'var(--color-primary-bg, rgba(122, 24, 34, 0.1))' : 'var(--color-bg)',
                              border: isQuestionMark ? '2px dashed var(--color-primary)' : '1px solid var(--color-border)',
                              borderRadius: '10px',
                              color: isQuestionMark ? 'var(--color-primary)' : 'var(--color-text)',
                              fontFamily: 'var(--font-display)'
                            }}
                          >
                            {cell}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            }

            return isDialogueQuestion
              ? <DialogueQuestionBlock question={item.question} />
              : <h2 className="quiz-question-title">{item.question}</h2>;
          })()}

          <div className="quiz-choice-list">
            {item.choices.map((choice, i) => {
              const isCorrect = i === item.answer;
              const isPicked = i === picked;
              const stateClass = !showResult ? '' : isCorrect ? ' is-correct' : isPicked ? ' is-wrong' : ' is-muted';
              return (
                <button
                  key={i}
                  onClick={() => revealAnswer(i, false)}
                  disabled={showResult}
                  className={`quiz-choice${stateClass}`}
                >
                  <span className="quiz-choice-key">{String.fromCharCode(65 + i)}</span>
                  <span className="quiz-choice-text">{choice}</span>
                </button>
              );
            })}
          </div>

          {didTimeout && (
            <div className="pab-knowledge-callout quiz-explanation">
              <h3 className="pab-knowledge-callout-title">⏰ หมดเวลา</h3>
              <p className="pab-knowledge-rich">ข้อนี้ถูกนับเป็นผิดและระบบพาไปข้อต่อไปอัตโนมัติ</p>
            </div>
          )}

          {showResult && item.explanation && (
            <div className="pab-knowledge-callout quiz-explanation">
              <h3 className="pab-knowledge-callout-title">💡 คำอธิบาย</h3>
              <div
                className="pab-knowledge-rich"
                dangerouslySetInnerHTML={{ __html: item.explanation }}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
