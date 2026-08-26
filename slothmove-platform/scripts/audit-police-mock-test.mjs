#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const EXAM_SET_ID = 'police-mock_test-set-01';
const INPUT_PATH = path.join(ROOT, 'content/exams/police-mock-test-set-01.json');
const EXPECTED_COUNTS = { math: 20, thai: 20, computer: 40, saraban: 30, law: 25, english: 15 };

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function normalize(text) {
  return String(text).toLowerCase().replace(/\s+/g, '').replace(/[“”‘’'".,!?():;\-–—/\\]/g, '');
}

function trigrams(text) {
  const value = normalize(text);
  const result = new Set();
  for (let index = 0; index <= value.length - 3; index += 1) result.add(value.slice(index, index + 3));
  return result;
}

function jaccard(left, right) {
  const a = trigrams(left);
  const b = trigrams(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function localAudit(payload) {
  const errors = [];
  const warnings = [];
  const questions = payload.questions ?? [];
  const subjectCounts = countBy(questions.map((question) => question.subjectId));

  if (questions.length !== 150) errors.push(`Expected 150 questions, found ${questions.length}`);
  if (payload.qualityNotes?.correctChoiceIndexBase !== 0) errors.push('correctChoiceIndexBase must be 0');
  for (const [subject, expected] of Object.entries(EXPECTED_COUNTS)) {
    if (subjectCounts[subject] !== expected) errors.push(`${subject}: expected ${expected}, found ${subjectCounts[subject] ?? 0}`);
  }

  const promptMap = new Map();
  const sourceMap = new Map();
  const answerDistribution = [0, 0, 0, 0];
  for (const [index, question] of questions.entries()) {
    const label = `Q${index + 1}`;
    if (question.position !== index + 1) errors.push(`${label}: position mismatch`);
    if (!question.prompt?.trim() || !question.explanation?.trim() || !question.tip?.trim()) errors.push(`${label}: incomplete text`);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${label}: expected four choices`);
    if (new Set(question.choices?.map(normalize)).size !== 4) errors.push(`${label}: duplicate choices`);
    if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex > 3) {
      errors.push(`${label}: invalid answer index`);
    } else {
      answerDistribution[question.correctChoiceIndex] += 1;
    }
    const promptKey = normalize(question.prompt);
    promptMap.set(promptKey, [...(promptMap.get(promptKey) ?? []), question.position]);
    const sourceKey = `${question.subjectId}:${question.sourceExamSetId}:${question.sourceQuestionId}`;
    sourceMap.set(sourceKey, [...(sourceMap.get(sourceKey) ?? []), question.position]);

    const finalLine = question.prompt.trim().split('\n').at(-1);
    if (/(ไม่ใช่|ไม่ถูกต้อง|กล่าวผิด)/.test(finalLine) && question.tip.startsWith('จุดจำ:')) {
      errors.push(`${label}: unsafe negative-prompt tip`);
    }
  }

  for (const positions of promptMap.values()) if (positions.length > 1) errors.push(`Exact duplicate prompts: Q${positions.join(', Q')}`);
  for (const positions of sourceMap.values()) if (positions.length > 1) errors.push(`Repeated source item: Q${positions.join(', Q')}`);

  const nearDuplicates = [];
  for (let left = 0; left < questions.length; left += 1) {
    for (let right = left + 1; right < questions.length; right += 1) {
      if (questions[left].subjectId !== questions[right].subjectId) continue;
      const similarity = jaccard(questions[left].prompt, questions[right].prompt);
      if (similarity >= 0.82) nearDuplicates.push({ left: left + 1, right: right + 1, similarity: Number(similarity.toFixed(3)) });
    }
  }
  if (nearDuplicates.length) warnings.push(`Near-duplicate candidates: ${JSON.stringify(nearDuplicates)}`);

  const thaiReadingCategories = new Set([
    'การอ่านจับใจความ', 'การตีความคำประพันธ์', 'การตีความคำในบริบท',
    'วัตถุประสงค์ของผู้เขียน', 'การอนุมาน', 'น้ำเสียงของผู้เขียน'
  ]);
  const thai = questions.filter((question) => question.subjectId === 'thai');
  const thaiDistribution = {
    reading: thai.filter((question) => thaiReadingCategories.has(question.originalCategory)).length,
    language: thai.filter((question) => !thaiReadingCategories.has(question.originalCategory)).length
  };

  const sarabanPositions = questions.filter((question) => question.subjectId === 'saraban').map((question) => question.sourcePosition);
  const sarabanDistribution = {
    A: sarabanPositions.filter((position) => position <= 20).length,
    B: sarabanPositions.filter((position) => position >= 21 && position <= 37).length,
    C: sarabanPositions.filter((position) => position >= 38 && position <= 45).length,
    D: sarabanPositions.filter((position) => position >= 46).length
  };

  const lawPositions = questions.filter((question) => question.subjectId === 'law').map((question) => question.sourcePosition);
  const lawDistribution = {
    generalAdmin: lawPositions.filter((position) => position <= 8).length,
    constitution: lawPositions.filter((position) => position >= 9 && position <= 15).length,
    civil: lawPositions.filter((position) => position >= 16 && position <= 33).length,
    criminal: lawPositions.filter((position) => position >= 34 && position <= 45).length,
    consumerRegistration: lawPositions.filter((position) => position >= 46).length
  };

  const englishDistribution = countBy(
    questions.filter((question) => question.subjectId === 'english').map((question) => question.originalCategory)
  );

  const expectedDna = {
    thai: { reading: 8, language: 12 },
    saraban: { A: 12, B: 10, C: 5, D: 3 },
    law: { generalAdmin: 4, constitution: 4, civil: 9, criminal: 6, consumerRegistration: 2 },
    english: { Conversation: 3, Vocabulary: 3, Reading: 3, Grammar: 6 }
  };
  const actualDna = { thai: thaiDistribution, saraban: sarabanDistribution, law: lawDistribution, english: englishDistribution };
  if (JSON.stringify(actualDna) !== JSON.stringify(expectedDna)) errors.push(`DNA mismatch: ${JSON.stringify(actualDna)}`);

  const supplements = questions.filter((question) => question.sourceType === 'dna-derived-unique-item');
  if (supplements.length !== 10) errors.push(`Expected 10 computer supplements, found ${supplements.length}`);

  const password = questions.find((question) => question.prompt.includes('แนวทางปฏิบัติที่ดีที่สุดในการตั้งรหัสผ่าน'));
  if (!password?.choices[password.correctChoiceIndex].includes('15 ตัวอักษร') || !password.explanation.includes('NIST SP 800-63B-4')) {
    errors.push('Current NIST password correction is missing');
  }
  const ownerNumber = questions.find((question) => question.prompt.includes('ตัวเลขสองตัวหลังของส่วนราชการระดับกรม'));
  if (ownerNumber?.choices[ownerNumber.correctChoiceIndex] !== 'สำนัก กอง หรือส่วนราชการที่มีฐานะเทียบกอง') {
    errors.push('Saraban owner-number correction is missing');
  }
  const versionNumber = questions.find((question) => question.prompt.includes("การลง ‘ฉบับที่’ ของระเบียบ"));
  if (!versionNumber || !versionNumber.explanation.includes('ข้อ 17.3')) errors.push('Saraban version-number correction is missing');

  if (Math.min(...answerDistribution) < 20 || Math.max(...answerDistribution) > 60) {
    warnings.push(`Skewed answer distribution: ${answerDistribution.join('/')}`);
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    summary: {
      total: questions.length,
      subjectCounts,
      answerDistribution,
      exactDuplicateGroups: [...promptMap.values()].filter((positions) => positions.length > 1).length,
      repeatedSourceGroups: [...sourceMap.values()].filter((positions) => positions.length > 1).length,
      nearDuplicateCandidates: nearDuplicates,
      dna: actualDna,
      supplements: supplements.length
    }
  };
}

async function remoteAudit(payload) {
  loadEnvFile(path.join(ROOT, '.env.local'));
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase credentials are missing');
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: mappings, error: mappingError } = await supabase
    .from('exam_set_questions')
    .select('question_id,position')
    .eq('exam_set_id', EXAM_SET_ID)
    .order('position');
  if (mappingError) throw mappingError;
  const ids = mappings.map((mapping) => mapping.question_id);
  const [{ data: questions, error: questionError }, { data: solutions, error: solutionError }] = await Promise.all([
    supabase.from('questions').select('id,prompt,choices,metadata').in('id', ids),
    supabase.from('question_solutions').select('question_id,correct_choice_index,explanation,tip').in('question_id', ids)
  ]);
  if (questionError) throw questionError;
  if (solutionError) throw solutionError;
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const solutionById = new Map(solutions.map((solution) => [solution.question_id, solution]));
  const errors = [];
  if (mappings.length !== 150) errors.push(`Remote mapping count is ${mappings.length}`);
  for (const [index, local] of payload.questions.entries()) {
    const mapping = mappings[index];
    const remoteQuestion = questionById.get(mapping?.question_id);
    const remoteSolution = solutionById.get(mapping?.question_id);
    if (!mapping || mapping.position !== local.position) errors.push(`Q${index + 1}: remote position mismatch`);
    if (!remoteQuestion || !remoteSolution) {
      errors.push(`Q${index + 1}: remote row missing`);
      continue;
    }
    if (remoteQuestion.prompt !== local.prompt) errors.push(`Q${index + 1}: remote prompt differs`);
    if (JSON.stringify(remoteQuestion.choices) !== JSON.stringify(local.choices)) errors.push(`Q${index + 1}: remote choices differ`);
    if (remoteSolution.correct_choice_index !== local.correctChoiceIndex) errors.push(`Q${index + 1}: remote answer differs`);
    if (remoteSolution.explanation !== local.explanation) errors.push(`Q${index + 1}: remote explanation differs`);
    if (remoteSolution.tip !== local.tip) errors.push(`Q${index + 1}: remote tip differs`);
  }
  return { passed: errors.length === 0, errors, mappings: mappings.length };
}

async function main() {
  const payload = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));
  const local = localAudit(payload);
  const remote = process.argv.includes('--remote') ? await remoteAudit(payload) : null;
  const passed = local.passed && (!remote || remote.passed);
  console.log(JSON.stringify({ passed, local, remote }, null, 2));
  if (!passed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
