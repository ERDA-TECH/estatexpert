-- Contact form and NRI consultation requests.
create table contact_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'contact' check (kind in ('contact','nri_consult')),
  name text not null check (char_length(name) >= 2),
  email text not null check (email like '%_@_%._%'),
  topic text,
  time_zone text,
  message text,
  created_at timestamptz not null default now()
);
alter table contact_requests enable row level security;
create policy contact_insert on contact_requests for insert to anon, authenticated with check (true);
create policy contact_admin_read on contact_requests for select to authenticated using (public.is_admin());
