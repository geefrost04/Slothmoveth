#!/usr/bin/env node
// Run right after applying content/exams/police-thai-mock-audit-fixes-2026-11-13.json.
// That patch moves the key of 26 Thai questions by swapping two choice positions. Past attempts store
// selected_choice_index / correct_choice_index by position, and the wrong-answer book reads them against the
// current choice list (app/dashboard/page.tsx), so this script swaps the same two positions inside
// attempts.answers for those questions. is_correct and scores do not change.
// Idempotent: an answer is remapped only while its correct_choice_index still equals the old key.
// Dry-run by default. Usage: node scripts/police/remap-thai-attempt-indices.mjs [--apply]
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const patch = JSON.parse(fs.readFileSync('content/exams/police-thai-mock-audit-fixes-2026-11-13.json', 'utf8'));
// question id -> [oldKey, newKey]; each move is a swap of those two positions
const swaps = new Map(patch.fixes.filter((fix) => 'key' in fix.after).map((fix) => [fix.id, [fix.before.key, fix.after.key]]));

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = line.match(/^([^#=\s]+)=(.*)$/); if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data: attempts, error } = await db.from('attempts').select('id, answers').in('exam_set_id', ['police-thai-set-01', 'police-thai-set-02', 'police-thai-set-03']);
if (error) throw new Error(error.message);
const swap = (index, [a, b]) => (index === a ? b : index === b ? a : index);
let changedAnswers = 0; const updates = [];
for (const attempt of attempts) {
  let touched = false;
  const answers = (attempt.answers ?? []).map((answer) => {
    const pair = swaps.get(answer.question_id);
    if (!pair || answer.correct_choice_index !== pair[0]) return answer;
    touched = true; changedAnswers += 1;
    return { ...answer, correct_choice_index: pair[1], selected_choice_index: answer.selected_choice_index === null || answer.selected_choice_index === undefined ? answer.selected_choice_index : swap(answer.selected_choice_index, pair) };
  });
  if (touched) updates.push({ id: attempt.id, answers });
}
console.log(`${updates.length} attempts, ${changedAnswers} answers to remap`);
if (!APPLY) { console.log('dry-run: pass --apply to write'); process.exit(0); }
for (const update of updates) {
  const { error: updateError } = await db.from('attempts').update({ answers: update.answers }).eq('id', update.id);
  if (updateError) throw new Error(`${update.id}: ${updateError.message}`);
}
console.log('remapped');
