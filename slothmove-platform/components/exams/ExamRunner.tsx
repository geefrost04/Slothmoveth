'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { queuePendingAttempt, type PendingAttempt } from '@/lib/pending-attempts';
import { getSupabase } from '@/lib/supabase';
import { trackAnalyticsEvent } from '@/lib/analytics';
import type { ExamBundle, ExamQuestionData, ExamSetData } from '@/lib/exam-data';
import styles from './ExamRunner.module.css';

type ExamSet = ExamSetData;
type ExamQuestion = ExamQuestionData;

type StoredSession = {
  answers: Record<string, number>;
  flaggedIds: string[];
  startedAt: number;
  questionIds?: string[];
};

type ExamResult = {
  score: number;
  total: number;
  answered: number;
  reason: 'submitted' | 'timeout';
  durationSeconds: number;
  categoryResults: CategoryResult[];
};

type CategoryResult = {
  category: string;
  total: number;
  answered: number;
  correct: number;
};

type ReviewFilter = 'wrong' | 'correct' | 'all';

const CHOICE_KEYS = ['A', 'B', 'C', 'D', 'E'];
const SECONDS_PER_QUESTION = 90;
const SUBJECT_LABELS: Record<string, string> = {
  math: 'ความรู้ทั่วไป',
  thai: 'ภาษาไทย',
  english: 'ภาษาอังกฤษ',
  computer: 'คอมพิวเตอร์',
  law: 'กฎหมาย',
  saraban: 'งานสารบรรณ',
  mock_test: 'Mock Test'
};
const RICH_TEXT_PATTERN = /(https?:\/\/[^\s]+|\^\{[^}]+\}|\^[+-]?\d+|[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿ]+)/g;
const SUPERSCRIPT_CHARACTERS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '−', '⁼': '=', '⁽': '(', '⁾': ')', 'ⁿ': 'n'
};

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
}

