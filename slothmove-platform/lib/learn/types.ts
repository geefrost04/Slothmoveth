// Content model shared by the tutor-style courses (/courses/nesdc/learn, /courses/police_admin/learn).
// Lessons and summaries are plain data; components/learn renders them.
// Text fields accept **bold** only. Every block that states a fact carries refs (doc id from the
// course's source index + PDF page, or มาตรา); scripts/learn/check-content.mjs enforces this.

/** Topic id within a course, e.g. "n" (สศช.) or "pc" (police computer). */
export type TopicId = string;

/** Our estimate of how likely a lesson or section is to be examined. */
export type Priority = 'must' | 'maybe' | 'skip';

/** A citation: `doc` is an id in the course's source index, `page` the PDF page (or "12–14", or "มาตรา 15"). */
export type Ref = { doc: string; page?: number | string };

/** Tone of a box in a ladder or flow diagram, from darkest to lightest. */
export type Tone = 'ink' | 'deep' | 'purple' | 'soft' | 'white' | 'outline';

export type MCQ = {
  id: string; // unique across the course, e.g. "n1-c1" (check) or "n1-t03" (test)
  q: string;
  choices: string[]; // 4 choices, shown in this order (positions are authored, not shuffled)
  answer: number; // index of the correct choice
  why: string; // shown after answering: why the key is right and why the main traps are wrong
  refs: Ref[];
  /** General knowledge with no official document (e.g. computer basics): refs may be empty. */
  plain?: true;
};

export type Block =
  /** A white card section. `anchor` makes it a jump target in the sticky header. */
  | { type: 'section'; anchor?: string; eyebrow?: string; title?: string; priority?: Priority; body?: string[]; blocks?: Block[]; refs?: Ref[]; plain?: true }
  /** Plain paragraphs (inside a section or on the page). */
  | { type: 'text'; body: string[]; muted?: boolean; refs?: Ref[]; plain?: true }
  /** Grey note box inside a card. */
  | { type: 'note'; title?: string; body: string; refs?: Ref[]; plain?: true }
  /** Dark context card ("ทำไมแผน 13 ถึงชื่อว่า…"). */
  | { type: 'context'; title: string; body: string[]; refs?: Ref[]; plain?: true }
  /** "ข้อมูล ณ …" stamp for anything that describes the current situation. */
  | { type: 'asOf'; date: string; note?: string }
  /** Vertical ladder of levels joined by connectors (the 3-level plan diagram). */
  | { type: 'ladder'; rungs: { tag: string; name: string; desc?: string; tone: Tone; side?: string[] }[]; after?: string; refs?: Ref[]; plain?: true }
  /** Big-number rows: "5 เป้าหมายหลัก …". */
  | { type: 'numbers'; rows: { n: string; name: string; desc: string }[]; refs?: Ref[]; plain?: true }
  /** A titled list of name + plain explanation. */
  | { type: 'list'; title?: string; items: { name: string; desc: string }[]; refs?: Ref[]; plain?: true }
  /** Tap-to-read explorer: groups of chips; tapping a chip shows its full name and meaning. */
  | {
      type: 'explorer';
      title: string;
      intro?: string;
      groups: { tag: string; name: string; idea?: string; items: { key: string; label: string; full: string; meaning: string }[] }[];
      initial?: string; // key picked first
      refs?: Ref[];
      plain?: true;
    }
  /** Static flow: boxes top to bottom, each arrow labelled with what passes down. */
  | { type: 'flow'; title?: string; nodes: { level?: string; name: string; role?: string; tone: Tone }[]; arrows: string[]; loopNote?: string; refs?: Ref[]; plain?: true }
  /** Static grid/table, e.g. a comparison. First row is the header. `highlightCol` tints a column. */
  | { type: 'table'; title?: string; rows: string[][]; highlightCol?: number; after?: string; refs?: Ref[]; plain?: true }
  /** Static timeline. `now` marks where today falls. */
  | { type: 'timeline'; title?: string; items: { when: string; label: string; desc?: string; now?: boolean }[]; refs?: Ref[]; plain?: true }
  /** 2×2 (SWOT, PDCA): four labelled quadrants in reading order. */
  | { type: 'quad'; title?: string; cells: { tag: string; name: string; desc?: string }[]; center?: string; refs?: Ref[]; plain?: true }
  /** Worked reasoning: question, numbered thinking steps, the trap. */
  | { type: 'reasoning'; question: string; steps: string[]; answer: string; trap?: string; refs?: Ref[]; plain?: true }
  /** Common mistakes, each with the reason. */
  | { type: 'mistakes'; items: { title: string; body: string }[]; refs?: Ref[]; plain?: true }
  /** Reasoning MCQs with instant feedback. */
  | { type: 'check'; anchor?: string; eyebrow?: string; title?: string; questions: MCQ[] }
  /** Explain-in-your-own-words prompt with a model answer to reveal. */
  | { type: 'explain'; prompt: string; model: string; refs?: Ref[]; plain?: true };

export type Lesson = {
  id: string; // "n1"
  topic: TopicId;
  order: number; // 1-based within the topic
  title: string;
  lead: string; // what the learner will get
  minutes: number;
  /** Our estimate of exam weight (police course); shown as a label on the lesson and in the map. */
  priority?: Priority;
  /** 'practice' = a question set: a short method card, then the 10-item test whose explanations do the teaching. */
  kind?: 'practice';
  /** Jump chips in the sticky header: [anchor, label]. */
  jumps: [string, string][];
  blocks: Block[];
  /** End-of-lesson test: 10 questions, 8 to pass. */
  test: MCQ[];
  /** Every document used, with pages, listed at the foot of the page. */
  sources: Ref[];
};

export type Summary = {
  topic: TopicId;
  question: string; // the one guiding question
  questionNote: string;
  flow: Extract<Block, { type: 'flow' }>;
  pieces: { name: string; what: string; why: string; link: string; key: string; refs: Ref[]; plain?: true }[];
  story?: { title: string; steps: { title: string; body: string }[]; refs: Ref[] };
  compare?: { title: string; rows: string[][]; why: string; whyLabel?: string; refs: Ref[] };
  numbers: { label: string; value: string; meaning: string; refs: Ref[]; plain?: true }[];
  prompts: { q: string; a: string }[];
  asOf?: string;
  sources: Ref[];
};

export type Topic = {
  id: TopicId;
  title: string;
  short: string;
  part: 1 | 2; // exam part (ภาค 1 / ภาค 2)
  lessons: Lesson[];
  summary?: Summary;
  /** Fresh topic test (20 items, not drawn from the lesson tests). Without it, the topic test draws from lesson tests. */
  test?: MCQ[];
  /** Practice sets that live elsewhere on the site (e.g. existing question banks), shown on the map. */
  links?: { id: string; title: string; href: string; meta: string }[];
  ready: boolean; // false = shown on the map as "เร็วๆ นี้"
};
