-- ⚠️ Run this in Supabase Dashboard → SQL Editor
-- Adds RLS policies for the study-materials storage bucket
-- 
-- How to run:
-- 1. Go to https://supabase.com/dashboard/project/hymttvgdutdmodvomehq/sql/new
-- 2. Paste this entire script
-- 3. Click "Run"

-- Escalate role to postgres for storage schema DDL
set role postgres;

-- Enable RLS on storage.objects (safe to run multiple times)
alter table storage.objects enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can read own study materials' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Users can read own study materials"
    on storage.objects for select
    using (
      auth.role() = 'authenticated'
      and bucket_id = 'study-materials'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users can upload own study materials' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Users can upload own study materials"
    on storage.objects for insert
    with check (
      auth.role() = 'authenticated'
      and bucket_id = 'study-materials'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users can update own study materials' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Users can update own study materials"
    on storage.objects for update
    using (
      auth.role() = 'authenticated'
      and bucket_id = 'study-materials'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users can delete own study materials' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Users can delete own study materials"
    on storage.objects for delete
    using (
      auth.role() = 'authenticated'
      and bucket_id = 'study-materials'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end $$;

-- Reset role back to default
reset role;