function splitExplanation(explanation: string) {
  return explanation
    .replace(/\s+(?=(?:ดังนั้น|อีกวิธีหนึ่ง|สามารถตรวจสอบ|จุดสำคัญ))/g, '\n')
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function MathText({ text }: { text: string }) {
  const parts = text.split(RICH_TEXT_PATTERN).filter(Boolean);
  return (
    <span className={styles.mathText}>
      {parts.map((part, index) => {
        if (part.startsWith('http://') || part.startsWith('https://')) {
          return (
            <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer">
              ดูวิดีโอประกอบ
            </a>
          );
        }

        const isCaretExponent = part.startsWith('^');
        const isUnicodeExponent = [...part].every((character) => character in SUPERSCRIPT_CHARACTERS);
        if (!isCaretExponent && !isUnicodeExponent) return part;

        const exponent = isCaretExponent
          ? part.slice(1).replace(/^\{(.+)\}$/, '$1')
          : [...part].map((character) => SUPERSCRIPT_CHARACTERS[character]).join('');
        return <sup key={`${part}-${index}`}>{exponent}</sup>;
      })}
    </span>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.6 1.8M9 2h6M12 2v3" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 21V4m0 0c4-3 8 3 12 0v10c-4 3-8-3-12 0" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5H5v14h4M13 8l4 4-4 4m4-4H8" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5M10 12h5M10 16h5" />
    </svg>
  );
}

export function ExamRunner({ examSetId, initialData }: { examSetId: string; initialData?: ExamBundle }) {
  const subjectId = examSetId.match(/^police-([a-z_]+)-set-/)?.[1] ?? 'math';
  const subjectTitle = SUBJECT_LABELS[subjectId] ?? 'รายวิชา';
  const subjectHref = subjectId === 'mock_test' ? '/courses/police_admin' : `/courses/police_admin/${subjectId}`;
  const [examSet, setExamSet] = useState<ExamSet | null>(initialData?.examSet ?? null);
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialData?.questions ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [startedAt, setStartedAt] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionReady, setSessionReady] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('wrong');
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showAllCategoryResults, setShowAllCategoryResults] = useState(false);
  const [progressSaveState, setProgressSaveState] = useState<'idle' | 'account' | 'guest' | 'error'>('idle');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const hasTrackedPracticeStart = useRef(false);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState('');

  const storageKey = `slothmove:exam-session:${examSetId}`;
  const durationSeconds = subjectId === 'mock_test'
    ? (examSet?.duration_minutes ?? 180) * 60
    : questions.length > 0
    ? questions.length * SECONDS_PER_QUESTION
    : (examSet?.duration_minutes ?? 30) * 60;

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;

    async function loadExam() {
      const supabase = getSupabase();
      if (!supabase) {
        setError('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase');
        setLoading(false);
        return;
      }

      const { data: examData, error: examError } = await supabase
        .from('exam_sets')
        .select('id,title,description,duration_minutes,total_questions')
        .eq('id', examSetId)
        .eq('is_published', true)
        .single();

      if (examError || !examData) {
        if (!cancelled) {
          setError('ไม่พบชุดข้อสอบนี้ หรือชุดข้อสอบยังไม่เปิดใช้งาน');
          setLoading(false);
        }
        return;
      }

      const { data: mappings, error: mappingError } = await supabase
        .from('exam_set_questions')
        .select('question_id,position')
        .eq('exam_set_id', examSetId)
        .order('position');

      if (mappingError || !mappings?.length) {
        if (!cancelled) {
          setError('ชุดข้อสอบนี้ยังไม่มีคำถาม');
          setLoading(false);
        }
        return;
      }

      const questionIds = mappings.map((mapping) => mapping.question_id);
      const [questionResponse, solutionResponse] = await Promise.all([
        supabase
          .from('questions')
          .select('id,category,prompt,choices,media')
          .in('id', questionIds),
        supabase
          .from('question_solutions')
          .select('question_id,correct_choice_index,explanation,tip')
          .in('question_id', questionIds)
      ]);

      if (questionResponse.error || solutionResponse.error) {
        if (!cancelled) {
          setError('โหลดคำถามไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          setLoading(false);
        }
        return;
      }

      const questionById = new Map((questionResponse.data ?? []).map((item) => [item.id, item]));
      const solutionById = new Map((solutionResponse.data ?? []).map((item) => [item.question_id, item]));
      const loadedQuestions = mappings.flatMap((mapping) => {
        const question = questionById.get(mapping.question_id);
        const solution = solutionById.get(mapping.question_id);
        if (!question || !solution || !Array.isArray(question.choices)) return [];

        return [{
          id: question.id,
          position: mapping.position,
          category: question.category,
          prompt: question.prompt,
          choices: question.choices.map(String),
          media: question.media && typeof question.media === 'object' ? question.media : null,
          correctChoiceIndex: solution.correct_choice_index,
          explanation: solution.explanation,
          tip: solution.tip
        } satisfies ExamQuestion];
      });

      if (!cancelled) {
        setExamSet(examData as ExamSet);
        setQuestions(loadedQuestions);
        setLoading(false);
      }
    }

    loadExam();
    return () => {
      cancelled = true;
    };
  }, [examSetId, initialData]);

  useEffect(() => {
    if (!examSet || questions.length === 0 || sessionReady) return;

    let stored: StoredSession | null = null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      stored = raw ? JSON.parse(raw) as StoredSession : null;
    } catch {
      stored = null;
    }

    const validQuestionIds = new Set(questions.map((question) => question.id));
    const currentQuestionSignature = questions.map((question) => question.id).join('|');
    const storedQuestionSignature = (stored?.questionIds ?? []).join('|');
    if (stored && (!stored.questionIds || storedQuestionSignature !== currentQuestionSignature)) {
      stored = null;
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Session reset is best-effort when storage is unavailable.
      }
    }
    const restoredAnswers = Object.fromEntries(
      Object.entries(stored?.answers ?? {}).filter(([questionId]) => validQuestionIds.has(questionId))
    );
    const restoredFlags = (stored?.flaggedIds ?? []).filter((questionId) => validQuestionIds.has(questionId));
    const sessionStartedAt = stored?.startedAt && Number.isFinite(stored.startedAt)
      ? stored.startedAt
      : Date.now();

    setAnswers(restoredAnswers);
    setFlaggedIds(new Set(restoredFlags));
    setStartedAt(sessionStartedAt);
    setSecondsLeft(Math.max(0, durationSeconds - Math.floor((Date.now() - sessionStartedAt) / 1000)));
    setSessionReady(true);
    if (!stored?.startedAt && !hasTrackedPracticeStart.current) {
      hasTrackedPracticeStart.current = true;
      trackAnalyticsEvent('practice_started', { practice_type: 'exam_set', subject_id: subjectId, question_count: questions.length, exam_set_id: examSetId });
    }
  }, [durationSeconds, examSet, questions, sessionReady, storageKey]);

  useEffect(() => {
    if (!sessionReady || result) return;

    const session: StoredSession = {
      answers,
      flaggedIds: Array.from(flaggedIds),
      startedAt,
      questionIds: questions.map((question) => question.id)
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    } catch {
      // The exam remains usable when browser storage is unavailable.
    }
  }, [answers, flaggedIds, result, sessionReady, startedAt, storageKey]);

  useEffect(() => {
    if (!sessionReady || result || !startedAt) return;

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(0, durationSeconds - elapsed));
    };

    updateTimer();
    const timerId = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timerId);
  }, [durationSeconds, result, sessionReady, startedAt]);

  useEffect(() => {
    if (!sessionReady || result || secondsLeft > 0 || questions.length === 0) return;
    finishExam('timeout');
    // finishExam intentionally reads the latest answer state when time reaches zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length, result, secondsLeft, sessionReady]);

  useEffect(() => {
    if (!showLoginPrompt && !showSubmitConfirm) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setShowLoginPrompt(false);
      setShowSubmitConfirm(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showLoginPrompt, showSubmitConfirm]);

  function finishExam(reason: ExamResult['reason']) {
    const score = questions.reduce(
      (total, question) => total + (answers[question.id] === question.correctChoiceIndex ? 1 : 0),
      0
    );
    const categoryMap = new Map<string, CategoryResult>();
    for (const question of questions) {
      const categoryResult = categoryMap.get(question.category) ?? {
        category: question.category,
        total: 0,
        answered: 0,
        correct: 0
      };
      categoryResult.total += 1;
      if (answers[question.id] !== undefined) categoryResult.answered += 1;
      if (answers[question.id] === question.correctChoiceIndex) categoryResult.correct += 1;
      categoryMap.set(question.category, categoryResult);
    }

    const completedResult: ExamResult = {
      score,
      total: questions.length,
      answered: Object.keys(answers).length,
      reason,
      durationSeconds: Math.min(durationSeconds, Math.max(0, Math.floor((Date.now() - startedAt) / 1000))),
      categoryResults: Array.from(categoryMap.values())
    };

    setResult(completedResult);
    trackAnalyticsEvent('practice_completed', {
      practice_type: 'exam_set', subject_id: subjectId, question_count: completedResult.total,
      score: completedResult.score, completion_reason: reason, exam_set_id: examSetId
    });
    void saveProgress(completedResult);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // No-op when browser storage is unavailable.
    }
  }

  async function saveProgress(completedResult: ExamResult) {
    const completedAt = new Date().toISOString();
    const localEntry = {
      ...completedResult,
      examSetId,
      completedAt
    };

    try {
      const historyKey = `slothmove:exam-history:${examSetId}`;
      const raw = window.localStorage.getItem(historyKey);
      const history = raw ? JSON.parse(raw) : [];
      const nextHistory = [localEntry, ...(Array.isArray(history) ? history : [])].slice(0, 10);
      window.localStorage.setItem(historyKey, JSON.stringify(nextHistory));
    } catch {
      // Remote account progress can still be saved when local storage fails.
    }

    const answerDetails = questions.map((question) => ({
      question_id: question.id,
      category: question.category,
      selected_choice_index: answers[question.id] ?? null,
      correct_choice_index: question.correctChoiceIndex,
      is_correct: answers[question.id] === question.correctChoiceIndex
    }));

    const pendingAttempt: PendingAttempt = {
      id: `${examSetId}:${completedAt}`,
      subject_id: subjectId,
      quiz_id: examSetId,
      exam_set_id: examSetId,
      score: completedResult.score,
      total_questions: completedResult.total,
      answers: answerDetails,
      category_results: completedResult.categoryResults,
      duration_seconds: completedResult.durationSeconds,
      completion_reason: completedResult.reason,
      created_at: completedAt
    };

    const supabase = getSupabase();
    if (!supabase) {
      queuePendingAttempt(pendingAttempt);
      setProgressSaveState('guest');
      setShowLoginPrompt(true);
      return;
    }

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      queuePendingAttempt(pendingAttempt);
      setProgressSaveState('guest');
      setShowLoginPrompt(true);
      return;
    }

    const { id: _pendingId, ...attemptRow } = pendingAttempt;
    const { error: saveError } = await supabase.from('attempts').insert({
      user_id: authData.user.id,
      ...attemptRow
    });

    if (saveError) queuePendingAttempt(pendingAttempt);
    setProgressSaveState(saveError ? 'error' : 'account');
  }

  function submitExam() {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      setShowSubmitConfirm(true);
      return;
    }
    finishExam('submitted');
  }

  function confirmSubmitExam() {
    setShowSubmitConfirm(false);
    finishExam('submitted');
  }

  function restartExam() {
    const now = Date.now();
    setAnswers({});
    setFlaggedIds(new Set());
    setCurrentIndex(0);
    setStartedAt(now);
    setSecondsLeft(durationSeconds);
    setResult(null);
    setShowReview(false);
    setReviewFilter('wrong');
    setExpandedReviewIds(new Set());
    setShowSubmitConfirm(false);
    setShowAllCategoryResults(false);
    setProgressSaveState('idle');
    setShowLoginPrompt(false);
    hasTrackedPracticeStart.current = true;
    trackAnalyticsEvent('practice_started', { practice_type: 'exam_set', subject_id: subjectId, question_count: questions.length, exam_set_id: examSetId, restarted: true });
  }

  function openReview() {
    const firstWrongQuestion = questions.find(
      (question) => answers[question.id] !== question.correctChoiceIndex
    );
    const firstQuestion = firstWrongQuestion ?? questions[0];

    setReviewFilter(firstWrongQuestion ? 'wrong' : 'all');
    setExpandedReviewIds(new Set(firstQuestion ? [firstQuestion.id] : []));
    setShowReview(true);
  }

  function toggleReviewQuestion(questionId: string) {
    setExpandedReviewIds((current) => {
      const next = new Set(current);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }

  function toggleFlag(questionId: string) {
    setFlaggedIds((current) => {
      const next = new Set(current);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }

  if (loading) {
    return (
      <main className={styles.statePage}>
        <div className={styles.loader} aria-hidden="true" />
        <h1>กำลังเตรียมชุดข้อสอบ</h1>
        <p>กำลังโหลดคำถามจากคลังข้อสอบ...</p>
      </main>
    );
  }

  if (error || !examSet || questions.length === 0) {
    return (
      <main className={styles.statePage}>
        <span className={styles.stateIcon}>!</span>
        <h1>เปิดชุดข้อสอบไม่ได้</h1>
        <p>{error || 'ไม่พบข้อมูลคำถาม'}</p>
        <Link href={subjectHref} className={styles.primaryButton}>กลับหน้าวิชา{subjectTitle}</Link>
      </main>
    );
  }

  if (result) {
    const percent = Math.round((result.score / result.total) * 100);

    if (showReview) {
      const reviewItems = questions
        .map((question, questionIndex) => ({ question, questionIndex }))
        .filter(({ question }) => {
          const isCorrect = answers[question.id] === question.correctChoiceIndex;
          if (reviewFilter === 'wrong') return !isCorrect;
          if (reviewFilter === 'correct') return isCorrect;
          return true;
        });
      const allVisibleExpanded = reviewItems.length > 0
        && reviewItems.every(({ question }) => expandedReviewIds.has(question.id));

      return (
        <div className={styles.examPage}>
          <ExamHeader completedSeconds={result.durationSeconds} exitHref={subjectHref} />
          <main className={styles.reviewPage}>
            <div className={styles.reviewHeader}>
              <div>
                <span className={styles.resultEyebrow}>เฉลยพร้อมคำอธิบาย</span>
                <h1>{examSet.title}</h1>
                <p>ตอบถูก {result.score} จาก {result.total} ข้อ · {percent}%</p>
              </div>
              <button type="button" className={styles.secondaryButton} onClick={() => setShowReview(false)}>
                ← กลับหน้าผลคะแนน
              </button>
            </div>

            <div className={styles.reviewToolbar}>
              <div className={styles.reviewFilters} aria-label="กรองเฉลย">
                <button
                  type="button"
                  className={reviewFilter === 'wrong' ? styles.activeReviewFilter : ''}
                  onClick={() => setReviewFilter('wrong')}
                >
                  ข้อผิด/ไม่ได้ตอบ <strong>{result.total - result.score}</strong>
                </button>
                <button
                  type="button"
                  className={reviewFilter === 'correct' ? styles.activeReviewFilter : ''}
                  onClick={() => setReviewFilter('correct')}
                >
                  ตอบถูก <strong>{result.score}</strong>
                </button>
                <button
                  type="button"
                  className={reviewFilter === 'all' ? styles.activeReviewFilter : ''}
                  onClick={() => setReviewFilter('all')}
                >
                  ทั้งหมด <strong>{result.total}</strong>
                </button>
              </div>
              <button
                type="button"
                className={styles.expandAllButton}
                onClick={() => setExpandedReviewIds(
                  allVisibleExpanded ? new Set() : new Set(reviewItems.map(({ question }) => question.id))
                )}
              >
                {allVisibleExpanded ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด'}
              </button>
            </div>

            <div className={styles.reviewList}>
              {reviewItems.map(({ question, questionIndex }) => {
                const selectedChoice = answers[question.id];
                const isCorrect = selectedChoice === question.correctChoiceIndex;
                const isExpanded = expandedReviewIds.has(question.id);
                return (
                  <article className={styles.reviewCard} key={question.id}>
                    <button
                      type="button"
                      className={styles.reviewCardSummary}
                      aria-expanded={isExpanded}
                      onClick={() => toggleReviewQuestion(question.id)}
                    >
                      <span className={styles.reviewCardHead}>
                        <strong>ข้อ {questionIndex + 1}</strong>
                        <span>{question.category}</span>
                        <em className={isCorrect ? styles.correctStatus : styles.wrongStatus}>
                          {selectedChoice === undefined ? 'ไม่ได้ตอบ' : isCorrect ? 'ถูก' : 'ผิด'}
                        </em>
                      </span>
                      <span className={styles.reviewQuestionPreview}><MathText text={question.prompt} /></span>
                      <span className={styles.reviewAnswerPreview}>
                        <small>คำตอบที่ถูก</small>
                        <strong>
                          {CHOICE_KEYS[question.correctChoiceIndex]}. <MathText text={question.choices[question.correctChoiceIndex]} />
                        </strong>
                      </span>
                      <span className={`${styles.reviewChevron} ${isExpanded ? styles.reviewChevronOpen : ''}`} aria-hidden="true">⌄</span>
                    </button>

                    {isExpanded ? (
                      <div className={styles.reviewCardBody}>
                        {question.media?.src ? (
                          <figure className={styles.reviewMedia}>
                            <img src={question.media.src} alt={question.media.alt || `ภาพประกอบข้อ ${questionIndex + 1}`} />
                          </figure>
                        ) : null}
                        <div className={styles.reviewChoices}>
                          {question.choices.map((choice, choiceIndex) => {
                            const isAnswer = choiceIndex === question.correctChoiceIndex;
                            const isSelected = choiceIndex === selectedChoice;
                            const choiceImage = question.media?.choiceImages?.[choiceIndex];
                            return (
                              <div
                                key={`${question.id}-review-${choiceIndex}`}
                                className={`${styles.reviewChoice} ${isAnswer ? styles.correctReviewChoice : ''} ${isSelected && !isAnswer ? styles.wrongReviewChoice : ''}`}
                              >
                                <strong>{CHOICE_KEYS[choiceIndex]}</strong>
                                <span className={styles.reviewChoiceContent}>
                                  {choiceImage ? <img src={choiceImage.src} alt={choiceImage.alt} /> : null}
                                  <span><MathText text={choice} /></span>
                                </span>
                                {isAnswer ? <em>คำตอบที่ถูก</em> : isSelected ? <em>คำตอบของคุณ</em> : null}
                              </div>
                            );
                          })}
                        </div>
                        <div className={styles.explanationBox}>
                          <strong>วิธีคิดทีละขั้น</strong>
                          <div className={styles.explanationText}>
                            {splitExplanation(question.explanation).map((paragraph, paragraphIndex) => (
                              <p key={`${question.id}-explanation-${paragraphIndex}`}><MathText text={paragraph} /></p>
                            ))}
                          </div>
                          {question.tip ? (
                            <div className={styles.tipCallout}>
                              <span>เทคนิคจำ</span>
                              <p><MathText text={question.tip} /></p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
            <button
              type="button"
              className={styles.reviewBackToTop}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="กลับด้านบน"
            >
              <span aria-hidden="true">↑</span>
              ด้านบน
            </button>
          </main>
        </div>
      );
    }

    return (
      <div className={styles.examPage}>
        <ExamHeader completedSeconds={result.durationSeconds} exitHref={subjectHref} />
        <main className={styles.resultPage}>
          <section className={styles.resultCard}>
            <span className={styles.resultEyebrow}>{result.reason === 'timeout' ? 'หมดเวลา' : 'ส่งข้อสอบแล้ว'}</span>
            <div className={styles.scoreRing} style={{ '--score': `${percent * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{percent}%</strong><span>{result.score} / {result.total}</span></div>
            </div>
            <h1>{percent >= 60 ? 'ผ่านเกณฑ์ชุดทดลอง' : 'ทบทวนอีกนิดแล้วลองใหม่'}</h1>
            <p>{examSet.title} · ตอบแล้ว {result.answered} ข้อ</p>
            <div className={styles.resultStats}>
              <div><span>ตอบถูก</span><strong>{result.score}</strong></div>
              <div><span>ตอบผิด/ว่าง</span><strong>{result.total - result.score}</strong></div>
              <div><span>ปักหมุด</span><strong>{flaggedIds.size}</strong></div>
            </div>
            <div className={styles.categoryResults}>
              <div className={styles.categoryResultsHead}>
                <h2>จุดที่ควรฝึกก่อน</h2>
                <span>{result.categoryResults.length} หมวด</span>
              </div>
              {[...result.categoryResults]
                .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))
                .slice(0, showAllCategoryResults ? undefined : 6)
                .map((categoryResult) => {
                const categoryPercent = Math.round((categoryResult.correct / categoryResult.total) * 100);
                return (
                  <div className={styles.categoryResultRow} key={categoryResult.category}>
                    <div><strong>{categoryResult.category}</strong><span>{categoryResult.correct}/{categoryResult.total} ข้อ</span></div>
                    <i><span style={{ width: `${categoryPercent}%` }} /></i>
                    <em>{categoryPercent}%</em>
                  </div>
                );
              })}
              {result.categoryResults.length > 6 ? (
                <button
                  type="button"
                  className={styles.categoryToggleButton}
                  onClick={() => setShowAllCategoryResults((current) => !current)}
                >
                  {showAllCategoryResults ? 'แสดงเฉพาะจุดที่ควรฝึก' : `ดูครบทั้ง ${result.categoryResults.length} หมวด`}
                  <span aria-hidden="true">{showAllCategoryResults ? '↑' : '↓'}</span>
                </button>
              ) : null}
            </div>
            <p className={styles.progressSaveMessage}>
              {progressSaveState === 'account' && 'บันทึกผลและความก้าวหน้ารายหมวดในบัญชีแล้ว'}
              {progressSaveState === 'guest' && 'บันทึกผลรายหมวดไว้ในอุปกรณ์นี้แล้ว · เข้าสู่ระบบเพื่อซิงก์ข้ามอุปกรณ์'}
              {progressSaveState === 'error' && 'บันทึกในอุปกรณ์แล้ว แต่ซิงก์บัญชีไม่สำเร็จ'}
              {progressSaveState === 'idle' && 'กำลังบันทึกความก้าวหน้า...'}
            </p>
            <div className={styles.resultActions}>
              <button type="button" onClick={openReview} className={`${styles.primaryButton} ${styles.reviewCta}`}>
                <span className={styles.reviewCtaIcon} aria-hidden="true">✓</span>
                <span className={styles.reviewCtaCopy}>
                  <strong>ดูเฉลยพร้อมวิธีคิด</strong>
                  <small>เช็กข้อผิดและเทคนิคจำทุกข้อ</small>
                </span>
                <span className={styles.reviewCtaArrow} aria-hidden="true">→</span>
              </button>
              <button type="button" onClick={restartExam} className={styles.secondaryButton}>ทำชุดนี้อีกครั้ง</button>
              {subjectId === 'mock_test' ? <Link href="/daily-practice/math" className={styles.secondaryButton} onClick={() => trackAnalyticsEvent('daily_practice_recommendation_click', { source: 'mock_test_result' })}>ต่อด้วยควิซฟรี 10 ข้อ</Link> : null}
              <Link href={subjectHref} className={styles.secondaryButton}>กลับหน้าวิชา{subjectTitle}</Link>
            </div>
          </section>
        </main>
        {showLoginPrompt ? (
          <div
            className={styles.loginPromptBackdrop}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowLoginPrompt(false);
            }}
          >
            <section
              className={styles.loginPrompt}
              role="dialog"
              aria-modal="true"
              aria-labelledby="save-result-title"
              aria-describedby="save-result-description"
            >
              <button
                type="button"
                className={styles.loginPromptClose}
                onClick={() => setShowLoginPrompt(false)}
                aria-label="ปิดหน้าต่าง"
              >
                ×
              </button>
              <span className={styles.loginPromptIcon} aria-hidden="true">✓</span>
              <span className={styles.loginPromptEyebrow}>เก็บความก้าวหน้าของคุณ</span>
              <h2 id="save-result-title">เข้าสู่ระบบเพื่อบันทึกผลสอบ</h2>
              <p id="save-result-description">
                ผลสอบครั้งนี้พักไว้ในอุปกรณ์แล้ว เมื่อเข้าสู่ระบบ ระบบจะนำคะแนนเข้าสู่ Dashboard ให้อัตโนมัติ
              </p>
              <div className={styles.loginPromptScore}>
                <span>คะแนนครั้งนี้</span>
                <strong>{result.score} / {result.total}</strong>
              </div>
              <div className={styles.loginPromptActions}>
                <Link href="/register" className={styles.loginPromptPrimary}>สมัครฟรีและบันทึกผล</Link>
                <button type="button" onClick={() => setShowLoginPrompt(false)}>ไว้ทีหลัง</button>
              </div>
              <small>ไม่บังคับสมัครสมาชิก คุณยังดูเฉลยและใช้งานต่อได้ตามปกติ</small>
            </section>
          </div>
        ) : null}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const isFlagged = flaggedIds.has(currentQuestion.id);

  return (
    <div className={styles.examPage}>
      <ExamHeader secondsLeft={sessionReady ? secondsLeft : durationSeconds} exitHref={subjectHref} />

      <main className={styles.examMain}>
        <section className={styles.questionPanel}>
          <div className={styles.examSummary}>
            <span className={styles.documentBadge}><DocumentIcon /></span>
            <div className={styles.summaryCopy}>
              <span className={styles.freeBadge}>จับเวลาจริง · พร้อมเฉลย</span>
              <h1>{examSet.title}</h1>
              <p>ข้อ {currentIndex + 1} / {questions.length}</p>
              <div className={styles.progressRow}>
                <span className={styles.progressTrack}><i style={{ width: `${progress}%` }} /></span>
                <strong>{progress}%</strong>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.flagTopButton} ${isFlagged ? styles.flagged : ''}`}
              onClick={() => toggleFlag(currentQuestion.id)}
            >
              <FlagIcon />
              {isFlagged ? 'ยกเลิกปักหมุด' : 'ปักหมุดข้อนี้'}
            </button>
          </div>

          <article className={styles.questionCard} key={currentQuestion.id}>
            <div className={styles.questionMeta}>
              <strong>ข้อ {currentIndex + 1}</strong>
              <span>{currentQuestion.category}</span>
            </div>
            <h2><MathText text={currentQuestion.prompt} /></h2>
            {currentQuestion.media?.src ? (
              <figure className={styles.questionMedia}>
                <img src={currentQuestion.media.src} alt={currentQuestion.media.alt || `ภาพประกอบข้อ ${currentIndex + 1}`} />
              </figure>
            ) : null}

            <div
              className={`${styles.choiceList} ${currentQuestion.media?.choiceImages?.length ? styles.visualChoiceList : ''}`}
              role="radiogroup"
              aria-label={`ตัวเลือกข้อ ${currentIndex + 1}`}
            >
              {currentQuestion.choices.map((choice, choiceIndex) => {
                const selected = answers[currentQuestion.id] === choiceIndex;
                const choiceImage = currentQuestion.media?.choiceImages?.[choiceIndex];
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`${styles.choiceButton} ${selected ? styles.selectedChoice : ''}`}
                    key={`${currentQuestion.id}-${choiceIndex}`}
                    onClick={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: choiceIndex }))}
                  >
                    <span className={styles.radioMark}><i /></span>
                    <span className={styles.choiceKey}>{CHOICE_KEYS[choiceIndex] ?? choiceIndex + 1}</span>
                    <span className={styles.choiceContent}>
                      {choiceImage ? <img src={choiceImage.src} alt={choiceImage.alt} /> : null}
                      <span><MathText text={choice} /></span>
                    </span>
                  </button>
                );
              })}
            </div>
          </article>

          <div className={styles.questionActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            >
              <span aria-hidden="true">←</span> ข้อก่อนหน้า
            </button>
            {currentIndex === questions.length - 1 ? (
              <button type="button" className={styles.primaryButton} onClick={submitExam}>
                ส่งข้อสอบ <span aria-hidden="true">✓</span>
              </button>
            ) : (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
              >
                {answers[currentQuestion.id] === undefined ? 'ข้ามไปข้อถัดไป' : 'บันทึกและไปข้อถัดไป'}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </section>

        <aside className={styles.navigatorPanel}>
          <div className={styles.navigatorHead}>
            <div><span>กระดาษคำตอบ</span><h2>ข้อสอบ {questions.length} ข้อ</h2></div>
            <span className={styles.answeredPill}>{answeredCount}/{questions.length}</span>
          </div>
          <div className={styles.questionGrid}>
            {questions.map((question, index) => {
              const answered = answers[question.id] !== undefined;
              const flagged = flaggedIds.has(question.id);
              return (
                <button
                  type="button"
                  key={question.id}
                  aria-label={`ไปข้อ ${index + 1}`}
                  className={`${styles.numberButton} ${answered ? styles.answeredNumber : ''} ${flagged ? styles.flaggedNumber : ''} ${index === currentIndex ? styles.currentNumber : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className={styles.legend}>
            <div><span className={styles.answeredDot} />ตอบแล้ว <strong>{answeredCount} ข้อ</strong></div>
            <div><span className={styles.flaggedDot} />ปักหมุด <strong>{flaggedIds.size} ข้อ</strong></div>
            <div><span className={styles.emptyDot} />ยังไม่ได้ตอบ <strong>{questions.length - answeredCount} ข้อ</strong></div>
          </div>
          <button type="button" className={styles.flagAsideButton} onClick={() => toggleFlag(currentQuestion.id)}>
            <FlagIcon /> {isFlagged ? 'ยกเลิกปักหมุดข้อนี้' : 'ปักหมุดข้อนี้'}
          </button>
          <button type="button" className={styles.submitAsideButton} onClick={submitExam}>ส่งข้อสอบ</button>
        </aside>
      </main>

      <div className={styles.autoSaveNote}>
        <span>i</span> ระบบบันทึกคำตอบและเวลาที่เหลือไว้ในอุปกรณ์นี้โดยอัตโนมัติ
      </div>

      {showSubmitConfirm ? (
        <div
          className={styles.submitConfirmBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSubmitConfirm(false);
          }}
        >
          <section
            className={styles.submitConfirm}
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-confirm-title"
            aria-describedby="submit-confirm-description"
          >
            <button
              type="button"
              className={styles.submitConfirmClose}
              onClick={() => setShowSubmitConfirm(false)}
              aria-label="ปิดหน้าต่าง"
            >
              ×
            </button>
            <span className={styles.submitConfirmIcon} aria-hidden="true">!</span>
            <span className={styles.submitConfirmEyebrow}>ตรวจคำตอบก่อนส่ง</span>
            <h2 id="submit-confirm-title">ยังไม่ได้ตอบ {questions.length - answeredCount} ข้อ</h2>
            <p id="submit-confirm-description">
              ข้อที่เว้นว่างจะนับเป็นคำตอบผิด คุณสามารถกลับไปทำต่อ หรือส่งข้อสอบตอนนี้ได้
            </p>
            <div className={styles.submitConfirmSummary}>
              <div><span>ตอบแล้ว</span><strong>{answeredCount}</strong></div>
              <div><span>ยังไม่ตอบ</span><strong>{questions.length - answeredCount}</strong></div>
              <div><span>ปักหมุด</span><strong>{flaggedIds.size}</strong></div>
            </div>
            <div className={styles.submitConfirmActions}>
              <button type="button" onClick={() => setShowSubmitConfirm(false)}>กลับไปทำต่อ</button>
              <button type="button" onClick={confirmSubmitExam}>ยืนยันส่งข้อสอบ</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function ExamHeader({ secondsLeft, completedSeconds, exitHref }: { secondsLeft?: number; completedSeconds?: number; exitHref: string }) {
  const isCompleted = completedSeconds !== undefined;
  const displayedSeconds = isCompleted ? completedSeconds : secondsLeft ?? 0;
  return (
    <header className={styles.examHeaderOuter}>
      <div className={styles.examHeaderInner}>
        <Link href="/" className={styles.wordmark} aria-label="SlothMove หน้าแรก">
          SLOTH<span>MOVE</span>
        </Link>
        <div className={`${styles.timer} ${!isCompleted && displayedSeconds <= 300 ? styles.timerWarning : ''}`}>
          <ClockIcon />
          <span>{isCompleted ? 'เวลาที่ใช้' : 'เวลาคงเหลือ'}</span>
          <strong>{formatTime(displayedSeconds)}</strong>
        </div>
        <Link href={exitHref} className={styles.exitButton}>
          <ExitIcon /> ออกจากข้อสอบ
        </Link>
      </div>
    </header>
  );
}
