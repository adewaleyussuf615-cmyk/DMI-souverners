-- Run this once in your Supabase project's SQL Editor (Supabase dashboard -> SQL Editor -> New query)

create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric not null,
  category text not null default 'Uncategorized',
  rating numeric default 4.7,
  moq text,
  weight text,
  description text,
  long_description text,
  features text[] default '{}',
  images text[] default '{}',
  badge text,
  created_at timestamptz default now()
);

-- Public (anonymous) visitors may only READ products -- never write.
alter table products enable row level security;

create policy "Public can view products"
  on products for select
  to anon
  using (true);

-- No insert/update/delete policy is created for the anon role on purpose.
-- All writes go through the admin API routes, which use the service_role key
-- (server-side only, never exposed to the browser) and therefore bypass RLS safely.
