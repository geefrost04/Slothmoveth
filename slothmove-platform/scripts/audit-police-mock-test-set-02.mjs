#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'content/exams/police-mock-test-set-02.json');
const REPORT = path.join(ROOT, 'content/exams/police-mock-test-set-02-audit.md');
const EXPECTED_COUNTS = { math: 20, thai: 20, computer: 40, saraban: 30, law: 25, english: 15 };
const EXPECTED_ANSWER_DISTRIBUTIONS = {
  math: [1, 9, 8, 2],
  thai: [3, 9, 5, 3],
  computer: [11, 11, 9, 9],
  saraban: [3, 10, 8, 9],
  law: [5, 1, 9, 10],
  english: [7, 4, 3, 1]
};
const EXPECTED_GLOBAL_ANSWERS = [30, 44, 42, 34];
const EXPECTED_MECHANISMS = {
  thai: [
    'การอ่านจับใจความ', 'การอนุมาน', 'วัตถุประสงค์ของผู้เขียน', 'การตีความคำในบริบท', 'น้ำเสียงของผู้เขียน',
    'การอ่านจับรายละเอียด', 'การตีความคำประพันธ์', 'การอนุมาน', 'การสะกดคำ', 'การใช้คำ', 'ระดับภาษา',
    'คำราชาศัพท์', 'ลักษณนาม', 'สำนวนไทย', 'ความหมายตรงและความหมายเชิงอุปมา', 'การอ่านออกเสียง',
    'การใช้ ใอ/ไอ', 'คำประสม', 'การใช้คำสุภาพ', 'อิทธิพลภาษาต่างประเทศ'
  ],
  computer: [
    'พื้นฐานคอมพิวเตอร์', 'หน่วยประมวลผล', 'หน่วยความจำ', 'ฮาร์ดแวร์', 'อุปกรณ์รับส่งข้อมูล', 'ซอฟต์แวร์ระบบ',
    'โปรแกรมแปลภาษา', 'นามสกุลไฟล์', 'การบีบอัดไฟล์', 'ผังงาน', 'เครือข่าย', 'อุปกรณ์เครือข่าย',
    'อุปกรณ์เครือข่าย', 'โทโพโลยี', 'อินเทอร์เน็ต', 'เว็บเบราว์เซอร์', 'Bluetooth', 'Cloud computing',
    'อีคอมเมิร์ซ', 'ไฟร์วอลล์', 'Microsoft Word', 'Microsoft Word', 'สเปรดชีต', 'สเปรดชีต',
    'โปรแกรมประมวลผลคำ', 'งานนำเสนอ', 'สื่อสังคมออนไลน์', 'มัลแวร์', 'ฟิชชิง', 'รหัสผ่าน', 'HDMI',
    'ข่าวปลอม', 'การยืนยันตัวตนหลายปัจจัย', 'ฟิชชิง', 'หน่วยเก็บข้อมูล', 'HTTPS', 'Microsoft Excel',
    'Microsoft Word', 'Microsoft PowerPoint', 'เครือข่าย'
  ],
  saraban: [
    'ความหมายงานสารบรรณ', 'ชนิดหนังสือราชการ', 'หนังสือภายนอก', 'หนังสือภายใน', 'หนังสือประทับตรา',
    'หนังสือสั่งการ', 'หนังสือประชาสัมพันธ์', 'คำสั่ง', 'ระเบียบ', 'ข้อบังคับ', 'ประกาศ', 'รายงานการประชุม',
    'ชั้นความเร็ว', 'ด่วนที่สุด', 'เลขที่หนังสือ', 'คำขึ้นต้น', 'สิ่งที่ส่งมาด้วย', 'สำเนาคู่ฉบับ', 'หนังสือเวียน',
    'การรับหนังสือ', 'การส่งหนังสือ', 'การเก็บหนังสือ', 'การยืมหนังสือ', 'การทำลายหนังสือ', 'อายุการเก็บ',
    'การรับหนังสือ', 'การส่งและเก็บหนังสือ', 'สารบรรณอิเล็กทรอนิกส์', 'อีเมลราชการ', 'การตั้งชื่อไฟล์'
  ],
  law: [
    'กฎหมายสารบัญญัติ', 'กฎหมายวิธีสบัญญัติ', 'คำสั่งทางปกครอง', 'ประวัติศาสตร์กฎหมายไทย', 'วุฒิสภา',
    'วุฒิสภา', 'ศาลยุติธรรม', 'สิทธิด้านการศึกษา', 'สภาพบุคคล', 'ทารกในครรภ์', 'บุคคลสาบสูญ',
    'บุคคลสาบสูญ', 'กฎหมายที่ดิน', 'เช่าทรัพย์', 'เช่าทรัพย์', 'การหมั้น', 'มรดก', 'ความผิดอันยอมความได้',
    'โทษทางอาญา', 'ฉ้อโกง', 'ฉ้อโกง', 'ลักทรัพย์', 'ผู้สนับสนุน', 'คุ้มครองผู้บริโภค', 'ทะเบียนราษฎร'
  ],
  english: [
    'Conversation', 'Conversation', 'Conversation', 'Vocabulary', 'Vocabulary', 'Vocabulary', 'Reading', 'Reading',
    'Reading', 'Grammar', 'Grammar', 'Grammar', 'Grammar', 'Grammar', 'Grammar'
  ]
};

