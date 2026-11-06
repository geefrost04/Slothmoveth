#!/usr/bin/env node
// Builds seven free 20-question saraban quick-review sets from the 150 questions
// in police-saraban-set-01..03, using the cleaned wording in
// content/exams/police-saraban-quick-review-edits.json.
//
// Balancing rules:
// - every set mixes all topic groups (dealt round-robin per group)
// - near-duplicate questions never land in the same set
// - each set has 5 correct answers per choice letter (except order-dependent choices)
// - leaked source wording ("ต้นฉบับ", "ชุดที่ N", ...) fails the build
//
// Usage: node scripts/generate-police-saraban-quick-sets.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/exams');
const EDITS_PATH = path.join(CONTENT, 'police-saraban-quick-review-edits.json');
const REPORT_PATH = path.join(CONTENT, 'police-saraban-quick-sets-audit.md');
const SET_COUNT = 7;
const SET_SIZE = 20;
const DURATION_MINUTES = 20;

// Questions left out of the quick sets (key = "<source set>-<position>").
// Chosen from reviewer flags: doubtful answers, source-key quirks, or near-duplicates.
const DROP = new Map(JSON.parse(fs.readFileSync(EDITS_PATH, 'utf8')).drop.map((item) => [item.key, item.reason]));

// Pairs that must not share a set even if their prompts look different.
const EXTRA_CONFLICTS = JSON.parse(fs.readFileSync(EDITS_PATH, 'utf8')).conflicts ?? [];

const TOPIC_GROUPS = [
  ['electronic', /อิเล็กทรอนิกส์|อีเมล|ไฟล์/],
  ['urgency-secrecy', /ความเร็ว|ความลับ|ด่วน/],
  ['storage', /เก็บ|ยืม|ทำลาย|ตรวจค้น/],
  ['receive-send', /หนังสือรับ|ตรารับ|ทะเบียน|การส่ง|ติดตาม/],
  ['format', /วันที่|อ้างถึง|คำขึ้นต้น|คำลงท้าย|ลงชื่อ|เลขที่|เลขฉบับ|ฉบับที่|กระดาษ|ครุฑ|ซอง|ตราชื่อ|รูปแบบ|สำเนา|ภาษาต่างประเทศ/],
  ['document-types', /หนังสือ|ระเบียบ$|ข้อบังคับ|ประกาศ|แถลงการณ์|ข่าว|รายงานการประชุม|บันทึก|คำสั่ง/],
  ['general', /.*/]
];

// "ต้นฉบับ" alone can mean an original document, so only flag the generation-note phrasings.
const LEAK_PATTERN = /ข้อสอบต้นฉบับ|ต้นฉบับชุด|ที่ต้นฉบับ(ใช้|ให้|ยก|ถาม|ระบุ)|ตามต้นฉบับ(?!ทุก)|กรอบต้นฉบับ|ชุดที่\s*\d|ตัวอย่างชุด|DNA|คาแรกเตอร์|แนวข้อสอบ/;
const LETTER_PATTERN = /(ข้อ|ตัวเลือก)\s*[กขคง](?![ก-๙])/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Small deterministic PRNG so reruns produce identical sets.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function similarity(left, right) {
  // Character-bigram Dice coefficient; good enough for Thai without word splitting.
  const grams = (text) => {
    const clean = text.replace(/\s+/g, '');
    const map = new Map();
    for (let index = 0; index < clean.length - 1; index += 1) {
      const gram = clean.slice(index, index + 2);
      map.set(gram, (map.get(gram) ?? 0) + 1);
    }
    return { map, size: Math.max(clean.length - 1, 1) };
  };
  const a = grams(left);
  const b = grams(right);
  let overlap = 0;
  for (const [gram, count] of a.map) overlap += Math.min(count, b.map.get(gram) ?? 0);
  return (2 * overlap) / (a.size + b.size);
}

function topicOf(category) {
  return TOPIC_GROUPS.find(([, pattern]) => pattern.test(category))[0];
}

const edits = new Map(JSON.parse(fs.readFileSync(EDITS_PATH, 'utf8')).questions.map((edit) => [`${edit.src}-${edit.position}`, edit]));
const pool = [];
for (const src of [1, 2, 3]) {
  const file = `police-saraban-set-0${src}-notebooklm.json`;
  const payload = JSON.parse(fs.readFileSync(path.join(CONTENT, file), 'utf8'));
  for (const question of payload.questions) {
    const key = `${src}-${question.position}`;
    const edit = edits.get(key);
    assert(edit, `Missing cleaned wording for ${key}`);
    const choices = edit.choices ?? question.choices;
    assert(choices.length === 4 && new Set(choices).size === 4, `${key}: choices must be 4 unique values`);
    if (DROP.has(key)) continue;
    pool.push({
      key,
      sourceFile: file,
      sourcePosition: question.position,
      category: question.category,
      topic: topicOf(question.category),
      difficulty: question.difficulty ?? 'ปานกลาง',
      prompt: edit.prompt,
      choices,
      correctChoiceIndex: question.correctChoiceIndex,
      explanation: edit.explanation,
      tip: edit.tip,
      orderDependent: Boolean(edit.orderDependent)
    });
  }
}
assert(pool.length === SET_COUNT * SET_SIZE, `Expected ${SET_COUNT * SET_SIZE} questions after drops, found ${pool.length} (drops: ${DROP.size})`);

