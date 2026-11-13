-- ImmoPulse — politiques RLS pour les biens

alter table public.properties enable row level security;

drop policy if exists "Members can read organization properties"
on public.properties;

create policy "Members can read organization properties"
on public.properties
for select
to authenticated
using (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);

drop policy if exists "Members can create organization properties"
on public.properties;

create policy "Members can create organization properties"
on public.properties
for insert
to authenticated
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
  and created_by = auth.uid()
);

drop policy if exists "Members can update organization properties"
on public.properties;

create policy "Members can update organization properties"
on public.properties
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

drop policy if exists "Members can delete organization properties"
on public.properties;

create policy "Members can delete organization properties"
on public.properties
for delete
to authenticated
using (
  organization_id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);