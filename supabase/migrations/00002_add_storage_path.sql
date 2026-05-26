-- Add storage_path column to files table
alter table if exists public.files
  add column if not exists storage_path text;

-- Ensure study-materials bucket exists (run in Supabase SQL Editor)
-- select storage.create_bucket('study-materials', true);
