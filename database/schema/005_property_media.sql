-- ImmoPulse
-- Migration 005 : médias associés aux biens
-- Les fichiers seront stockés dans Supabase Storage.
-- Cette table conserve uniquement leurs métadonnées.

create type public.property_media_type as enum (
  'image',
  'video'
);

create table if not exists public.property_media (
  id uuid primary key default gen_random_uuid(),

  property_id uuid not null
    references public.properties(id)
    on delete cascade,

  organization_id uuid not null
    references public.organizations(id)
    on delete cascade,

  media_type public.property_media_type not null,

  storage_path text not null unique,

  public_url text,

  mime_type text not null,

  file_name text not null,

  file_size bigint,

  sort_order integer not null default 0,

  is_cover boolean not null default false,

  created_by uuid references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint property_media_file_size_positive
    check (file_size is null or file_size > 0),

  constraint property_media_sort_order_positive
    check (sort_order >= 0)
);

create index if not exists property_media_property_id_idx
  on public.property_media(property_id);

create index if not exists property_media_organization_id_idx
  on public.property_media(organization_id);

create index if not exists property_media_type_idx
  on public.property_media(media_type);

create unique index if not exists one_cover_per_property_idx
  on public.property_media(property_id)
  where is_cover = true;