#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourcePath = resolve(process.cwd(), process.argv[2] || 'content/study-sheets/police-general-ability-summary.json');
const payload = JSON.parse(await readFile(sourcePath, 'utf8'));

const text = (value) => value == null ? 'null' : `'${String(value).replaceAll("'", "''")}'`;
const integer = (value) => value == null ? 'null' : String(value);
const textArray = (values) => values.length ? `array[${values.map(text).join(', ')}]::text[]` : `array[]::text[]`;
const sheet = payload.sheet;

const sectionValues = payload.sections.map((section) => `(
    target_sheet_id, ${text(section.section_type)}, ${integer(section.chapter_no)}, ${text(section.slug)},
    ${text(section.title)}, ${section.sort_order}, ${text(section.content_md)}, ${textArray(section.visual_placeholders)}, import_time
  )`).join(',\n  ');

const assetValues = payload.assets.map((asset) => `(
    target_sheet_id, ${text(asset.asset_key)}, ${text(asset.type)}, ${text(asset.title)}, ${text(asset.description)},
    ${text(asset.alt_text)}, ${text(asset.recommended_format)}, ${text(asset.recommended_aspect_ratio)}, ${integer(asset.chapter_no)}, import_time
  )`).join(',\n  ');

process.stdout.write(`-- Generated from ${sourcePath}. Do not edit content in this SQL output.
-- Idempotent upsert: no existing row is deleted.
do $study_sheet_import$
declare
  target_sheet_id uuid;
  import_time timestamptz := timezone('utc'::text, now());
begin
  insert into public.study_sheets (
    slug, course_id, subject_id, title, description, brand, content_format,
    version, status, section_count, chapter_count, intro_md, references_md,
    recommended_renderer, metadata, updated_at
  ) values (
    ${text(sheet.slug)}, 'police_admin', 'math', ${text(sheet.title)}, ${text(sheet.description)},
    ${text(sheet.brand)}, ${text(sheet.content_format)}, ${sheet.version}, ${text(sheet.status)},
    ${sheet.section_count}, ${sheet.chapter_count}, ${text(sheet.intro_md)}, ${text(sheet.references_md)},
    ${text(sheet.recommended_renderer)}, jsonb_build_object('exam_type', ${text(sheet.exam_type)}, 'source_subject', ${text(sheet.subject)}), import_time
  )
  on conflict (slug) do update set
    course_id = excluded.course_id,
    subject_id = excluded.subject_id,
    title = excluded.title,
    description = excluded.description,
    brand = excluded.brand,
    content_format = excluded.content_format,
    version = excluded.version,
    status = excluded.status,
    section_count = excluded.section_count,
    chapter_count = excluded.chapter_count,
    intro_md = excluded.intro_md,
    references_md = excluded.references_md,
    recommended_renderer = excluded.recommended_renderer,
    metadata = excluded.metadata,
    updated_at = excluded.updated_at
  returning id into target_sheet_id;

  insert into public.study_sheet_sections (
    sheet_id, section_type, chapter_no, slug, title, sort_order,
    content_md, visual_placeholders, updated_at
  ) values
  ${sectionValues}
  on conflict (sheet_id, slug) do update set
    section_type = excluded.section_type,
    chapter_no = excluded.chapter_no,
    title = excluded.title,
    sort_order = excluded.sort_order,
    content_md = excluded.content_md,
    visual_placeholders = excluded.visual_placeholders,
    updated_at = excluded.updated_at;

  insert into public.study_sheet_assets (
    sheet_id, asset_key, asset_type, title, description, alt_text,
    recommended_format, recommended_aspect_ratio, chapter_no, updated_at
  ) values
  ${assetValues}
  on conflict (sheet_id, asset_key) do update set
    asset_type = excluded.asset_type,
    title = excluded.title,
    description = excluded.description,
    alt_text = excluded.alt_text,
    recommended_format = excluded.recommended_format,
    recommended_aspect_ratio = excluded.recommended_aspect_ratio,
    chapter_no = excluded.chapter_no,
    updated_at = excluded.updated_at;
end
$study_sheet_import$;

select
  (select count(*) from public.study_sheets where slug = ${text(sheet.slug)}) as sheets,
  count(*) as sections,
  count(*) filter (where section_type = 'chapter') as chapters,
  count(*) filter (where section_type = 'quick_review') as quick_reviews,
  (select count(*) from public.study_sheet_assets asset where asset.sheet_id = section.sheet_id) as assets
from public.study_sheet_sections section
where section.sheet_id = (select id from public.study_sheets where slug = ${text(sheet.slug)})
group by section.sheet_id;
`);
