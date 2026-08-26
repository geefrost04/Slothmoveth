#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)=(.*)$/);
    if (!match) continue;
    process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '');
  }
}

function readQuestion(setNo, position) {
  const setId = `police-math-set-${String(setNo).padStart(2, '0')}`;
  const payload = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'content/exams', `${setId}-original.json`), 'utf8')
  );
  const question = payload.questions.find((item) => item.position === position);
  if (!question) throw new Error(`${setId} Q${position} is missing.`);
  return { setId, question };
}

loadEnvFile(path.join(ROOT, '.env.local'));
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) throw new Error('Supabase environment variables are missing.');

const set04q17 = {
  setId: 'police-math-set-04',
  question: {
    position: 17,
    category: 'เลขยกกำลัง',
    prompt: '(2⁸ × 4³) ÷ 8² มีค่าเท่ากับข้อใด',
    choices: ['2⁶', '2⁸', '2¹⁰', '2¹²'],
    correctChoiceIndex: 1,
    explanation: 'ทำทุกจำนวนให้อยู่ในรูปฐาน 2 โดย 4³ = (2²)³ = 2⁶ และ 8² = (2³)² = 2⁶ ดังนั้น (2⁸ × 2⁶) ÷ 2⁶ = 2⁸⁺⁶⁻⁶ = 2⁸ จึงตอบ 2⁸',
    tip: 'แปลงทุกจำนวนเป็นฐานเดียวกันก่อน แล้วใช้กฎคูณให้บวกเลขชี้กำลังและหารให้ลบเลขชี้กำลัง'
  }
};

const targets = [
  set04q17,
  readQuestion(6, 1),
  readQuestion(6, 28),
  readQuestion(7, 2),
  readQuestion(7, 4)
];

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const updated = [];
for (const { setId, question } of targets) {
  const questionId = `${setId}-q${String(question.position).padStart(2, '0')}`;
  const { error: questionError } = await supabase
    .from('questions')
    .update({
      category: question.category,
      prompt: question.prompt,
      choices: question.choices
    })
    .eq('id', questionId);
  if (questionError) throw new Error(`${questionId} question: ${questionError.message}`);

  const { error: solutionError } = await supabase
    .from('question_solutions')
    .update({
      correct_choice_index: question.correctChoiceIndex,
      explanation: question.explanation,
      tip: question.tip
    })
    .eq('question_id', questionId);
  if (solutionError) throw new Error(`${questionId} solution: ${solutionError.message}`);

  const { data, error: verifyError } = await supabase
    .from('questions')
    .select('id,category,prompt,choices,question_solutions(correct_choice_index,explanation,tip)')
    .eq('id', questionId)
    .single();
  if (verifyError) throw new Error(`${questionId} verify: ${verifyError.message}`);
  updated.push(data);
}

console.log(JSON.stringify({ updated }, null, 2));
