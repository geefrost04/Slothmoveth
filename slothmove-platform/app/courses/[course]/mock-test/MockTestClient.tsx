'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CourseConfig, QuizItem } from '@/lib/course-types';
import { getSupabase } from '@/lib/supabase';
import {
  math_quiz,
  thai_quiz,
  computer_quiz,
  saraban_quiz,
  law_quiz,
  english_quiz
} from '@/courses/police_admin/data';
import {
  analytical_thinking_quiz,
  civil_servant_rules_quiz,
  english_quiz as ocsc_english_quiz
} from '@/courses/ocsc/data';

// Helper to shuffle list using Fisher-Yates algorithm
function shuffleList<T>(array: T[]): T[] {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

// Clean and sanitize HTML tags in explanation strings
function sanitizeExplanation(s: string): string {
  if (!s || typeof s !== 'string') return s || '';
  return s
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*br\s*>/gi, '\n')
    .replace(/<\s*strong\s*>(.*?)<\s*\/\s*strong\s*>/gi, '**$1**')
    .replace(/<\s*\/\s*strong\s*>/gi, '')
    .replace(/<\s*b\s*>(.*?)<\s*\/\s*b\s*>/gi, '**$1**')
    .replace(/<\s*\/\s*b\s*>/gi, '')
    .replace(/<\s*em\s*>(.*?)<\s*\/\s*em\s*>/gi, '_$1_')
    .replace(/<\s*\/\s*em\s*>/gi, '')
    .replace(/<\s*i\s*>(.*?)<\s*\/\s*i\s*>/gi, '_$1_')
    .replace(/<\s*\/\s*i\s*>/gi, '');
}

type MockQuestion = QuizItem & {
  subjectTitle: string;
  subjectId: string;
};

type MockSection = {
  title: string;
  bullets: string[];
};

type MockExamConfig = {
  title: string;
  intro: string;
  emoji: string;
  totalQuestions: number;
  durationSec: number;
  sections: MockSection[];
  resultTitle: string;
  saveSubject: string;
  backHref: string;
  backLabel: string;
};

function buildQuestions(source: QuizItem[], count: number, subjectTitle: string, subjectId: string) {
  return shuffleList(source)
    .slice(0, count)
    .map((q) => ({ ...q, subjectTitle, subjectId }));
}

function generateMockExamPaper(courseId: string): MockQuestion[] {
  if (courseId === 'ocsc') {
    return [
      ...buildQuestions(analytical_thinking_quiz, 50, 'ความสามารถในการคิดวิเคราะห์', 'analytical_thinking'),
      ...buildQuestions(ocsc_english_quiz, 25, 'ภาษาอังกฤษ', 'english'),
      ...buildQuestions(civil_servant_rules_quiz, 25, 'ความรู้และลักษณะการเป็นข้าราชการที่ดี', 'civil_servant_rules')
    ];
  }

  const math = buildQuestions(math_quiz, 20, 'ความสามารถทั่วไป', 'math');
  const thai = buildQuestions(thai_quiz, 20, 'ภาษาไทย', 'thai');
  const computer = buildQuestions(computer_quiz, 40, 'คอมพิวเตอร์และ IT', 'computer');
  const saraban = buildQuestions(saraban_quiz, 30, 'ระเบียบงานสารบรรณ', 'saraban');
  const law = buildQuestions(law_quiz, 25, 'กฎหมายที่ประชาชนควรรู้', 'law');
  const english = buildQuestions(english_quiz, 15, 'ภาษาอังกฤษ', 'english');

  return [...math, ...thai, ...computer, ...saraban, ...law, ...english];
}

