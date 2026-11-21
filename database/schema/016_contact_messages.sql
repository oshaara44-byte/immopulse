-- ImmoPulse — messages de contact publics

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  user_type text not null default 'other'
    check (user_type in ('agent', 'buyer', 'tenant', 'other')),
  subject text not null,
  message text not null,
  consent_to_reply boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'resolved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Public can create contact messages"
on public.contact_messages;

create policy "Public can create contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (
  consent_to_reply = true
);

create index if not exists contact_messages_status_idx
  on public.contact_messages(status);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages(created_at desc);