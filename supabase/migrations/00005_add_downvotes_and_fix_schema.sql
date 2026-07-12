-- Add downvotes column to community_posts (client-side already expects it)
alter table if exists public.community_posts
  add column if not exists downvotes integer not null default 0;

-- Add RLS policies for post_votes (upsert/delete own votes)
create policy "Users can delete own votes"
  on public.post_votes for delete
  using (auth.uid() = user_id);

create policy "Users can update own votes"
  on public.post_votes for update
  using (auth.uid() = user_id);

-- Add RLS for post_comments (delete own comments)
create policy "Users can delete own comments"
  on public.post_comments for delete
  using (auth.uid() = user_id);

-- Add RLS for community_posts (delete own posts)
create policy "Users can delete own posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

-- Ensure comment_count column exists on community_posts for efficient display
alter table if exists public.community_posts
  add column if not exists comment_count integer not null default 0;

-- Add storage bucket for study materials (run separately if needed)
-- insert into storage.buckets (id, name, public) values ('study-materials', 'study-materials', false)
-- on conflict (id) do nothing;
