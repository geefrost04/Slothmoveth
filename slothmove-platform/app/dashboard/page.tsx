'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { readPendingAttempts, removePendingAttempts } from '@/lib/pending-attempts';
import { getSupabase } from '@/lib/supabase';
import '../dashboard.css';

type DashboardView = 'overview' | 'history' | 'analysis' | 'review';
type AccountProfile = { id: string; email: string; full_name: string | null; role: 'admin' | 'user' };
type CategoryResult = { category: string; total: number; answered: number; correct: number };
type AttemptRow = {
  id: string;
  subject_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  exam_set_id: string | null;
  category_results: CategoryResult[];
  duration_seconds: number | null;
  completion_reason: 'submitted' | 'timeout' | null;
  created_at: string;
  answers: AttemptAnswer[] | null;
};
type AttemptAnswer = {
  question_id: string;
  category: string;
  selected_choice_index: number | null;
  correct_choice_index: number;
  is_correct: boolean;
};
type ReviewQuestion = {
  id: string;
  category: string;
  prompt: string;
  choices: string[];
  correctChoiceIndex: number;
  explanation: string | null;
  tip: string | null;
};
type PerformanceStat = { id: string; title: string; subjectId: string; score: number; total: number; percentage: number };
type AttemptGroup = 'subject' | 'mock' | 'other';

const SUBJECT_TITLES: Record<string, string> = {
  math: 'ความรู้ทั่วไป', thai: 'ภาษาไทย', english: 'ภาษาอังกฤษ', law: 'กฎหมาย',
  computer: 'คอมพิวเตอร์', social: 'สังคมศึกษา', saraban: 'งานสารบรรณ',
  analytical_thinking: 'ความสามารถในการคิดวิเคราะห์', mock_test: 'Mock Test'
};

const MOCK_CATEGORY_SUBJECT_IDS: Record<string, string> = {
  'ความรู้ทั่วไป': 'math',
  'ภาษาไทย': 'thai',
  'คอมพิวเตอร์': 'computer',
  'งานสารบรรณ': 'saraban',
  'กฎหมาย': 'law',
  'ภาษาอังกฤษ': 'english'
};

const SUBJECT_PRACTICE_IDS = new Set(Object.keys(SUBJECT_TITLES).filter((subjectId) => subjectId !== 'mock_test'));

function getAttemptGroup(subjectId: string): AttemptGroup {
  if (subjectId === 'mock_test') return 'mock';
  if (SUBJECT_PRACTICE_IDS.has(subjectId)) return 'subject';
  return 'other';
}

function normalizeAttemptSubject(attempt: Pick<AttemptRow, 'subject_id' | 'quiz_id'>) {
  // Older Mock Test rows were written with the legacy math subject id.
  return attempt.quiz_id.startsWith('police-mock_test-') ? 'mock_test' : attempt.subject_id;
}

function summarizeAttempts(groupAttempts: AttemptRow[]) {
  const questions = groupAttempts.reduce((total, attempt) => total + attempt.total_questions, 0);
  const score = groupAttempts.reduce((total, attempt) => total + attempt.score, 0);
  return { attempts: groupAttempts.length, questions, average: getPercentage(score, questions) };
}

function getPracticeHref(subjectId: string, examSetId?: string | null) {
  if (subjectId === 'mock_test') {
    return examSetId
      ? `/courses/police_admin/mock-test/${examSetId}`
      : '/courses/police_admin/mock-test';
  }
  if (examSetId && subjectId === 'math') return `/courses/police_admin/math/exams/${examSetId}`;
  return `/courses/police_admin/${subjectId}`;
}

function getViewFromHash(): DashboardView {
  if (typeof window === 'undefined') return 'overview';
  if (window.location.hash === '#history') return 'history';
  if (window.location.hash === '#analysis') return 'analysis';
  if (window.location.hash === '#review') return 'review';
  return 'overview';
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric', month: 'short', year: '2-digit',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  }).format(new Date(value));
}

function getPercentage(score: number, total: number) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

function getLatestWrongAnswers(attempts: AttemptRow[]) {
  const seenQuestionIds = new Set<string>();
  const wrongAnswers: Array<{ answer: AttemptAnswer; attempt: AttemptRow }> = [];

  // Attempts arrive newest first. A later correct answer removes an earlier mistake from review.
  for (const attempt of attempts) {
    for (const answer of attempt.answers ?? []) {
      if (!answer?.question_id || seenQuestionIds.has(answer.question_id)) continue;
      seenQuestionIds.add(answer.question_id);
      if (!answer.is_correct) wrongAnswers.push({ answer, attempt });
    }
  }

  return wrongAnswers;
}

function EmptyState({ title, children }: { title: string; children: string }) {
  return <div className="dashboard-empty-state"><span aria-hidden="true">○</span><strong>{title}</strong><p>{children}</p><Link href="/courses/police_admin">เลือกชุดข้อสอบ</Link></div>;
}

