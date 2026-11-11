'use client';

import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteNav } from '@/components/nav/SiteNav';
import { Footer } from '@/components/Footer';
import { readPendingAttempts, removePendingAttempts } from '@/lib/pending-attempts';
import { getSupabase } from '@/lib/supabase';
import { trackAnalyticsEvent } from '@/lib/analytics';
import { SubjectIcon } from '@/components/icons/SubjectIcons';
import { evaluatePoliceBenchmark } from '@/lib/police-exam-benchmark';
import { CoffeeNudge } from '@/components/CoffeeNudge';
import { DASH_COURSES, courseOfSubject, dashCourse, type DashCourse, type DashCourseId } from '@/lib/dashboardCourses';
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
  analytical_thinking: 'ความสามารถในการคิดวิเคราะห์', mock_test: 'Mock Test', mini_mock: 'Mini Mock',
  // สทนช. (ONWR) topics
  org: 'ความรู้เกี่ยวกับ สทนช.', admin: 'การบริหารจัดการองค์กรภาครัฐ', rules: 'ระเบียบพนักงานราชการ',
  policy: 'การจัดทำนโยบายและแผน', masterplan: 'นโยบายและแผนแม่บทน้ำ', monitoring: 'การติดตามและประเมินผล',
  project: 'การวิเคราะห์แผนงานโครงการ', meeting: 'การประชุมและการมีส่วนร่วม', wateract: 'พ.ร.บ.ทรัพยากรน้ำ 2561',
  onwr_mini_mock: 'Mini Mock สทนช.', onwr_mini_drill: 'Mini Drill สทนช.',
  // สศช. (NESDC) topics: saved as nesdc_<topic> so they don't mix with police/ONWR ids
  nesdc_general: 'ความรู้ความสามารถทั่วไป', nesdc_saraban: 'งานสารบรรณ', nesdc_english: 'ภาษาอังกฤษ',
  nesdc_computer: 'คอมพิวเตอร์', nesdc_org: 'ความรู้เกี่ยวกับ สศช.', nesdc_national: 'ยุทธศาสตร์ชาติและแผนพัฒนาฯ',
  nesdc_analysis: 'การสรุปและวิเคราะห์งาน', nesdc_mini_mock: 'Mini Mock สศช.', nesdc_mini_drill: 'Mini Drill สศช.',
  // กทท. (PAT) topics: saved as pat_<topic>
  pat_general: 'ความสามารถทั่วไป', pat_thai: 'ภาษาไทย', pat_english: 'ภาษาอังกฤษ', pat_port: 'ความรู้เกี่ยวกับ กทท.',
  pat_ppp: 'การร่วมลงทุนรัฐและเอกชน (PPP) และ EEC', pat_soe: 'รัฐวิสาหกิจและแผนวิสาหกิจ', pat_invest: 'การวิเคราะห์โครงการลงทุน',
  pat_mini_mock: 'Mini Mock กทท.'
};
const ONWR_TOPIC_IDS = new Set(['org', 'admin', 'rules', 'policy', 'masterplan', 'monitoring', 'project', 'meeting', 'wateract']);
function isOnwrSubject(subjectId: string) {
  return ONWR_TOPIC_IDS.has(subjectId) || subjectId.startsWith('onwr_');
}
function isNesdcSubject(subjectId: string) {
  return subjectId.startsWith('nesdc_');
}
function isPatSubject(subjectId: string) {
  return subjectId.startsWith('pat_');
}

const MOCK_CATEGORY_SUBJECT_IDS: Record<string, string> = {
  'ความรู้ทั่วไป': 'math',
  'ภาษาไทย': 'thai',
  'คอมพิวเตอร์': 'computer',
  'งานสารบรรณ': 'saraban',
  'กฎหมาย': 'law',
  'ภาษาอังกฤษ': 'english'
};

const SUBJECT_PRACTICE_IDS = new Set(Object.keys(SUBJECT_TITLES).filter((subjectId) => !isMockAttempt(subjectId)));

function isMockAttempt(subjectId: string) {
  return subjectId === 'mock_test' || subjectId === 'mini_mock' || subjectId === 'onwr_mini_mock' || subjectId === 'nesdc_mini_mock' || subjectId === 'pat_mini_mock';
}

function getAttemptGroup(subjectId: string): AttemptGroup {
  if (isMockAttempt(subjectId)) return 'mock';
  if (SUBJECT_PRACTICE_IDS.has(subjectId)) return 'subject';
  return 'other';
}

function normalizeAttemptSubject(attempt: Pick<AttemptRow, 'subject_id' | 'quiz_id'>) {
  // Older Mock Test rows were written with the legacy math subject id.
  if (attempt.quiz_id.startsWith('police-mock_test-')) return 'mock_test';
  if (attempt.quiz_id.startsWith('police-mini_mock-')) return 'mini_mock';
  // ONWR saves its Mini Mock / Mini Drill under generic subject ids; keep them apart from police.
  if (attempt.quiz_id.startsWith('onwr-mini_mock-')) return 'onwr_mini_mock';
  if (attempt.quiz_id.startsWith('onwr-mini_drill-')) return 'onwr_mini_drill';
  // NESDC topic ids (general, saraban, english, computer, org) overlap police/ONWR ones.
  if (attempt.quiz_id.startsWith('nesdc-mini_mock-')) return 'nesdc_mini_mock';
  if (attempt.quiz_id.startsWith('nesdc-mini_drill-')) return 'nesdc_mini_drill';
  const nesdcSet = attempt.quiz_id.match(/^nesdc-([a-z]+)-set-\d{2}$/);
  if (nesdcSet) return `nesdc_${nesdcSet[1]}`;
  if (attempt.quiz_id.startsWith('pat-mini_mock-')) return 'pat_mini_mock';
  const patSet = attempt.quiz_id.match(/^pat-([a-z]+)-set-\d{2}$/);
  if (patSet) return `pat_${patSet[1]}`;
  return attempt.subject_id;
}

function summarizeAttempts(groupAttempts: AttemptRow[]) {
  const questions = groupAttempts.reduce((total, attempt) => total + attempt.total_questions, 0);
  const score = groupAttempts.reduce((total, attempt) => total + attempt.score, 0);
  return { attempts: groupAttempts.length, questions, average: getPercentage(score, questions) };
}

