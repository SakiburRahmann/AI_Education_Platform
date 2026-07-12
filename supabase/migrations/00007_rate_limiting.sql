-- Migration 00007: Distributed Rate Limiting
-- Stores rate limit counters per IP per window in Supabase so they
-- persist across Vercel serverless function invocations.

set role postgres;

-- Rate limits table
create table if not exists public.rate_limits (
  id bigint generated always as identity primary key,
  ip_address text not null,
  endpoint_path text not null default '/',
  request_count integer not null default 1,
  window_start timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

-- Index for fast lookups by IP + endpoint within a time window
create index if not exists idx_rate_limits_lookup
  on public.rate_limits (ip_address, endpoint_path, window_start desc);

-- Index for cleaning up old entries (timestamp-based, no partial predicate needed)
create index if not exists idx_rate_limits_created
  on public.rate_limits (created_at);

-- Enable RLS (even though admin client bypasses, good practice)
alter table public.rate_limits enable row level security;

-- Auth bucket brute force tracking
create table if not exists public.auth_attempts (
  id bigint generated always as identity primary key,
  ip_address text not null,
  attempt_type text not null default 'auth_callback',
  attempt_count integer not null default 1,
  window_start timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_auth_attempts_lookup
  on public.auth_attempts (ip_address, attempt_type, window_start desc);

create index if not exists idx_auth_attempts_created
  on public.auth_attempts (created_at);

alter table public.auth_attempts enable row level security;

reset role;
