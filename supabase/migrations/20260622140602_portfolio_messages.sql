-- Visitor messages from the terminal "leave a message" flow.
-- Ephemeral live-chat + the nano emulator are not persisted; only this is.

create table if not exists public.portfolio_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  contact text,
  body text not null,
  page text
);

alter table public.portfolio_messages enable row level security;

-- Anyone may leave a (length-bounded) message.
drop policy if exists "anon can insert messages" on public.portfolio_messages;
create policy "anon can insert messages"
  on public.portfolio_messages
  for insert
  to anon, authenticated
  with check (char_length(body) between 1 and 4000);

-- No SELECT/UPDATE/DELETE policies: messages are not publicly readable.
-- Callum reads them via the service role / Supabase dashboard.

create index if not exists portfolio_messages_created_at_idx
  on public.portfolio_messages (created_at desc);
