/**
 * Shared TypeScript types for the multi-course platform.
 *
 * Every course uses the same shape — only the data changes.
 * This is the contract between `courses/<id>/config.ts` and the
 * shared components in `components/course/`.
 */

export type GameId =
  | 'quiz'
  | 'flashcard'
  | 'match'
  | 'cloze'
  | 'sorting'
  | 'order'
  | 'spelling'
  | 'truefalse'
  | 'authority'
  | 'logic'
  // New games added during police_admin migration. These will only
  // resolve to real data once their components are built (Phase B/C).
  | 'analogy'
  | 'series'
  | 'compare-values'
  | 'word-problem'
  | 'speed-percent'
  | 'number-match'
  | 'process-sort'
  | 'computer-logic'
  | 'dialogue'
  | 'error-detector'
  | 'flashcard-review'
  | 'survival'
  | 'speed'
  | 'review'
  | 'matrix'
  | 'logic-grid'
  | 'symbol-chain'
  | 'reading-detective';

export interface GameMeta {
  id: GameId;
  label: string;
  /** Thai label shown in nav and cards */
  labelTh: string;
  /** Emoji icon */
  icon: string;
  /** Short description (1 line) */
  desc: string;
  /** Whether the template is fully built or just a skeleton */
  status: 'full' | 'skeleton';
}

export interface SubjectMeta {
  /** URL-safe id, e.g. "budget_act" */
  id: string;
  /** Display name in Thai */
  title: string;
  /** Optional English/transliteration */
  titleEn?: string;
  /** Short description (1-2 lines) */
  desc: string;
  /** Emoji or icon */
  icon?: string;
  /** Optional mascot image path (used in subject page hero) */
  mascot?: string;
  /** Number of questions/items in this subject's data */
  count: number;
  /** Optional per-subject visible games.
   *  When omitted, the subject page falls back to showing every game
   *  registered at the course level. */
  games?: GameId[];
}

export interface CourseLandingStat {
  value: string;
  label: string;
}

