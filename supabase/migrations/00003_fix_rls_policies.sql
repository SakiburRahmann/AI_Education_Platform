-- Fix CRITICAL: Restrict profiles and achievements from public read
-- The old policies let anyone (even unauthenticated) read ALL user data.
-- New policies only allow authenticated users to see profiles/achievements.

-- Drop the dangerously open policies
drop policy if exists "Anyone can view profiles" on public.profiles;
drop policy if exists "Anyone can view achievements" on public.achievements;

-- Only authenticated users can view profiles
create policy "Authenticated users can view profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Only authenticated users can view achievements
create policy "Authenticated users can view achievements"
  on public.achievements for select
  using (auth.role() = 'authenticated');

-- If you need a public leaderboard that exposes only safe fields,
-- create a view instead of opening the raw table:
create or replace view public.leaderboard as
  select
    id,
    display_name,
    avatar_url,
    xp,
    level,
    streak_count,
    league_id
  from public.profiles
  where auth.role() = 'authenticated';

-- Revoke direct table access from anon (enforced by RLS, but belt-and-suspenders):
-- (This requires superuser, so it's commented — RLS handles it)
-- revoke select on public.profiles from anon;
-- revoke select on public.achievements from anon;

-- ⚠️ After applying this migration, run in Supabase SQL Editor:
--   select * from public.profiles limit 5;
-- If it returns an error or empty for anon users, RLS is working.
