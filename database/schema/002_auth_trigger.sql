-- ImmoPulse
-- Migration 002 : création automatique du profil et de l'essai

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_organization_id uuid;
  requested_role public.user_role;
  requested_language text;
begin
  requested_role := case
    when new.raw_user_meta_data->>'role' in (
      'agent',
      'agency_admin',
      'buyer',
      'tenant'
    )
    then (new.raw_user_meta_data->>'role')::public.user_role
    else 'agent'::public.user_role
  end;

  requested_language := case
    when new.raw_user_meta_data->>'preferred_language' in ('en', 'fr', 'es')
    then new.raw_user_meta_data->>'preferred_language'
    else 'en'
  end;

  insert into public.organizations (name, type)
  values (
    coalesce(
      nullif(new.raw_user_meta_data->>'organization_name', ''),
      'My real estate workspace'
    ),
    'independent'
  )
  returning id into new_organization_id;

  insert into public.profiles (
    id,
    full_name,
    phone,
    preferred_language,
    role,
    organization_id
  )
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    requested_language,
    requested_role,
    new_organization_id
  );

  insert into public.trials (
    user_id,
    mode,
    status,
    starts_at,
    ends_at
  )
  values (
    new.id,
    'discovery',
    'trial_active',
    now(),
    now() + interval '14 days'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();