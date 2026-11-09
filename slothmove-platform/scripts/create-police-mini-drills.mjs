#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const apply = process.argv.includes('--apply');
const drills = [
  {
    id: 'police-mini_mock-set-03', title: 'Mini Drill คณิตและการคิดคำนวณ',
    description: 'ฝึกเร็วการคำนวณ ห.ร.ม. ค.ร.น. เลขฐาน และพีชคณิต',
    source: 'police-math-category-foundations', positions: [1, 5, 9, 14, 18, 22, 26, 31, 35, 40],
    paidSource: 'police-mock_test-set-05', paidPositions: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    answerIndexes: [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 0, 2, 1, 3, 0, 2, 3, 1, 0, 2]
  },
  {
    id: 'police-mini_mock-set-04', title: 'Mini Drill ภาษาไทย',
    description: 'ฝึกเร็วการอ่าน การตีความ การใช้คำ และหลักภาษาไทยให้หลากหลาย',
    source: 'police-thai-set-01', positions: [1, 6, 11, 7, 21, 22, 24, 26, 33, 35],
    paidSource: 'police-mock_test-set-05', paidPositions: [21, 23, 25, 27, 29, 31, 33, 35, 37, 39],
    answerIndexes: [1, 3, 0, 2, 3, 1, 2, 0, 1, 3, 0, 2, 1, 3, 0, 2, 3, 1, 0, 2]
  },
  {
    id: 'police-mini_mock-set-05', title: 'Mini Drill คอมพิวเตอร์',
    description: 'ฝึกเร็วระบบคอมพิวเตอร์ อินเทอร์เน็ต และโปรแกรมสำนักงาน',
    source: 'police-computer-set-01', positions: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28],
    paidSource: 'police-mock_test-set-05', paidPositions: [41, 43, 46, 49, 52, 55, 58, 61, 65, 71],
    answerIndexes: [3, 1, 0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 0, 2, 3, 1, 0, 2]
  },
  {
    id: 'police-mini_mock-set-06', title: 'Mini Drill งานสารบรรณ',
    description: 'ฝึกเร็วรูปแบบหนังสือราชการและระเบียบงานสารบรรณ',
    source: 'police-saraban-set-01', positions: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    paidSource: 'police-mock_test-set-05', paidPositions: [81, 83, 87, 90, 93, 96, 101, 104, 107, 110],
    answerIndexes: [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 0, 2, 1, 3, 1, 0, 3, 2]
  },
  {
    id: 'police-mini_mock-set-07', title: 'Mini Drill กฎหมาย',
    description: 'ฝึกเร็วกฎหมายพื้นฐานสำหรับสอบนายสิบตำรวจ',
    source: 'police-law-set-01', positions: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    paidSource: 'police-mock_test-set-05', paidPositions: [111, 113, 115, 117, 119, 122, 125, 128, 131, 134],
    answerIndexes: [1, 0, 2, 3, 1, 3, 0, 2, 1, 0, 2, 3, 0, 2, 1, 3, 2, 0, 3, 1]
  },
  {
    id: 'police-mini_mock-set-08', title: 'Mini Drill ภาษาอังกฤษ',
    description: 'ฝึกเร็วคำศัพท์ ไวยากรณ์ การอ่าน และบทสนทนาภาษาอังกฤษ',
    source: 'police-english-set-01', positions: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28],
    paidSource: 'police-mock_test-set-05', paidPositions: [136, 137, 139, 141, 142, 144, 146, 147, 149, 150],
    answerIndexes: [2, 3, 1, 0, 2, 0, 3, 1, 2, 3, 1, 0, 2, 1, 3, 0, 1, 0, 2, 3]
  },
  {
    id: 'police-mini_mock-set-09', title: 'Mini Drill คณิตและการคิดคำนวณ ชุด 2',
    description: 'ฝึกต่อด้วยอนุกรม ตรรกะ ร้อยละ สมการ และการวิเคราะห์ข้อมูล',
    source: 'police-mock_test-set-04', positions: [2, 4, 7, 10, 12, 14, 17, 20, 3, 5],
    paidSource: 'police-mock_test-set-05', paidPositions: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    sourceLabel: 'คัดจากคลัง Mock Test ที่เปิดให้ฝึกฟรี',
    answerIndexes: [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 0, 2, 1, 3, 0, 2, 3, 1, 0, 2]
  },
  {
    id: 'police-mini_mock-set-10', title: 'Mini Drill ภาษาไทย ชุด 2',
    description: 'ฝึกต่อเรื่องการใช้คำ ระดับภาษา สำนวน การเรียงประโยค และสรุปความ',
    source: 'police-mock_test-set-04', positions: [22, 24, 27, 30, 32, 35, 37, 40, 23, 25],
    paidSource: 'police-mock_test-set-05', paidPositions: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    sourceLabel: 'คัดจากคลัง Mock Test ที่เปิดให้ฝึกฟรี',
    answerIndexes: [1, 3, 0, 2, 3, 1, 2, 0, 1, 3, 0, 2, 1, 3, 0, 2, 3, 1, 0, 2]
  },
  {
    id: 'police-mini_mock-set-11', title: 'Mini Drill คอมพิวเตอร์ ชุด 2',
    description: 'ฝึกต่อฮาร์ดแวร์ ระบบปฏิบัติการ เครือข่าย ความปลอดภัย และผังภาพ',
    source: 'police-mock_test-set-04', positions: [41, 43, 45, 48, 51, 54, 58, 61, 65, 70],
    paidSource: 'police-mock_test-set-05', paidPositions: [42, 44, 45, 47, 48, 50, 51, 53, 54, 56],
    sourceLabel: 'คัดจากคลัง Mock Test ที่เปิดให้ฝึกฟรี',
    answerIndexes: [3, 1, 0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 0, 2, 3, 1, 0, 2]
  },
  {
    id: 'police-mini_mock-set-12', title: 'Mini Drill งานสารบรรณ ชุด 2',
    description: 'ฝึกต่อเรื่องหนังสือราชการ ชั้นความเร็ว ทะเบียน และเอกสารอิเล็กทรอนิกส์',
    source: 'police-mock_test-set-04', positions: [81, 84, 86, 89, 93, 96, 99, 101, 104, 108],
    paidSource: 'police-mock_test-set-05', paidPositions: [82, 84, 85, 86, 88, 89, 91, 92, 94, 95],
    sourceLabel: 'คัดจากคลัง Mock Test ที่เปิดให้ฝึกฟรี',
    answerIndexes: [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 0, 2, 1, 3, 1, 0, 3, 2]
  },
  {
    id: 'police-mini_mock-set-13', title: 'Mini Drill กฎหมาย ชุด 2',
    description: 'ฝึกต่อหลักกฎหมาย รัฐธรรมนูญ นิติกรรม สัญญา ละเมิด และกฎหมายอาญา',
    source: 'police-mock_test-set-04', positions: [111, 113, 116, 119, 122, 124, 127, 129, 132, 134],
    paidSource: 'police-mock_test-set-05', paidPositions: [112, 114, 116, 118, 120, 121, 123, 124, 126, 127],
    sourceLabel: 'คัดจากคลัง Mock Test ที่เปิดให้ฝึกฟรี',
    answerIndexes: [1, 0, 2, 3, 1, 3, 0, 2, 1, 0, 2, 3, 0, 2, 1, 3, 2, 0, 3, 1]
  },
  {
    id: 'police-mini_mock-set-14', title: 'Mini Drill ภาษาอังกฤษ ชุด 2',
    description: 'ฝึกต่ออีเมลทางการ ไวยากรณ์ คำบุพบท ป้ายสาธารณะ และการอ่าน',
    source: 'police-mock_test-set-04', positions: [137, 138, 139, 140, 142, 143, 144, 145, 147, 148, 149, 150],
    paidSource: 'police-mock_test-set-05', paidPositions: [138, 140, 143, 145, 148],
    supplementalSource: 'police-english-set-01', supplementalPositions: [2, 5, 8],
    sourceLabel: 'คัดจากคลัง Mock Test และข้อสอบฟรีที่เปิดให้ฝึกฟรี',
    answerIndexes: [2, 3, 1, 0, 2, 0, 3, 1, 2, 3, 1, 0, 2, 1, 3, 0, 1, 0, 2, 3]
  }
];

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const sources = [...new Set(drills.flatMap((drill) => [drill.source, drill.paidSource, drill.supplementalSource].filter(Boolean)))];
const { data: mappings, error: mappingError } = await supabase
  .from('exam_set_questions')
  .select('exam_set_id,question_id,position')
  .in('exam_set_id', sources);
