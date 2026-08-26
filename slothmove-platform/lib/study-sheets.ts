import { cache } from 'react';
import { getSupabaseServer } from './supabase-server';
import type { StudySheet, StudySheetAsset, StudySheetBundle, StudySheetSection } from './study-sheet-types';

export const getPublishedStudySheet = cache(async (
  courseId: string,
  subjectId: string
): Promise<StudySheetBundle | null> => {
  const supabase = await getSupabaseServer();
  const { data: sheet, error: sheetError } = await supabase
    .from('study_sheets')
    .select('id,slug,course_id,subject_id,title,description,brand,content_format,version,status,section_count,chapter_count,intro_md,references_md,recommended_renderer,metadata,updated_at')
    .eq('course_id', courseId)
    .eq('subject_id', subjectId)
    .eq('status', 'published')
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sheetError) throw new Error(`Unable to load study sheet: ${sheetError.message}`);
  if (!sheet) return null;

  const [sectionsResult, assetsResult] = await Promise.all([
    supabase
      .from('study_sheet_sections')
      .select('id,sheet_id,section_type,chapter_no,slug,title,sort_order,content_md,visual_placeholders')
      .eq('sheet_id', sheet.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('study_sheet_assets')
      .select('id,sheet_id,asset_key,asset_type,title,description,alt_text,recommended_format,recommended_aspect_ratio,chapter_no,storage_bucket,storage_path,status,metadata')
      .eq('sheet_id', sheet.id)
      .order('chapter_no', { ascending: true, nullsFirst: false })
  ]);

  if (sectionsResult.error) throw new Error(`Unable to load study sheet sections: ${sectionsResult.error.message}`);
  if (assetsResult.error) throw new Error(`Unable to load study sheet assets: ${assetsResult.error.message}`);

  return {
    sheet: sheet as StudySheet,
    sections: (sectionsResult.data ?? []) as StudySheetSection[],
    assets: (assetsResult.data ?? []) as StudySheetAsset[]
  };
});

export function getStudySheetAssetUrl(asset: StudySheetAsset): string | null {
  const publicPath = asset.metadata?.public_path;
  if (typeof publicPath === 'string' && publicPath.startsWith('/')) return publicPath;

  if (asset.status !== 'ready' || !asset.storage_bucket || !asset.storage_path) return null;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return null;

  const bucket = encodeURIComponent(asset.storage_bucket);
  const objectPath = asset.storage_path.split('/').map(encodeURIComponent).join('/');
  return `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}
