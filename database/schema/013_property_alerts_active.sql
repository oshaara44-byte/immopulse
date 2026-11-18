-- ImmoPulse — activation des alertes

alter table public.property_alerts
add column if not exists is_active boolean not null default true;

update public.property_alerts
set is_active = true
where is_active is null;