if (mappingError) throw mappingError;
const mappingByKey = new Map(mappings.map((mapping) => [`${mapping.exam_set_id}:${mapping.position}`, mapping]));
function getSourceGroups(drill) {
  return [
    { examSetId: drill.source, positions: drill.positions },
    { examSetId: drill.paidSource, positions: drill.paidPositions },
    ...(drill.supplementalSource ? [{ examSetId: drill.supplementalSource, positions: drill.supplementalPositions }] : [])
  ];
}

const sourceQuestionIds = [...new Set(drills.flatMap((drill) => getSourceGroups(drill).flatMap(({ examSetId, positions }) => positions.map((position) => {
  const mapping = mappingByKey.get(`${examSetId}:${position}`);
  if (!mapping) throw new Error(`Missing ${examSetId} question ${position}`);
  return mapping.question_id;
}))))];

async function fetchInBatches(table, columns, key, ids) {
  const rows = [];
  for (let index = 0; index < ids.length; index += 75) {
    const { data, error } = await supabase.from(table).select(columns).in(key, ids.slice(index, index + 75));
    if (error) throw error;
    rows.push(...data);
  }
  return rows;
}

const [sourceQuestions, sourceSolutions] = await Promise.all([
  fetchInBatches('questions', 'id,category,prompt,choices,media,metadata', 'id', sourceQuestionIds),
  fetchInBatches('question_solutions', 'question_id,correct_choice_index,explanation,tip,metadata', 'question_id', sourceQuestionIds)
]);
const questionById = new Map(sourceQuestions.map((question) => [question.id, question]));
const solutionByQuestionId = new Map(sourceSolutions.map((solution) => [solution.question_id, solution]));

