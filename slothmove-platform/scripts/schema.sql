-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Matches auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Drop policy if exists and create
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users and admins can view profiles" on public.profiles;
create policy "Users and admins can view profiles" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- PRODUCTS
create table if not exists public.products (
  id text primary key, -- e.g. 'math_free', 'math_set_01', 'math_master_bundle'
  title text not null,
  description text,
  price integer not null, -- in Satang/Cents (THB, e.g. 2900 = 29 THB)
  type text not null default 'single', -- 'single', 'bundle', 'sheet'
  metadata jsonb default '{}'::jsonb,
  stripe_price_id text unique,
  is_published boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

drop policy if exists "Anyone can view published products" on public.products;
create policy "Anyone can view published products" on public.products
  for select using (is_published = true or auth.role() = 'service_role');

-- PRODUCT ITEMS (Bundles map to content)
create table if not exists public.product_items (
  id uuid default gen_random_uuid() primary key,
  product_id text references public.products(id) on delete cascade not null,
  subject_id text not null, -- e.g. 'math'
  item_id text not null,    -- e.g. 'math_set_01', 'free'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.product_items enable row level security;

drop policy if exists "Anyone can view product items" on public.product_items;
create policy "Anyone can view product items" on public.product_items
  for select using (true);

-- EXAM SETS
-- A sellable exam set points at a product. Free sets still use a product with
-- price = 0 so catalog and entitlement logic share one model.
create table if not exists public.exam_sets (
  id text primary key,
  course_id text not null,
  subject_id text not null,
  product_id text references public.products(id) on delete set null,
  title text not null,
  description text,
  source_label text,
  access_type text not null default 'paid' check (access_type in ('free', 'paid')),
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  total_questions integer not null default 0 check (total_questions >= 0),
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists exam_sets_course_subject_idx
  on public.exam_sets(course_id, subject_id, is_published);

alter table public.exam_sets enable row level security;

-- QUESTIONS
-- Public question content is separate from solutions so paid answer keys can
-- remain protected without duplicating question rows.
create table if not exists public.questions (
  id text primary key,
  category text not null,
  prompt text not null,
  choices jsonb not null,
  media jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint questions_choices_array check (
    jsonb_typeof(choices) = 'array' and jsonb_array_length(choices) >= 2
  )
);

alter table public.questions enable row level security;

-- EXAM SET QUESTION ORDER
create table if not exists public.exam_set_questions (
  exam_set_id text references public.exam_sets(id) on delete cascade not null,
  question_id text references public.questions(id) on delete cascade not null,
  position integer not null check (position > 0),
  points numeric(8, 2) not null default 1 check (points > 0),
  primary key (exam_set_id, question_id),
  unique (exam_set_id, position)
);

create index if not exists exam_set_questions_question_idx
  on public.exam_set_questions(question_id);

alter table public.exam_set_questions enable row level security;

-- ANSWERS AND EXPLANATIONS
create table if not exists public.question_solutions (
  question_id text references public.questions(id) on delete cascade primary key,
  correct_choice_index integer not null check (correct_choice_index >= 0),
  explanation text not null,
  tip text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.question_solutions enable row level security;

-- ORDERS
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id text references public.products(id) not null,
  amount integer not null,
  status text not null default 'pending', -- 'pending', 'completed', 'failed'
  stripe_session_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id or auth.role() = 'service_role');

-- ENTITLEMENTS (User purchase rights)
create table if not exists public.entitlements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id text references public.products(id) not null,
  source_order_id uuid references public.orders(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

alter table public.entitlements enable row level security;

drop policy if exists "Users can view their own entitlements" on public.entitlements;
create policy "Users can view their own entitlements" on public.entitlements
  for select using (auth.uid() = user_id or auth.role() = 'service_role');

-- Centralized access check: free published sets are public; paid sets require
-- an entitlement to their linked product. SECURITY DEFINER allows this helper
-- to read entitlement rows without exposing the table itself.
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
          where entitlement.user_id = auth.uid()
            and entitlement.product_id = exam_set.product_id
        )
      )
  );
$$;

grant execute on function public.can_access_exam_set(text) to anon, authenticated;

drop policy if exists "Users can view accessible exam sets" on public.exam_sets;
drop policy if exists "Anyone can view published exam sets" on public.exam_sets;
create policy "Anyone can view published exam sets" on public.exam_sets
  for select using (is_published = true or auth.role() = 'service_role');

drop policy if exists "Users can view accessible exam mappings" on public.exam_set_questions;
create policy "Users can view accessible exam mappings" on public.exam_set_questions
  for select using (public.can_access_exam_set(exam_set_id));

drop policy if exists "Users can view accessible questions" on public.questions;
create policy "Users can view accessible questions" on public.questions
  for select using (
    exists (
      select 1
      from public.exam_set_questions mapping
      where mapping.question_id = questions.id
        and public.can_access_exam_set(mapping.exam_set_id)
    )
  );

drop policy if exists "Users can view accessible solutions" on public.question_solutions;
create policy "Users can view accessible solutions" on public.question_solutions
  for select using (
    exists (
      select 1
      from public.exam_set_questions mapping
      where mapping.question_id = question_solutions.question_id
        and public.can_access_exam_set(mapping.exam_set_id)
    )
  );

-- ATTEMPTS (Quiz attempts)
create table if not exists public.attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id text not null,
  quiz_id text not null,
  score integer not null,
  total_questions integer not null,
  answers jsonb not null default '[]'::jsonb,
  exam_set_id text references public.exam_sets(id) on delete set null,
  category_results jsonb not null default '[]'::jsonb,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  completion_reason text check (completion_reason is null or completion_reason in ('submitted', 'timeout')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.attempts enable row level security;

drop policy if exists "Users can view/create their own attempts" on public.attempts;
create policy "Users can view/create their own attempts" on public.attempts
  for all using (auth.uid() = user_id or auth.role() = 'service_role');

drop policy if exists "Admins can view all attempts" on public.attempts;
create policy "Admins can view all attempts" on public.attempts
  for select using (public.is_admin());

-- Automatically handle user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    'user'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = case
        when excluded.full_name <> '' then excluded.full_name
        else profiles.full_name
      end,
      updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
