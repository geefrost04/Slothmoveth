import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2] || 'content/exams/police-math-set-03-original.json';
const outputPath = process.argv[3] || 'scripts/seed-police-math-set-03.sql';
const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const questions = payload.questions;

if (!Array.isArray(questions) || questions.length !== 30) {
  throw new Error(`Expected 30 questions, received ${questions?.length ?? 0}`);
}

for (const [index, question] of questions.entries()) {
  const position = index + 1;
  if (question.position !== position) throw new Error(`Question order mismatch at ${position}`);
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    throw new Error(`Question ${position} must have exactly four choices`);
  }
  if (!Number.isInteger(question.correctChoiceIndex) || question.correctChoiceIndex < 0 || question.correctChoiceIndex > 3) {
    throw new Error(`Invalid answer index at question ${position}`);
  }
  if (!question.prompt || !question.explanation || !question.tip) {
    throw new Error(`Incomplete content at question ${position}`);
  }
  if (question.media?.src && !fs.existsSync(path.join('public', question.media.src))) {
    throw new Error(`Missing media at question ${position}: ${question.media.src}`);
  }
}

const normalized = questions.map(({ imagePrompt: _imagePrompt, ...question }) => question);
const json = JSON.stringify(normalized).replaceAll('$questions$', '$ questions $');
const sourceName = path.basename(inputPath);
const sqlString = (value) => `'${String(value).replaceAll("'", "''")}'`;

const sql = `begin;

insert into public.products (id, title, description, price, type, metadata, is_published)
values (
  'police_math_set_03_free',
  'คณิตศาสตร์ ชุดที่ 3',
  'ข้อสอบตำรวจ วิชาความสามารถทั่วไป ชุดที่ 3 จำนวน 30 ข้อ พร้อมเฉลย',
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
  'police-math-set-03',
  'police_admin',
  'math',
  'police_math_set_03_free',
  'คณิตศาสตร์ ชุดที่ 3',
  'ข้อสอบสร้างใหม่ ครอบคลุมอนุกรม การคำนวณ สมการ ความน่าจะเป็น เรขาคณิต ตรรกศาสตร์ และการวิเคราะห์ภาพ',
  'SlothMoveTH Original Set 3',
  'paid',
  45,
  30,
  jsonb_build_object('version', 3, 'qa_status', 'passed', 'content_source', ${sqlString(sourceName)}, 'original_content', true),
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
select 'police_math_set_03_free', 'math', 'police-math-set-03'
where not exists (
  select 1 from public.product_items
  where product_id = 'police_math_set_03_free'
    and subject_id = 'math'
    and item_id = 'police-math-set-03'
);

create temporary table seed_police_math_set_03 (
  position integer primary key,
  data jsonb not null
) on commit drop;

insert into seed_police_math_set_03 (position, data)
select (value->>'position')::integer, value
from jsonb_array_elements($questions$${json}$questions$::jsonb);

insert into public.questions (id, category, prompt, choices, media, metadata)
select
  'police-math-set-03-q' || lpad(position::text, 2, '0'),
  data->>'category',
  data->>'prompt',
  data->'choices',
  coalesce(data->'media', '{}'::jsonb),
  jsonb_build_object('source_question_no', position, 'qa_status', 'passed', 'original_content', true)
from seed_police_math_set_03
on conflict (id) do update set
  category = excluded.category,
  prompt = excluded.prompt,
  choices = excluded.choices,
  media = excluded.media,
  metadata = excluded.metadata;

insert into public.question_solutions (question_id, correct_choice_index, explanation, tip, metadata)
select
  'police-math-set-03-q' || lpad(position::text, 2, '0'),
  (data->>'correctChoiceIndex')::integer,
  data->>'explanation',
  data->>'tip',
  jsonb_build_object('version', 3, 'qa_status', 'passed', 'source', ${sqlString(sourceName)})
from seed_police_math_set_03
on conflict (question_id) do update set
  correct_choice_index = excluded.correct_choice_index,
  explanation = excluded.explanation,
  tip = excluded.tip,
  metadata = excluded.metadata;

insert into public.exam_set_questions (exam_set_id, question_id, position)
select
  'police-math-set-03',
  'police-math-set-03-q' || lpad(position::text, 2, '0'),
  position
from seed_police_math_set_03
on conflict (exam_set_id, question_id) do update set position = excluded.position;

do $$
declare
  seeded_count integer;
  solution_count integer;
  media_count integer;
begin
  select count(*) into seeded_count
  from public.exam_set_questions
  where exam_set_id = 'police-math-set-03';

  select count(*) into solution_count
  from public.exam_set_questions mapping
  join public.question_solutions solution on solution.question_id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-03';

  select count(*) into media_count
  from public.exam_set_questions mapping
  join public.questions question on question.id = mapping.question_id
  where mapping.exam_set_id = 'police-math-set-03'
    and question.media ? 'src';

  if seeded_count <> 30 or solution_count <> 30 or media_count <> 4 then
    raise exception 'Set 3 validation failed: questions %, solutions %, media %', seeded_count, solution_count, media_count;
  end if;
end $$;

commit;
`;

fs.writeFileSync(outputPath, sql);
console.log(`Generated ${outputPath} with ${normalized.length} original questions.`);
