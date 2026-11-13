-- ImmoPulse — politiques RLS minimales pour le compte connecté

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.trials enable row level security;
alter table public.plans enable row level security;

drop policy if exists "Users can read their own profile"
on public.profiles;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can read their own trial"
on public.trials;

create policy "Users can read their own trial"
on public.trials
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Authenticated users can read active plans"
on public.plans;

create policy "Authenticated users can read active plans"
on public.plans
for select
to authenticated
using (is_active = true);

drop policy if exists "Users can read their organization"
on public.organizations;

create policy "Users can read their organization"
on public.organizations
for select
to authenticated
using (
  id in (
    select organization_id
    from public.profiles
    where id = auth.uid()
  )
);