begin;

alter table public.products
  add column if not exists stripe_price_id text;

create unique index if not exists products_stripe_price_id_unique
  on public.products(stripe_price_id)
  where stripe_price_id is not null;

-- Catalog metadata stays visible, while mappings, questions and solutions
-- remain protected by can_access_exam_set().
drop policy if exists "Users can view accessible exam sets" on public.exam_sets;
drop policy if exists "Anyone can view published exam sets" on public.exam_sets;
create policy "Anyone can view published exam sets" on public.exam_sets
  for select using (is_published = true or auth.role() = 'service_role');

-- Set 1 remains the free sample. Sets 2, 3, and 5-7 are individual paid products.
update public.products
set
  price = 1900,
  stripe_price_id = case id
    when 'police_math_set_02_free' then 'price_1U7u6CF5MiPBTu7UOHPtfDKy'
    when 'police_math_set_03_free' then 'price_1U7u6FF5MiPBTu7UDrwovmxb'
    when 'police_math_set_05_free' then 'price_1U7u6HF5MiPBTu7UfTYxFGEc'
    when 'police_math_set_06_free' then 'price_1U7u6IF5MiPBTu7Ui6mt88yl'
    when 'police_math_set_07_free' then 'price_1U7u6KF5MiPBTu7UVhWTQW1c'
  end,
  metadata = metadata || '{"access_type":"paid","currency":"thb","stripe_mode":"test"}'::jsonb
where id in (
  'police_math_set_02_free',
  'police_math_set_03_free',
  'police_math_set_05_free',
  'police_math_set_06_free',
  'police_math_set_07_free'
);

update public.exam_sets
set access_type = 'paid', updated_at = timezone('utc'::text, now())
where id in (
  'police-math-set-02',
  'police-math-set-03',
  'police-math-set-05',
  'police-math-set-06',
  'police-math-set-07'
);

commit;
