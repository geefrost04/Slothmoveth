-- Additive content schema for database-backed study sheets.
-- Safe to rerun: no existing application table or row is removed.

create table if not exists public.study_sheets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  course_id text not null,
  subject_id text not null,
  title text not null,
  description text not null default '',
  brand text not null default 'SlothMoveTH',
  content_format text not null default 'markdown'
    check (content_format = 'markdown'),
  version integer not null default 1 check (version > 0),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  section_count integer not null default 0 check (section_count >= 0),
  chapter_count integer not null default 0 check (chapter_count >= 0),
  intro_md text not null default '',
  references_md text not null default '',
  recommended_renderer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists study_sheets_lookup_idx
  on public.study_sheets(course_id, subject_id, status);

create table if not exists public.study_sheet_sections (
  id uuid primary key default gen_random_uuid(),
  sheet_id uuid not null references public.study_sheets(id) on delete cascade,
  section_type text not null check (section_type in ('chapter', 'quick_review')),
  chapter_no integer check (chapter_no is null or chapter_no > 0),
  slug text not null,
  title text not null,
  sort_order integer not null check (sort_order > 0),
  content_md text not null check (length(trim(content_md)) > 0),
  visual_placeholders text[] not null default '{}',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (sheet_id, slug),
  unique (sheet_id, sort_order),
  constraint study_sheet_sections_chapter_shape check (
    (section_type = 'chapter' and chapter_no is not null)
    or (section_type = 'quick_review' and chapter_no is null)
  )
);

create index if not exists study_sheet_sections_order_idx
  on public.study_sheet_sections(sheet_id, sort_order);

create table if not exists public.study_sheet_assets (
  id uuid primary key default gen_random_uuid(),
  sheet_id uuid not null references public.study_sheets(id) on delete cascade,
  asset_key text not null,
  asset_type text not null,
  title text not null,
  description text not null default '',
  alt_text text not null,
  recommended_format text,
  recommended_aspect_ratio text,
  chapter_no integer check (chapter_no is null or chapter_no > 0),
  storage_bucket text,
  storage_path text,
  status text not null default 'pending'
    check (status in ('pending', 'ready', 'hidden')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (sheet_id, asset_key),
  constraint study_sheet_assets_ready_path check (
    status <> 'ready' or (storage_bucket is not null and storage_path is not null)
  )
);

create index if not exists study_sheet_assets_sheet_idx
  on public.study_sheet_assets(sheet_id, chapter_no);

alter table public.study_sheets enable row level security;
alter table public.study_sheet_sections enable row level security;
alter table public.study_sheet_assets enable row level security;

do $$ begin
  create policy "Anyone can view published study sheets" on public.study_sheets
    for select using (status = 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Anyone can view published study sheet sections" on public.study_sheet_sections
    for select using (
      exists (
        select 1 from public.study_sheets sheet
        where sheet.id = study_sheet_sections.sheet_id
          and sheet.status = 'published'
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Anyone can view published study sheet assets" on public.study_sheet_assets
    for select using (
      exists (
        select 1 from public.study_sheets sheet
        where sheet.id = study_sheet_assets.sheet_id
          and sheet.status = 'published'
      )
    );
exception when duplicate_object then null;
end $$;

grant select on public.study_sheets to anon, authenticated;
grant select on public.study_sheet_sections to anon, authenticated;
grant select on public.study_sheet_assets to anon, authenticated;
