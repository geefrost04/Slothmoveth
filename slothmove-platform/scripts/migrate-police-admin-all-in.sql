begin;

-- A bundle grants access to each mapped exam set. Access can also expire for
-- time-limited products while existing one-off purchases remain permanent.
alter table public.entitlements
  add column if not exists expires_at timestamp with time zone;

create index if not exists entitlements_active_access_idx
  on public.entitlements (user_id, product_id, expires_at);

create unique index if not exists product_items_product_subject_item_unique
  on public.product_items (product_id, subject_id, item_id);

create or replace function public.can_access_exam_set(target_exam_set_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.exam_sets exam_set
    where exam_set.id = target_exam_set_id
      and exam_set.is_published = true
      and (
        exam_set.access_type = 'free'
        or exists (
          select 1
          from public.entitlements entitlement
          left join public.product_items item
            on item.product_id = entitlement.product_id
          where entitlement.user_id = auth.uid()
            and (entitlement.expires_at is null or entitlement.expires_at > now())
            and (
              entitlement.product_id = exam_set.product_id
              or (item.subject_id = exam_set.subject_id and item.item_id = exam_set.id)
            )
        )
      )
  );
$$;

-- Staged product only. Keep it unpublished until its Stripe price is created
-- and the release promise has been approved against the production roadmap.
insert into public.products (id, title, description, price, type, metadata, is_published)
values (
  'police_admin_all_in_2026',
  'Police Admin All-in 2026',
  'ปลดล็อก Mock Test และชุดข้อสอบรายวิชาที่มีในแพ็กเกจ พร้อมสิทธิ์เข้าใช้ 1 ปี',
  29900,
  'bundle',
  jsonb_build_object(
    'course_id', 'police_admin',
    'access_duration_days', 365,
    'release_window_end', '2026-12-31',
    'release_cadence_days', 14,
    'status', 'staged'
  ),
  false
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  type = excluded.type,
  metadata = excluded.metadata;

-- The bundle contains every paid Police Admin set that is published today.
-- Future paid sets must be inserted here when released.
insert into public.product_items (product_id, subject_id, item_id)
select 'police_admin_all_in_2026', exam_set.subject_id, exam_set.id
from public.exam_sets exam_set
where exam_set.course_id = 'police_admin'
  and exam_set.access_type = 'paid'
  and exam_set.is_published = true
on conflict (product_id, subject_id, item_id) do nothing;

commit;
