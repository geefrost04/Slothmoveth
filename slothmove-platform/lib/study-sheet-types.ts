export type StudySheet = {
  id: string;
  slug: string;
  course_id: string;
  subject_id: string;
  title: string;
  description: string;
  brand: string;
  content_format: 'markdown';
  version: number;
  status: 'published';
  section_count: number;
  chapter_count: number;
  intro_md: string;
  references_md: string;
  recommended_renderer: string | null;
  metadata: Record<string, unknown>;
  updated_at: string;
};
export type StudySheetSection = {
  id: string;
  sheet_id: string;
  section_type: 'chapter' | 'quick_review';
  chapter_no: number | null;
  slug: string;
  title: string;
  sort_order: number;
  content_md: string;
  visual_placeholders: string[];
};

export type StudySheetAsset = {
  id: string;
  sheet_id: string;
  asset_key: string;
  asset_type: string;
  title: string;
  description: string;
  alt_text: string;
  recommended_format: string | null;
  recommended_aspect_ratio: string | null;
  chapter_no: number | null;
  storage_bucket: string | null;
  storage_path: string | null;
  status: 'pending' | 'ready' | 'hidden';
  metadata: Record<string, unknown>;
};

export type StudySheetBundle = {
  sheet: StudySheet;
  sections: StudySheetSection[];
  assets: StudySheetAsset[];
};
