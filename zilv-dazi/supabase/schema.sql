-- 自律搭子 · Supabase 建表脚本
-- 用法：Supabase 项目 → SQL Editor → New query → 粘贴全部内容 → Run

-- 1. 成员昵称
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nick text not null check (char_length(nick) between 1 and 16),
  created_at timestamptz not null default now()
);

-- 2. 每个人的每日目标
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 40),
  created_at timestamptz not null default now()
);

-- 3. 每日打卡（每人每天一条）
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date text not null,                       -- 本地日期 YYYY-MM-DD
  goals jsonb not null default '[]'::jsonb,  -- [{id, title, done}]
  note text not null default '' check (char_length(note) <= 1000),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

-- 4. 评论
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null check (char_length(text) between 1 and 300),
  created_at timestamptz not null default now()
);

-- 5. 加油
create table if not exists public.cheers (
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (checkin_id, user_id)
);

-- 权限：登录的人都能看所有内容；每个人只能改自己的东西
alter table public.profiles enable row level security;
alter table public.goals    enable row level security;
alter table public.checkins enable row level security;
alter table public.comments enable row level security;
alter table public.cheers   enable row level security;

drop policy if exists "read all" on public.profiles;
drop policy if exists "write own" on public.profiles;
create policy "read all"  on public.profiles for select to authenticated using (true);
create policy "write own" on public.profiles for all    to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "read all" on public.goals;
drop policy if exists "write own" on public.goals;
create policy "read all"  on public.goals for select to authenticated using (true);
create policy "write own" on public.goals for all    to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "read all" on public.checkins;
drop policy if exists "write own" on public.checkins;
create policy "read all"  on public.checkins for select to authenticated using (true);
create policy "write own" on public.checkins for all    to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "read all" on public.comments;
drop policy if exists "write own" on public.comments;
create policy "read all"  on public.comments for select to authenticated using (true);
create policy "write own" on public.comments for all    to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "read all" on public.cheers;
drop policy if exists "write own" on public.cheers;
create policy "read all"  on public.cheers for select to authenticated using (true);
create policy "write own" on public.cheers for all    to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 实时更新：对方打卡、评论后，页面自动刷新
do $$
declare t text;
begin
  foreach t in array array['profiles','goals','checkins','comments','cheers'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- 打卡照片存储桶（公开读取，只能往自己的文件夹上传）
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "photos upload own" on storage.objects;
drop policy if exists "photos delete own" on storage.objects;
create policy "photos upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
