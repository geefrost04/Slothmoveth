#!/usr/bin/env node
// Builds the PAT (กทท.) exam sets from scripts/pat/banks/<topic>.mjs (correct answer = choices[0]):
//  - content/exams/pat-mini_mock-set-NN.json: 2 × 30 mixed questions, taken out of the topic banks
//  - content/exams/pat-<topic>-set-NN.json: the rest of each bank, split into sets of up to 25
// Answer positions are shuffled with a fixed seed so rebuilding gives the same files.
// Import: node scripts/import-local-exam-sets.mjs --course=pat --apply
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const TOPICS = [
  { id: 'general', title: 'ความสามารถทั่วไป', mini: 12 },
  { id: 'thai', title: 'ภาษาไทย', mini: 8 },
  { id: 'english', title: 'ภาษาอังกฤษ', mini: 8 },
  { id: 'port', title: 'ความรู้เกี่ยวกับ กทท.', mini: 8 },
  { id: 'ppp', title: 'การร่วมลงทุนรัฐและเอกชน (PPP) และ EEC', mini: 8 },
  { id: 'soe', title: 'รัฐวิสาหกิจและแผนวิสาหกิจ', mini: 8 },
  { id: 'invest', title: 'การวิเคราะห์โครงการลงทุน', mini: 8 }
];
const MINI_SETS = 2;
const POSITION = 'สอบคัดเลือกพนักงานการท่าเรือแห่งประเทศไทย ตำแหน่งนักวิชาการ 6 กองแผนวิสาหกิจ';

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = (items, rand) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

function check(topic, pool) {
  const seen = new Set();
  pool.forEach((item, i) => {
    const where = `${topic} #${i + 1}`;
    if (!item.q || !item.why || !item.tip || !item.category) throw new Error(`${where}: missing q/why/tip/category`);
    if (!Array.isArray(item.choices) || item.choices.length !== 4 || new Set(item.choices).size !== 4) throw new Error(`${where}: needs 4 distinct choices`);
    if (seen.has(item.q)) throw new Error(`${where}: duplicate question`);
    seen.add(item.q);
  });
}

function toQuestions(items, rand) {
  const slots = shuffle(items.map((_, i) => i % 4), rand);
  return items.map(({ item, topic }, i) => {
    const [correct, ...wrong] = item.choices;
    const choices = shuffle(wrong, rand);
    choices.splice(slots[i], 0, correct);
    return {
      position: i + 1,
      category: item.category,
      topic: topic.title,
      difficulty: item.difficulty ?? 'medium',
      prompt: item.q,
      choices,
      correctChoiceIndex: slots[i],
      explanation: item.why,
      tip: item.tip,
      sourceRef: item.ref ?? ''
    };
  });
}

function write(id, title, description, questions, catalogOrder) {
  const payload = {
    examSet: { id, title, description, accessType: 'free', durationMinutes: Math.ceil(questions.length * 1.2), totalQuestions: questions.length, catalogOrder },
    qualityNotes: { generatedBy: 'scripts/pat/build-sets.mjs', answerDistribution: [0, 1, 2, 3].map((k) => questions.filter((q) => q.correctChoiceIndex === k).length) },
    questions
  };
  fs.writeFileSync(`content/exams/${id}.json`, JSON.stringify(payload, null, 2) + '\n');
}

for (const name of fs.readdirSync('content/exams')) {
  if (/^pat-[a-z_]+-set-\d{2}\.json$/.test(name)) fs.unlinkSync(path.join('content/exams', name));
}