for (const question of pool) {
  for (const field of ['prompt', 'explanation', 'tip', ...question.choices.map((_, index) => index)]) {
    const text = typeof field === 'number' ? question.choices[field] : question[field];
    assert(!LEAK_PATTERN.test(text), `${question.key}: source wording leaked in ${field}: ${text}`);
  }
  assert(!LETTER_PATTERN.test(question.explanation), `${question.key}: explanation refers to a choice letter`);
  assert(!LETTER_PATTERN.test(question.tip), `${question.key}: tip refers to a choice letter`);
  const correctText = question.choices[question.correctChoiceIndex];
  assert(question.explanation.startsWith('ตอบ'), `${question.key}: explanation must start with "ตอบ"`);
  // Multi-line answers (layout samples) are paraphrased in one line, so skip the text match.
  if (!question.orderDependent && !correctText.includes('\n')) {
    assert(question.explanation.includes(correctText.slice(0, 12)), `${question.key}: explanation does not name the correct choice`);
  }
}

// Conflict graph: near-duplicate prompts or explicit pairs never share a set.
const conflicts = new Map(pool.map((question) => [question.key, new Set()]));
const conflictPairs = [];
for (let left = 0; left < pool.length; left += 1) {
  for (let right = left + 1; right < pool.length; right += 1) {
    const score = similarity(pool[left].prompt, pool[right].prompt);
    const sameCategory = pool[left].category === pool[right].category;
    if (score >= 0.72 || (sameCategory && score >= 0.5)) {
      conflicts.get(pool[left].key).add(pool[right].key);
      conflicts.get(pool[right].key).add(pool[left].key);
      conflictPairs.push([pool[left].key, pool[right].key, score.toFixed(2)]);
    }
  }
}
for (const [left, right] of EXTRA_CONFLICTS) {
  if (!conflicts.has(left) || !conflicts.has(right)) continue;
  conflicts.get(left).add(right);
  conflicts.get(right).add(left);
  conflictPairs.push([left, right, 'manual']);
}

// Deal each topic group round-robin across the sets so every set gets a mix.
const random = mulberry32(Number(process.env.QUICK_SET_SEED ?? 1));
const sets = Array.from({ length: SET_COUNT }, () => []);
const difficultyRank = { 'ง่าย': 0, 'ปานกลาง': 1, 'ยาก': 2 };
const topicOrder = TOPIC_GROUPS.map(([topic]) => topic);
let cursor = 0;
for (const topic of topicOrder) {
  const group = shuffle(pool.filter((question) => question.topic === topic), random)
    .sort((left, right) => (difficultyRank[left.difficulty] ?? 1) - (difficultyRank[right.difficulty] ?? 1));
  for (const question of group) {
    let placed = false;
    for (let attempt = 0; attempt < SET_COUNT; attempt += 1) {
      const target = sets[(cursor + attempt) % SET_COUNT];
      if (target.length >= SET_SIZE) continue;
      if (target.some((other) => conflicts.get(question.key).has(other.key))) continue;
      target.push(question);
      cursor = (cursor + attempt + 1) % SET_COUNT;
      placed = true;
      break;
    }
    if (!placed) {
      // Fall back to the emptiest set that has room; recorded as a warning in the audit.
      const target = sets.filter((set) => set.length < SET_SIZE).sort((a, b) => a.length - b.length)[0];
      question.conflictFallback = true;
      target.push(question);
    }
  }
}
assert(sets.every((set) => set.length === SET_SIZE), 'Every set must have exactly 20 questions');

// Balance answer letters to 5/5/5/5 inside each set.
function balanceAnswers(set, setRandom) {
  const counts = [0, 0, 0, 0];
  for (const question of set.filter((item) => item.orderDependent)) counts[question.correctChoiceIndex] += 1;
  const targets = [];
  const goal = SET_SIZE / 4;
  for (let letter = 0; letter < 4; letter += 1) {
    for (let count = counts[letter]; count < goal; count += 1) targets.push(letter);
  }
  const movable = set.filter((item) => !item.orderDependent);
  while (targets.length < movable.length) targets.push(Math.floor(setRandom() * 4));
  const shuffledTargets = shuffle(targets, setRandom);
  return set.map((question) => {
    if (question.orderDependent) return { ...question };
    const target = shuffledTargets.pop();
    const correct = question.choices[question.correctChoiceIndex];
    const distractors = shuffle(question.choices.filter((_, index) => index !== question.correctChoiceIndex), setRandom);
    distractors.splice(target, 0, correct);
    return { ...question, choices: distractors, correctChoiceIndex: target };
  });
}

