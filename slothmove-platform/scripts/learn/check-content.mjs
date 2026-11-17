#!/usr/bin/env node
// Checks a tutor-course's content (content/<course>-learn/<topic>/*.ts):
// - every fact block and every MCQ carries refs, and each ref's doc id exists in lib/<course>-learn/sources.ts
// - MCQs: 4 distinct choices, a valid answer, unique ids, 10 test questions per lesson, 20 per topic test
// - police: every lesson and every top-level section has a priority label
// - reports key positions and how often the key is the longest choice
// Usage: node scripts/learn/check-content.mjs [nesdc|police]   (default nesdc; exit code 1 on errors)

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const COURSE = process.argv[2] || 'nesdc';
const CONTENT = path.join(ROOT, `content/${COURSE}-learn`);
const sourcesTs = fs.readFileSync(path.join(ROOT, `lib/${COURSE}-learn/sources.ts`), 'utf8');
const DOCS = new Set([...sourcesTs.matchAll(/^\s+"([a-z0-9-]+)": \{ title:/gm)].map((m) => m[1]));
const PAGELESS = new Set([...sourcesTs.matchAll(/^\s+"([a-z0-9-]+)": \{ title:.*pageless: true/gm)].map((m) => m[1]));
const NEEDS_PRIORITY = COURSE === 'police';
const PRIORITIES = new Set(['must', 'maybe', 'skip']);

async function load(file) {
  const src = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
}

const errors = [];
const warnings = [];
const ids = new Map();
const FACT_TYPES = new Set(['text', 'note', 'context', 'ladder', 'numbers', 'list', 'explorer', 'flow', 'table', 'timeline', 'quad', 'reasoning', 'mistakes', 'explain']);

function checkRefs(where, refs) {
  if (!Array.isArray(refs) || refs.length === 0) {
    errors.push(`${where}: no refs`);
    return;
  }
  for (const r of refs) {
    if (!DOCS.has(r.doc)) errors.push(`${where}: unknown doc "${r.doc}"`);
    // nesdc-about-* are copies of web pages: no page numbers to cite.
    if ((r.page === undefined || r.page === '') && !PAGELESS.has(r.doc) && !r.doc.startsWith('nesdc-about-') && !r.doc.endsWith('-ocs')) warnings.push(`${where}: ref to ${r.doc} has no page`);
  }
}

function checkText(where, s) {
  if (typeof s !== 'string') return;
  if (/^\s*(#{1,6} |- |\* )/m.test(s)) warnings.push(`${where}: markdown-looking text`);
  // "ต้นฉบับ" is a regulation term in the police saraban lessons, so only the สศช. course bans it.
  const AUTHORING = COURSE === 'police' ? /ตามเอกสาร|ข้อสอบชุดนี้|(สร้าง|เขียน|ตรวจ)(โดย|ด้วย) ?AI/ : /ตามเอกสาร|ข้อสอบชุดนี้|ต้นฉบับ|(สร้าง|เขียน|ตรวจ)(โดย|ด้วย) ?AI/;
  if (AUTHORING.test(s)) errors.push(`${where}: authoring word`);
  if ((s.match(/\*\*/g) || []).length % 2) errors.push(`${where}: unbalanced **`);
  if (/[\u0600-\u06ff\u0400-\u04ff\u4e00-\u9fff]/.test(s)) errors.push(`${where}: stray non-Thai/Latin character`);
}

function walkStrings(where, value) {
  if (typeof value === 'string') checkText(where, value);
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(`${where}[${i}]`, v));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) if (k !== 'refs') walkStrings(`${where}.${k}`, v);
}

function checkMcq(where, q, stats) {
  if (ids.has(q.id)) errors.push(`${where}: duplicate id ${q.id} (also ${ids.get(q.id)})`);
  ids.set(q.id, where);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(`${where}: needs 4 choices`);
  else if (new Set(q.choices).size !== 4) errors.push(`${where}: duplicate choices`);
  if (!(q.answer >= 0 && q.answer <= 3)) errors.push(`${where}: bad answer index`);
  if (!q.why || q.why.length < 40) warnings.push(`${where}: short explanation`);
  if (/ถูกทุกข้อ|ผิดทุกข้อ|ข้อ [กขคง] และ/.test(q.choices?.join(' ') ?? '')) errors.push(`${where}: banned choice pattern`);
  if (!q.plain) checkRefs(where, q.refs);
  stats.pos[q.answer] = (stats.pos[q.answer] || 0) + 1;
  const lens = q.choices.map((c) => c.length);
  if (lens[q.answer] === Math.max(...lens) && lens.filter((l) => l === lens[q.answer]).length === 1) stats.longest++;
  stats.n++;
}

function checkBlock(where, b, stats) {
  if (FACT_TYPES.has(b.type) && !b.plain) checkRefs(where, b.refs);
  if (b.type === 'section') {
    if (b.body?.length && !b.plain) checkRefs(where, b.refs);
    b.blocks?.forEach((c, i) => checkBlock(`${where}.blocks[${i}](${c.type})`, c, stats));
  }
  if (b.type === 'check') b.questions.forEach((q, i) => checkMcq(`${where}.q${i + 1}`, q, stats));
  if (b.type === 'table') {
    const cols = b.rows[0]?.length;
    if (b.rows.some((r) => r.length !== cols)) errors.push(`${where}: ragged table`);
    if (cols > 3) warnings.push(`${where}: ${cols} columns may be tight at 360px`);
  }
  if (b.type === 'explorer') b.groups.forEach((g) => g.items.forEach((it) => it.label.length > 3 && warnings.push(`${where}: chip label "${it.label}" longer than 3`)));
}

const topics = fs.readdirSync(CONTENT).filter((d) => fs.statSync(path.join(CONTENT, d)).isDirectory());
let lessons = 0;
for (const topic of topics) {
  for (const f of fs.readdirSync(path.join(CONTENT, topic)).filter((x) => x.endsWith('.ts')).sort()) {
    const file = path.join(CONTENT, topic, f);
    const mod = await load(file);
    const rel = path.relative(ROOT, file);
    if (mod.lesson) {
      const l = mod.lesson;
      lessons++;
      const stats = { pos: {}, longest: 0, n: 0 };
      walkStrings(rel, l);
      l.blocks.forEach((b, i) => checkBlock(`${rel} blocks[${i}](${b.type})`, b, stats));
      if (l.test.length !== 10) errors.push(`${rel}: test has ${l.test.length} questions (needs 10)`);
      l.test.forEach((q, i) => checkMcq(`${rel} test[${i + 1}]`, q, stats));
      // A pure-skills lesson that cites nothing may have empty sources; otherwise sources are required.
      const citesSomething = JSON.stringify(l.blocks.concat(l.test)).includes('"doc":');
      if (citesSomething || l.sources.length) checkRefs(`${rel} sources`, l.sources);
      const anchors = new Set();
      const collect = (b) => { if (b.anchor) anchors.add(b.anchor); b.blocks?.forEach(collect); };
      l.blocks.forEach(collect);
      for (const [a, label] of l.jumps) {
        if (!anchors.has(a)) errors.push(`${rel}: jump "${a}" has no matching anchor`);
        if ([...label].length > 9) warnings.push(`${rel}: jump label "${label}" may not fit at 360px (max 9 characters)`);
      }
      if (NEEDS_PRIORITY) {
        if (!PRIORITIES.has(l.priority)) errors.push(`${rel}: lesson needs priority must|maybe|skip`);
        l.blocks.forEach((b, i) => b.type === 'section' && !PRIORITIES.has(b.priority) && errors.push(`${rel} blocks[${i}]: section needs priority`));
        const checks = l.blocks.flatMap((b) => [b, ...(b.blocks ?? [])]).filter((b) => b.type === 'check').reduce((n, b) => n + b.questions.length, 0);
        if ((l.kind === 'practice' ? checks > 5 : checks < 3 || checks > 8)) errors.push(`${rel}: ${checks} check questions (needs 3–8: 3–5 in the main check, plus up to 3 for an optional section)`);
      }
      const share = Math.round((stats.longest / stats.n) * 100);
      if (share > 35) warnings.push(`${rel}: key is the longest choice in ${share}% of MCQs`);
      if (Object.values(stats.pos).some((c) => c > Math.ceil(stats.n * 0.4))) warnings.push(`${rel}: key positions unbalanced ${JSON.stringify(stats.pos)}`);
      console.log(`${rel}: ${l.blocks.length} blocks, ${stats.n} MCQs, key positions ${JSON.stringify(stats.pos)}, key longest ${share}%`);
    }
    if (mod.topicTest) {
      const stats = { pos: {}, longest: 0, n: 0 };
      walkStrings(rel, mod.topicTest);
      if (mod.topicTest.length !== 20) errors.push(`${rel}: topic test has ${mod.topicTest.length} questions (needs 20)`);
      mod.topicTest.forEach((q, i) => checkMcq(`${rel} topicTest[${i + 1}]`, q, stats));
      const share = Math.round((stats.longest / stats.n) * 100);
      if (share > 35) warnings.push(`${rel}: key is the longest choice in ${share}% of MCQs`);
      if (Object.values(stats.pos).some((c) => c > Math.ceil(stats.n * 0.4))) warnings.push(`${rel}: key positions unbalanced ${JSON.stringify(stats.pos)}`);
      console.log(`${rel}: topic test, ${stats.n} MCQs, key positions ${JSON.stringify(stats.pos)}, key longest ${share}%`);
    }
    if (mod.summary) {
      const s = mod.summary;
      walkStrings(rel, s);
      if (!s.flow.plain) checkRefs(`${rel} flow`, s.flow.refs);
      s.pieces.forEach((p, i) => !p.plain && checkRefs(`${rel} pieces[${i}]`, p.refs));
      s.numbers.forEach((n, i) => !n.plain && checkRefs(`${rel} numbers[${i}]`, n.refs));
      if (s.story) checkRefs(`${rel} story`, s.story.refs);
      if (s.compare) checkRefs(`${rel} compare`, s.compare.refs);
      if (JSON.stringify(s).includes('"doc":') || s.sources.length) checkRefs(`${rel} sources`, s.sources);
      console.log(`${rel}: summary, ${s.pieces.length} pieces, ${s.numbers.length} numbers`);
    }
  }
}

for (const w of warnings) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`\n${lessons} lessons · ${errors.length} errors · ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