async function syncPendingAttempts(userId: string) {
  const client = getSupabase();
  const pendingAttempts = readPendingAttempts();
  if (!client || pendingAttempts.length === 0) return { synced: 0, error: false };

  const quizIds = [...new Set(pendingAttempts.map((attempt) => attempt.quiz_id))];
  const { data: existingAttempts, error: existingError } = await client.from('attempts').select('quiz_id,created_at').eq('user_id', userId).in('quiz_id', quizIds);
  if (existingError) return { synced: 0, error: true };

  const toAttemptKey = (quizId: string, createdAt: string) => `${quizId}:${new Date(createdAt).toISOString()}`;
  const existingKeys = new Set((existingAttempts ?? []).map((attempt) => toAttemptKey(attempt.quiz_id, attempt.created_at)));
  const alreadySyncedIds = pendingAttempts.filter((attempt) => existingKeys.has(toAttemptKey(attempt.quiz_id, attempt.created_at))).map((attempt) => attempt.id);
  const unsyncedAttempts = pendingAttempts.filter((attempt) => !existingKeys.has(toAttemptKey(attempt.quiz_id, attempt.created_at)));
  const syncedIds = [...alreadySyncedIds];
  let hasSyncError = false;

  for (const { id, ...attempt } of unsyncedAttempts) {
    const { error } = await client.from('attempts').insert({ user_id: userId, ...attempt });
    if (error) hasSyncError = true;
    else syncedIds.push(id);
  }

  removePendingAttempts(syncedIds);
  return { synced: syncedIds.length - alreadySyncedIds.length, error: hasSyncError };
}

