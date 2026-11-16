-- ImmoPulse — politiques Storage pour le bucket property-media
-- Le bucket doit rester privé.

drop policy if exists "Authenticated users can upload property media"
on storage.objects;

create policy "Authenticated users can upload property media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-media'
  and (storage.foldername(name))[1] in (
    select organization_id::text
    from public.profiles
    where id = auth.uid()
  )
);

drop policy if exists "Members can read property media"
on storage.objects;

create policy "Members can read property media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'property-media'
  and (storage.foldername(name))[1] in (
    select organization_id::text
    from public.profiles
    where id = auth.uid()
  )
);

drop policy if exists "Members can update property media"
on storage.objects;

create policy "Members can update property media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-media'
  and (storage.foldername(name))[1] in (
    select organization_id::text
    from public.profiles
    where id = auth.uid()
  )
)
with check (
  bucket_id = 'property-media'
  and (storage.foldername(name))[1] in (
    select organization_id::text
    from public.profiles
    where id = auth.uid()
  )
);

drop policy if exists "Members can delete property media"
on storage.objects;

create policy "Members can delete property media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-media'
  and (storage.foldername(name))[1] in (
    select organization_id::text
    from public.profiles
    where id = auth.uid()
  )
);