function getMockExamConfig(courseId: string): MockExamConfig {
  if (courseId === 'ocsc') {
    return {
      title: 'จำลองสอบเสมือนจริง ก.พ. ภาค ก.',
      intro: 'สุ่มข้อสอบ 100 ข้อ คะแนนเต็ม 200 คะแนน จับเวลา 180 นาที เพื่อฝึกทำข้อสอบเสมือนจริงตามสัดส่วนจริงของ ก.พ.',
      emoji: '📝',
      totalQuestions: 100,
      durationSec: 10800,
      sections: [
        {
          title: 'วิชาความรู้ความสามารถในการคิดวิเคราะห์ (100 คะแนน)',
          bullets: [
            'ด้านตัวเลข: คณิตศาสตร์ทั่วไปและอนุกรม (จำนวนข้อไม่แน่นอน)',
            'ด้านเหตุผล: อุปมาอุปไมย, เงื่อนไขสัญลักษณ์ และเงื่อนไขภาษา (จำนวนข้อไม่แน่นอน)',
            'ด้านภาษา: การเข้าใจภาษา, การสรุปความ และบทความสั้น/ยาว (จำนวนข้อไม่แน่นอน)'
          ]
        },
        {
          title: 'วิชาภาษาอังกฤษ (50 คะแนน)',
          bullets: [
            'จำนวน 25 ข้อ',
            'Conversation, Vocabulary, Grammar และ Reading'
          ]
        },
        {
          title: 'วิชาความรู้และลักษณะการเป็นข้าราชการที่ดี (50 คะแนน)',
          bullets: [
            'จำนวน 25 ข้อ',
            'พ.ร.บ.ระเบียบข้าราชการพลเรือน, ประมวลกฎหมายอาญา, วิธีปฏิบัติราชการทางปกครอง และหลักการบริหารกิจการบ้านเมืองที่ดี'
          ]
        }
      ],
      resultTitle: 'ผลการจำลองสอบเสมือนจริง',
      saveSubject: 'จำลองสอบเสมือนจริง (100 ข้อ)',
      backHref: '/courses/ocsc',
      backLabel: '← กลับสู่หน้าหลักคอร์ส'
    };
  }

  return {
    title: 'จำลองสอบสนามจริง ตำรวจสายอำนวยการ',
    intro: 'สุ่มข้อสอบ 150 ข้อ จากวิชาตามสัดส่วนการสอบจริงของสำนักงานตำรวจแห่งชาติ จับเวลา 180 นาที เพื่อฝึกฝนการทดสอบภายใต้ความกดดันแบบเสมือนจริงในสนามสอบ',
    emoji: '👮‍♀️',
    totalQuestions: 150,
    durationSec: 10800,
    sections: [
      {
        title: 'ภาค ก (40 คะแนน)',
        bullets: ['ความสามารถทั่วไป (20 ข้อ)', 'ภาษาไทย (20 ข้อ)']
      },
      {
        title: 'ภาค ข (110 คะแนน)',
        bullets: ['คอมพิวเตอร์ฯ (40 ข้อ)', 'ระเบียบสารบรรณ (30 ข้อ)', 'กฎหมายน่ารู้ (25 ข้อ)', 'ภาษาอังกฤษ (15 ข้อ)']
      }
    ],
    resultTitle: 'ผลการจำลองสอบสนามจริง',
    saveSubject: 'จำลองสอบสนามจริง (150 ข้อ)',
    backHref: '/courses/police_admin',
    backLabel: '← กลับสู่หน้าหลักคอร์ส'
  };
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function MockTestClient({ course }: { course: CourseConfig }) {
  const mockExam = getMockExamConfig(course.id);
  const [step, setStep] = useState<'start' | 'quiz' | 'result'>('start');
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mockExam.durationSec);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Score saving state
  const [nickname, setNickname] = useState('');
  const [remoteSaveState, setRemoteSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [remoteSaveMessage, setRemoteSaveMessage] = useState('');

  // 1. Initialize mock paper on mount (avoid hydration mismatches)
  useEffect(() => {
    const nextQuestions = generateMockExamPaper(course.id);
    setQuestions(nextQuestions);
    setUserAnswers(new Array(mockExam.totalQuestions).fill(null));
    setTimeLeft(mockExam.durationSec);
  }, [course.id]);

  // 2. Countdown Timer Effect
  useEffect(() => {
    if (step !== 'quiz' || showConfirmSubmit) return undefined;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, showConfirmSubmit]);

  // 3. Firing Buy-me-a-Coffee Popup Event on completion
  useEffect(() => {
    if (step === 'result') {
      window.dispatchEvent(new CustomEvent('slothmove:donate'));
    }
  }, [step]);

  const startExam = () => {
    const nextQuestions = generateMockExamPaper(course.id);
    setQuestions(nextQuestions);
    setUserAnswers(new Array(mockExam.totalQuestions).fill(null));
    setCurrentIdx(0);
    setTimeLeft(mockExam.durationSec);
    setStep('quiz');
    setShowReview(false);
    setRemoteSaveState('idle');
    setRemoteSaveMessage('');
  };

  const selectChoice = (choiceIdx: number) => {
    const nextAnswers = [...userAnswers];
    nextAnswers[currentIdx] = choiceIdx;
    setUserAnswers(nextAnswers);

    // Auto-advance with a tiny visual delay
    if (currentIdx < mockExam.totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
      }, 200);
    }
  };

  const handleForceSubmit = () => {
    setStep('result');
    setShowConfirmSubmit(false);
  };

  const confirmSubmit = () => {
    setStep('result');
    setShowConfirmSubmit(false);
  };

  // Grade Calculations
  const total = questions.length || mockExam.totalQuestions;
  const correctCount = questions.reduce((acc, q, index) => {
    return acc + (userAnswers[index] === q.answer ? 1 : 0);
  }, 0);
  const pct = Math.round((correctCount / total) * 100);
  const elapsedSec = mockExam.durationSec - timeLeft;

  const gradeText = (() => {
    if (pct >= 80) return 'ผ่านเกณฑ์ดีเยี่ยม — ความรู้แน่นปึ้ก สมบูรณ์แบบ พร้อมลงสอบจริงแล้ว!';
    if (pct >= 60) return 'ผ่านเกณฑ์ — ถือว่าพื้นฐานดีมาก ลองย้อนทบทวนข้อที่พลาดและทำซ้ำเพื่อความชัวร์';
    if (pct >= 50) return 'เกือบผ่านเกณฑ์ — พื้นฐานเริ่มมาแล้ว ทบทวนจุดอ่อนอีกนิดและฝึกเพิ่มยังพอมีเวลาครับ';
    return 'ยังไม่ผ่านเกณฑ์ — แนะนำให้กลับไปเก็บเนื้อหารายวิชาเพิ่มและฝึกทำบ่อย ๆ สู้ ๆ อย่าเพิ่งท้อนะครับ';
  })();

  const gradeEmoji = (() => {
    if (pct >= 80) return '🏆';
    if (pct >= 60) return '⭐️';
    if (pct >= 50) return '📈';
    return '💪';
  })();

  const saveScoreToSupabase = async () => {
    const cleanName = nickname.trim();
    if (!cleanName) {
      setRemoteSaveState('error');
      setRemoteSaveMessage('กรุณากรอกชื่อเล่นเพื่อบันทึกคะแนน');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setRemoteSaveState('error');
      setRemoteSaveMessage('ไม่พบการเชื่อมต่อฐานข้อมูล');
      return;
    }

    setRemoteSaveState('saving');
    setRemoteSaveMessage('');

    const payload = {
      nickname: cleanName,
      dept: course.id,
      subject: mockExam.saveSubject,
      score: correctCount,
      total: mockExam.totalQuestions,
      pct,
      mode: mockExam.totalQuestions,
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
      setRemoteSaveState('saved');
      setRemoteSaveMessage('บันทึกคะแนนขึ้นกระดานเรียบร้อยแล้ว! 🎉');
    } catch (err) {
      setRemoteSaveState('error');
      setRemoteSaveMessage(err instanceof Error ? `ข้อผิดพลาด: ${err.message}` : 'ไม่สามารถบันทึกได้');
    }
  };

  const answeredCount = userAnswers.filter((a) => a !== null).length;

  // ────────────────────────────────────────────────────────────────────────
  // 1. START SCREEN
  // ────────────────────────────────────────────────────────────────────────
  if (step === 'start') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 bg-[var(--color-bg,#faf8f4)] dark:bg-[#171726]">
        <div className="w-full max-w-xl bg-white dark:bg-[#1e1e32] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-xl shadow-[6px_6px_0_#1a1a2e] dark:shadow-none overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"></div>
          <div className="p-6 sm:p-10 text-center">
            <span className="text-5xl mb-4 block" role="img" aria-label="exam">{mockExam.emoji}</span>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">Virtual Examination Ground</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] dark:text-[#f7f2e8] mb-4">
              {mockExam.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {mockExam.intro}
            </p>

            <div className={`grid gap-3 mb-8 bg-gray-50 dark:bg-[#25253e] p-4 border border-gray-100 dark:border-[#34344a] rounded-xl text-left ${
              mockExam.sections.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2'
            }`}>
              {mockExam.sections.map((section) => (
                <div key={section.title}>
                  <strong className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{section.title}</strong>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>• {bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={startExam}
              className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold rounded-lg border-2 border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1a1a2e] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              เริ่มทำข้อสอบจำลอง
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // 2. QUIZ SCREEN
  // ────────────────────────────────────────────────────────────────────────
  if (step === 'quiz') {
    const q = questions[currentIdx];
    if (!q) return <p className="text-center py-12">กำลังเตรียมข้อสอบ...</p>;

    return (
      <div className="min-h-[70vh] py-8 px-4 bg-[var(--color-bg,#faf8f4)] dark:bg-[#171726]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Question Card */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#1e1e32] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-xl shadow-[4px_4px_0_#1a1a2e] dark:shadow-none overflow-hidden mb-6">
              <div className="h-1 bg-[var(--color-primary)]"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-lg font-black text-[var(--color-primary)]">
                    ข้อ {currentIdx + 1} / {mockExam.totalQuestions}
                  </span>
                  <span className="text-xs px-3 py-1 bg-[var(--color-accent-soft,#fbeef0)] text-[var(--color-primary)] rounded-full font-bold">
                    {q.subjectTitle}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg text-gray-800 dark:text-[#f7f2e8] font-bold leading-relaxed mb-6">
                  {q.question}
                </h2>

                <div className="space-y-3">
                  {q.choices.map((choice, index) => {
                    const isSelected = userAnswers[currentIdx] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => selectChoice(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 font-medium text-sm transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-bg,#fbeef0)] text-[var(--color-primary)] font-bold'
                            : 'border-[#e5e0d8] dark:border-[#34344a] bg-white dark:bg-[#25253e] hover:border-[var(--color-primary)] text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        <span className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                            : 'border-gray-400 text-gray-500'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="px-6 py-3 bg-white dark:bg-[#1e1e32] text-gray-700 dark:text-[#f7f2e8] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-lg font-bold shadow-[2px_2px_0_#1a1a2e] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← ข้อก่อนหน้า
              </button>
              <button
                disabled={currentIdx === 149}
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="px-6 py-3 bg-white dark:bg-[#1e1e32] text-gray-700 dark:text-[#f7f2e8] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-lg font-bold shadow-[2px_2px_0_#1a1a2e] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ข้อถัดไป →
              </button>
            </div>
          </div>

          {/* Right: Answer Sheet Grid & Timer */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1e1e32] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-xl p-5 shadow-[4px_4px_0_#1a1a2e] dark:shadow-none sticky top-24">
              <div className="text-center p-3 bg-gray-50 dark:bg-[#25253e] border border-gray-100 dark:border-[#34344a] rounded-lg mb-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">เวลาคงเหลือ</span>
                <div className="text-3xl font-black text-[#1a1a2e] dark:text-[#f7f2e8] my-1">
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full mt-3 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold rounded-md border-2 border-[#1a1a2e] text-xs transition-all shadow-[2px_2px_0_#1a1a2e]"
                >
                  🔔 ส่งกระดาษคำตอบ
                </button>
              </div>

              <div className="border-b border-gray-100 dark:border-[#34344a] pb-2 mb-3 flex items-center justify-between text-xs">
                <strong className="text-gray-700 dark:text-gray-300">กระดาษคำตอบ</strong>
                <span className="text-gray-400 font-bold">ทำแล้ว {answeredCount} / {mockExam.totalQuestions}</span>
              </div>

              {/* Grid Sheet */}
              <div className="max-h-[320px] overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-1.5">
                  {userAnswers.map((ans, idx) => {
                    const isAnswered = ans !== null;
                    const isCurrent = idx === currentIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-8 h-8 rounded text-[11px] font-black border transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                            : isAnswered
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary-bg,#fbeef0)] text-[var(--color-primary)]'
                              : 'border-gray-200 dark:border-[#34344a] bg-white dark:bg-[#25253e] text-gray-400 dark:text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-[#1e1e32] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-xl shadow-[8px_8px_0_#1a1a2e] dark:shadow-none p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-[#f7f2e8] mb-3">ต้องการส่งกระดาษคำตอบ?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {answeredCount < mockExam.totalQuestions
                  ? `คุณยังไม่ได้ทำข้อสอบอีก ${mockExam.totalQuestions - answeredCount} ข้อ`
                  : `คุณทำข้อสอบเสร็จครบ ${mockExam.totalQuestions} ข้อแล้ว`} ยืนยันการส่งเพื่อประเมินผลและตรวจคำตอบเลยหรือไม่?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-5 py-3 bg-white dark:bg-[#1e1e32] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-lg font-bold text-sm text-gray-700 dark:text-[#f7f2e8]"
                >
                  กลับไปทำต่อ
                </button>
                <button
                  onClick={confirmSubmit}
                  className="px-5 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border-2 border-[#1a1a2e] rounded-lg font-bold text-sm shadow-[2px_2px_0_#1a1a2e]"
                >
                  ส่งข้อสอบเลย
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // 3. RESULT SCREEN
  // ────────────────────────────────────────────────────────────────────────
  if (step === 'result' && !showReview) {
    return (
      <div className="min-h-[70vh] py-12 px-4 bg-[var(--color-bg,#faf8f4)] dark:bg-[#171726] flex items-center justify-center">
        <div className="w-full max-w-xl bg-white dark:bg-[#1e1e32] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-xl shadow-[6px_6px_0_#1a1a2e] dark:shadow-none overflow-hidden relative">
          {/* Top highlight bar based on grade */}
          <div className={`h-3 bg-gradient-to-r ${
            pct >= 60
              ? 'from-emerald-400 to-teal-500'
              : pct >= 50
                ? 'from-amber-400 to-orange-500'
                : 'from-rose-500 to-red-600'
          }`}></div>

          <div className="p-6 sm:p-10 text-center">
            {/* Mascot / Emoji Grade representation */}
            <div className="relative w-24 h-24 mx-auto mb-6 bg-gray-50 dark:bg-[#25253e] rounded-full border-2 border-[#1a1a2e] dark:border-[#34344a] flex items-center justify-center text-5xl">
              {gradeEmoji}
              <div className={`absolute -bottom-1 -right-1 px-2.5 py-1 rounded-md border-2 border-[#1a1a2e] text-xs font-black text-[#1a1a2e] ${
                pct >= 60
                  ? 'bg-emerald-100'
                  : pct >= 50
                    ? 'bg-amber-100'
                    : 'bg-rose-100'
              }`}>
                {pct}%
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 dark:text-[#f7f2e8] mb-2">{mockExam.resultTitle}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">
              {gradeText}
            </p>

            {/* Score Grid Info */}
            <div className="grid grid-cols-3 gap-3 mb-8 bg-gray-50 dark:bg-[#25253e] p-4 border border-gray-100 dark:border-[#34344a] rounded-xl">
              <div className="p-2 bg-white dark:bg-[#1e1e32] border border-gray-100 dark:border-[#34344a] rounded-lg shadow-sm">
                <span className="text-[10px] text-gray-400 block mb-0.5">คะแนนสุทธิ</span>
                <strong className="text-lg font-black text-gray-800 dark:text-[#f7f2e8]">
                  {correctCount} <small className="text-xs font-medium">/ {mockExam.totalQuestions}</small>
                </strong>
              </div>
              <div className="p-2 bg-white dark:bg-[#1e1e32] border border-gray-100 dark:border-[#34344a] rounded-lg shadow-sm">
                <span className="text-[10px] text-gray-400 block mb-0.5">เวลาที่ใช้</span>
                <strong className="text-lg font-black text-gray-800 dark:text-[#f7f2e8]">
                  {formatDuration(elapsedSec)}
                </strong>
              </div>
              <div className="p-2 bg-white dark:bg-[#1e1e32] border border-gray-100 dark:border-[#34344a] rounded-lg shadow-sm">
                <span className="text-[10px] text-gray-400 block mb-0.5">สถานะ</span>
                <strong className={`text-sm font-black block mt-1 ${
                  pct >= 60
                    ? 'text-emerald-500'
                    : pct >= 50
                      ? 'text-amber-500'
                      : 'text-rose-500'
                }`}>
                  {pct >= 60 ? 'ผ่านเกณฑ์' : 'ไม่ผ่านเกณฑ์'}
                </strong>
              </div>
            </div>

            {/* Remote Leaderboard Form */}
            {remoteSaveState !== 'saved' && (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-[#25253e] border border-gray-100 dark:border-[#34344a] rounded-xl text-left">
                <label htmlFor="mock-nickname" className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">
                  📝 บันทึกคะแนนของคุณขึ้นกระดานคะแนน (Leaderboard)
                </label>
                <div className="flex gap-2">
                  <input
                    id="mock-nickname"
                    type="text"
                    placeholder="กรอกชื่อเล่นหรือนามสมมุติ..."
                    maxLength={16}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={remoteSaveState === 'saving'}
                    className="flex-1 px-3 py-2 text-sm border-2 border-[#1a1a2e] dark:border-[#34344a] dark:bg-[#1e1e32] dark:text-[#f7f2e8] rounded-md focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <button
                    onClick={saveScoreToSupabase}
                    disabled={remoteSaveState === 'saving'}
                    className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border-2 border-[#1a1a2e] rounded-md text-xs font-bold shadow-[2px_2px_0_#1a1a2e] disabled:opacity-40"
                  >
                    {remoteSaveState === 'saving' ? 'กำลังบันทึก...' : 'ส่งคะแนน'}
                  </button>
                </div>
                {remoteSaveMessage && (
                  <p className={`text-xs mt-2 font-bold ${
                    remoteSaveState === 'error' ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {remoteSaveMessage}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowReview(true)}
                className="w-full py-3.5 bg-white dark:bg-[#1e1e32] text-gray-800 dark:text-[#f7f2e8] font-bold border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-lg shadow-[3px_3px_0_#1a1a2e] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1a1a2e] transition-all flex items-center justify-center gap-2"
              >
                🔎 รีวิวข้อสอบและตรวจเฉลยละเอียด
              </button>
              <button
                onClick={startExam}
                className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold border-2 border-[#1a1a2e] rounded-lg shadow-[3px_3px_0_#1a1a2e] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1a1a2e] transition-all"
              >
                🔄 เริ่มทำใหม่อีกครั้ง
              </button>
              <Link
                href={mockExam.backHref}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#25253e] dark:hover:bg-[#2e2e4f] text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-all flex items-center justify-center"
              >
                {mockExam.backLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // 4. REVIEW MODE (all questions showing explanation)
  // ────────────────────────────────────────────────────────────────────────
  if (step === 'result' && showReview) {
    return (
      <div className="min-h-[70vh] py-8 px-4 bg-[var(--color-bg,#faf8f4)] dark:bg-[#171726]">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#1a1a2e] dark:border-[#34344a] pb-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-[#f7f2e8]">ตรวจเฉลยละเอียด</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{mockExam.title} · {correctCount} / {mockExam.totalQuestions} คะแนน</p>
            </div>
            <button
              onClick={() => setShowReview(false)}
              className="px-4 py-2 bg-white dark:bg-[#1e1e32] text-gray-700 dark:text-[#f7f2e8] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-lg text-xs font-bold shadow-[2px_2px_0_#1a1a2e]"
            >
              ← กลับไปสรุปคะแนน
            </button>
          </div>

          {/* List of questions */}
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedIdx = userAnswers[idx];
              const isCorrect = selectedIdx === q.answer;
              const hasAnswered = selectedIdx !== null;

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#1e1e32] border-2 border-[#1a1a2e] dark:border-[#34344a] rounded-xl shadow-[3px_3px_0_#1a1a2e] dark:shadow-none overflow-hidden"
                >
                  <div className={`h-1.5 ${
                    !hasAnswered
                      ? 'bg-gray-300'
                      : isCorrect
                        ? 'bg-emerald-400'
                        : 'bg-rose-400'
                  }`}></div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="text-sm font-black text-gray-700 dark:text-[#f7f2e8]">ข้อ {idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-[#25253e] text-gray-600 dark:text-gray-300 rounded font-bold">
                          {q.subjectTitle}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                          !hasAnswered
                            ? 'bg-gray-100 text-gray-500'
                            : isCorrect
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                        }`}>
                          {!hasAnswered ? 'ไม่ได้ทำ' : isCorrect ? 'ถูกต้อง' : 'ตอบผิด'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-bold mb-4">
                      {q.question}
                    </h3>

                    {/* Choices */}
                    <div className="space-y-2 mb-4">
                      {q.choices.map((choice, choiceIdx) => {
                        const isCorrectChoice = choiceIdx === q.answer;
                        const isSelectedChoice = choiceIdx === selectedIdx;

                        return (
                          <div
                            key={choiceIdx}
                            className={`p-3 rounded-lg border text-xs flex items-center gap-3 font-medium ${
                              isCorrectChoice
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-bold'
                                : isSelectedChoice
                                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300'
                                  : 'border-gray-100 dark:border-[#25253e] bg-gray-50 dark:bg-[#25253e] text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${
                              isCorrectChoice
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : isSelectedChoice
                                  ? 'border-rose-500 bg-rose-500 text-white'
                                  : 'border-gray-300 text-gray-400'
                            }`}>
                              {String.fromCharCode(65 + choiceIdx)}
                            </span>
                            <span>{choice}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 bg-gray-50 dark:bg-[#25253e] border-l-4 border-[var(--color-primary)] text-xs text-gray-600 dark:text-gray-300 rounded">
                        <strong className="block mb-1 text-[var(--color-primary)] font-bold">คำอธิบาย:</strong>
                        <p className="whitespace-pre-line leading-relaxed">
                          {sanitizeExplanation(q.explanation)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setShowReview(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border-2 border-[#1a1a2e] rounded-lg font-bold shadow-[3px_3px_0_#1a1a2e]"
            >
              ← กลับไปสรุปคะแนน
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// 4. Timer Format Helper
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