function AttemptItem({ attempt, title, expanded, onToggle }: { attempt: AttemptRow; title: string; expanded: boolean; onToggle: () => void }) {
  const percentage = getPercentage(attempt.score, attempt.total_questions);
  const practiceHref = getPracticeHref(attempt.subject_id, attempt.exam_set_id);

  return (
    <article className={`dashboard-attempt${expanded ? ' is-expanded' : ''}`}>
      <button type="button" className="dashboard-attempt-summary" onClick={onToggle} aria-expanded={expanded}>
        <span className={`activity-icon-wrap is-${percentage >= 70 ? 'good' : 'review'}`} aria-hidden="true">{percentage >= 70 ? '✓' : '↗'}</span>
        <span className="activity-info"><strong>{title}</strong><small>{formatDate(attempt.created_at, true)} · {attempt.total_questions} ข้อ · {formatDuration(attempt.duration_seconds ?? 0)} นาที</small></span>
        <span className={`activity-score-badge ${percentage >= 70 ? 'green' : 'orange'}`}>{percentage}%</span>
        <span className="dashboard-attempt-chevron" aria-hidden="true">⌄</span>
      </button>
      {expanded ? (
        <div className="dashboard-attempt-detail">
          <div className="dashboard-attempt-metrics">
            <div><span>ตอบถูก</span><strong>{attempt.score}</strong></div>
            <div><span>ผิด/ไม่ได้ตอบ</span><strong>{attempt.total_questions - attempt.score}</strong></div>
            <div><span>สถานะ</span><strong>{attempt.completion_reason === 'timeout' ? 'หมดเวลา' : 'ส่งคำตอบ'}</strong></div>
          </div>
          {attempt.category_results.length > 0 ? (
            <div className="dashboard-category-breakdown">
              <h4>ผลแยกตามประเภทข้อสอบ</h4>
              {attempt.category_results.map((category) => { const categoryPercentage = getPercentage(category.correct, category.total); return <div className="dashboard-category-row" key={`${attempt.id}-${category.category}`}><span>{category.category}</span><i><b style={{ width: `${categoryPercentage}%` }} /></i><strong>{category.correct}/{category.total}</strong></div>; })}
            </div>
          ) : <p className="dashboard-detail-note">ประวัติเดิมรายการนี้ไม่มีข้อมูลแยกหมวด</p>}
          <Link href={practiceHref} className="dashboard-retry-link">ฝึกชุดนี้อีกครั้ง →</Link>
        </div>
      ) : null}
    </article>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [reviewQuestions, setReviewQuestions] = useState<Record<string, ReviewQuestion>>({});
  const [examSetTitles, setExamSetTitles] = useState<Record<string, string>>({});
  const [view, setView] = useState<DashboardView>('overview');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [analysisSubjectFilter, setAnalysisSubjectFilter] = useState('all');
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [dataError, setDataError] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const router = useRouter();
  const supabase = getSupabase();

  useEffect(() => {
    setView(getViewFromHash());
    const onHashChange = () => setView(getViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let active = true;
    if (!supabase) { router.replace('/login'); setLoading(false); return; }
    const client = supabase;

    async function loadDashboard() {
      setLoading(true); setDataError(''); setSyncMessage('');
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (!active) return;
      if (sessionError || !sessionData.session) { router.replace('/login'); setLoading(false); return; }

      const sessionUser = sessionData.session.user;
      setUser(sessionUser);
      const syncResult = await syncPendingAttempts(sessionUser.id);
      const [profileResponse, attemptsResponse] = await Promise.all([
        client.from('profiles').select('id,email,full_name,role').eq('id', sessionUser.id).maybeSingle(),
        client.from('attempts').select('id,subject_id,quiz_id,score,total_questions,exam_set_id,answers,category_results,duration_seconds,completion_reason,created_at').eq('user_id', sessionUser.id).order('created_at', { ascending: false })
      ]);
      if (!active) return;
      if (profileResponse.error || attemptsResponse.error || syncResult.error) setDataError('ข้อมูลบางส่วนโหลดหรือซิงก์ไม่สำเร็จ กรุณากดลองใหม่');
      if (syncResult.synced > 0) setSyncMessage(`นำเข้าประวัติจากอุปกรณ์นี้แล้ว ${syncResult.synced} รายการ`);

      setProfile(profileResponse.data as AccountProfile | null);
      const realAttempts = ((attemptsResponse.data ?? []) as AttemptRow[]).map((attempt) => ({
        ...attempt,
        subject_id: normalizeAttemptSubject(attempt),
        answers: Array.isArray(attempt.answers) ? attempt.answers as AttemptAnswer[] : [],
        category_results: Array.isArray(attempt.category_results) ? attempt.category_results : []
      }));
      setAttempts(realAttempts);
      const wrongQuestionIds = getLatestWrongAnswers(realAttempts).map(({ answer }) => answer.question_id);
      if (wrongQuestionIds.length > 0) {
        const [questionsResponse, solutionsResponse] = await Promise.all([
          client.from('questions').select('id,category,prompt,choices').in('id', wrongQuestionIds),
          client.from('question_solutions').select('question_id,correct_choice_index,explanation,tip').in('question_id', wrongQuestionIds)
        ]);
        if (active && !questionsResponse.error && !solutionsResponse.error) {
          const solutionsById = new Map((solutionsResponse.data ?? []).map((solution) => [solution.question_id, solution]));
          const nextReviewQuestions = Object.fromEntries((questionsResponse.data ?? []).flatMap((question) => {
            const solution = solutionsById.get(question.id);
            if (!solution || !Array.isArray(question.choices)) return [];
            return [[question.id, {
              id: question.id,
              category: question.category,
              prompt: question.prompt,
              choices: question.choices.map(String),
              correctChoiceIndex: solution.correct_choice_index,
              explanation: solution.explanation,
              tip: solution.tip
            } satisfies ReviewQuestion]];
          }));
          setReviewQuestions(nextReviewQuestions);
        }
      } else {
        setReviewQuestions({});
      }
      const examSetIds = [...new Set(realAttempts.map((attempt) => attempt.exam_set_id).filter(Boolean))] as string[];
      if (examSetIds.length > 0) {
        const { data: examSets } = await client.from('exam_sets').select('id,title').in('id', examSetIds);
        if (active) setExamSetTitles(Object.fromEntries((examSets ?? []).map((examSet) => [examSet.id, examSet.title])));
      } else setExamSetTitles({});
      setLoading(false);
    }

    void loadDashboard();
    return () => { active = false; };
  }, [reloadToken, router, supabase]);

  function selectView(nextView: DashboardView) {
    setView(nextView); setExpandedAttemptId(null);
    const hash = nextView === 'overview' ? '' : nextView;
    window.history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) return <div className="dashboard-loading"><span className="dashboard-loading-spinner" />กำลังเตรียม Dashboard ของคุณ...</div>;
  if (!user) return null;

  const username = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'สมาชิก';
  const totalQuestions = attempts.reduce((total, attempt) => total + attempt.total_questions, 0);
  const totalScore = attempts.reduce((total, attempt) => total + attempt.score, 0);
  const averageScore = getPercentage(totalScore, totalQuestions);
  const timedAttempts = attempts.filter((attempt) => attempt.duration_seconds !== null);
  const averageDuration = timedAttempts.length > 0 ? Math.round(timedAttempts.reduce((total, attempt) => total + (attempt.duration_seconds ?? 0), 0) / timedAttempts.length) : 0;
  const subjectMap = new Map<string, { score: number; total: number }>();
  const categoryMap = new Map<string, PerformanceStat>();

  for (const attempt of attempts) {
    if (attempt.subject_id !== 'mock_test') {
      const subject = subjectMap.get(attempt.subject_id) ?? { score: 0, total: 0 };
      subject.score += attempt.score; subject.total += attempt.total_questions; subjectMap.set(attempt.subject_id, subject);
    }
    for (const category of attempt.category_results) {
      const categorySubjectId = attempt.subject_id === 'mock_test'
        ? MOCK_CATEGORY_SUBJECT_IDS[category.category] ?? 'mock_test'
        : attempt.subject_id;
      if (attempt.subject_id === 'mock_test') {
        const subject = subjectMap.get(categorySubjectId) ?? { score: 0, total: 0 };
        subject.score += category.correct; subject.total += category.total; subjectMap.set(categorySubjectId, subject);
      }
      const key = `${categorySubjectId}:${category.category}`;
      const current = categoryMap.get(key) ?? { id: key, title: category.category, subjectId: categorySubjectId, score: 0, total: 0, percentage: 0 };
      current.score += category.correct; current.total += category.total; current.percentage = getPercentage(current.score, current.total); categoryMap.set(key, current);
    }
  }

  const subjectStats: PerformanceStat[] = [...subjectMap.entries()].map(([id, totals]) => ({ id, title: SUBJECT_TITLES[id] ?? id, subjectId: id, score: totals.score, total: totals.total, percentage: getPercentage(totals.score, totals.total) }));
  const categoryStats = [...categoryMap.values()].sort((a, b) => a.percentage - b.percentage || b.total - a.total);
  const weaknesses = categoryStats.length > 0 ? categoryStats.slice(0, 5) : [...subjectStats].sort((a, b) => a.percentage - b.percentage).slice(0, 5);
  const subjectAnalysis = subjectStats
    .map((subject) => ({
      ...subject,
      attemptCount: attempts.filter((attempt) => attempt.subject_id === subject.subjectId || (
        attempt.subject_id === 'mock_test' && attempt.category_results.some((category) => MOCK_CATEGORY_SUBJECT_IDS[category.category] === subject.subjectId)
      )).length,
      categories: categoryStats.filter((category) => category.subjectId === subject.subjectId)
    }))
    .sort((a, b) => a.percentage - b.percentage);
  const visibleSubjectAnalysis = analysisSubjectFilter === 'all'
    ? subjectAnalysis
    : subjectAnalysis.filter((subject) => subject.subjectId === analysisSubjectFilter);
  const recentAttempts = attempts.slice(0, 5);
  const trendAttempts = attempts.slice(0, 7).reverse();
  const subjectFilters = [...new Set(attempts.filter((attempt) => getAttemptGroup(attempt.subject_id) === 'subject').map((attempt) => attempt.subject_id))];
  const subjectAttempts = attempts.filter((attempt) => getAttemptGroup(attempt.subject_id) === 'subject');
  const mockAttempts = attempts.filter((attempt) => getAttemptGroup(attempt.subject_id) === 'mock');
  const otherAttempts = attempts.filter((attempt) => getAttemptGroup(attempt.subject_id) === 'other');
  const subjectSummary = summarizeAttempts(subjectAttempts);
  const mockSummary = summarizeAttempts(mockAttempts);
  const otherSummary = summarizeAttempts(otherAttempts);
  const filteredAttempts = historyFilter === 'all'
    ? attempts
    : historyFilter.startsWith('group:')
      ? attempts.filter((attempt) => getAttemptGroup(attempt.subject_id) === historyFilter.slice(6))
      : attempts.filter((attempt) => attempt.subject_id === historyFilter);
  const getAttemptTitle = (attempt: AttemptRow) => (attempt.exam_set_id && examSetTitles[attempt.exam_set_id]) || SUBJECT_TITLES[attempt.subject_id] || attempt.quiz_id;
  const wrongAnswers = getLatestWrongAnswers(attempts);

  function openHistoryGroup(group: AttemptGroup) {
    setHistoryFilter(`group:${group}`);
    selectView('history');
  }

  return (
    <div className="dashboard-layout-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <aside className="dashboard-sidebar" aria-label="เมนู Dashboard">
          <div className="dashboard-menu">
            <button type="button" className={`dashboard-menu-item${view === 'overview' ? ' active' : ''}`} onClick={() => selectView('overview')}><span>▦</span><span>ภาพรวม</span></button>
            <button type="button" className={`dashboard-menu-item${view === 'history' ? ' active' : ''}`} onClick={() => selectView('history')}><span>◷</span><span>ประวัติการฝึก</span><b>{attempts.length}</b></button>
            <button type="button" className={`dashboard-menu-item${view === 'analysis' ? ' active' : ''}`} onClick={() => selectView('analysis')}><span>◎</span><span>วิเคราะห์จุดอ่อน</span></button>
            <button type="button" className={`dashboard-menu-item${view === 'review' ? ' active' : ''}`} onClick={() => selectView('review')}><span>▣</span><span>สมุดข้อผิด</span><b>{wrongAnswers.length}</b></button>
          </div>
          <div className="sidebar-exam-card">
            <div className="sidebar-exam-title">สนามสอบที่ใช้งานอยู่</div><img src="/pic/logo_police.png" alt="นายสิบตำรวจ" className="sidebar-exam-logo" />
            <div className="sidebar-exam-title is-course-name">นายสิบตำรวจ</div><Link href="/courses/police_admin" className="sidebar-exam-btn">ไปหน้าคอร์ส</Link><Link href="/#exam-selection" className="sidebar-change-link">เปลี่ยนสนามสอบ</Link>
          </div>
          <a href="https://www.facebook.com/profile.php?id=61589670089745" target="_blank" rel="noopener noreferrer" className="sidebar-help-box"><span>มีคำถามหรือปัญหา?</span><span>ติดต่อทีมงาน ›</span></a>
        </aside>

        <main className="dashboard-content">
          <header className="dashboard-page-header">
            <div className="dashboard-account-heading">
              <div className="dashboard-account-copy"><Link href="/" className="dashboard-home-breadcrumb">← กลับหน้าแรก</Link><span className="dashboard-view-eyebrow">{view === 'overview' ? 'ภาพรวมบัญชี' : view === 'history' ? 'ประวัติทั้งหมด' : view === 'analysis' ? 'วิเคราะห์ผลการฝึก' : 'ทบทวนเฉพาะข้อที่ยังพลาด'}</span><h1>{view === 'overview' ? `สวัสดี, ${username}` : view === 'history' ? 'ประวัติการฝึกของฉัน' : view === 'analysis' ? 'จุดที่ควรฝึกต่อ' : 'สมุดข้อผิดของฉัน'}</h1><p>{view === 'overview' ? 'ติดตามคะแนน เวลา และความก้าวหน้าจากข้อมูลจริงของคุณ' : view === 'history' ? 'เปิดดูผลรายหมวดและกลับไปฝึกชุดเดิมได้ทุกเมื่อ' : view === 'analysis' ? 'เรียงจากหมวดที่คะแนนต่ำ เพื่อช่วยเลือกสิ่งที่ควรทบทวนก่อน' : 'ข้อที่ตอบถูกในภายหลังจะถูกนำออก เพื่อให้เหลือเฉพาะจุดที่ควรทบทวน'}</p></div>
              <div className="dashboard-account-actions"><Link href="/courses/police_admin" className="dashboard-primary-action">ทำข้อสอบต่อ <span aria-hidden="true">→</span></Link><button type="button" className="dashboard-refresh-button" onClick={() => setReloadToken((value) => value + 1)}>↻ อัปเดตข้อมูล</button><span className={`account-role-badge is-${profile?.role ?? 'user'}`}>{profile?.role === 'admin' ? 'ADMIN' : 'USER'}</span>{profile?.role === 'admin' ? <Link href="/admin">ระบบจัดการ →</Link> : null}</div>
            </div>
          </header>
          {syncMessage ? <div className="dashboard-sync-message" role="status">✓ {syncMessage}</div> : null}
          {dataError ? <div className="dashboard-data-error" role="alert"><span>{dataError}</span><button type="button" onClick={() => setReloadToken((value) => value + 1)}>ลองใหม่</button></div> : null}

          {view === 'overview' ? (
            <>
              <section className="dashboard-premium-hero" aria-label="สรุปเป้าหมายการฝึก">
              <div className="dashboard-premium-hero-copy">
                <span className="dashboard-premium-kicker">YOUR PREPARATION STATUS</span>
                <h2>{attempts.length > 0 ? 'กำลังพัฒนาได้ถูกทาง' : 'วางแผนการเตรียมตัวของคุณ'}</h2>
                <p>{attempts.length > 0 ? `ทำข้อสอบมาแล้ว ${attempts.length} ครั้ง ระบบจัดลำดับหัวข้อที่ควรฝึกให้คุณแล้ว` : 'เริ่มทำข้อสอบชุดแรก เพื่อให้ระบบวิเคราะห์คะแนนและสร้างแผนฝึกเฉพาะคุณ'}</p>
              </div>
              <div className="dashboard-premium-goal">
                <div className="dashboard-premium-goal-heading"><span>เป้าหมายคะแนน</span><strong>{averageScore}% <small>/ 80%</small></strong></div>
                <div className="dashboard-premium-goal-track"><i style={{ width: `${Math.min(100, Math.round((averageScore / 80) * 100))}%` }} /></div>
                <span className="dashboard-premium-goal-note">{averageScore >= 80 ? 'ถึงเป้าหมายแล้ว รักษาระดับต่อไป' : `อีก ${Math.max(0, 80 - averageScore)}% เพื่อถึงเป้าหมาย`}</span>
              </div>
              <Link href={weaknesses[0] ? getPracticeHref(weaknesses[0].subjectId) : '/courses/police_admin'} className="dashboard-premium-next-action">
                <span><small>แนะนำให้ทำต่อ</small><strong>{weaknesses[0] ? `ฝึก ${weaknesses[0].title}` : 'เริ่มทำข้อสอบชุดแรก'}</strong></span><i aria-hidden="true">→</i>
              </Link>
              </section>
              {wrongAnswers.length > 0 ? <button type="button" className="dashboard-review-summary" onClick={() => selectView('review')}><span className="dashboard-review-summary-icon" aria-hidden="true">▣</span><span><strong>มีข้อที่ควรทบทวน {wrongAnswers.length} ข้อ</strong><small>เปิดสมุดข้อผิดเพื่ออ่านเฉลย แล้วกลับไปฝึกวิชานั้นได้ทันที</small></span><i aria-hidden="true">→</i></button> : null}
            </>
          ) : null}

          {view === 'overview' ? <>
            <section className="stats-section" aria-labelledby="stats-title"><div className="dashboard-section-heading"><h2 id="stats-title">ภาพรวมการฝึก</h2><span>อัปเดตจาก {attempts.length} ครั้ง</span></div><div className="stats-grid">
              <button type="button" className="stat-card" onClick={() => selectView('history')}><span className="stat-icon green">▤</span><span><strong className="stat-value">{attempts.length}<small>ครั้ง</small></strong><span className="stat-label">การทำข้อสอบทั้งหมด</span></span></button>
              <button type="button" className="stat-card" onClick={() => selectView('history')}><span className="stat-icon blue">◎</span><span><strong className="stat-value">{totalQuestions.toLocaleString('th-TH')}<small>ข้อ</small></strong><span className="stat-label">ข้อที่ทำทั้งหมด</span></span></button>
              <button type="button" className="stat-card" onClick={() => selectView('analysis')}><span className="stat-icon orange">↗</span><span><strong className="stat-value">{averageScore}%</strong><span className="stat-label">คะแนนเฉลี่ยรวม</span></span></button>
              <div className="stat-card"><span className="stat-icon purple">◷</span><span><strong className="stat-value">{formatDuration(averageDuration)}<small>นาที</small></strong><span className="stat-label">เวลาเฉลี่ยต่อชุด</span></span></div>
            </div></section>

            <section className="dashboard-practice-spaces" aria-labelledby="practice-spaces-title">
              <div className="dashboard-section-heading is-practice-spaces-heading">
                <div><span className="dashboard-section-kicker">แยกตามรูปแบบ</span><h2 id="practice-spaces-title">พื้นที่การฝึกของคุณ</h2></div>
                <span>เลือกหมวดเพื่อดูประวัติเฉพาะส่วนนั้น</span>
              </div>
              <div className="dashboard-space-grid">
                <button type="button" className="dashboard-space-card is-subject" onClick={() => openHistoryGroup('subject')}>
                  <span className="dashboard-space-icon" aria-hidden="true">01</span>
                  <span className="dashboard-space-copy"><small>ฝึกพื้นฐาน</small><strong>ฝึกแยกวิชา</strong><span>ดูคะแนนและจุดอ่อนรายวิชาแบบไม่รวมสนามจำลอง</span></span>
                  <span className="dashboard-space-metrics"><span><strong>{subjectSummary.attempts}</strong> ครั้ง</span><span><strong>{subjectSummary.questions.toLocaleString('th-TH')}</strong> ข้อ</span><span><strong>{subjectSummary.average}%</strong> เฉลี่ย</span></span>
                  <span className="dashboard-space-action">ดูประวัติ <i aria-hidden="true">→</i></span>
                </button>
                <button type="button" className="dashboard-space-card is-mock" onClick={() => openHistoryGroup('mock')}>
                  <span className="dashboard-space-icon" aria-hidden="true">02</span>
                  <span className="dashboard-space-copy"><small>สนามสอบจำลอง</small><strong>Mock Test</strong><span>ติดตามผลชุดจำลองสอบเต็มรูปแบบแยกจากการฝึกรายวิชา</span></span>
                  <span className="dashboard-space-metrics"><span><strong>{mockSummary.attempts}</strong> ครั้ง</span><span><strong>{mockSummary.questions.toLocaleString('th-TH')}</strong> ข้อ</span><span><strong>{mockSummary.average}%</strong> เฉลี่ย</span></span>
                  <span className="dashboard-space-action">ดูประวัติ <i aria-hidden="true">→</i></span>
                </button>
                <button type="button" className="dashboard-space-card is-other" onClick={() => openHistoryGroup('other')}>
                  <span className="dashboard-space-icon" aria-hidden="true">03</span>
                  <span className="dashboard-space-copy"><small>รองรับในอนาคต</small><strong>กิจกรรมอื่น ๆ</strong><span>{otherSummary.attempts > 0 ? 'กิจกรรมรูปแบบใหม่ที่ไม่อยู่ในสองหมวดหลัก' : 'พื้นที่สำหรับบทเรียน เกม และกิจกรรมรูปแบบใหม่'}</span></span>
                  <span className="dashboard-space-metrics"><span><strong>{otherSummary.attempts}</strong> ครั้ง</span><span><strong>{otherSummary.questions.toLocaleString('th-TH')}</strong> ข้อ</span><span><strong>{otherSummary.average}%</strong> เฉลี่ย</span></span>
                  <span className="dashboard-space-action">{otherSummary.attempts > 0 ? 'ดูประวัติ' : 'ยังไม่มีกิจกรรม'} <i aria-hidden="true">→</i></span>
                </button>
              </div>
            </section>

            <div className="charts-grid">
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">คะแนนเฉลี่ยแยกตามวิชา</h2><p className="chart-subtitle">คำนวณจากคำตอบทุกครั้งในบัญชีนี้</p></div><button type="button" className="chart-btn-detail" onClick={() => selectView('analysis')}>ดูการวิเคราะห์</button></div>{subjectStats.length > 0 ? <div className="bar-chart-container">{subjectStats.map((subject) => <div className="bar-item" key={subject.id}><span className="bar-label">{subject.title}</span><span className="bar-track"><i className="bar-fill" style={{ width: `${subject.percentage}%` }} /></span><strong className="bar-val">{subject.percentage}%</strong></div>)}</div> : <EmptyState title="ยังไม่มีคะแนน">ทำข้อสอบชุดแรกเพื่อเริ่มสร้างสถิติรายวิชา</EmptyState>}</section>
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">แนวโน้มความแม่นยำ</h2><p className="chart-subtitle">เรียงตามเวลา สูงสุด 7 ครั้งล่าสุด</p></div></div>{trendAttempts.length > 0 ? <div className="dashboard-trend-chart"><div className="trend-scale"><span>100%</span><span>50%</span><span>0%</span></div><div className="trend-bars">{trendAttempts.map((attempt) => { const percentage = getPercentage(attempt.score, attempt.total_questions); return <div className="trend-column" key={attempt.id} title={`${formatDate(attempt.created_at)}: ${percentage}%`}><span>{percentage}%</span><i><b style={{ height: `${Math.max(percentage, 4)}%` }} /></i><small>{formatDate(attempt.created_at)}</small></div>; })}</div></div> : <EmptyState title="ยังไม่มีแนวโน้ม">คะแนนแต่ละครั้งจะปรากฏที่นี่หลังส่งข้อสอบ</EmptyState>}</section>
            </div>

            <div className="bottom-sections-grid">
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">การฝึกล่าสุด</h2><p className="chart-subtitle">กดรายการเพื่อดูผลแยกหมวด</p></div><button type="button" className="chart-btn-detail" onClick={() => selectView('history')}>ดูทั้งหมด</button></div>{recentAttempts.length > 0 ? <div className="dashboard-attempt-list">{recentAttempts.map((attempt) => <AttemptItem key={attempt.id} attempt={attempt} title={getAttemptTitle(attempt)} expanded={expandedAttemptId === attempt.id} onToggle={() => setExpandedAttemptId((current) => current === attempt.id ? null : attempt.id)} />)}</div> : <EmptyState title="ยังไม่มีประวัติ">เริ่มทำข้อสอบเพื่อดูคะแนนและรายละเอียดที่นี่</EmptyState>}</section>
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">ควรฝึกอะไรต่อ</h2><p className="chart-subtitle">อ้างอิงจากหมวดที่คะแนนต่ำที่สุด</p></div><button type="button" className="chart-btn-detail" onClick={() => selectView('analysis')}>ดูทั้งหมด</button></div>{weaknesses.length > 0 ? <div className="weakness-list">{weaknesses.slice(0, 3).map((item, index) => <div className="weakness-row" key={item.id}><div className="weakness-subject"><span className="weakness-number">{index + 1}</span><span className="weakness-name">{item.title}<small>{SUBJECT_TITLES[item.subjectId] ?? item.subjectId}</small></span></div><div className="weakness-stats"><div className="weakness-score">{item.percentage}%<span>{item.score}/{item.total} ข้อ</span></div><Link href={getPracticeHref(item.subjectId)} className="weakness-btn-action">ฝึกต่อ</Link></div></div>)}</div> : <EmptyState title="ข้อมูลยังไม่พอ">ส่งข้อสอบอย่างน้อยหนึ่งครั้งเพื่อวิเคราะห์จุดอ่อน</EmptyState>}</section>
            </div>
          </> : null}

          {view === 'history' ? <section className="dashboard-view-card"><div className="dashboard-view-toolbar"><div><h2>รายการทั้งหมด</h2><p>{filteredAttempts.length} จาก {attempts.length} ครั้ง</p></div><label>กรองประวัติ<select value={historyFilter} onChange={(event) => setHistoryFilter(event.target.value)}><option value="all">ทุกกิจกรรม</option><optgroup label="รูปแบบการฝึก"><option value="group:subject">ฝึกแยกวิชา ({subjectSummary.attempts})</option><option value="group:mock">Mock Test ({mockSummary.attempts})</option><option value="group:other">กิจกรรมอื่น ๆ ({otherSummary.attempts})</option></optgroup>{subjectFilters.length > 0 ? <optgroup label="เลือกเฉพาะวิชา">{subjectFilters.map((subjectId) => <option value={subjectId} key={subjectId}>{SUBJECT_TITLES[subjectId] ?? subjectId}</option>)}</optgroup> : null}</select></label></div>{filteredAttempts.length > 0 ? <div className="dashboard-attempt-list is-full">{filteredAttempts.map((attempt) => <AttemptItem key={attempt.id} attempt={attempt} title={getAttemptTitle(attempt)} expanded={expandedAttemptId === attempt.id} onToggle={() => setExpandedAttemptId((current) => current === attempt.id ? null : attempt.id)} />)}</div> : <EmptyState title="ไม่พบประวัติ">ยังไม่มีผลสอบตรงกับตัวกรองที่เลือก</EmptyState>}</section> : null}

          {view === 'analysis' ? (
            <div className="dashboard-analysis-layout">
              <section className="dashboard-view-card">
                <div className="dashboard-view-toolbar">
                  <div><h2>วิเคราะห์แยกตามวิชา</h2><p>ภายในแต่ละวิชาเรียงหมวดที่ควรปรับปรุงก่อน</p></div>
                  <label>
                    เลือกวิชา
                    <select value={analysisSubjectFilter} onChange={(event) => setAnalysisSubjectFilter(event.target.value)}>
                      <option value="all">ทุกวิชา ({subjectAnalysis.length})</option>
                      {subjectAnalysis.map((subject) => <option value={subject.subjectId} key={subject.subjectId}>{subject.title}</option>)}
                    </select>
                  </label>
                </div>
                {visibleSubjectAnalysis.length > 0 ? (
                  <div className="subject-analysis-list">
                    {visibleSubjectAnalysis.map((subject) => (
                      <article className="subject-analysis-card" key={subject.subjectId}>
                        <header className="subject-analysis-head">
                          <div>
                            <span>วิชา</span>
                            <h3>{subject.title}</h3>
                            <p>ฝึกแล้ว {subject.attemptCount} ครั้ง · ตอบถูก {subject.score} จาก {subject.total} ข้อ</p>
                          </div>
                          <div className={`subject-analysis-score is-${subject.percentage < 50 ? 'weak' : subject.percentage < 70 ? 'developing' : 'good'}`}>
                            <strong>{subject.percentage}%</strong>
                            <span>{subject.percentage < 50 ? 'ควรทบทวน' : subject.percentage < 70 ? 'กำลังพัฒนา' : 'ทำได้ดี'}</span>
                          </div>
                        </header>
                        <div className="subject-progress-track"><i style={{ width: `${subject.percentage}%` }} /></div>
                        {subject.categories.length > 0 ? (
                          <div className="analysis-list">
                            {subject.categories.map((item, index) => (
                              <div className="analysis-row" key={item.id}>
                                <span className="analysis-rank">{index + 1}</span>
                                <div className="analysis-copy">
                                  <strong>{item.title}</strong>
                                  <small>ถูก {item.score} จาก {item.total} ข้อ</small>
                                  <i><b style={{ width: `${item.percentage}%` }} /></i>
                                </div>
                                <div className="analysis-result"><strong>{item.percentage}%</strong><span>{item.percentage < 50 ? 'ควรทบทวน' : item.percentage < 70 ? 'ฝึกเพิ่ม' : 'ทำได้ดี'}</span></div>
                              </div>
                            ))}
                          </div>
                        ) : <p className="subject-analysis-empty">ข้อสอบเดิมของวิชานี้ยังไม่มีข้อมูลแยกหมวด ระบบจะแสดงรายละเอียดเมื่อทำข้อสอบรุ่นใหม่</p>}
                        <Link href={getPracticeHref(subject.subjectId)} className="subject-analysis-action">ไปฝึกวิชานี้ →</Link>
                      </article>
                    ))}
                  </div>
                ) : <EmptyState title="ยังวิเคราะห์ไม่ได้">ทำข้อสอบอย่างน้อยหนึ่งวิชาเพื่อเริ่มสร้างการวิเคราะห์</EmptyState>}
              </section>
              <aside className="dashboard-analysis-tip">
                <span>แนวทางฝึกที่แนะนำ</span>
                <h2>{weaknesses[0] ? `เริ่มจาก “${weaknesses[0].title}”` : 'เริ่มทำข้อสอบชุดแรก'}</h2>
                <p>{weaknesses[0] ? `อยู่ในวิชา ${SUBJECT_TITLES[weaknesses[0].subjectId] ?? weaknesses[0].subjectId} คะแนนปัจจุบัน ${weaknesses[0].percentage}% ควรอ่านสรุปก่อน แล้วลองทำข้อสอบซ้ำเพื่อวัดผล` : 'ระบบต้องมีผลสอบก่อนจึงจะจัดลำดับสิ่งที่ควรฝึกได้'}</p>
                <Link href={weaknesses[0] ? getPracticeHref(weaknesses[0].subjectId) : '/courses/police_admin'}>ไปหน้าฝึก →</Link>
              </aside>
            </div>
          ) : null}

          {view === 'review' ? (
            <section className="dashboard-view-card dashboard-wrong-book">
              <div className="dashboard-view-toolbar"><div><h2>รายการที่ยังต้องทบทวน</h2><p>ระบบเก็บเฉพาะคำตอบล่าสุดของแต่ละข้อ เพื่อไม่ให้ข้อที่ทำถูกแล้วกลับมารบกวน</p></div><span className="analysis-count">{wrongAnswers.length} ข้อ</span></div>
              {wrongAnswers.length > 0 ? <div className="dashboard-wrong-book-list">{wrongAnswers.map(({ answer, attempt }) => {
                const question = reviewQuestions[answer.question_id];
                const subjectTitle = SUBJECT_TITLES[attempt.subject_id] ?? attempt.subject_id;
                const selectedChoice = answer.selected_choice_index === null ? 'ไม่ได้ตอบ' : `${String.fromCharCode(65 + answer.selected_choice_index)}. ${question?.choices[answer.selected_choice_index] ?? 'คำตอบเดิม'}`;
                const correctChoice = `${String.fromCharCode(65 + answer.correct_choice_index)}. ${question?.choices[answer.correct_choice_index] ?? 'ดูเฉลยในชุดข้อสอบ'}`;
                return <article className="dashboard-wrong-book-item" key={answer.question_id}><header><span>{subjectTitle}</span><small>{question?.category ?? answer.category}</small><time>{formatDate(attempt.created_at)}</time></header><h3>{question?.prompt ?? 'กำลังโหลดรายละเอียดข้อสอบ...'}</h3><div className="dashboard-wrong-book-answers"><p><span>คำตอบของคุณ</span><strong className="is-wrong">{selectedChoice}</strong></p><p><span>คำตอบที่ถูก</span><strong className="is-correct">{correctChoice}</strong></p></div>{question?.explanation ? <p className="dashboard-wrong-book-explanation">{question.explanation}</p> : null}<Link href={getPracticeHref(attempt.subject_id, attempt.exam_set_id)} className="dashboard-wrong-book-action">กลับไปฝึกวิชานี้ →</Link></article>;
              })}</div> : <EmptyState title="สมุดข้อผิดว่างแล้ว">เมื่อทำข้อที่เคยพลาดได้ถูกต้อง ข้อนั้นจะหายจากรายการนี้</EmptyState>}
            </section>
          ) : null}

          <div className="footer-banner-cta"><div className="footer-banner-left"><div className="footer-banner-icon">✓</div><div className="footer-banner-info"><h2>{attempts.length > 0 ? 'พร้อมพัฒนาคะแนนต่อหรือยัง?' : 'เริ่มเก็บผลการฝึกครั้งแรก'}</h2><p>ทุกครั้งที่ส่งข้อสอบ ระบบจะอัปเดต Dashboard ให้อัตโนมัติ</p></div></div><Link href="/courses/police_admin" className="footer-banner-btn">เลือกชุดข้อสอบ <span aria-hidden="true">→</span></Link></div>
        </main>
      </div>
    </div>
  );
}
