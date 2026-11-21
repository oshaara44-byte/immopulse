-- ImmoPulse — événements analytiques minimaux

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),

  event_name text not null
    check (
      event_name in (
        'page_view',
        'language_selected',
        'profile_selected',
        'signup_completed',
        'login_completed',
        'trial_started',
        'property_created',
        'inquiry_submitted',
        'alert_created',
        'plan_selected'
      )
    ),

  user_id uuid references public.profiles(id)
    on delete set null,

  session_id text,
  locale text not null default 'en'
    check (locale in ('en', 'fr', 'es')),

  role text,
  path text,
  source text,
  campaign text,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_idx
  on public.analytics_events(event_name);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events(created_at desc);

create index if not exists analytics_events_locale_idx
  on public.analytics_events(locale);

create index if not exists analytics_events_source_idx
  on public.analytics_events(source);

alter table public.analytics_events enable row level security;

drop policy if exists "Public can create analytics events"
on public.analytics_events;

create policy "Public can create analytics events"
on public.analytics_events
for insert
to anon, authenticated
with check (
  length(event_name) > 0
);

drop policy if exists "Users cannot read analytics events"
on public.analytics_events;

create policy "Users cannot read analytics events"
on public.analytics_events
for select
to authenticated
using (false);