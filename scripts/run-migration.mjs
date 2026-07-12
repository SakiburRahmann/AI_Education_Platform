// Run Supabase migration 00005 and create storage bucket
import fs from "fs";
import path from "path";
import { createRequire } from "module";

// Read .env.local
const envPath = path.resolve(".env.local");
const envFile = fs.readFileSync(envPath, "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*?)\s*$/);
  if (match) env[match[1]] = match[2].replace(/['"]/g, "");
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = env.DATABASE_URL;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Failed to find Supabase credentials in .env.local");
  process.exit(1);
}

const MIGRATION_SQL = `
alter table if exists public.community_posts add column if not exists downvotes integer not null default 0;
alter table if exists public.community_posts add column if not exists comment_count integer not null default 0;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own votes' and tablename = 'post_votes') then
    create policy "Users can delete own votes" on public.post_votes for delete using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own votes' and tablename = 'post_votes') then
    create policy "Users can update own votes" on public.post_votes for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own comments' and tablename = 'post_comments') then
    create policy "Users can delete own comments" on public.post_comments for delete using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own posts' and tablename = 'community_posts') then
    create policy "Users can delete own posts" on public.community_posts for delete using (auth.uid() = user_id);
  end if;
end $$;
`;

let exitCode = 0;

async function main() {
  console.log("Running Supabase operations...\n");

  // Step 1: Create storage bucket
  console.log("1/2 Creating 'study-materials' storage bucket...");
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.storage.createBucket("study-materials", {
      public: false,
      fileSizeLimit: 52428800,
    });
    if (error && error.message?.includes("already exists")) {
      console.log("   -> Bucket already exists");
    } else if (error) {
      console.log("   Warning:", error.message);
    } else {
      console.log("   -> Bucket created successfully");
    }
  } catch (err) {
    console.log("   Warning:", err.message);
  }

  // Step 2: Run migration SQL
  console.log("\n2/2 Running migration 00005...");
  if (!DATABASE_URL) {
    console.log("   ERROR: DATABASE_URL not found in .env.local");
    exitCode = 1;
  } else {
    const require = createRequire(import.meta.url);
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: DATABASE_URL });
    
    try {
      await pool.query(MIGRATION_SQL);
      console.log("   -> Migration executed successfully");
    } catch (err) {
      console.log("   ERROR:", err.message);
      exitCode = 1;
    } finally {
      await pool.end();
    }
  }

  if (exitCode === 0) {
    console.log("\nAll operations completed successfully!");
  } else {
    console.log("\nSome operations failed.");
    console.log("\nRun this SQL manually in Supabase Dashboard > SQL Editor:");
    console.log(MIGRATION_SQL);
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
