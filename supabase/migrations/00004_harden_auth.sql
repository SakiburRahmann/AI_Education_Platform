-- ⚠️ Run this in Supabase Dashboard → SQL Editor after deploying

-- 1. Revoke the public schema usage from anon (defense in depth)
-- This prevents anon from discovering tables via schema introspection
revoke usage on schema public from anon;
grant usage on schema public to authenticated;

-- 2. Drop the public policy that leaks auth settings endpoint access
-- (The /auth/v1/settings endpoint is controlled by Supabase, not by SQL)

-- 3. Add DELETE policy for profiles (only own profile)
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- 4. Add DELETE policy for own lessons/quizzes
create policy "Users can delete own lessons"
  on public.lessons for delete
  using (auth.uid() = user_id);

create policy "Users can delete own quizzes"
  on public.quizzes for delete
  using (auth.uid() = user_id);

-- 5. Ensure the leaderboard view requires authentication
-- (already created in 00003, but re-assert)
create or replace view public.leaderboard as
  select id, display_name, avatar_url, xp, level, streak_count, league_id
  from public.profiles
  where auth.role() = 'authenticated';

-- 6. Revoke execute on all public functions from anon
-- (bulk: no custom RPC functions exposed)
revoke all on all functions in schema public from anon;