function normalize(text) {
  return String(text).toLowerCase().replace(/\s+/g, '').replace(/[“”‘’'".,!?():;\-–—/\\`_$]/g, '');
}

function grams(text, size = 3) {
  const value = normalize(text);
  const result = new Set();
  for (let index = 0; index <= value.length - size; index += 1) result.add(value.slice(index, index + size));
  return result;
}

function similarity(left, right) {
  const a = grams(left);
  const b = grams(right);
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const gram of a) if (b.has(gram)) common += 1;
  return common / (a.size + b.size - common);
}

function countBy(items, key) {
  return items.reduce((result, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

function answerDistribution(items) {
  return items.reduce((result, item) => {
    if (Number.isInteger(item.correctChoiceIndex) && item.correctChoiceIndex >= 0 && item.correctChoiceIndex <= 3) {
      result[item.correctChoiceIndex] += 1;
    }
    return result;
  }, [0, 0, 0, 0]);
}

function detectPeriodicAnswers(answers) {
  for (let period = 1; period <= 8; period += 1) {
    let matches = 0;
    for (let index = period; index < answers.length; index += 1) {
      if (answers[index] === answers[index - period]) matches += 1;
    }
    const ratio = matches / (answers.length - period);
    if (ratio >= 0.9) return { period, ratio };
  }
  return null;
}

function loadReferenceQuestions() {
  const references = [];
  for (const file of fs.readdirSync(path.join(ROOT, 'content/exams'))) {
    if (!file.endsWith('.json') || file === path.basename(INPUT)) continue;
    const payload = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/exams', file), 'utf8'));
    const questions = Array.isArray(payload) ? payload : payload.questions;
    if (!Array.isArray(questions)) continue;
    for (const question of questions) {
      if (question.prompt) references.push({ file, position: question.position, prompt: question.prompt });
    }
  }
  return references;
}

function audit(payload) {
  const errors = [];
  const warnings = [];
  const questions = payload.questions ?? [];
  const subjectCounts = countBy(questions, 'subjectId');
  const globalAnswerDistribution = answerDistribution(questions);

  if (payload.qualityNotes?.qaStatus !== 'independent_reaudit_round_2_passed_2026_08_26') {
    errors.push(`Unexpected QA status: ${payload.qualityNotes?.qaStatus ?? 'missing'}`);
  }

  if (questions.length !== 150) errors.push(`Expected 150 questions, found ${questions.length}`);
  for (const [subject, expected] of Object.entries(EXPECTED_COUNTS)) {
    if (subjectCounts[subject] !== expected) errors.push(`${subject}: expected ${expected}, found ${subjectCounts[subject] ?? 0}`);
  }

  const normalizedPrompts = new Map();
  questions.forEach((question, index) => {
    const label = `Q${index + 1}`;
    if (question.position !== index + 1) errors.push(`${label}: position mismatch`);
    if (!question.prompt?.trim() || !question.explanation?.trim() || !question.tip?.trim()) errors.push(`${label}: incomplete content`);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${label}: must have four choices`);
    const normalizedChoices = (question.choices ?? []).map((choice) => String(choice).trim().toLowerCase().replace(/\s+/g, ' '));
    if (new Set(normalizedChoices).size !== 4) errors.push(`${label}: duplicate choices`);
    if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex > 3) {
      errors.push(`${label}: invalid correctChoiceIndex`);
    } else {
      const answer = question.choices[question.correctChoiceIndex];
      if (!question.explanation.includes(answer)) errors.push(`${label}: explanation does not confirm the selected answer`);
    }
    if (question.sourceType !== 'new-dna-authored-item') errors.push(`${label}: invalid source type`);
    if (!['easy', 'medium', 'hard'].includes(question.difficulty)) errors.push(`${label}: missing or invalid difficulty`);
    if (!question.sourceMechanism?.trim() || question.sourceMechanism !== question.originalCategory) errors.push(`${label}: invalid source mechanism`);
    if (question.sourceDnaSet !== 'Set 1' || !question.sourceDnaRef?.trim()) errors.push(`${label}: missing Set 1 DNA reference`);
    if (['law', 'saraban'].includes(question.subjectId) && !question.verificationRef?.trim()) errors.push(`${label}: missing official verification reference`);
    if (normalize(question.explanation) === normalize(question.tip)) errors.push(`${label}: explanation and tip are duplicated`);
    const key = normalize(question.prompt);
    normalizedPrompts.set(key, [...(normalizedPrompts.get(key) ?? []), question.position]);
  });
  for (const positions of normalizedPrompts.values()) {
    if (positions.length > 1) errors.push(`Exact duplicate prompts: Q${positions.join(', Q')}`);
  }

  const dna = {
    thai: countBy(questions.filter((question) => question.subjectId === 'thai'), 'dnaBucket'),
    saraban: countBy(questions.filter((question) => question.subjectId === 'saraban'), 'dnaBucket'),
    law: countBy(questions.filter((question) => question.subjectId === 'law'), 'dnaBucket'),
    english: countBy(questions.filter((question) => question.subjectId === 'english'), 'dnaBucket')
  };
  const expectedDna = payload.qualityNotes.expectedDna;
  if (JSON.stringify(dna) !== JSON.stringify(expectedDna)) errors.push(`DNA mismatch: ${JSON.stringify(dna)}`);
  if (JSON.stringify(globalAnswerDistribution) !== JSON.stringify(EXPECTED_GLOBAL_ANSWERS)) {
    errors.push(`Global answer distribution mismatch: ${globalAnswerDistribution.join('/')}`);
  }
  for (const [subject, expected] of Object.entries(EXPECTED_ANSWER_DISTRIBUTIONS)) {
    const actual = answerDistribution(questions.filter((question) => question.subjectId === subject));
    if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`${subject}: answer distribution ${actual.join('/')} != ${expected.join('/')}`);
  }
  const periodicAnswers = detectPeriodicAnswers(questions.map((question) => question.correctChoiceIndex));
  if (periodicAnswers) errors.push(`Answer key has a detectable period of ${periodicAnswers.period} (${(periodicAnswers.ratio * 100).toFixed(1)}% match)`);
  for (const [subject, expected] of Object.entries(EXPECTED_MECHANISMS)) {
    const actual = questions.filter((question) => question.subjectId === subject).map((question) => question.sourceMechanism);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`${subject}: source mechanisms drift from Set 1 DNA`);
  }

  const references = loadReferenceQuestions();
  const similarities = [];
  for (const question of questions) {
    let best = null;
    for (const reference of references) {
      const score = similarity(question.prompt, reference.prompt);
      if (!best || score > best.score) best = { ...reference, score };
    }
    similarities.push({ question: question.position, ...best });
  }
  const suspicious = similarities.filter((item) => item.score >= 0.72);
  if (suspicious.length) errors.push(`${suspicious.length} questions are too similar to existing bank prompts`);
  const reviewCandidates = similarities.filter((item) => item.score >= 0.55 && item.score < 0.72);
  if (reviewCandidates.length) warnings.push(`${reviewCandidates.length} medium-similarity prompts reviewed manually`);

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    summary: {
      total: questions.length,
      subjectCounts,
      answerDistribution: globalAnswerDistribution,
      periodicAnswers,
      dna,
      exactDuplicates: [...normalizedPrompts.values()].filter((positions) => positions.length > 1).length,
      suspiciousSimilarity: suspicious,
      reviewCandidates,
      highestSimilarity: similarities.sort((left, right) => right.score - left.score).slice(0, 10)
    }
  };
}

const payload = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const result = audit(payload);
fs.writeFileSync(REPORT, [
  '# Police Mock Test Set 02 - Full Audit',
  '',
  `- Status: **${result.passed ? 'PASS' : 'FAIL'}**`,
  `- Total: ${result.summary.total}`,
  `- Subject counts: ${JSON.stringify(result.summary.subjectCounts)}`,
  `- Answer distribution A/B/C/D: ${result.summary.answerDistribution.join('/')}`,
  `- DNA: ${JSON.stringify(result.summary.dna)}`,
  `- Exact duplicate prompts: ${result.summary.exactDuplicates}`,
  `- Similarity >= 0.72: ${result.summary.suspiciousSimilarity.length}`,
  `- Similarity 0.55-0.72: ${result.summary.reviewCandidates.length}`,
  '',
  '## Errors',
  ...(result.errors.length ? result.errors.map((error) => `- ${error}`) : ['- None']),
  '',
  '## Highest similarities',
  ...result.summary.highestSimilarity.map((item) => `- Q${item.question} -> ${item.file} Q${item.position}: ${item.score.toFixed(3)}`),
  ''
].join('\n'), 'utf8');
console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exit(1);
