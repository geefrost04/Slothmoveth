import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];
const outputPath = process.argv[3] || 'scripts/seed-police-math-set-02.sql';

if (!inputPath) {
  throw new Error('Usage: node scripts/generate-police-math-set-02-seed.mjs <input.json> [output.sql]');
}

const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const questions = payload.questions;

if (!Array.isArray(questions) || questions.length !== 30) {
  throw new Error(`Expected 30 questions, received ${questions?.length ?? 0}`);
}

const normalized = questions.map((question, index) => {
  const position = index + 1;
  if (question.question_no !== position) throw new Error(`Question order mismatch at ${position}`);
  if (!Array.isArray(question.choices) || question.choices.length !== 4) throw new Error(`Invalid choices at ${position}`);
  if (question.choices[question.correct_choice_no - 1] !== question.correct_answer) {
    throw new Error(`Answer mapping mismatch at ${position}`);
  }

  const choiceImages = [28, 29].includes(position)
    ? question.choices.map((choice, choiceIndex) => ({
        src: `/exams/police-math-set-02/q${String(position).padStart(3, '0')}-choice-${String.fromCharCode(97 + choiceIndex)}.svg`,
        alt: choice
      }))
    : undefined;

  return {
    position,
    category: question.category,
    subcategory: question.subcategory,
    difficulty: question.difficulty,
    prompt: question.question,
    choices: question.choices,
    correct_choice_index: question.correct_choice_no - 1,
    explanation: question.explanation,
    tip: question.tip,
    source_question_id: question.question_id,
    media: question.requires_visual
      ? {
          src: `/exams/police-math-set-02/${path.basename(question.image_path)}`,
          alt: `ภาพประกอบข้อ ${position}: ${question.subcategory}`,
          ...(choiceImages ? { choiceImages } : {})
        }
      : {}
  };
});

const json = JSON.stringify(normalized).replaceAll('$questions$', '$ questions $');
const sourceName = path.basename(inputPath);
const sourceSql = `'${sourceName.replaceAll("'", "''")}'`;

const sql = `begin;

insert into public.products (id, title, description, price, type, metadata, is_published)
values (
  'police_math_set_02_free',
  'คณิตศาสตร์ ชุดที่ 2',
  'ข้อสอบตำรวจ วิชาความสามารถทั่วไป ชุดที่ 2 จำนวน 30 ข้อ พร้อมเฉลย',
  1900,
  'exam_set',
  '{"course_id":"police_admin","subject_id":"math","access_type":"paid"}'::jsonb,
  true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  type = excluded.type,
  metadata = excluded.metadata,
  is_published = excluded.is_published;

insert into public.exam_sets (
  id, course_id, subject_id, product_id, title, description, source_label,
  access_type, duration_minutes, total_questions, metadata, is_published
)
values (
  'police-math-set-02',
  'police_admin',
  'math',
  'police_math_set_02_free',
  'คณิตศาสตร์ ชุดที่ 2',
  'อนุกรม อุปมาอุปไมย การคำนวณ สมการ ความน่าจะเป็น เรขาคณิต เซต ตรรกศาสตร์ และมิติสัมพันธ์',
  'SlothMoveTH Template 1 Clone: QA Passed',
  'paid',
  45,
  30,
  jsonb_build_object('version', 2, 'qa_status', 'passed', 'content_source', ${sourceSql}),
  true
)
on conflict (id) do update set
  product_id = excluded.product_id,
  title = excluded.title,
  description = excluded.description,
  source_label = excluded.source_label,
  access_type = excluded.access_type,
  duration_minutes = excluded.duration_minutes,
  total_questions = excluded.total_questions,
  metadata = excluded.metadata,
  is_published = excluded.is_published,
  updated_at = timezone('utc'::text, now());

insert into public.product_items (product_id, subject_id, item_id)
select 'police_math_set_02_free', 'math', 'police-math-set-02'
where not exists (
  select 1 from public.product_items
  where product_id = 'police_math_set_02_free'
    and subject_id = 'math'
    and item_id = 'police-math-set-02'
);

create temporary table seed_police_math_set_02 (
  position integer primary key,
  data jsonb not null
) on commit drop;

insert into seed_police_math_set_02 (position, data)
select (value->>'position')::integer, value
from jsonb_array_elements($questions$${json}$questions$::jsonb);

insert into public.questions (id, category, prompt, choices, media, metadata)
select
  'police-math-set-02-q' || lpad(position::text, 2, '0'),
  data->>'category',
  data->>'prompt',
  data->'choices',
  data->'media',
  jsonb_build_object(
    'source_question_id', data->>'source_question_id',
    'subcategory', data->>'subcategory',
    'difficulty', data->>'difficulty',
    'qa_status', 'passed'
  )
from seed_police_math_set_02
on conflict (id) do update set
  category = excluded.category,
  prompt = excluded.prompt,
  choices = excluded.choices,
  media = excluded.media,
  metadata = excluded.metadata;

insert into public.question_solutions (question_id, correct_choice_index, explanation, tip, metadata)
select
  'police-math-set-02-q' || lpad(position::text, 2, '0'),
  (data->>'correct_choice_index')::integer,
  data->>'explanation',
  data->>'tip',
  jsonb_build_object('version', 2, 'qa_status', 'passed', 'source', ${sourceSql})
from seed_police_math_set_02
on conflict (question_id) do update set
  correct_choice_index = excluded.correct_choice_index,
  explanation = excluded.explanation,
  tip = excluded.tip,
  metadata = excluded.metadata;

insert into public.exam_set_questions (exam_set_id, question_id, position)
select
  'police-math-set-02',
  'police-math-set-02-q' || lpad(position::text, 2, '0'),
  position
from seed_police_math_set_02
on conflict (exam_set_id, question_id) do update set position = excluded.position;

do $$
declare
  seeded_count integer;
  solution_count integer;
  media_count integer;
begin
  select count(*) into seeded_count
  from public.exam_set_questions
  where exam_set_id = 'police-math-set-02';

  select count(*) into solution_count
  from public.exam_set_questions mapping
  join public.question_solutions solution on solution.question_id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-02';

  select count(*) into media_count
  from public.exam_set_questions mapping
  join public.questions question on question.id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-02'
    and question.media ? 'src';

  if seeded_count <> 30 or solution_count <> 30 or media_count <> 3 then
    raise exception 'Set 2 validation failed: questions %, solutions %, media %', seeded_count, solution_count, media_count;
  end if;
end $$;

commit;
`;

fs.writeFileSync(outputPath, sql);
console.log(`Generated ${outputPath} with ${normalized.length} questions.`);
