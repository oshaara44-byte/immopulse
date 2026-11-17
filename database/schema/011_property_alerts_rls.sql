-- ImmoPulse — politiques RLS des alertes de recherche

alter table public.property_alerts enable row level security;

drop policy if exists "Users can read their own alerts"
on public.property_alerts;

create policy "Users can read their own alerts"
on public.property_alerts
for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Users can create their own alerts"
on public.property_alerts;

create policy "Users can create their own alerts"
on public.property_alerts
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Public can create email alerts"
on public.property_alerts;

create policy "Public can create email alerts"
on public.property_alerts
for insert
to anon
with check (
  owner_id is null
  and email is not null
  and length(trim(email)) > 3
);

drop policy if exists "Users can update their own alerts"
on public.property_alerts;

create policy "Users can update their own alerts"
on public.property_alerts
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Users can delete their own alerts"
on public.property_alerts;

create policy "Users can delete their own alerts"
on public.property_alerts
for delete
to authenticated
using (owner_id = auth.uid());