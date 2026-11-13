-- ImmoPulse
-- Migration initiale
-- Version : 001
-- Paiements : désactivés dans la première version

create extension if not exists "pgcrypto";

-- Types contrôlés
do $$
begin
  create type public.user_role as enum (
    'agent',
    'agency_admin',
    'buyer',
    'tenant',
    'platform_admin'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.organization_type as enum (
    'independent',
    'agency',
    'network'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.property_transaction as enum (
    'sale',
    'rent'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.property_status as enum (
    'draft',
    'published',
    'archived',
    'sold',
    'rented'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.prospect_status as enum (
    'new',
    'to_qualify',
    'to_follow_up',
    'visit_scheduled',
    'visit_completed',
    'offer',
    'converted',
    'not_relevant',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.trial_status as enum (
    'registered',
    'trial_active',
    'trial_expiring',
    'trial_expired',
    'plan_selected',
    'payment_pending',
    'active_subscriber',
    'cancelled',
    'data_deletion_requested'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.consent_type as enum (
    'terms',
    'privacy',
    'service_messages',
    'marketing',
    'property_alerts',
    'agent_contact'
  );
exception
  when duplicate_object then null;
end $$;

-- Organisations : agences, indépendants ou réseaux
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null default 'independent',
  country text,
  city text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profils liés à auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  preferred_language text not null default 'en'
    check (preferred_language in ('en', 'fr', 'es')),
  role public.user_role not null default 'agent',
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Biens immobiliers
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  transaction public.property_transaction not null,
  property_type text not null,
  price numeric(14, 2),
  currency text not null default 'EUR',
  city text,
  area text,
  bedrooms integer,
  rooms integer,
  surface numeric(10, 2),
  status public.property_status not null default 'draft',
  public_slug text unique,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prospects liés aux biens
create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  full_name text,
  email text,
  phone text,
  source text,
  request text,
  budget numeric(14, 2),
  criteria jsonb not null default '{}'::jsonb,
  status public.prospect_status not null default 'new',
  priority integer not null default 2 check (priority between 1 and 3),
  last_contact_at timestamptz,
  next_action_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Alertes de recherche des particuliers
create table if not exists public.property_alerts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  email text,
  transaction public.property_transaction not null,
  property_type text,
  city text,
  area text,
  min_price numeric(14, 2),
  max_price numeric(14, 2),
  min_surface numeric(10, 2),
  min_rooms integer,
  bedrooms integer,
  criteria jsonb not null default '{}'::jsonb,
  language text not null default 'en'
    check (language in ('en', 'fr', 'es')),
  is_active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Essais et statut commercial
create table if not exists public.trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null default 'discovery'
    check (mode in ('discovery', 'complete')),
  selected_plan text
    check (selected_plan in ('essential', 'professional', 'agency')),
  status public.trial_status not null default 'registered',
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '14 days'),
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Essais de 14 jours et statut commercial
create table if not exists public.trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null default 'discovery'
    check (mode in ('discovery', 'complete')),
  selected_plan text
    check (selected_plan in ('essential', 'professional', 'agency')),
  status public.trial_status not null default 'registered',
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '14 days'),
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trials_user_id_idx
  on public.trials(user_id);

create index if not exists trials_ends_at_idx
  on public.trials(ends_at);

-- Forfaits
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null
    check (code in ('essential', 'professional', 'agency')),
  name text not null,
  monthly_price numeric(10, 2) not null,
  setup_price numeric(10, 2) not null default 0,
  max_users integer not null default 1,
  max_properties integer not null,
  max_prospects integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Consentements
create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  prospect_id uuid references public.prospects(id) on delete cascade,
  alert_id uuid references public.property_alerts(id) on delete cascade,
  consent_type public.consent_type not null,
  consent_version text not null,
  language text not null default 'en'
    check (language in ('en', 'fr', 'es')),
  accepted boolean not null default false,
  accepted_at timestamptz,
  source text,
  created_at timestamptz not null default now(),
  check (
    user_id is not null
    or prospect_id is not null
    or alert_id is not null
  )
);

-- Index principaux
create index if not exists properties_organization_id_idx
  on public.properties(organization_id);

create index if not exists properties_status_idx
  on public.properties(status);

create index if not exists prospects_organization_id_idx
  on public.prospects(organization_id);

create index if not exists prospects_property_id_idx
  on public.prospects(property_id);

create index if not exists prospects_status_idx
  on public.prospects(status);

create index if not exists prospects_next_action_at_idx
  on public.prospects(next_action_at);

create index if not exists alerts_active_idx
  on public.property_alerts(is_active);

create index if not exists trials_user_id_idx
  on public.trials(user_id);

create index if not exists trials_ends_at_idx
  on public.trials(ends_at);

-- Données initiales des forfaits
insert into public.plans (
  code,
  name,
  monthly_price,
  setup_price,
  max_users,
  max_properties,
  max_prospects
)
values
  ('essential', 'Essentiel', 39, 49, 1, 2, 50),
  ('professional', 'Professionnel', 59, 79, 1, 10, 250),
  ('agency', 'Agence', 129, 149, 5, 30, 1000)
on conflict (code) do update set
  name = excluded.name,
  monthly_price = excluded.monthly_price,
  setup_price = excluded.setup_price,
  max_users = excluded.max_users,
  max_properties = excluded.max_properties,
  max_prospects = excluded.max_prospects,
  updated_at = now();