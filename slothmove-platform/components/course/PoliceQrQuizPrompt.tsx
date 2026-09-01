'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { trackAnalyticsEvent } from '@/lib/analytics';

type SampleQuestion = {
  prompt: string;
  choices: string[];
  correctChoiceIndex: number;
  explanation: string;
  dailyKey: string;
};

export function PoliceQrQuizPrompt({ question }: { question: SampleQuestion | null }) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const hasTrackedView = useRef(false);
  const isQrEntry = searchParams?.get('entry') === 'qr' || searchParams?.get('utm_source') === 'qr';
  const nextPath = '/daily-practice/math?source=qr_sample';
  const registerHref = `/register?next=${encodeURIComponent(nextPath)}&source=qr_sample`;

  useEffect(() => {
    if (!isQrEntry || !question) return;

    const openTimer = window.setTimeout(() => {
      setIsOpen(true);
      if (!hasTrackedView.current) {
        hasTrackedView.current = true;
        trackAnalyticsEvent('qr_sample_question_shown', { subject_id: 'math', daily_key: question.dailyKey });
      }
    }, 350);

    const supabase = getSupabase();
    if (supabase) {
      void supabase.auth.getSession().then(({ data }) => setIsSignedIn(Boolean(data.session)));
    }

    return () => window.clearTimeout(openTimer);
  }, [isQrEntry, question]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [isOpen]);

  if (!question || !isOpen) return null;

  const answered = selectedChoice !== null;
  const isCorrect = selectedChoice === question.correctChoiceIndex;

  return (
    <div className="qr-quiz-overlay" role="presentation" onClick={() => setIsOpen(false)}>
      <section
        className="qr-quiz-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-quiz-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="qr-quiz-close"
          aria-label="ปิดโจทย์ตัวอย่าง"
          onClick={() => {
            trackAnalyticsEvent('qr_sample_question_closed', { answered, daily_key: question.dailyKey });
            setIsOpen(false);
          }}
        >
          ×
        </button>

        <span className="qr-quiz-eyebrow">ข้อสอบฟรีสำหรับนายสิบตำรวจ</span>
        <h2 id="qr-quiz-title">ลองทำโจทย์จริง 1 ข้อ</h2>
        <p className="qr-quiz-intro">เลือกคำตอบที่คิดว่าถูก แล้วดูเฉลยเต็มพร้อมชุดฝึกฟรีหลังสมัคร</p>

        <div className="qr-quiz-question">
          <span>ความรู้ทั่วไป</span>
          <p>{question.prompt}</p>
        </div>

        <div className="qr-quiz-choices" aria-label="ตัวเลือกคำตอบ">
          {question.choices.map((choice, index) => {
            const choiceState = answered
              ? index === question.correctChoiceIndex
                ? ' is-correct'
                : index === selectedChoice
                  ? ' is-incorrect'
                  : ''
              : '';
            return (
              <button
                type="button"
                key={`${index}-${choice}`}
                className={`qr-quiz-choice${choiceState}`}
                disabled={answered}
                onClick={() => {
                  setSelectedChoice(index);
                  trackAnalyticsEvent('qr_sample_question_answered', {
                    subject_id: 'math',
                    is_correct: index === question.correctChoiceIndex,
                    daily_key: question.dailyKey
                  });
                }}
              >
                <span aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                {choice}
              </button>
            );
          })}
        </div>

        {answered ? (
          <div className={`qr-quiz-result${isCorrect ? ' is-correct' : ' is-incorrect'}`} role="status">
            <strong>{isCorrect ? 'ตอบถูก' : 'ยังไม่ถูก'}</strong>
            <p>{isSignedIn ? question.explanation : 'สมัครฟรีเพื่อดูคำอธิบายเต็ม และทำข้อสอบฟรีต่ออีก 10 ข้อ'}</p>
          </div>
        ) : null}

        {answered ? (
          isSignedIn ? (
            <Link
              href={nextPath}
              className="qr-quiz-primary-action"
              onClick={() => trackAnalyticsEvent('qr_sample_continue_click', { destination: 'free_practice', daily_key: question.dailyKey })}
            >
              ทำข้อสอบฟรีต่อ <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              href={registerHref}
              className="qr-quiz-primary-action"
              onClick={() => trackAnalyticsEvent('qr_sample_signup_click', { destination: 'register', daily_key: question.dailyKey })}
            >
              สมัครฟรีเพื่อดูเฉลยเต็ม <span aria-hidden="true">→</span>
            </Link>
          )
        ) : null}

        {!answered ? <p className="qr-quiz-note">ไม่ต้องสมัครเพื่อทดลองทำข้อนี้</p> : null}
      </section>
    </div>
  );
}
