#!/usr/bin/env node
// Pilot exam-quality audit, round 1 (script checks) for one exam file.
// Read-only: never writes to content files or Supabase.
//
// Usage: node scripts/audit-pilot-quality.mjs [content/exams/<file>.json] [--db] [--blind=<out.json>]
//   --db         also compare prompt / choices / key with the live Supabase rows (read-only)
//   --blind=FILE write the questions without key or explanation, for blind solving
// Prints a JSON summary of findings to stdout.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const FILE = args.find((a) => !a.startsWith('--')) ?? 'content/exams/police-mock-test-set-01.json';
const CHECK_DB = args.includes('--db');
const BLIND = args.find((a) => a.startsWith('--blind='))?.slice('--blind='.length);
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const setId = data.examSet.id;
const questions = data.questions;
const findings = [];
const add = (q, check, severity, detail) => findings.push({ id: `${setId}-q${String(q.position).padStart(3, '0')}`, position: q.position, subject: q.subjectId, check, severity, detail });

// --- 1. Schema ---
questions.forEach((q, i) => {
  if (q.position !== i + 1) add(q, 'schema', 'high', `position ${q.position} at index ${i}`);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) add(q, 'schema', 'high', `has ${q.choices?.length} choices`);
  else if (new Set(q.choices.map((c) => c.trim())).size !== 4) add(q, 'schema', 'high', 'choices are not distinct');
  if (!Number.isInteger(q.correctChoiceIndex) || q.correctChoiceIndex < 0 || q.correctChoiceIndex >= (q.choices?.length ?? 0)) add(q, 'schema', 'high', `bad key ${q.correctChoiceIndex}`);
  if (!q.explanation?.trim()) add(q, 'schema', 'medium', 'no explanation');
  if (!q.tip?.trim()) add(q, 'schema', 'low', 'no tip');
  if (q.choices?.some((c) => !String(c).trim())) add(q, 'schema', 'high', 'empty choice');
  if (q.media?.src && !fs.existsSync(path.join('public', q.media.src))) add(q, 'schema', 'high', `missing image ${q.media.src}`);
});

