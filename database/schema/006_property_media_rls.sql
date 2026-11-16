-- ImmoPulse — politiques RLS pour les médias des biens

alter table public.property_media enable row level security;

drop policy if exists "Members can read organization property media"
on public.property_media;

create policy "Members can read organization property media"
on public.property_media
for select
to authenticated
using (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);

drop policy if exists "Members can insert organization property media"
on public.property_media;

create policy "Members can insert organization property media"
on public.property_media
for insert
to authenticated
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
  and created_by = auth.uid()
  and property_id in (
    select id
    from public.properties
    where organization_id in (
      select organization_id
      from public.profiles
      where id = auth.uid()
    )
  )
);

drop policy if exists "Members can update organization property media"
on public.property_media;

create policy "Members can update organization property media"
on public.property_media
for update
to authenticated
using (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
)
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);

drop policy if exists "Members can delete organization property media"
on public.property_media;

create policy "Members can delete organization property media"
on public.property_media
for delete
to authenticated
using (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);