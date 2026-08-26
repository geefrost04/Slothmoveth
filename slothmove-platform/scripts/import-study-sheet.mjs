#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SOURCE = 'content/study-sheets/police-general-ability-summary.json';
const ASSET_TOKEN = /\{\{asset:([a-z0-9-]+)\}\}/g;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

function validate(payload) {
  assert(payload && typeof payload === 'object', 'Import source must be a JSON object.');
  assert(payload.sheet && Array.isArray(payload.sections) && Array.isArray(payload.assets), 'Expected sheet, sections, and assets.');
  assert(payload.sheet.section_count === 21, 'Expected sheet.section_count to equal 21.');
  assert(payload.sheet.chapter_count === 20, 'Expected sheet.chapter_count to equal 20.');
  assert(payload.sections.length === 21, `Expected 21 sections; received ${payload.sections.length}.`);

  const chapters = payload.sections.filter((section) => section.section_type === 'chapter');
  const quickReviews = payload.sections.filter((section) => section.section_type === 'quick_review');
  assert(chapters.length === 20, `Expected 20 chapters; received ${chapters.length}.`);
  assert(quickReviews.length === 1, `Expected 1 quick review; received ${quickReviews.length}.`);
  assert(
    chapters.map((section) => section.chapter_no).sort((a, b) => a - b).join(',') === Array.from({ length: 20 }, (_, index) => index + 1).join(','),
    'Chapter numbers must contain every value from 1 through 20.'
  );
  assert(
    payload.sections.map((section) => section.sort_order).sort((a, b) => a - b).join(',') === Array.from({ length: 21 }, (_, index) => index + 1).join(','),
    'Section sort_order must contain every value from 1 through 21.'
  );
  assert(duplicates(payload.sections.map((section) => section.slug)).length === 0, 'Section slugs must be unique.');
  assert(duplicates(payload.assets.map((asset) => asset.asset_key)).length === 0, 'Asset keys must be unique.');
  assert(payload.sections.every((section) => typeof section.content_md === 'string' && section.content_md.trim()), 'Every section must have non-empty content_md.');

  const assetKeys = new Set(payload.assets.map((asset) => asset.asset_key));
  const referencedAssets = new Set();
  for (const section of payload.sections) {
    for (const match of section.content_md.matchAll(ASSET_TOKEN)) referencedAssets.add(match[1]);
  }
  const missingAssets = [...referencedAssets].filter((key) => !assetKeys.has(key));
  assert(missingAssets.length === 0, `Missing asset metadata: ${missingAssets.join(', ')}`);
}

async function upsertOrThrow(query, label) {
  const { data, error } = await query;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

async function main() {
  const args = process.argv.slice(2);
  const validateOnly = args.includes('--validate-only');
  const sourcePath = resolve(process.cwd(), args.find((arg) => !arg.startsWith('--')) || DEFAULT_SOURCE);
  const payload = JSON.parse(await readFile(sourcePath, 'utf8'));
  validate(payload);
  assert(payload.assets.length === 13, `Expected 13 asset metadata records; received ${payload.assets.length}.`);

  if (validateOnly) {
    console.log(JSON.stringify({
      sheet: 1,
      sections: payload.sections.length,
      chapters: payload.sections.filter((section) => section.section_type === 'chapter').length,
      quick_review: payload.sections.filter((section) => section.section_type === 'quick_review').length,
      assets: payload.assets.length,
      status: 'valid'
    }, null, 2));
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert(url, 'Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  assert(serviceRoleKey, 'Set SUPABASE_SERVICE_ROLE_KEY. Never expose this key to browser code.');

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const now = new Date().toISOString();
  const sourceSheet = payload.sheet;

  const sheetRows = await upsertOrThrow(
    supabase
      .from('study_sheets')
      .upsert({
        slug: sourceSheet.slug,
        course_id: 'police_admin',
        subject_id: 'math',
        title: sourceSheet.title,
        description: sourceSheet.description,
        brand: sourceSheet.brand,
        content_format: sourceSheet.content_format,
        version: sourceSheet.version,
        status: sourceSheet.status,
        section_count: sourceSheet.section_count,
        chapter_count: sourceSheet.chapter_count,
        intro_md: sourceSheet.intro_md,
        references_md: sourceSheet.references_md,
        recommended_renderer: sourceSheet.recommended_renderer,
        metadata: { exam_type: sourceSheet.exam_type, source_subject: sourceSheet.subject },
        updated_at: now
      }, { onConflict: 'slug' })
      .select('id')
      .single(),
    'Upsert study sheet'
  );

  const sheetId = sheetRows.id;
  await upsertOrThrow(
    supabase.from('study_sheet_sections').upsert(
      payload.sections.map((section) => ({
        sheet_id: sheetId,
        section_type: section.section_type,
        chapter_no: section.chapter_no,
        slug: section.slug,
        title: section.title,
        sort_order: section.sort_order,
        content_md: section.content_md,
        visual_placeholders: section.visual_placeholders,
        updated_at: now
      })),
      { onConflict: 'sheet_id,slug' }
    ),
    'Upsert study sheet sections'
  );

  await upsertOrThrow(
    supabase.from('study_sheet_assets').upsert(
      payload.assets.map((asset) => ({
        sheet_id: sheetId,
        asset_key: asset.asset_key,
        asset_type: asset.type,
        title: asset.title,
        description: asset.description,
        alt_text: asset.alt_text,
        recommended_format: asset.recommended_format,
        recommended_aspect_ratio: asset.recommended_aspect_ratio,
        chapter_no: asset.chapter_no,
        updated_at: now
      })),
      { onConflict: 'sheet_id,asset_key' }
    ),
    'Upsert study sheet assets'
  );

  const [sectionResult, assetResult] = await Promise.all([
    supabase.from('study_sheet_sections').select('section_type,chapter_no,slug,sort_order,content_md').eq('sheet_id', sheetId),
    supabase.from('study_sheet_assets').select('asset_key').eq('sheet_id', sheetId)
  ]);
  if (sectionResult.error) throw sectionResult.error;
  if (assetResult.error) throw assetResult.error;

  const importedSections = sectionResult.data ?? [];
  const report = {
    sheet: 1,
    sections: importedSections.length,
    chapters: importedSections.filter((section) => section.section_type === 'chapter').length,
    quick_review: importedSections.filter((section) => section.section_type === 'quick_review').length,
    assets: assetResult.data?.length ?? 0
  };
  assert(report.sections === 21 && report.chapters === 20 && report.quick_review === 1 && report.assets === 13, `Database verification failed: ${JSON.stringify(report)}`);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
