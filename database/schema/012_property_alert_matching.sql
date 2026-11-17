-- ImmoPulse — correspondance entre biens et alertes

create or replace function public.match_property_alerts(
  target_property_id uuid
)
returns table (
  alert_id uuid,
  owner_id uuid,
  transaction public.property_transaction,
  property_type text,
  city text,
  area text,
  min_price numeric,
  max_price numeric,
  min_surface numeric,
  min_rooms integer,
  bedrooms integer,
  language text
)
language sql
security invoker
set search_path = public
as $$
  select
    a.id as alert_id,
    a.owner_id,
    a.transaction,
    a.property_type,
    a.city,
    a.area,
    a.min_price,
    a.max_price,
    a.min_surface,
    a.min_rooms,
    a.bedrooms,
    a.language
  from public.property_alerts a
  join public.properties p
    on p.id = target_property_id
  where a.is_active = true
    and p.status = 'published'
    and a.transaction = p.transaction
    and (
      a.property_type is null
      or a.property_type = ''
      or a.property_type = p.property_type
    )
    and (
      a.city is null
      or a.city = ''
      or lower(a.city) = lower(coalesce(p.city, ''))
    )
    and (
      a.area is null
      or a.area = ''
      or lower(a.area) = lower(coalesce(p.area, ''))
    )
    and (
      a.min_price is null
      or p.price is null
      or p.price >= a.min_price
    )
    and (
      a.max_price is null
      or p.price is null
      or p.price <= a.max_price
    )
    and (
      a.min_surface is null
      or p.surface is null
      or p.surface >= a.min_surface
    )
    and (
      a.min_rooms is null
      or p.rooms is null
      or p.rooms >= a.min_rooms
    )
    and (
      a.bedrooms is null
      or p.bedrooms is null
      or p.bedrooms >= a.bedrooms
    );
$$;