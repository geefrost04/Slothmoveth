begin;

alter table public.attempts
  add column if not exists exam_set_id text references public.exam_sets(id) on delete set null,
  add column if not exists category_results jsonb not null default '[]'::jsonb,
  add column if not exists duration_seconds integer,
  add column if not exists completion_reason text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'attempts_duration_seconds_check'
  ) then
    alter table public.attempts
      add constraint attempts_duration_seconds_check
      check (duration_seconds is null or duration_seconds >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'attempts_completion_reason_check'
  ) then
    alter table public.attempts
      add constraint attempts_completion_reason_check
      check (completion_reason is null or completion_reason in ('submitted', 'timeout'));
  end if;
end $$;

create index if not exists attempts_user_exam_set_idx
  on public.attempts(user_id, exam_set_id, created_at desc);

update public.exam_sets
set title = 'คณิตศาสตร์ ชุดที่ 1',
    updated_at = timezone('utc'::text, now())
where id = 'police-math-set-04';

update public.products
set title = 'คณิตศาสตร์ ชุดที่ 1'
where id = 'police_math_set_04_free';

commit;
