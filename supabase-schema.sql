-- SpendLens Database Schema
-- Run this in your Supabase SQL editor at: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Audits table
create table if not exists audits (
  id text primary key,
  created_at timestamptz default now(),
  input jsonb not null,
  recommendations jsonb not null,
  total_monthly_savings numeric not null default 0,
  total_annual_savings numeric not null default 0,
  total_current_spend numeric not null default 0,
  ai_summary text,
  is_already_optimal boolean not null default false,
  high_savings boolean not null default false
);

-- Leads table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  audit_id text references audits(id),
  total_monthly_savings numeric
);

-- Indexes for performance
create index if not exists audits_created_at_idx on audits(created_at desc);
create index if not exists leads_email_idx on leads(email);
create index if not exists leads_audit_id_idx on leads(audit_id);

-- Row Level Security (enable but allow service role full access)
alter table audits enable row level security;
alter table leads enable row level security;

-- Public can read audits (for shareable URLs)
create policy "Public audits are viewable by everyone"
  on audits for select using (true);

-- Only service role can insert (via API routes)
create policy "Service role can insert audits"
  on audits for insert with check (true);

create policy "Service role can insert leads"
  on leads for insert with check (true);
