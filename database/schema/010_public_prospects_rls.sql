-- ImmoPulse — insertion publique contrôlée des prospects

alter table public.prospects enable row level security;

drop policy if exists "Public can create prospects for published properties"
on public.prospects;

create policy "Public can create prospects for published properties"
on public.prospects
for insert
to anon, authenticated
with check (
  property_id is not null
  and organization_id = (
    select p.organization_id
    from public.properties p
    where p.id = property_id
      and p.status = 'published'
      and p.public_slug is not null
  )
);

drop policy if exists "Members can read organization prospects"
on public.prospects;

create policy "Members can read organization prospects"
on public.prospects
for select
to authenticated
using (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);

drop policy if exists "Members can update organization prospects"
on public.prospects;

create policy "Members can update organization prospects"
on public.prospects
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

drop policy if exists "Members can delete organization prospects"
on public.prospects;

create policy "Members can delete organization prospects"
on public.prospects
for delete
to authenticated
using (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);