-- Run this in Supabase Dashboard → SQL Editor

-- 0. Enable pgvector extension (must be first)
create extension if not exists vector;

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  streak_count integer not null default 0,
  last_active_date date,
  league_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Allow users to read any profile
create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

-- Allow users to update own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    lower(replace(new.email, '@', '_at_')),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. XP transactions log
create table if not exists public.xp_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.xp_transactions enable row level security;

create policy "Users can view own XP"
  on public.xp_transactions for select
  using (auth.uid() = user_id);

-- 4. Achievements
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_type text not null,
  earned_at timestamptz not null default now()
);

alter table public.achievements enable row level security;

create policy "Anyone can view achievements"
  on public.achievements for select
  using (true);

-- 5. Files
create table if not exists public.files (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null,
  size integer not null,
  status text not null default 'processing',
  created_at timestamptz not null default now()
);

alter table public.files enable row level security;

create policy "Users can view own files"
  on public.files for select
  using (auth.uid() = user_id);

create policy "Users can insert own files"
  on public.files for insert
  with check (auth.uid() = user_id);

-- 6. File chunks (for RAG embeddings)
create table if not exists public.file_chunks (
  id uuid default gen_random_uuid() primary key,
  file_id uuid references public.files(id) on delete cascade not null,
  content text not null,
  embedding vector(768),
  chunk_index integer not null
);

alter table public.file_chunks enable row level security;

create policy "Users can view own file chunks"
  on public.file_chunks for select
  using (
    auth.uid() = (select user_id from public.files where id = file_id)
  );

-- 7. Lessons
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  file_id uuid references public.files(id) on delete set null,
  title text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.lessons enable row level security;

create policy "Users can view own lessons"
  on public.lessons for select
  using (auth.uid() = user_id);

create policy "Users can insert own lessons"
  on public.lessons for insert
  with check (auth.uid() = user_id);

-- 8. Quizzes
create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  file_id uuid references public.files(id) on delete set null,
  title text not null,
  questions jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.quizzes enable row level security;

create policy "Users can view own quizzes"
  on public.quizzes for select
  using (auth.uid() = user_id);

create policy "Users can insert own quizzes"
  on public.quizzes for insert
  with check (auth.uid() = user_id);

-- 9. Quiz attempts
create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null,
  total integer not null,
  answers jsonb not null,
  completed_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

create policy "Users can view own attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

-- 10. Community posts
create table if not exists public.community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  upvotes integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

create policy "Anyone can view posts"
  on public.community_posts for select
  using (true);

create policy "Authenticated users can insert posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.community_posts for update
  using (auth.uid() = user_id);

-- 11. Post comments
create table if not exists public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

create policy "Anyone can view comments"
  on public.post_comments for select
  using (true);

create policy "Authenticated users can insert comments"
  on public.post_comments for insert
  with check (auth.uid() = user_id);

-- 12. Post votes
create table if not exists public.post_votes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

alter table public.post_votes enable row level security;

create policy "Anyone can view votes"
  on public.post_votes for select
  using (true);

create policy "Authenticated users can vote"
  on public.post_votes for insert
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_file_chunks_embedding on public.file_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists idx_profiles_xp on public.profiles(xp desc);
create index if not exists idx_xp_transactions_user on public.xp_transactions(user_id, created_at desc);
create index if not exists idx_community_posts_created on public.community_posts(created_at desc);