// Order questions so the same answer letter never appears more than twice in a row.
function orderQuestions(set, setRandom) {
  for (let tries = 0; tries < 500; tries += 1) {
    const ordered = shuffle(set, setRandom);
    const ok = ordered.every((question, index) => (
      index < 2 || !(question.correctChoiceIndex === ordered[index - 1].correctChoiceIndex
        && question.correctChoiceIndex === ordered[index - 2].correctChoiceIndex)
    ));
    if (ok) return ordered;
  }
  throw new Error('Could not order questions without 3 identical answers in a row');
}

const outputs = sets.map((set, index) => {
  const number = index + 1;
  const padded = String(number).padStart(2, '0');
  const setRandom = mulberry32(1000 + number);
  const questions = orderQuestions(balanceAnswers(set, setRandom), setRandom).map((question, position) => ({
    position: position + 1,
    category: question.category,
    difficulty: question.difficulty,
    prompt: question.prompt,
    choices: question.choices,
    correctChoiceIndex: question.correctChoiceIndex,
    explanation: question.explanation,
    tip: question.tip,
    sourceRef: `${question.sourceFile} Q${question.sourcePosition}`,
    topic: question.topic,
    media: {}
  }));
  return {
    examSet: {
      id: `police-saraban-quick-${padded}`,
      title: `งานสารบรรณ ทบทวนเร็ว ชุดที่ ${number}`,
      description: 'ข้อสอบงานสารบรรณ 20 ข้อ คละทุกหัวข้อ ใช้เวลาประมาณ 20 นาที พร้อมเฉลยทุกข้อ',
      durationMinutes: DURATION_MINUTES,
      totalQuestions: SET_SIZE,
      accessType: 'free',
      catalogOrder: number,
      isPublished: true
    },
    qualityNotes: {
      generatedBy: 'scripts/generate-police-saraban-quick-sets.mjs',
      sources: ['police-saraban-set-01-notebooklm.json', 'police-saraban-set-02-notebooklm.json', 'police-saraban-set-03-notebooklm.json'],
      policy: 'Re-split of existing saraban questions with cleaned wording; topics mixed, near-duplicates separated, answer letters balanced.'
    },
    questions
  };
});

for (const payload of outputs) {
  fs.writeFileSync(path.join(CONTENT, `${payload.examSet.id}.json`), `${JSON.stringify(payload, null, 2)}\n`);
}

// Audit report.
const letters = ['ก', 'ข', 'ค', 'ง'];
const lines = [
  '# Police Saraban Quick Sets 01-07 - Audit',
  '',
  `- Sets: ${SET_COUNT} × ${SET_SIZE} questions (${SET_COUNT * SET_SIZE} of 150 source questions used)`,
  `- Dropped: ${DROP.size}`,
  `- Conflict pairs kept apart: ${conflictPairs.length}`,
  `- Conflict fallbacks (pair forced into same set): ${pool.filter((question) => question.conflictFallback).length}`,
  ''
];
for (const payload of outputs) {
  const answerCounts = [0, 0, 0, 0];
  const topics = {};
  const difficulty = {};
  const sources = {};
  for (const question of payload.questions) {
    answerCounts[question.correctChoiceIndex] += 1;
    topics[question.topic] = (topics[question.topic] ?? 0) + 1;
    difficulty[question.difficulty] = (difficulty[question.difficulty] ?? 0) + 1;
    const source = question.sourceRef.match(/set-0(\d)/)[1];
    sources[`set ${source}`] = (sources[`set ${source}`] ?? 0) + 1;
  }
  lines.push(`## ${payload.examSet.title}`);
  lines.push(`- Answers: ${answerCounts.map((count, index) => `${letters[index]} ${count}`).join(' | ')}`);
  lines.push(`- Topics: ${JSON.stringify(topics)}`);
  lines.push(`- Difficulty: ${JSON.stringify(difficulty)}`);
  lines.push(`- Source mix: ${JSON.stringify(sources)}`);
  lines.push('');
}
lines.push('## Dropped questions');
for (const [key, reason] of DROP) lines.push(`- ${key}: ${reason}`);
lines.push('');
fs.writeFileSync(REPORT_PATH, `${lines.join('\n')}\n`);

console.log(JSON.stringify({
  written: outputs.map((payload) => payload.examSet.id),
  conflictPairs: conflictPairs.length,
  fallbacks: pool.filter((question) => question.conflictFallback).map((question) => question.key),
  report: path.relative(ROOT, REPORT_PATH)
}, null, 2));