export interface CourseLandingFeature {
  icon: string;
  chip: string;
  title: string;
  desc: string;
  meta: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface CourseLandingSection {
  id: string;
  chip: string;
  title: string;
  subtitle: string;
  partClass: 'part1' | 'part2';
  partLabel: string;
  subjectIds: string[];
  categoryLabel: string;
}

export interface CourseLandingConfig {
  heroBadge: string;
  heroTitleLead: string;
  heroTitleLines: string[];
  heroTitleAccent?: string;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  mascotLabel?: string;
  scrollLabel?: string;
  stats: CourseLandingStat[];
  feature?: CourseLandingFeature;
  sections: CourseLandingSection[];
}

export interface CourseMeta {
  /** SEO description */
  description: string;
  /** SEO keywords */
  keywords: string[];
  /** Last updated date (DD/MM/YY) */
  updated: string;
  /** Total counts */
  totalSubjects: number;
  totalQuestions: number;
  /** Hide question totals from marketing/course overview surfaces. */
  hideQuestionCounts?: boolean;
  /** True when the course has real, per-subject content migrated into the
   *  platform's data pipeline. False = config-only placeholder (counts may
   *  be aspirational, no quiz/match/etc data yet). Drives "coming soon"
   *  UI on the platform — be honest and flip this only when loaders exist. */
  migrated?: boolean;
  /** Short, user-facing note shown on the course landing when not migrated. */
  migrationNote?: string;
  /** Optional shared landing configuration for a richer course page. */
  landing?: CourseLandingConfig;
}

export interface CourseConfig {
  /** URL-safe id, e.g. "pab", "opsd", "industry" */
  id: string;
  /** Display title */
  title: string;
  /** Short tagline (1 line) */
  tagline: string;
  /** Longer subtitle (1-2 lines) */
  subtitle: string;
  /** Category label (ministry name) */
  category: string;
  /** Position type (e.g. "ข้าราชการพลเรือนสามัญ") */
  type: string;
  /** Theme tokens */
  theme: import('./course-theme').CourseTheme;
  /** List of subjects */
  subjects: SubjectMeta[];
  /** Enabled games (in display order) */
  games: GameMeta[];
  /** Metadata for SEO */
  meta: CourseMeta;
  /** Optional custom route to the original source folder (e.g. "PAB") */
  sourceFolder?: string;
  /** Hide from course registry (e.g. not yet migrated) */
  hidden?: boolean;
  /** Whether the course uses the Drill-style practice navigation bar */
  useDrillNav?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          Content data shapes (per game)                    */
/* -------------------------------------------------------------------------- */

/** Multiple-choice quiz question */
export interface QuizItem {
  /** The question text (matches original `question` field in PAB data) */
  question: string;
  /** Multiple-choice options */
  choices: string[];
  /** 0-based index of correct answer */
  answer: number;
  /** Optional explanation (matches `explanation` in original) */
  explanation?: string;
  /** Optional reading passage — used by reading-comprehension subjects
   *  (e.g. OPSD `english`) where each question is tied to a passage. */
  passage?: string;
  /** Optional title for `passage`. */
  passage_title?: string;
  /** Optional hint (police_admin math questions include `hint` field) */
  hint?: string;
  /** Optional category tag (e.g. 'math' | 'series' | 'analogy' for
   *  police_admin) — used by derived game components to show
   *  pattern badges and route questions to specialized games. */
  category?: string;
  /** Optional pattern tag (e.g. 'relationship' | 'letter' | 'percentage')
   *  — used by AnalogyGame / SeriesGame to show what type of question
   *  this is (active-recall pattern). */
  pattern?: string;
  /** Optional multi-label theme tags (e.g. 'public_administration',
   *  'good_governance', 'strategic_planning'). One item can belong to
   *  multiple themes — used by QuizGame / FlashcardGame / MatchGame /
   *  ClozeGame to filter by topic without splitting data into separate
   *  arrays (which would lose multi-label context). */
  themes?: string[];
}

/** Flashcard: front + back */
export interface FlashcardItem {
  front: string;
  back: string;
  tag?: string;
}

/** Match: pair of terms */
export interface MatchPair {
  left: string;
  right: string;
}

/** Cloze: text with `___` blanks, choices include correct answers */
export interface ClozeItem {
  text: string;
  /** Ordered list of missing words (left-to-right) */
  blanks: string[];
  /** Distractor options to show */
  options?: string[];
}

/** Sorting: reorder items by importance/size/value (drag-or-click) */
export interface SortingItem {
  /** คำศัพท์ที่ต้องนำไปจัดหมวดหมู่ */
  word: string;
  /** รหัสหมวดหมู่ */
  category: string;
  /** ชื่อหมวดหมู่ที่ใช้แสดงผล */
  categoryName: string;
  /** คำอธิบายข้อเฉลยเพิ่มเติม */
  explanation?: string;
}

/** Order: arrange steps in the correct sequence (drag-or-click) */
export interface OrderItem {
  /** Question prompt */
  question: string;
  /** Steps in correct order */
  steps: string[];
  /** Optional explanation */
  explain?: string;
}

/** Spelling: unscramble letters to form a word matching the definition */
export interface SpellingItem {
  /** The word to spell (the answer) or the word presented for validation */
  word: string;
  /** Definition / clue shown to the user (optional for bomb defusal) */
  definition?: string;
  /** Optional hint (first letter, syllable count, etc.) */
  hint?: string;
  /** Optional true/false flag for bomb defusal validation */
  isCorrectSpelling?: boolean;
  /** Correct spelling equivalent */
  correctSpelling?: string;
  /** Rule or explanation of the spelling */
  rule?: string;
}

/** True / False: judge whether a statement is correct */
export interface TrueFalseItem {
  /** Statement to evaluate */
  statement: string;
  /** Correct answer: true or false */
  answer: boolean;
  /** Optional explanation shown after answering */
  explain?: string;
}

/** Authority: alias to MatchPair (organize agencies ↔ missions).
 *  Using a distinct type for clarity at call-sites. */
export type AuthorityItem = MatchPair;

/** Logic: pattern/sequence question with multiple-choice answer */
export interface LogicItem {
  /** Question/prompt describing the pattern */
  question: string;
  /** Multiple-choice options (4 recommended) */
  options: string[];
  /** 0-based index of correct answer */
  answer: number;
  /** Optional explanation */
  explain?: string;
}

export interface QuickJudgeItem {
  statement: string;
  conclusion1: string;
  conclusion2: string;
  answer1: 'true' | 'false' | 'uncertain';
  answer2: 'true' | 'false' | 'uncertain';
  correctOption: number; // 1, 2, 3, 4
  explanation?: string;
  hint?: string;
}

export interface LogicGridItem {
  title: string;
  description: string;
  clues: string[];
  rows: string[];
  columns: string[];
  solution: Record<string, string>;
  explanation: string;
}

export interface SymbolChainItem {
  statement: string;
  conclusion: string;
  targetStart: string;
  targetEnd: string;
  possibleChains: string[];
  correctAnswer: 'true' | 'false' | 'uncertain';
  explanation: string;
}