function getPracticeHref(subjectId: string, examSetId?: string | null) {
  if (examSetId?.startsWith('pat-mini_mock-')) return `/courses/pat/mini-mock/${examSetId}`;
  const patSet = examSetId?.match(/^pat-([a-z]+)-set-\d{2}$/);
  if (patSet) return `/courses/pat/${patSet[1]}/exams/${examSetId}`;
  if (subjectId === 'pat_mini_mock') return '/courses/pat#mini';
  if (isPatSubject(subjectId)) return `/courses/pat/${subjectId.slice('pat_'.length)}`;
  if (examSetId?.startsWith('nesdc-mini_mock-')) return `/courses/nesdc/mini-mock/${examSetId}`;
  if (examSetId?.startsWith('nesdc-mini_drill-')) return `/courses/nesdc/mini-drill/${examSetId}`;
  const nesdcSet = examSetId?.match(/^nesdc-([a-z]+)-set-\d{2}$/);
  if (nesdcSet) return `/courses/nesdc/${nesdcSet[1]}/exams/${examSetId}`;
  if (subjectId === 'nesdc_mini_mock') return '/courses/nesdc#mini';
  if (subjectId === 'nesdc_mini_drill') return '/courses/nesdc#drill';
  if (isNesdcSubject(subjectId)) return `/courses/nesdc/${subjectId.slice('nesdc_'.length)}`;
  if (examSetId?.startsWith('onwr-mini_mock-')) return `/courses/onwr/mini-mock/${examSetId}`;
  if (examSetId?.startsWith('onwr-mini_drill-')) return `/courses/onwr/mini-drill/${examSetId}`;
  const onwrSet = examSetId?.match(/^onwr-([a-z]+)-set-\d{2}$/);
  if (onwrSet) return `/courses/onwr/${onwrSet[1]}/exams/${examSetId}`;
  if (subjectId === 'onwr_mini_mock') return '/courses/onwr#mini';
  if (subjectId === 'onwr_mini_drill') return '/courses/onwr#drill';
  if (ONWR_TOPIC_IDS.has(subjectId)) return `/courses/onwr/${subjectId}`;
  if (subjectId === 'mock_test') {
    return examSetId
      ? `/courses/police_admin/mock-test/${examSetId}`
      : '/courses/police_admin/mock-test';
  }
  if (subjectId === 'mini_mock') {
    return examSetId
      ? `/courses/police_admin/mini-mock/${examSetId}`
      : '/courses/police_admin';
  }
  if (examSetId && subjectId === 'math') return `/courses/police_admin/math/exams/${examSetId}`;
  return `/courses/police_admin/${subjectId}`;
}

function getBangkokStudyDate(value: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getDailyStreak(attempts: AttemptRow[]) {
  const practiceDays = new Set(attempts.map((attempt) => getBangkokStudyDate(attempt.created_at)));
  let streak = 0;
  const cursor = new Date(`${getBangkokStudyDate(new Date().toISOString())}T12:00:00Z`);
  while (practiceDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
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

function OverviewNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="9" x="3" y="3" rx="1.5" />
      <rect width="7" height="5" x="14" y="3" rx="1.5" />
      <rect width="7" height="9" x="14" y="12" rx="1.5" />
      <rect width="7" height="5" x="3" y="16" rx="1.5" />
    </svg>
  );
}

function HistoryNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AnalysisNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function ReviewNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M9 10h6" />
      <path d="M12 7v6" />
    </svg>
  );
}

function AttemptsStatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

function QuestionsStatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ScoreStatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function DurationStatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 15 15" />
    </svg>
  );
}

function CheckMarkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowUpRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function ChevronDownIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function EmptyState({ title, children }: { title: string; children: string }) {
  return (
    <div className="dashboard-empty-state">
      <span aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7db298" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      </span>
      <strong>{title}</strong>
      <p>{children}</p>
      <Link href="/courses/police_admin">เลือกชุดข้อสอบ</Link>
    </div>
  );
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

// Course logo (image) or emoji on the course's soft colour.
function CourseMark({ course, size }: { course: DashCourse; size: number }) {
  return (
    <span className={`dbx-mark${course.icon.startsWith('/') ? ' is-logo' : ''}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.5), background: course.icon.startsWith('/') ? '#fff' : course.soft }} aria-hidden="true">
      {course.icon.startsWith('/') ? <img src={course.icon} alt="" /> : course.icon}
    </span>
  );
}

function CourseTag({ course }: { course: DashCourse }) {
  return <span className="dbx-tag" style={{ color: course.accent, background: course.soft }}>{course.short}</span>;
}

// Average score as a small ring.
function ScoreRing({ value, color, label = 'เฉลี่ย' }: { value: number; color: string; label?: string }) {
  const radius = 22;
  const length = 2 * Math.PI * radius;
  return (
    <span className="dbx-ring" aria-label={`${label} ${value}%`}>
      <svg viewBox="0 0 54 54" width="54" height="54" aria-hidden="true">
        <circle cx="27" cy="27" r={radius} fill="none" stroke="#edf0f3" strokeWidth="5" />
        <circle cx="27" cy="27" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(value / 100) * length} ${length}`} transform="rotate(-90 27 27)" />
      </svg>
      <span><strong>{value}%</strong><small>{label}</small></span>
    </span>
  );
}

function AttemptItem({ attempt, title, expanded, onToggle, showCourse = false }: { attempt: AttemptRow; title: string; expanded: boolean; onToggle: () => void; showCourse?: boolean }) {
  const percentage = getPercentage(attempt.score, attempt.total_questions);
  const practiceHref = getPracticeHref(attempt.subject_id, attempt.exam_set_id);

  return (
    <article className={`dashboard-attempt${expanded ? ' is-expanded' : ''}`}>
      <button type="button" className="dashboard-attempt-summary" onClick={onToggle} aria-expanded={expanded}>
        <span className={`activity-icon-wrap is-${percentage >= 70 ? 'good' : 'review'}`} aria-hidden="true">
          {percentage >= 70 ? <CheckMarkIcon size={16} /> : <ArrowUpRightIcon size={16} />}
        </span>
        <span className="activity-info"><strong>{title}</strong><small>{showCourse ? <CourseTag course={dashCourse(courseOfSubject(attempt.subject_id))} /> : null}{formatDate(attempt.created_at, true)} · {attempt.total_questions} ข้อ · {formatDuration(attempt.duration_seconds ?? 0)} นาที</small></span>
        <span className={`activity-score-badge ${percentage >= 70 ? 'green' : 'orange'}`}>{percentage}%</span>
        <span className="dashboard-attempt-chevron" aria-hidden="true"><ChevronDownIcon size={18} /></span>
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
  const [allAttempts, setAttempts] = useState<AttemptRow[]>([]);
  const [courseFilter, setCourseFilter] = useState<DashCourseId | 'all' | null>(null);
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
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const supabase = getSupabase();
  const welcomeHandled = useRef(false);

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
      // Local preview with sample data: /dashboard?demo=1, or ?demo=new for a new account (development builds only).
      const demo = process.env.NODE_ENV === 'development' ? new URLSearchParams(window.location.search).get('demo') : null;
      if (demo === '1' || demo === 'new') {
        const { DEMO_ATTEMPTS } = await import('@/lib/dashboardDemo');
        if (!active) return;
        setUser({ id: 'demo', email: 'demo@example.com', user_metadata: { full_name: 'ผู้ใช้ตัวอย่าง' } } as unknown as User);
        setProfile(null);
        setAttempts((demo === 'new' ? [] : DEMO_ATTEMPTS as AttemptRow[]).map((attempt) => ({ ...attempt, subject_id: normalizeAttemptSubject(attempt) })));
        setReviewQuestions({});
        setExamSetTitles({});
        setLoading(false);
        return;
      }
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

  useEffect(() => {
    if (loading || welcomeHandled.current || allAttempts.length > 0) return;
    welcomeHandled.current = true;
    if (new URLSearchParams(window.location.search).get('welcome') === '1') {
      setShowWelcome(true);
      trackAnalyticsEvent('onboarding_shown');
    }
  }, [allAttempts.length, loading]);

  // Course tab: last choice on this device, else the only course practised, else all courses.
  useEffect(() => {
    if (loading || courseFilter !== null) return;
    let saved: string | null = null;
    try { saved = window.localStorage.getItem('slothmove:dashboard-course'); } catch { /* storage blocked */ }
    const practised = [...new Set(allAttempts.map((attempt) => courseOfSubject(attempt.subject_id)))];
    if (saved === 'all' || DASH_COURSES.some((course) => course.id === saved)) setCourseFilter(saved as DashCourseId | 'all');
    else setCourseFilter(practised.length === 1 ? practised[0] : 'all');
  }, [allAttempts, courseFilter, loading]);

  // Keep the selected course tab visible when the tab row scrolls sideways on phones.
  useEffect(() => {
    document.querySelector('.dbx-tabs .is-active')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [courseFilter]);

  function selectCourse(next: DashCourseId | 'all') {
    setCourseFilter(next);
    setHistoryFilter('all');
    setAnalysisSubjectFilter('all');
    try { window.localStorage.setItem('slothmove:dashboard-course', next); } catch { /* storage blocked */ }
  }

  function selectView(nextView: DashboardView) {
    setView(nextView); setExpandedAttemptId(null);
    const hash = nextView === 'overview' ? '' : nextView;
    window.history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) return <div className="dashboard-loading"><span className="dashboard-loading-spinner" />กำลังเตรียม Dashboard ของคุณ...</div>;
  if (!user) return null;

  const activeFilter = courseFilter ?? 'all';
  const attempts = activeFilter === 'all' ? allAttempts : allAttempts.filter((attempt) => courseOfSubject(attempt.subject_id) === activeFilter);
  const courseSummaries = DASH_COURSES.map((course) => {
    const courseAttempts = allAttempts.filter((attempt) => courseOfSubject(attempt.subject_id) === course.id);
    const summary = summarizeAttempts(courseAttempts);
    return { course, list: courseAttempts, ...summary, last: courseAttempts[0] };
  });
  const practisedCourses = courseSummaries.filter((item) => item.list.length > 0);
  const otherCourses = courseSummaries.filter((item) => item.list.length === 0);
  const focusCourse = activeFilter === 'all' ? null : dashCourse(activeFilter);
  const username = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'สมาชิก';
  const totalQuestions = attempts.reduce((total, attempt) => total + attempt.total_questions, 0);
  const totalScore = attempts.reduce((total, attempt) => total + attempt.score, 0);
  const averageScore = getPercentage(totalScore, totalQuestions);
  const timedAttempts = attempts.filter((attempt) => attempt.duration_seconds !== null);
  const averageDuration = timedAttempts.length > 0 ? Math.round(timedAttempts.reduce((total, attempt) => total + (attempt.duration_seconds ?? 0), 0) / timedAttempts.length) : 0;
  const subjectMap = new Map<string, { score: number; total: number }>();
  const categoryMap = new Map<string, PerformanceStat>();

  // Police mocks spread their category scores over the police subjects; other courses' Mini Mocks stay as one subject.
  const isPoliceMock = (subjectId: string) => subjectId === 'mock_test' || subjectId === 'mini_mock';
  for (const attempt of attempts) {
    if (!isPoliceMock(attempt.subject_id)) {
      const subject = subjectMap.get(attempt.subject_id) ?? { score: 0, total: 0 };
      subject.score += attempt.score; subject.total += attempt.total_questions; subjectMap.set(attempt.subject_id, subject);
    }
    for (const category of attempt.category_results) {
      const categorySubjectId = isPoliceMock(attempt.subject_id)
        ? MOCK_CATEGORY_SUBJECT_IDS[category.category] ?? 'mock_test'
        : attempt.subject_id;
      if (isPoliceMock(attempt.subject_id)) {
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
        isPoliceMock(attempt.subject_id) && attempt.category_results.some((category) => MOCK_CATEGORY_SUBJECT_IDS[category.category] === subject.subjectId)
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
  const latestMockAttempt = mockAttempts[0];
  const mockBenchmark = latestMockAttempt
    ? evaluatePoliceBenchmark(latestMockAttempt.score, latestMockAttempt.total_questions, latestMockAttempt.category_results)
    : null;
  const filteredAttempts = historyFilter === 'all'
    ? attempts
    : historyFilter.startsWith('group:')
      ? attempts.filter((attempt) => getAttemptGroup(attempt.subject_id) === historyFilter.slice(6))
      : attempts.filter((attempt) => attempt.subject_id === historyFilter);
  const getAttemptTitle = (attempt: AttemptRow) => (attempt.exam_set_id && examSetTitles[attempt.exam_set_id]) || SUBJECT_TITLES[attempt.subject_id] || attempt.quiz_id;
  const wrongAnswers = getLatestWrongAnswers(attempts);
  // Shortcuts follow the course the user practised last.
  const lastAttempt = attempts[0];
  const continueHref = lastAttempt ? getPracticeHref(lastAttempt.subject_id, lastAttempt.exam_set_id) : '/courses';
  const dailyStreak = getDailyStreak(attempts);

  function openHistoryGroup(group: AttemptGroup) {
    setHistoryFilter(`group:${group}`);
    selectView('history');
  }

  return (
    <div className="dashboard-layout-wrapper">
      <SiteNav />
      <div className="dashboard-container">
        <aside className="dashboard-sidebar" aria-label="เมนู Dashboard">
          <div className="dashboard-menu">
            <button type="button" className={`dashboard-menu-item${view === 'overview' ? ' active' : ''}`} onClick={() => selectView('overview')}><span><OverviewNavIcon /></span><span>ภาพรวม</span></button>
            <button type="button" className={`dashboard-menu-item${view === 'history' ? ' active' : ''}`} onClick={() => selectView('history')}><span><HistoryNavIcon /></span><span>ประวัติการฝึก</span><b>{attempts.length}</b></button>
            <button type="button" className={`dashboard-menu-item${view === 'analysis' ? ' active' : ''}`} onClick={() => selectView('analysis')}><span><AnalysisNavIcon /></span><span>วิเคราะห์จุดอ่อน</span></button>
            <button type="button" className={`dashboard-menu-item${view === 'review' ? ' active' : ''}`} onClick={() => selectView('review')}><span><ReviewNavIcon /></span><span>สมุดข้อผิด</span><b>{wrongAnswers.length}</b></button>
          </div>
          <div className="dbx-side-courses">
            <span className="dbx-side-title">สนามสอบของฉัน</span>
            {(practisedCourses.length ? practisedCourses : courseSummaries).map(({ course, list: courseAttempts }) => (
              <Link href={course.href} className="dbx-side-course" key={course.id} style={{ '--c': course.accent, '--cs': course.soft } as React.CSSProperties}>
                <CourseMark course={course} size={30} />
                <span><strong>{course.short}</strong><small>{courseAttempts.length ? `ฝึกแล้ว ${courseAttempts.length} ครั้ง` : 'ยังไม่เริ่ม'}</small></span>
                <i aria-hidden="true">›</i>
              </Link>
            ))}
            <Link href="/courses" className="dbx-side-more">+ ดูสนามสอบทั้งหมด</Link>
          </div>
          <CoffeeNudge compact source="dashboard_sidebar" title={attempts.length ? `ฝึกฟรีมาแล้ว ${attempts.length} ครั้ง` : 'เว็บนี้เปิดให้ใช้ฟรี'} text="เลี้ยงกาแฟสักแก้ว ช่วยให้ข้อสอบฟรีต่อไปได้" />
          <a href="https://www.facebook.com/profile.php?id=61589670089745" target="_blank" rel="noopener noreferrer" className="sidebar-help-box"><span>มีคำถามหรือปัญหา?</span><span>ติดต่อทีมงาน ›</span></a>
        </aside>

        <main className="dashboard-content">
          <header className="dashboard-page-header">
            <div className="dashboard-account-heading">
              <div className="dashboard-account-copy"><Link href="/" className="dashboard-home-breadcrumb">← กลับหน้าแรก</Link><span className="dashboard-view-eyebrow">{view === 'overview' ? 'ภาพรวมบัญชี' : view === 'history' ? 'ประวัติทั้งหมด' : view === 'analysis' ? 'วิเคราะห์ผลการฝึก' : 'ทบทวนเฉพาะข้อที่ยังพลาด'}</span><h1>{view === 'overview' ? `สวัสดี, ${username}` : view === 'history' ? 'ประวัติการฝึกของฉัน' : view === 'analysis' ? 'จุดที่ควรฝึกต่อ' : 'สมุดข้อผิดของฉัน'}</h1><p>{view === 'overview' ? 'ติดตามคะแนน เวลา และความก้าวหน้าจากข้อมูลจริงของคุณ' : view === 'history' ? 'เปิดดูผลรายหมวดและกลับไปฝึกชุดเดิมได้ทุกเมื่อ' : view === 'analysis' ? 'เรียงจากหมวดที่คะแนนต่ำ เพื่อช่วยเลือกสิ่งที่ควรทบทวนก่อน' : 'ข้อที่ตอบถูกในภายหลังจะถูกนำออก เพื่อให้เหลือเฉพาะจุดที่ควรทบทวน'}</p></div>
              <div className="dashboard-account-actions"><Link href={continueHref} className="dashboard-primary-action">{lastAttempt ? 'ทำข้อสอบต่อ' : 'เลือกสนามสอบ'} <span aria-hidden="true">→</span></Link><button type="button" className="dashboard-refresh-button" onClick={() => setReloadToken((value) => value + 1)}>↻ อัปเดตข้อมูล</button><span className={`account-role-badge is-${profile?.role ?? 'user'}`}>{profile?.role === 'admin' ? 'ADMIN' : 'สมาชิก'}</span>{profile?.role === 'admin' ? <Link href="/admin">ระบบจัดการ →</Link> : null}</div>
            </div>
          </header>
          {syncMessage ? <div className="dashboard-sync-message" role="status">✓ {syncMessage}</div> : null}
          {dataError ? <div className="dashboard-data-error" role="alert"><span>{dataError}</span><button type="button" onClick={() => setReloadToken((value) => value + 1)}>ลองใหม่</button></div> : null}

          {practisedCourses.length > 1 || (focusCourse && !practisedCourses.some((item) => item.course.id === focusCourse.id)) ? (
            <nav className="dbx-tabs" aria-label="เลือกสนามสอบ">
              <button type="button" className={activeFilter === 'all' ? 'is-active' : ''} onClick={() => selectCourse('all')}>ทุกสนาม<b>{allAttempts.length}</b></button>
              {practisedCourses.map(({ course, list: courseAttempts }) => (
                <button type="button" key={course.id} className={activeFilter === course.id ? 'is-active' : ''} style={{ '--c': course.accent, '--cs': course.soft } as React.CSSProperties} onClick={() => selectCourse(course.id)}>
                  <i aria-hidden="true" />{course.short}<b>{courseAttempts.length}</b>
                </button>
              ))}
            </nav>
          ) : null}

          {view === 'overview' ? <>
              {showWelcome ? <section className="dashboard-welcome-plan" aria-label="เริ่มฝึกครั้งแรก">
                <div><span>เริ่มต้นวันนี้</span><h2>เลือกสนามสอบ แล้วทำชุดสั้น ๆ ชุดแรก</h2><p>ผลสอบชุดแรกจะบอกว่าควรฝึกวิชาไหนต่อ ทุกชุดฝึกฟรี</p></div>
                <div className="dashboard-welcome-actions"><Link href="/courses" onClick={() => trackAnalyticsEvent('onboarding_start_click', { destination: 'courses' })}>เลือกสนามสอบ <span aria-hidden="true">→</span></Link><button type="button" onClick={() => { trackAnalyticsEvent('onboarding_dismissed'); setShowWelcome(false); router.replace('/dashboard'); }}>ไว้ทีหลัง</button></div>
              </section> : null}

            {focusCourse === null ? (
              <section className="dbx-section" aria-labelledby="my-courses-title">
                <div className="dbx-section-head"><h2 id="my-courses-title">{practisedCourses.length ? 'สนามสอบของฉัน' : 'เลือกสนามสอบเพื่อเริ่มฝึก'}</h2><span>{practisedCourses.length ? 'กดการ์ดเพื่อดูผลเฉพาะสนามนั้น' : 'ทุกสนามฝึกฟรี ผลสอบจะมาแสดงที่นี่'}</span></div>
                <div className="dbx-course-grid">
                  {practisedCourses.map(({ course, list: courseAttempts, questions, average, last }) => (
                    <article className="dbx-course-card" key={course.id} style={{ '--c': course.accent, '--cs': course.soft } as React.CSSProperties}>
                      <button type="button" className="dbx-course-main" onClick={() => selectCourse(course.id)}>
                        <CourseMark course={course} size={44} />
                        <span className="dbx-course-name"><small>{course.agency}</small><strong>{course.name}</strong></span>
                        <ScoreRing value={average} color={course.accent} />
                      </button>
                      <dl className="dbx-course-stats">
                        <div><dt>ฝึกแล้ว</dt><dd>{courseAttempts.length} ครั้ง</dd></div>
                        <div><dt>ทำไปแล้ว</dt><dd>{questions.toLocaleString('th-TH')} ข้อ</dd></div>
                        <div><dt>ล่าสุด</dt><dd>{last ? formatDate(last.created_at) : '–'}</dd></div>
                      </dl>
                      <div className="dbx-course-actions">
                        {last ? <Link href={getPracticeHref(last.subject_id, last.exam_set_id)} className="dbx-btn is-solid">ทำต่อ →</Link> : null}
                        <Link href={course.href} className="dbx-btn">หน้าคอร์ส</Link>
                      </div>
                    </article>
                  ))}
                  {!practisedCourses.length ? otherCourses.map(({ course }) => (
                    <article className="dbx-course-card" key={course.id} style={{ '--c': course.accent, '--cs': course.soft } as React.CSSProperties}>
                      <Link href={course.href} className="dbx-course-main">
                        <CourseMark course={course} size={44} />
                        <span className="dbx-course-name"><small>{course.agency}</small><strong>{course.name}</strong></span>
                      </Link>
                      <div className="dbx-course-actions"><Link href={course.href} className="dbx-btn is-solid">เริ่มฝึกฟรี →</Link></div>
                    </article>
                  )) : otherCourses.length ? (
                    <div className="dbx-course-add">
                      <strong>{practisedCourses.length ? 'เพิ่มสนามสอบ' : 'สนามสอบที่เปิดอยู่'}</strong>
                      <span>ฝึกฟรีทุกชุด เลือกสนามที่สนใจได้เลย</span>
                      {otherCourses.map(({ course }) => (
                        <Link href={course.href} key={course.id} style={{ '--c': course.accent, '--cs': course.soft } as React.CSSProperties}><CourseMark course={course} size={26} />{course.short}<i aria-hidden="true">→</i></Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {focusCourse ? (
              <section className="dbx-focus" style={{ '--c': focusCourse.accent, '--cs': focusCourse.soft } as React.CSSProperties} aria-label={`สรุป ${focusCourse.name}`}>
                <CourseMark course={focusCourse} size={52} />
                <div className="dbx-focus-copy">
                  <small>{focusCourse.agency}</small>
                  <h2>{focusCourse.name}</h2>
                  <p>{attempts.length ? `ฝึกแล้ว ${attempts.length} ครั้ง · ล่าสุด ${formatDate(attempts[0].created_at)}` : 'ยังไม่ได้เริ่มฝึกสนามนี้'}</p>
                </div>
                <ScoreRing value={attempts.length ? averageScore : 0} color={focusCourse.accent} label={attempts.length ? 'เฉลี่ย' : 'ยังไม่มีผล'} />
                <div className="dbx-focus-actions">
                  <Link href={attempts[0] ? getPracticeHref(attempts[0].subject_id, attempts[0].exam_set_id) : focusCourse.href} className="dbx-btn is-solid">{attempts[0] ? 'ทำต่อ →' : 'เริ่มฝึก →'}</Link>
                  <Link href={focusCourse.href} className="dbx-btn">หน้าคอร์ส</Link>
                </div>
              </section>
            ) : null}

            <section className="stats-section" aria-labelledby="stats-title"><div className="dbx-section-head"><h2 id="stats-title">{focusCourse ? `ภาพรวม ${focusCourse.short}` : 'ภาพรวมทุกสนาม'}</h2><span>จาก {attempts.length} ครั้ง</span></div><div className="stats-grid">
              <button type="button" className="stat-card" onClick={() => selectView('history')}><span className="stat-icon crimson"><AttemptsStatIcon /></span><span><strong className="stat-value">{attempts.length}<small>ครั้ง</small></strong><span className="stat-label">ทำข้อสอบ</span></span></button>
              <button type="button" className="stat-card" onClick={() => selectView('history')}><span className="stat-icon blue"><QuestionsStatIcon /></span><span><strong className="stat-value">{totalQuestions.toLocaleString('th-TH')}<small>ข้อ</small></strong><span className="stat-label">ข้อที่ทำ</span></span></button>
              <button type="button" className="stat-card" onClick={() => selectView('analysis')}><span className="stat-icon orange"><ScoreStatIcon /></span><span><strong className="stat-value">{averageScore}%</strong><span className="stat-label">คะแนนเฉลี่ย</span></span></button>
              <div className="stat-card"><span className="stat-icon purple"><DurationStatIcon /></span><span><strong className="stat-value">{dailyStreak}<small>วัน</small></strong><span className="stat-label">ฝึกต่อเนื่อง</span></span></div>
            </div></section>

            <div className="dbx-next-grid">
                {wrongAnswers.length > 0 ? <button type="button" className="dashboard-review-summary" onClick={() => selectView('review')}><span className="dashboard-review-summary-icon" aria-hidden="true"><ReviewNavIcon /></span><span><strong>มีข้อที่ควรทบทวน {wrongAnswers.length} ข้อ</strong><small>เปิดสมุดข้อผิดเพื่ออ่านเฉลย แล้วกลับไปฝึกวิชานั้นได้ทันที</small></span><i aria-hidden="true">→</i></button> : null}
            </div>

            <div className="bottom-sections-grid">
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">ควรฝึกอะไรต่อ</h2><p className="chart-subtitle">หมวดที่คะแนนต่ำที่สุด{focusCourse ? ` ใน${focusCourse.short}` : ''}</p></div><button type="button" className="chart-btn-detail" onClick={() => selectView('analysis')}>ดูทั้งหมด</button></div>{weaknesses.length > 0 ? <div className="weakness-list">{weaknesses.slice(0, 4).map((item) => { const course = dashCourse(courseOfSubject(item.subjectId)); return <div className="weakness-row" key={item.id}><div className="weakness-subject"><span className="weakness-number"><SubjectIcon subjectId={item.subjectId} size={16} /></span><span className="weakness-name">{item.title}<small>{focusCourse ? '' : <CourseTag course={course} />}{SUBJECT_TITLES[item.subjectId] ?? item.subjectId}</small></span></div><div className="weakness-stats"><div className="weakness-score">{item.percentage}%<span>{item.score}/{item.total} ข้อ</span></div><Link href={getPracticeHref(item.subjectId)} className="weakness-btn-action">ฝึกต่อ</Link></div></div>; })}</div> : <EmptyState title="ข้อมูลยังไม่พอ">ส่งข้อสอบอย่างน้อยหนึ่งครั้งเพื่อวิเคราะห์จุดอ่อน</EmptyState>}</section>
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">การฝึกล่าสุด</h2><p className="chart-subtitle">กดรายการเพื่อดูผลแยกหมวด</p></div><button type="button" className="chart-btn-detail" onClick={() => selectView('history')}>ดูทั้งหมด</button></div>{recentAttempts.length > 0 ? <div className="dashboard-attempt-list">{recentAttempts.slice(0, 4).map((attempt) => <AttemptItem key={attempt.id} attempt={attempt} title={getAttemptTitle(attempt)} showCourse={!focusCourse} expanded={expandedAttemptId === attempt.id} onToggle={() => setExpandedAttemptId((current) => current === attempt.id ? null : attempt.id)} />)}</div> : <EmptyState title="ยังไม่มีประวัติ">เริ่มทำข้อสอบเพื่อดูคะแนนและรายละเอียดที่นี่</EmptyState>}</section>
            </div>

            <div className="charts-grid">
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">คะแนนเฉลี่ยแยกตามวิชา</h2><p className="chart-subtitle">คำนวณจากคำตอบทุกครั้งในบัญชีนี้</p></div><button type="button" className="chart-btn-detail" onClick={() => selectView('analysis')}>ดูการวิเคราะห์</button></div>{subjectStats.length > 0 ? <div className="bar-chart-container">{subjectStats.map((subject) => <div className="bar-item" key={subject.id}><span className="bar-label">{focusCourse ? null : <CourseTag course={dashCourse(courseOfSubject(subject.subjectId))} />}{subject.title}</span><span className="bar-track"><i className="bar-fill" style={{ width: `${subject.percentage}%` }} /></span><strong className="bar-val">{subject.percentage}%</strong></div>)}</div> : <EmptyState title="ยังไม่มีคะแนน">ทำข้อสอบชุดแรกเพื่อเริ่มสร้างสถิติรายวิชา</EmptyState>}</section>
              <section className="chart-card"><div className="chart-header"><div><h2 className="chart-title">แนวโน้มความแม่นยำ</h2><p className="chart-subtitle">เรียงตามเวลา สูงสุด 7 ครั้งล่าสุด</p></div></div>{trendAttempts.length > 0 ? <div className="dashboard-trend-chart"><div className="trend-scale"><span>100%</span><span>50%</span><span>0%</span></div><div className="trend-bars">{trendAttempts.map((attempt) => { const percentage = getPercentage(attempt.score, attempt.total_questions); return <div className="trend-column" key={attempt.id} title={`${formatDate(attempt.created_at)}: ${percentage}%`}><span>{percentage}%</span><i><b style={{ height: `${Math.max(percentage, 4)}%` }} /></i><small>{formatDate(attempt.created_at)}</small></div>; })}</div></div> : <EmptyState title="ยังไม่มีแนวโน้ม">คะแนนแต่ละครั้งจะปรากฏที่นี่หลังส่งข้อสอบ</EmptyState>}</section>
            </div>

            {activeFilter === 'police_admin' ? (
            <section className="dashboard-benchmark-section" aria-label="การประเมินเกณฑ์สอบตำรวจ">
              <div className="dashboard-section-heading is-benchmark-heading">
                <div>
                  <h2 className="dashboard-section-title">
                    การประเมินเกณฑ์สอบตำรวจ & โอกาสสอบติด (สายอำนวยการ)
                  </h2>
                  <p className="dashboard-section-subtitle">
                    วิเคราะห์เกณฑ์ขั้นต่ำ ภาค ก (60%) + ภาค ข (60%) และเทียบสถิติตัวจริงปี 62 และ 65
                  </p>
                </div>
                {mockBenchmark ? (
                  <span className={`dashboard-benchmark-tag is-${mockBenchmark.zone}`}>
                    {mockBenchmark.zoneLabel}
                  </span>
                ) : (
                  <span className="dashboard-benchmark-tag is-pending">
                    ยังไม่มีผลสอบจำลอง
                  </span>
                )}
              </div>

              <div className="dashboard-benchmark-card">
                {mockBenchmark ? (
                  <>
                    <div className="dashboard-benchmark-summary-row">
                      <div className="dashboard-benchmark-rank-badge">
                        <span className="dashboard-benchmark-kicker-label">ประมาณการอันดับจากการสอบล่าสุด</span>
                        <div className={`rank-value is-${mockBenchmark.zone}`}>
                          {mockBenchmark.zoneBadge}
                        </div>
                        <small>ประมาณการ: {mockBenchmark.estimatedRankText}</small>
                      </div>

                      <div className="dashboard-benchmark-cutoffs-box">
                        <div className="dashboard-cutoff-stat">
                          <span>คะแนนของคุณ</span>
                          <strong className="is-user">{mockBenchmark.score} / {mockBenchmark.total}</strong>
                          <small>{mockBenchmark.percentage}%</small>
                        </div>
                        <div className="dashboard-cutoff-divider" />
                        <div className="dashboard-cutoff-stat">
                          <span>ต่ำสุดปี 62</span>
                          <strong>107</strong>
                          <small>71.3% (รับ 350)</small>
                        </div>
                        <div className="dashboard-cutoff-divider" />
                        <div className="dashboard-cutoff-stat">
                          <span>ต่ำสุดปี 65</span>
                          <strong className="is-highlight">117</strong>
                          <small>78.0% (รับ 725)</small>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-dual-cutoff-wrap">
                      <div className="dashboard-dual-cutoff-header">
                        <strong>เกณฑ์ตัดผ่าน 60% สองภาควิชา (ระเบียบ ตร.)</strong>
                        {mockBenchmark.isOfficialPassed ? (
                          <span className="status-pass">✓ ผ่านทั้งสองภาค</span>
                        ) : (
                          <span className="status-fail">✕ ยังไม่ผ่านเกณฑ์คู่</span>
                        )}
                      </div>
                      <div className="dashboard-dual-cutoff-grid">
                        <div className={`dashboard-part-stat ${mockBenchmark.partA.isPassed ? 'is-pass' : 'is-fail'}`}>
                          <div className="dashboard-part-label">
                            <strong>ภาค ก (ความรู้ทั่วไป + ไทย)</strong>
                            <span>{mockBenchmark.partA.correct}/{mockBenchmark.partA.total} ข้อ ({mockBenchmark.partA.percentage}%)</span>
                          </div>
                          <div className="dashboard-part-track">
                            <i style={{ width: `${Math.min(100, mockBenchmark.partA.percentage)}%` }} />
                            <div className="dashboard-part-marker" style={{ left: '60%' }} title="เกณฑ์ผ่าน 60% (24 ข้อ)" />
                          </div>
                          <small>{mockBenchmark.partA.isPassed ? `✓ ผ่านเกณฑ์ (เกินเกณฑ์ ${mockBenchmark.partA.scoreDiff} ข้อ)` : `✕ ขาดอีก ${Math.abs(mockBenchmark.partA.scoreDiff)} ข้อ เพื่อแตะ 60% (${mockBenchmark.partA.passingScore} ข้อ)`}</small>
                        </div>

                        <div className={`dashboard-part-stat ${mockBenchmark.partB.isPassed ? 'is-pass' : 'is-fail'}`}>
                          <div className="dashboard-part-label">
                            <strong>ภาค ข (วิชาการ + กฎหมาย + อังกฤษ)</strong>
                            <span>{mockBenchmark.partB.correct}/{mockBenchmark.partB.total} ข้อ ({mockBenchmark.partB.percentage}%)</span>
                          </div>
                          <div className="dashboard-part-track">
                            <i style={{ width: `${Math.min(100, mockBenchmark.partB.percentage)}%` }} />
                            <div className="dashboard-part-marker" style={{ left: '60%' }} title="เกณฑ์ผ่าน 60% (66 ข้อ)" />
                          </div>
                          <small>{mockBenchmark.partB.isPassed ? `✓ ผ่านเกณฑ์ (เกินเกณฑ์ ${mockBenchmark.partB.scoreDiff} ข้อ)` : `✕ ขาดอีก ${Math.abs(mockBenchmark.partB.scoreDiff)} ข้อ เพื่อแตะ 60% (${mockBenchmark.partB.passingScore} ข้อ)`}</small>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-benchmark-footer">
                      <p>{mockBenchmark.advice}</p>
                      <Link href="/courses/police_admin/mock-test" className="dashboard-benchmark-action-btn">
                        ทดสอบใหม่เพื่อไต่อันดับ →
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="dashboard-benchmark-empty">
                    <div className="dashboard-benchmark-empty-copy">
                      <span className="dashboard-benchmark-empty-kicker">Target Cutoff Benchmark</span>
                      <h3>เป้าหมายคะแนนตัวจริง: 117+ / 150</h3>
                      <p>
                        การสอบสายอำนวยการมีผู้สมัครกว่า 1.35 แสนคน ต้องผ่านทั้งภาค ก (≥24 ข้อ) และ ภาค ข (≥66 ข้อ) 
                        และทำคะแนนรวมให้ถึง 117 ขึ้นไปเพื่อการันตีตัวจริง ลองทำ Mock Test เต็มรูปแบบเพื่อดูโอกาสสอบติดของคุณ
                      </p>
                    </div>
                    <div className="dashboard-benchmark-empty-cutoffs">
                      <div><span>เกณฑ์ผ่านคู่</span><strong>90 / 150</strong></div>
                      <div><span>ต่ำสุดปี 62</span><strong>107 / 150</strong></div>
                      <div><span>เป้าหมายปี 65</span><strong className="is-highlight">117 / 150</strong></div>
                    </div>
                    <Link href="/courses/police_admin/mock-test" className="dashboard-benchmark-start-btn">
                      เริ่มทำ Mock Test 150 ข้อ →
                    </Link>
                  </div>
                )}
              </div>
            </section>
            ) : null}
          </> : null}

          {view === 'history' ? <section className="dashboard-view-card"><div className="dashboard-view-toolbar"><div><h2>รายการทั้งหมด</h2><p>{filteredAttempts.length} จาก {attempts.length} ครั้ง</p></div><label>กรองประวัติ<select value={historyFilter} onChange={(event) => setHistoryFilter(event.target.value)}><option value="all">ทุกกิจกรรม</option><optgroup label="รูปแบบการฝึก"><option value="group:subject">ฝึกแยกวิชา ({subjectSummary.attempts})</option><option value="group:mock">Mini Mock + Mock Test ({mockSummary.attempts})</option><option value="group:other">กิจกรรมอื่น ๆ ({otherSummary.attempts})</option></optgroup>{subjectFilters.length > 0 ? <optgroup label="เลือกเฉพาะวิชา">{subjectFilters.map((subjectId) => <option value={subjectId} key={subjectId}>{focusCourse ? '' : `${dashCourse(courseOfSubject(subjectId)).short} · `}{SUBJECT_TITLES[subjectId] ?? subjectId}</option>)}</optgroup> : null}</select></label></div>{filteredAttempts.length > 0 ? <div className="dashboard-attempt-list is-full">{filteredAttempts.map((attempt) => <AttemptItem key={attempt.id} attempt={attempt} title={getAttemptTitle(attempt)} showCourse={!focusCourse} expanded={expandedAttemptId === attempt.id} onToggle={() => setExpandedAttemptId((current) => current === attempt.id ? null : attempt.id)} />)}</div> : <EmptyState title="ไม่พบประวัติ">ยังไม่มีผลสอบตรงกับตัวกรองที่เลือก</EmptyState>}</section> : null}

          {view === 'analysis' ? (
            <div className="dashboard-analysis-layout">
              <section className="dashboard-view-card">
                <div className="dashboard-view-toolbar">
                  <div><h2>วิเคราะห์แยกตามวิชา</h2><p>ภายในแต่ละวิชาเรียงหมวดที่ควรปรับปรุงก่อน</p></div>
                  <label>
                    เลือกวิชา
                    <select value={analysisSubjectFilter} onChange={(event) => setAnalysisSubjectFilter(event.target.value)}>
                      <option value="all">ทุกวิชา ({subjectAnalysis.length})</option>
                      {subjectAnalysis.map((subject) => <option value={subject.subjectId} key={subject.subjectId}>{focusCourse ? '' : `${dashCourse(courseOfSubject(subject.subjectId)).short} · `}{subject.title}</option>)}
                    </select>
                  </label>
                </div>
                {visibleSubjectAnalysis.length > 0 ? (
                  <div className="subject-analysis-list">
                    {visibleSubjectAnalysis.map((subject) => (
                      <article className="subject-analysis-card" key={subject.subjectId}>
                        <header className="subject-analysis-head">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 38,
                              height: 38,
                              borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: dashCourse(courseOfSubject(subject.subjectId)).soft,
                              color: dashCourse(courseOfSubject(subject.subjectId)).accent,
                              flexShrink: 0
                            }}>
                              <SubjectIcon subjectId={subject.subjectId} size={20} />
                            </div>
                            <div>
                              <span>{dashCourse(courseOfSubject(subject.subjectId)).short} · วิชา</span>
                              <h3>{subject.title}</h3>
                              <p>ฝึกแล้ว {subject.attemptCount} ครั้ง · ตอบถูก {subject.score} จาก {subject.total} ข้อ</p>
                            </div>
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
                <Link href={weaknesses[0] ? getPracticeHref(weaknesses[0].subjectId) : focusCourse?.href ?? '/courses'}>ไปหน้าฝึก →</Link>
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
                return <article className="dashboard-wrong-book-item" key={answer.question_id}><header>{focusCourse ? null : <CourseTag course={dashCourse(courseOfSubject(attempt.subject_id))} />}<span>{subjectTitle}</span><small>{question?.category ?? answer.category}</small><time>{formatDate(attempt.created_at)}</time></header><h3>{question?.prompt ?? 'กำลังโหลดรายละเอียดข้อสอบ...'}</h3><div className="dashboard-wrong-book-answers"><p><span>คำตอบของคุณ</span><strong className="is-wrong">{selectedChoice}</strong></p><p><span>คำตอบที่ถูก</span><strong className="is-correct">{correctChoice}</strong></p></div>{question?.explanation ? <p className="dashboard-wrong-book-explanation">{question.explanation}</p> : null}<Link href={getPracticeHref(attempt.subject_id, attempt.exam_set_id)} className="dashboard-wrong-book-action">กลับไปฝึกวิชานี้ →</Link></article>;
              })}</div> : <EmptyState title="สมุดข้อผิดว่างแล้ว">เมื่อทำข้อที่เคยพลาดได้ถูกต้อง ข้อนั้นจะหายจากรายการนี้</EmptyState>}
            </section>
          ) : null}

          <div className="footer-banner-cta"><div className="footer-banner-left"><div className="footer-banner-icon"><CheckMarkIcon size={22} /></div><div className="footer-banner-info"><h2>{attempts.length > 0 ? 'พร้อมพัฒนาคะแนนต่อหรือยัง?' : 'เริ่มเก็บผลการฝึกครั้งแรก'}</h2><p>ทุกครั้งที่ส่งข้อสอบ ระบบจะอัปเดต Dashboard ให้อัตโนมัติ</p></div></div><Link href={focusCourse?.href ?? '/courses'} className="footer-banner-btn">{focusCourse ? `ไปหน้าคอร์ส ${focusCourse.short}` : 'ดูสนามสอบทั้งหมด'} <span aria-hidden="true">→</span></Link></div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