// --- 2. Duplicates / near-duplicates (within the set and against every other exam file) ---
const compact = (v) => String(v ?? '').toLowerCase().replace(/\s+/g, '').replace(/[“”‘’'".,!?():;\-–—/\\…*]/g, '');
const grams = (v) => { const t = compact(v); const s = new Set(); for (let i = 0; i <= t.length - 3; i += 1) s.add(t.slice(i, i + 3)); return s; };
const jaccard = (a, b) => { if (!a.size || !b.size) return 0; let n = 0; for (const x of a) if (b.has(x)) n += 1; return n / (a.size + b.size - n); };
const fingerprint = (q) => `${q.prompt} ${[...q.choices].sort().join(' ')}`;
const own = questions.map((q) => ({ q, g: grams(fingerprint(q)) }));
for (let i = 0; i < own.length; i += 1) for (let j = i + 1; j < own.length; j += 1) {
  const s = jaccard(own[i].g, own[j].g);
  if (s >= 0.7) add(own[i].q, 'duplicate-in-set', s >= 0.9 ? 'high' : 'medium', `${Math.round(s * 100)}% similar to Q${own[j].q.position}`);
}
const others = [];
for (const name of fs.readdirSync('content/exams').filter((n) => n.endsWith('.json') && path.join('content/exams', n) !== path.normalize(FILE))) {
  try {
    const qs = JSON.parse(fs.readFileSync(path.join('content/exams', name), 'utf8')).questions;
    if (Array.isArray(qs)) qs.forEach((q) => q?.prompt && Array.isArray(q.choices) && others.push({ name, pos: q.position, g: grams(fingerprint(q)), key: q.choices[q.correctChoiceIndex], prompt: compact(q.prompt) }));
  } catch { /* not an exam file */ }
}
let crossDupes = 0;
let crossKeyConflicts = 0;
for (const { q, g } of own) {
  const hits = others.map((o) => ({ ...o, s: jaccard(g, o.g) })).filter((o) => o.s >= 0.85).sort((a, b) => b.s - a.s);
  if (!hits.length) continue;
  crossDupes += 1;
  // Same question elsewhere with a different keyed answer is a real red flag.
  const conflict = hits.find((h) => h.prompt === compact(q.prompt) && h.key && compact(h.key) !== compact(q.choices[q.correctChoiceIndex]));
  if (conflict) { crossKeyConflicts += 1; add(q, 'key-conflict-other-file', 'high', `same prompt in ${conflict.name} Q${conflict.pos} keys "${conflict.key}" but this set keys "${q.choices[q.correctChoiceIndex]}"`); }
  q.__dupes = hits.slice(0, 3).map((h) => `${h.name}#${h.pos} (${Math.round(h.s * 100)}%)`);
}

// --- 3. Answer position and "correct is the longest choice" bias ---
const positions = [0, 0, 0, 0];
let longest = 0;
let longestEligible = 0;
const len = (c) => [...String(c)].length;
for (const q of questions) {
  positions[q.correctChoiceIndex] += 1;
  const lens = q.choices.map(len);
  const max = Math.max(...lens);
  if (lens.filter((l) => l === max).length === 1 && max - [...lens].sort((a, b) => b - a)[1] >= 4) {
    longestEligible += 1;
    if (lens[q.correctChoiceIndex] === max) longest += 1;
  }
}
const bySubject = {};
for (const q of questions) {
  bySubject[q.subjectId] ??= [0, 0, 0, 0];
  bySubject[q.subjectId][q.correctChoiceIndex] += 1;
}

// --- 4. Wording flags ---
// A negative question: "ข้อใด…ไม่ / ผิด" or a stem ending in ไม่ถูกต้อง / ผิด / ไม่ใช่ (not "ความผิด" inside a clause).
const NEGATIVE = /(ข้อใด(?:ต่อไปนี้)?(?:กล่าว)?\s*(?:ไม่|ผิด)|(?:ไม่ถูกต้อง|ไม่ใช่|(?<!ความ)ผิด|ยกเว้น)(?:[^ก-๙]|$)|\bNOT\b|\bEXCEPT\b|incorrect)/i;
const EMPHASIS = /(\*\*[^*]*(ไม่|ยกเว้น|ผิด|NOT|EXCEPT)[^*]*\*\*|“[^”]*(ไม่|ยกเว้น|ผิด)[^”]*”|"[^"]*(ไม่|ยกเว้น|ผิด|NOT)[^"]*"|\bNOT\b|\bEXCEPT\b)/;
const ALL_NONE = /(ถูกทุกข้อ|ถูกทั้งหมด|ผิดทุกข้อ|ไม่มีข้อใดถูก|ไม่มีข้อถูก|ถูกทั้ง|ทั้ง ?ก ?และ ?ข|all of the above|none of the above)/i;
for (const q of questions) {
  const stem = q.prompt.split('\n')[0];
  if (/ข้อใด|อะไร|คือ|which|what/i.test(stem) && NEGATIVE.test(stem) && !EMPHASIS.test(stem)) add(q, 'negative-not-emphasised', 'low', stem.slice(0, 120));
  // Leftovers from the source material ("ตามต้นฉบับ", "ตัวเลือกของต้นฉบับ") read oddly to a candidate.
  if (/ต้นฉบับ|ในเอกสาร|ตามไฟล์|NotebookLM/i.test(q.prompt + q.choices.join(' '))) add(q, 'source-wording-leak', 'medium', q.prompt.split('\n')[0].slice(0, 120));
  q.choices.forEach((c, i) => { if (ALL_NONE.test(c)) add(q, 'all-or-none-choice', i === q.correctChoiceIndex ? 'medium' : 'low', `choice ${'กขคง'[i]} "${c}"${i === q.correctChoiceIndex ? ' is the key' : ''}`); });
}

// --- 5. Arithmetic: recompute "a op b = c" steps and check the final number matches the key ---
const toNum = (s) => Number(String(s).replace(/,/g, ''));
for (const q of questions.filter((item) => item.subjectId === 'math')) {
  // Each "=" is checked against the whole math run on its left (so "3 × 3 + 2 = 11" is read as one chain).
  const text = q.explanation.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/(\d),(\d{3})(?!\d)/g, '$1$2');
  for (const m of text.matchAll(/([\d\s.+\-*/()]+?)=\s*(-?\d+(?:\.\d+)?)/g)) {
    const expr = m[1].trim().replace(/^[+*/)\s]+/, '');
    if (!/\d\s*[+\-*/]\s*[\d(]/.test(expr) || /[+\-*/(]$/.test(expr)) continue;
    if ((expr.match(/\(/g) ?? []).length !== (expr.match(/\)/g) ?? []).length) continue;
    let v;
    try { v = Function(`"use strict"; return (${expr});`)(); } catch { continue; }
    const c = Number(m[2]);
    // Allow rounding to the shown precision.
    const decimals = (m[2].split('.')[1] ?? '').length;
    if (!Number.isFinite(v) || Math.abs(v - c) <= 0.5 * 10 ** -decimals + 1e-9) continue;
    add(q, 'arithmetic', 'high', `explanation says ${expr} = ${m[2]}, but it is ${+v.toFixed(4)}`);
  }
  const key = q.choices[q.correctChoiceIndex];
  const keyNums = (key.match(/-?\d[\d,]*(?:\.\d+)?/g) ?? []).map(toNum);
  const explNums = (q.explanation.match(/-?\d[\d,]*(?:\.\d+)?/g) ?? []).map(toNum);
  if (keyNums.length && !keyNums.every((n) => explNums.includes(n))) add(q, 'explanation-vs-key', 'high', `keyed choice "${key}" does not appear in the explanation`);
  // Another choice named as the final result is a stronger hint of a mismatch.
  const last = explNums.at(-1);
  const otherHit = q.choices.findIndex((c, i) => i !== q.correctChoiceIndex && (c.match(/-?\d[\d,]*(?:\.\d+)?/g) ?? []).map(toNum).includes(last) && !keyNums.includes(last));
  if (otherHit >= 0 && last !== undefined) add(q, 'explanation-vs-key', 'medium', `explanation ends on ${last}, which is choice ${'กขคง'[otherHit]}, not the key`);
}

// --- 6. Live DB matches the file ---
let db = null;
if (CHECK_DB) {
  const { createClient } = await import('@supabase/supabase-js');
  for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = line.match(/^([^#=\s]+)=(.*)$/); if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, ''); }
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data: links, error } = await client.from('exam_set_questions').select('position, question_id').eq('exam_set_id', setId).order('position');
  if (error) throw error;
  const ids = links.map((l) => l.question_id);
  const rows = [];
  const sols = [];
  for (let i = 0; i < ids.length; i += 100) {
    const part = ids.slice(i, i + 100);
    rows.push(...(await client.from('questions').select('id, prompt, choices').in('id', part)).data);
    sols.push(...(await client.from('question_solutions').select('question_id, correct_choice_index').in('question_id', part)).data);
  }
  const byId = new Map(rows.map((r) => [r.id, r]));
  const keyById = new Map(sols.map((s) => [s.question_id, s.correct_choice_index]));
  let mismatches = 0;
  for (const link of links) {
    const q = questions[link.position - 1];
    const row = byId.get(link.question_id);
    const diffs = [];
    if (!q || !row) diffs.push('missing');
    else {
      if (compact(row.prompt) !== compact(q.prompt)) diffs.push('prompt');
      if (JSON.stringify(row.choices.map(compact)) !== JSON.stringify(q.choices.map(compact))) diffs.push('choices');
      if (keyById.get(link.question_id) !== q.correctChoiceIndex) diffs.push(`key db=${keyById.get(link.question_id)} file=${q.correctChoiceIndex}`);
    }
    if (diffs.length) { mismatches += 1; add(q ?? { position: link.position, subjectId: '?' }, 'db-vs-file', 'high', `${link.question_id}: ${diffs.join(', ')}`); }
  }
  db = { linked: links.length, mismatches };
}

if (BLIND) {
  fs.writeFileSync(BLIND, JSON.stringify(questions.map((q) => ({
    id: `Q${q.position}`, subject: q.subjectId, topic: q.originalCategory ?? q.category, prompt: q.prompt,
    choices: Object.fromEntries(q.choices.map((c, i) => ['กขคง'[i], c])),
    ...(q.media?.src ? { image: q.media.src, imageAlt: q.media.alt } : {})
  })), null, 1));
}

const order = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.position - b.position);
console.log(JSON.stringify({
  file: FILE, setId, questions: questions.length,
  answerPositions: Object.fromEntries(positions.map((n, i) => ['กขคง'[i], n])),
  answerPositionsBySubject: bySubject,
  longestChoiceIsKey: { eligible: longestEligible, keyIsLongest: longest, rate: +(longest / Math.max(1, longestEligible)).toFixed(2), chance: 0.25 },
  crossFileNearDuplicates: crossDupes, crossFileKeyConflicts: crossKeyConflicts,
  db,
  countsByCheck: findings.reduce((acc, f) => ({ ...acc, [f.check]: (acc[f.check] ?? 0) + 1 }), {}),
  findings,
  duplicatesElsewhere: questions.filter((q) => q.__dupes).map((q) => ({ position: q.position, matches: q.__dupes }))
}, null, 2));
