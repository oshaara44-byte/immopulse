-- ImmoPulse — slugs et publication des pages publiques

create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    lower(
      translate(
        coalesce(input, ''),
        'ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖòóôõöÙÚÛÜùúûüÝýÿ',
        'AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOooooUUUUuuuuYyy'
      )
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  ));
$$;

update public.properties
set public_slug = public.slugify(title) || '-' || left(id::text, 8)
where public_slug is null;

create unique index if not exists properties_public_slug_idx
  on public.properties(public_slug)
  where public_slug is not null;