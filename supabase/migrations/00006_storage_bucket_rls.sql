-- ⚠️ Run this in Supabase Dashboard → SQL Editor
-- Adds RLS policies for the study-materials storage bucket

-- 1. Enable RLS on the storage.objects table (Supabase manages this, but ensure it's on)
-- (storage.objects RLS is enabled by default in newer Supabase projects)

-- 2. Policy: Users can read their own files
create policy "Users can read own study materials"
on storage.objects for select
using (
  auth.role() = 'authenticated'
  and bucket_id = 'study-materials'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Policy: Users can upload their own files
create policy "Users can upload own study materials"
on storage.objects for insert
with check (
  auth.role() = 'authenticated'
  and bucket_id = 'study-materials'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy: Users can update their own files
create policy "Users can update own study materials"
on storage.objects for update
using (
  auth.role() = 'authenticated'
  and bucket_id = 'study-materials'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Policy: Users can delete their own files
create policy "Users can delete own study materials"
on storage.objects for delete
using (
  auth.role() = 'authenticated'
  and bucket_id = 'study-materials'
  and (storage.foldername(name))[1] = auth.uid()::text
);
