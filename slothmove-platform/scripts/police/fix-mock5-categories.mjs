#!/usr/bin/env node
// Mock Test 5 used 83 fine-grained categories (e.g. "อนุกรมตัวเลข") instead of the 6 subject names used by
// Mock Test 1–4, so its results could not be split by subject or by ภาค ก / ภาค ข (score planner, dashboard,
// police benchmark). This sets category = subject name, keeping the fine label as originalCategory.
// Dry-run by default; --apply updates the JSON file and the questions table.
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const FILE = 'content/exams/police-mock-test-set-05.json';
const APPLY = process.argv.includes('--apply');
const payload = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const changes = payload.questions.filter((q) => q.category !== q.subjectTitle);
console.log(`${changes.length} of ${payload.questions.length} questions need category → subject name`);
if (!APPLY) process.exit(0);

for (const q of payload.questions) {
  if (q.category !== q.subjectTitle) { q.originalCategory = q.originalCategory ?? q.category; q.category = q.subjectTitle; }
}
fs.writeFileSync(FILE, JSON.stringify(payload, null, 2) + '\n');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = line.match(/^([^#=\s]+)=(.*)$/); if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
for (const title of [...new Set(payload.questions.map((q) => q.subjectTitle))]) {
  const ids = payload.questions.filter((q) => q.subjectTitle === title).map((q) => `${payload.examSet.id}-q${String(q.position).padStart(3, '0')}`);
  const { error } = await db.from('questions').update({ category: title }).in('id', ids);
  if (error) throw new Error(`${title}: ${error.message}`);
  console.log(`${title}: ${ids.length} updated`);
}
