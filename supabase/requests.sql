create table if not exists public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  team text not null check (char_length(team) between 1 and 40),
  title text not null check (char_length(title) between 1 and 100),
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.ai_requests enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on table public.ai_requests to anon, authenticated;

drop policy if exists "Anonymous visitors can read AI requests" on public.ai_requests;
create policy "Anonymous visitors can read AI requests"
on public.ai_requests for select to anon, authenticated using (true);

drop policy if exists "Anonymous visitors can create AI requests" on public.ai_requests;
create policy "Anonymous visitors can create AI requests"
on public.ai_requests for insert to anon, authenticated
with check (
  char_length(team) between 1 and 40
  and char_length(title) between 1 and 100
  and char_length(content) between 1 and 1000
);
