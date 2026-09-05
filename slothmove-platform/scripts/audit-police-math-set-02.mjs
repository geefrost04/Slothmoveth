#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const exams = path.join(root, 'content/exams');
const slugs = ['foundations', 'algebra', 'ratios-percent', 'geometry', 'stats-prob', 'aptitude-logic'];
const expectedCounts = new Map([['foundations', 40], ...slugs.slice(1).map((slug) => [slug, 20])]);
const normalize = (value) => String(value).toLowerCase().replace(/\s+/g, ' ').trim();

const current = slugs.map((slug) => ({
  slug,
  file: `police-math-set-02-${slug}.json`,
  data: JSON.parse(fs.readFileSync(path.join(exams, `police-math-set-02-${slug}.json`), 'utf8'))
}));
const existingFiles = fs.readdirSync(exams).filter((file) => file.endsWith('.json') && !file.startsWith('police-math-set-02-'));
const existingPrompts = new Set(
  existingFiles.flatMap((file) => {
    const payload = JSON.parse(fs.readFileSync(path.join(exams, file), 'utf8'));
    return Array.isArray(payload.questions) ? payload.questions.map((question) => normalize(question.prompt)) : [];
  })
);

const errors = [];
const warnings = [];
const allPrompts = new Map();
const answerDistribution = [0, 0, 0, 0];
const difficultyDistribution = {};
let total = 0;

for (const { slug, file, data } of current) {
  const questions = data.questions ?? [];
  if (questions.length !== expectedCounts.get(slug)) errors.push(`${file}: expected ${expectedCounts.get(slug)} questions, found ${questions.length}`);
  if (data.examSet?.totalQuestions !== questions.length) errors.push(`${file}: examSet.totalQuestions does not match questions.length`);
  questions.forEach((question, index) => {
    total += 1;
    if (question.position !== index + 1) errors.push(`${file} Q${index + 1}: position must be ${index + 1}`);
    if (!question.prompt || !Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${file} Q${index + 1}: requires a prompt and exactly 4 choices`);
    if (new Set(question.choices.map(normalize)).size !== 4) errors.push(`${file} Q${index + 1}: duplicate choices`);
    if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex > 3) errors.push(`${file} Q${index + 1}: invalid correctChoiceIndex`);
    else answerDistribution[question.correctChoiceIndex] += 1;
    if (!question.explanation || !question.tip) errors.push(`${file} Q${index + 1}: explanation and tip are required`);
    if (!question.difficulty) warnings.push(`${file} Q${index + 1}: missing difficulty`);
    else difficultyDistribution[question.difficulty] = (difficultyDistribution[question.difficulty] ?? 0) + 1;
    const key = normalize(question.prompt);
    if (allPrompts.has(key)) errors.push(`${file} Q${index + 1}: duplicate Set 2 prompt with ${allPrompts.get(key)}`);
    else allPrompts.set(key, `${file} Q${index + 1}`);
    if (existingPrompts.has(key)) errors.push(`${file} Q${index + 1}: exact prompt repeats an existing published or draft exam`);
  });
}

if (total !== 140) errors.push(`Set 2 total must be 140, found ${total}`);

// Regression checks for defects that basic schema validation cannot detect.
const bySlug = new Map(current.map((entry) => [entry.slug, entry.data.questions]));
const expectedAnswer = (slug, position, value) => {
  const question = bySlug.get(slug)?.[position - 1];
  if (!question || question.choices[question.correctChoiceIndex] !== value) {
    errors.push(`${slug} Q${position}: expected answer ${value}`);
  }
};
expectedAnswer('foundations', 30, '35');
expectedAnswer('stats-prob', 9, '48');
expectedAnswer('stats-prob', 1, '100');
expectedAnswer('stats-prob', 13, '78.33');
expectedAnswer('geometry', 20, '432');

const foundationsQ30 = bySlug.get('foundations')?.[29];
if (!foundationsQ30?.prompt.includes('ห.ร.ม. ของ 175 และ 245')) {
  errors.push('foundations Q30: prompt must explicitly ask for the HCF of 175 and 245');
}
const statsQ9 = bySlug.get('stats-prob')?.[8];
if (!statsQ9?.prompt.includes('ต้องติดกัน')) {
  errors.push('stats-prob Q9: permutation question must retain the adjacency constraint');
}
for (const [slug, position] of [['stats-prob', 2], ['ratios-percent', 10]]) {
  const question = bySlug.get(slug)?.[position - 1];
  if (question?.prompt.includes('จากข้อก่อนหน้า')) {
    errors.push(`${slug} Q${position}: question must be self-contained and not depend on a previous question`);
  }
}
const statsQ13 = bySlug.get('stats-prob')?.[12];
if (!statsQ13?.prompt.includes('ทศนิยม 2 ตำแหน่ง')) {
  errors.push('stats-prob Q13: prompt must specify rounding to 2 decimal places');
}
const geometryQ20 = bySlug.get('geometry')?.[19];
if (!geometryQ20?.prompt.includes('ปริมาตร') || !geometryQ20.media?.image) {
  errors.push('geometry Q20: diagram dimensions must be used in a volume question');
}
const genericExplanationPatterns = [
  'จัดรูปเศษส่วนให้มีส่วนร่วมกันหรือกลับเศษส่วนเมื่อหาร',
  'ใช้กฎเลขยกกำลังหรือค่ารากที่ตรงกัน',
  'แปลงค่าตามหลักประจำตำแหน่งของฐาน',
  'ใช้ตัวประกอบเฉพาะหรือพิจารณาเศษตามเงื่อนไข'
];
for (const question of bySlug.get('foundations') ?? []) {
  if (genericExplanationPatterns.some((pattern) => question.explanation.includes(pattern))) {
    errors.push(`foundations Q${question.position}: explanation must show the working, not only name a method`);
  }
}
for (const { slug, data } of current) {
  for (const question of data.questions) {
    const text = `${question.prompt} ${question.explanation}`;
    if (/\d\.\d{8,}/.test(text)) errors.push(`${slug} Q${question.position}: unformatted floating-point artifact`);
  }
}
const report = [
  '# Police Math Set 2 Audit',
  '',
  `Status: **${errors.length ? 'FAIL' : 'PASS'}**`,
  `Total questions: ${total}/140`,
  `Answer indices A/B/C/D: ${answerDistribution.join(' / ')}`,
  `Difficulty labels: ${Object.entries(difficultyDistribution).map(([key, value]) => `${key} ${value}`).join(', ') || 'not fully labeled'}`,
  '',
  '## Errors',
  ...(errors.length ? errors.map((message) => `- ${message}`) : ['- None']),
  '',
  '## Warnings',
  ...(warnings.length ? warnings.map((message) => `- ${message}`) : ['- None']),
  '',
  '## Coverage',
  ...current.map(({ slug, data }) => `- ${slug}: ${data.questions.length} questions`),
  '',
  'Audit checks structural integrity and exact-prompt reuse across existing exam JSON files. Mathematical correctness and instructional quality still require editorial review.'
];
fs.writeFileSync(path.join(exams, 'police-math-set-02-audit.md'), `${report.join('\n')}\n`);
console.log(report.join('\n'));
process.exitCode = errors.length ? 1 : 0;
