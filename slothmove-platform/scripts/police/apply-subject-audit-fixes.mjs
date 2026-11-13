#!/usr/bin/env node
// Applies the police subject-set audit fixes (13 Nov 2026) to Supabase.
// It only updates questions (prompt, choices) and question_solutions (correct_choice_index, explanation, tip)
// for the ids listed in the patch file. It never touches exam_sets, exam_set_questions, products, prices or Stripe,
// and question ids stay the same, so attempts and the wrong-answer book keep pointing at the right rows.
// Dry-run by default: checks that every row in the DB still equals the "before" value, then prints the plan.
// Usage: node scripts/police/apply-subject-audit-fixes.mjs [patch.json] [--apply]
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const patchPath = process.argv.slice(2).find((arg) => !arg.startsWith('--')) ?? 'content/exams/police-subject-sets-audit-fixes-2026-11-13.json';
const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = line.match(/^([^#=\s]+)=(.*)$/); if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const run = async (query, label) => { const { data, error } = await query; if (error) throw new Error(`${label}: ${error.message}`); return data; };
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const ids = patch.fixes.map((fix) => fix.id);
if (new Set(ids).size !== ids.length) throw new Error('patch has duplicate ids');
const questions = []; const solutions = [];
for (let i = 0; i < ids.length; i += 100) {
  const chunk = ids.slice(i, i + 100);
  questions.push(...await run(db.from('questions').select('id, prompt, choices').in('id', chunk), 'read questions'));
  solutions.push(...await run(db.from('question_solutions').select('question_id, correct_choice_index, explanation, tip').in('question_id', chunk), 'read solutions'));
}
const qById = new Map(questions.map((row) => [row.id, row]));
const sById = new Map(solutions.map((row) => [row.question_id, row]));
const live = (id) => { const q = qById.get(id); const s = sById.get(id); return q && s ? { prompt: q.prompt, choices: q.choices, key: s.correct_choice_index, explanation: s.explanation, tip: s.tip } : null; };

// Safety: the DB must still hold the "before" text for every field we change.
const problems = [];
for (const fix of patch.fixes) {
  const current = live(fix.id);
  if (!current) { problems.push(`${fix.id}: not in DB`); continue; }
  for (const field of Object.keys(fix.after)) {
    if (!same(current[field], fix.before[field])) problems.push(`${fix.id}.${field}: DB differs from "before", stopping`);
  }
  if (fix.after.choices && (fix.after.choices.length !== 4 || new Set(fix.after.choices).size !== 4)) problems.push(`${fix.id}: needs 4 distinct choices`);
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

const counts = {};
for (const fix of patch.fixes) for (const field of Object.keys(fix.after)) counts[field] = (counts[field] ?? 0) + 1;
console.log(`${patch.fixes.length} questions, fields: ${JSON.stringify(counts)}; key changes: ${patch.fixes.filter((fix) => 'key' in fix.after).map((fix) => fix.id).join(', ') || 'none'}`);
if (!APPLY) { console.log('dry-run: DB matches every "before" value; pass --apply to write'); process.exit(0); }

for (const fix of patch.fixes) {
  const { prompt, choices, key, explanation, tip } = fix.after;
  if (prompt !== undefined || choices !== undefined) {
    await run(db.from('questions').update({ ...(prompt !== undefined && { prompt }), ...(choices !== undefined && { choices }) }).eq('id', fix.id), `question ${fix.id}`);
  }
  if (key !== undefined || explanation !== undefined || tip !== undefined) {
    await run(db.from('question_solutions').update({ ...(key !== undefined && { correct_choice_index: key }), ...(explanation !== undefined && { explanation }), ...(tip !== undefined && { tip }) }).eq('question_id', fix.id), `solution ${fix.id}`);
  }
}

// Verify by reading back.
const after = [];
for (let i = 0; i < ids.length; i += 100) {
  const chunk = ids.slice(i, i + 100);
  const q = await run(db.from('questions').select('id, prompt, choices').in('id', chunk), 'verify questions');
  const s = await run(db.from('question_solutions').select('question_id, correct_choice_index, explanation, tip').in('question_id', chunk), 'verify solutions');
  for (const row of q) { const sol = s.find((x) => x.question_id === row.id); after.push({ id: row.id, prompt: row.prompt, choices: row.choices, key: sol.correct_choice_index, explanation: sol.explanation, tip: sol.tip }); }
}
const bad = patch.fixes.filter((fix) => { const row = after.find((x) => x.id === fix.id); return Object.entries(fix.after).some(([field, value]) => !same(row?.[field], value)); });
if (bad.length) { console.error(`verify failed: ${bad.map((fix) => fix.id).join(', ')}`); process.exit(1); }
console.log(`applied and verified ${patch.fixes.length} questions`);
