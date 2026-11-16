-- ImmoPulse — lecture publique limitée aux biens publiés

alter table public.properties enable row level security;

drop policy if exists "Public can read published properties"
on public.properties;

create policy "Public can read published properties"
on public.properties
for select
to anon, authenticated
using (
  status = 'published'
  and public_slug is not null
);