const mini = Array.from({ length: MINI_SETS }, () => []);
let miniTurn = 0;
for (const [topicIndex, topic] of TOPICS.entries()) {
  const file = path.resolve(`scripts/pat/banks/${topic.id}.mjs`);
  if (!fs.existsSync(file)) {
    console.log(`${topic.id}: no bank yet, skipped`);
    continue;
  }
  const { QUESTIONS } = await import(pathToFileURL(file).href);
  check(topic.id, QUESTIONS);
  const rand = mulberry32(20261111 + topicIndex * 101);
  const order = shuffle(QUESTIONS, rand);
  const reserved = order.slice(0, topic.mini);
  const rest = QUESTIONS.filter((item) => !reserved.includes(item)); // keep bank order for topic sets
  // Alternate across topics too, so both Mini Mocks end up with 30.
  reserved.forEach((item) => { mini[miniTurn % MINI_SETS].push({ item, topic }); miniTurn += 1; });

  const setCount = Math.max(1, Math.ceil(rest.length / 25));
  const groups = Array.from({ length: setCount }, () => []);
  rest.forEach((item, i) => groups[i % setCount].push({ item, topic }));
  groups.forEach((items, setIndex) => {
    const id = `pat-${topic.id}-set-${String(setIndex + 1).padStart(2, '0')}`;
    write(id, `${topic.title} ชุดที่ ${setIndex + 1}`, `${topic.title} ${items.length} ข้อ พร้อมเฉลยละเอียด สำหรับ${POSITION}`, toQuestions(items, rand), setIndex + 1);
  });
  console.log(`${topic.id}: ${QUESTIONS.length} questions → mini ${reserved.length} + sets ${groups.map((g) => g.length).join(' + ')}`);

  // Round 2: <topic>-more.mjs becomes extra sets after the first ones, leaving the live sets unchanged.
  const moreFile = path.resolve(`scripts/pat/banks/${topic.id}-more.mjs`);
  if (fs.existsSync(moreFile)) {
    const { QUESTIONS: MORE } = await import(pathToFileURL(moreFile).href);
    check(`${topic.id}-more`, [...QUESTIONS, ...MORE]);
    const moreRand = mulberry32(20261110 + topicIndex * 101);
    const moreCount = Math.max(1, Math.ceil(MORE.length / 25));
    const moreGroups = Array.from({ length: moreCount }, () => []);
    MORE.forEach((item, i) => moreGroups[i % moreCount].push({ item, topic }));
    moreGroups.forEach((items, i) => {
      const setNo = groups.length + i + 1;
      const id = `pat-${topic.id}-set-${String(setNo).padStart(2, '0')}`;
      write(id, `${topic.title} ชุดที่ ${setNo}`, `${topic.title} ${items.length} ข้อ พร้อมเฉลยละเอียด สำหรับ${POSITION}`, toQuestions(items, moreRand), setNo);
    });
    console.log(`${topic.id}-more: ${MORE.length} questions → sets ${moreGroups.map((g) => g.length).join(' + ')}`);
  }
}

// Mini Drill: scripts/pat/banks/drill.mjs → pat-mini_drill-set-NN (10 quick questions each).
const drillFile = path.resolve('scripts/pat/banks/drill.mjs');
if (fs.existsSync(drillFile)) {
  const { DRILLS } = await import(pathToFileURL(drillFile).href);
  check('drill', DRILLS.flatMap((drill) => drill.questions));
  DRILLS.forEach((drill, index) => {
    const id = `pat-mini_drill-set-${String(index + 1).padStart(2, '0')}`;
    const group = drill.title.replace(/^Mini Drill\s*/, '').split(':')[0].trim();
    const rand = mulberry32(77000 + index);
    write(id, drill.title, `${drill.title} ${drill.questions.length} ข้อ ทวนเร็วพร้อมเฉลย สำหรับ${POSITION}`, toQuestions(drill.questions.map((item) => ({ item, topic: { title: group } })), rand), index + 1);
  });
  console.log(`drills: ${DRILLS.length} sets`);
}

mini.forEach((items, setIndex) => {
  if (!items.length) return;
  const id = `pat-mini_mock-set-${String(setIndex + 1).padStart(2, '0')}`;
  const rand = mulberry32(99000 + setIndex);
  write(id, `Mini Mock กทท. ชุดที่ ${setIndex + 1}`, `Mini Mock ${items.length} ข้อ คละครบทุกหัวข้อ สำหรับ${POSITION} พร้อมเฉลยละเอียด`, toQuestions(items, rand), setIndex + 1);
  console.log(`${id}: ${items.length} questions`);
});