function cloneJson(value) {
  return value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;
}

function reorderQuestion(question, solution, correctChoiceIndex) {
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    throw new Error(`${question.id} must have exactly 4 choices`);
  }
  if (!Number.isInteger(solution.correct_choice_index) || solution.correct_choice_index < 0 || solution.correct_choice_index >= question.choices.length) {
    throw new Error(`${question.id} has an invalid source answer index`);
  }

  const sourceIndexes = [solution.correct_choice_index, ...question.choices.map((_, index) => index).filter((index) => index !== solution.correct_choice_index)];
  // Rotate the source order so the correct answer lands at the intended index.
  const orderedIndexes = Array.from({ length: question.choices.length }, (_, index) => sourceIndexes[(index - correctChoiceIndex + question.choices.length) % question.choices.length]);
  const media = cloneJson(question.media) ?? {};
  if (Array.isArray(media.choiceImages)) {
    if (media.choiceImages.length !== question.choices.length) {
      throw new Error(`${question.id} has choiceImages that do not match the choices`);
    }
    media.choiceImages = orderedIndexes.map((index) => media.choiceImages[index]);
  }
  return {
    choices: orderedIndexes.map((index) => question.choices[index]),
    media
  };
}

for (const drill of drills) {
  const selectQuestion = (sourceExamSetId, position) => {
    const mapping = mappingByKey.get(`${sourceExamSetId}:${position}`);
    if (!mapping) throw new Error(`Missing ${sourceExamSetId} question ${position}`);
    const question = questionById.get(mapping.question_id);
    const solution = solutionByQuestionId.get(mapping.question_id);
    if (!question || !solution) throw new Error(`Missing question or solution for ${mapping.question_id}`);
    return { mapping, question, solution, sourceExamSetId };
  };
  const sourceGroups = getSourceGroups(drill);
  const selected = sourceGroups.flatMap(({ examSetId, positions }) => positions.map((position) => selectQuestion(examSetId, position)));
  if (selected.length !== 20 || drill.answerIndexes.length !== 20 || sourceGroups.some(({ positions }) => new Set(positions).size !== positions.length)) {
    throw new Error(`${drill.id} must define 20 unique source questions and answer indexes`);
  }
  const answerDistribution = [0, 0, 0, 0];
  drill.answerIndexes.forEach((index) => { answerDistribution[index] += 1; });
  if (Math.max(...answerDistribution) - Math.min(...answerDistribution) > 1) {
    throw new Error(`${drill.id} has an unbalanced answer distribution: ${answerDistribution.join('/')}`);
  }
  console.log(`${drill.id}: ${selected.length} curated questions; answer distribution ${answerDistribution.join('/')}`);
  if (!apply) continue;

  const clonedQuestions = selected.map(({ mapping, question, solution, sourceExamSetId }, index) => {
    const targetAnswerIndex = drill.answerIndexes[index];
    const reordered = reorderQuestion(question, solution, targetAnswerIndex);
    const questionId = `${drill.id}-q${String(index + 1).padStart(2, '0')}`;
    return {
      id: questionId,
      category: question.category,
      prompt: question.prompt,
      choices: reordered.choices,
      media: reordered.media,
      metadata: {
        ...(cloneJson(question.metadata) ?? {}),
        derived_from_question_id: mapping.question_id,
        mini_drill: { version: 3, source_exam_set_id: sourceExamSetId, source_position: mapping.position, answer_order: targetAnswerIndex }
      },
      solution: {
        question_id: questionId,
        correct_choice_index: targetAnswerIndex,
        explanation: solution.explanation,
        tip: solution.tip,
        metadata: {
          ...(cloneJson(solution.metadata) ?? {}),
          derived_from_question_id: mapping.question_id,
          mini_drill: { version: 3, source_exam_set_id: sourceExamSetId, source_position: mapping.position }
        }
      }
    };
  });
  const { error: setError } = await supabase.from('exam_sets').upsert({
    id: drill.id, course_id: 'police_admin', subject_id: 'mini_mock', product_id: null,
    title: drill.title, description: drill.description, source_label: drill.sourceLabel ?? 'คัดจากคลังข้อสอบฟรีและ Mock Test ที่เปิดให้ฝึกฟรี',
    access_type: 'free', duration_minutes: 25, total_questions: 20, is_published: true,
    metadata: {
      format: 'mini_drill', source_exam_set_ids: sourceGroups.map(({ examSetId }) => examSetId),
      source_positions: sourceGroups.map(({ examSetId, positions }) => ({ exam_set_id: examSetId, positions })), version: 3
    }, updated_at: new Date().toISOString()
  }, { onConflict: 'id' });
  if (setError) throw setError;

  const { error: questionUpsertError } = await supabase.from('questions').upsert(
    clonedQuestions.map(({ solution, ...question }) => question),
    { onConflict: 'id' }
  );
  if (questionUpsertError) throw questionUpsertError;
  const { error: solutionUpsertError } = await supabase.from('question_solutions').upsert(
    clonedQuestions.map(({ solution }) => solution),
    { onConflict: 'question_id' }
  );
  if (solutionUpsertError) throw solutionUpsertError;
  const { error: deleteError } = await supabase.from('exam_set_questions').delete().eq('exam_set_id', drill.id);
  if (deleteError) throw deleteError;
  const { error: insertError } = await supabase.from('exam_set_questions').insert(clonedQuestions.map((question, index) => ({ exam_set_id: drill.id, question_id: question.id, position: index + 1, points: 1 })));
  if (insertError) throw insertError;
}
console.log(apply ? 'Mini Drills published.' : 'Dry run complete. Pass --apply to publish.');
