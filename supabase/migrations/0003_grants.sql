-- Newer Supabase projects do not give the API roles access to tables created in the SQL editor.
-- These grants only let the roles reach the tables; row level security (0001) still decides which rows they see.
grant usage on schema public to anon, authenticated;

-- everyone can read; policies hide pending listings, private contact details and other people's rows
grant select on all tables in schema public to anon, authenticated;

-- signed-in users write through RLS policies and the guard triggers
grant insert, update, delete on all tables in schema public to authenticated;

-- visitors can send an enquiry or a contact message without an account
grant insert on public.enquiries, public.contact_requests to anon;

grant usage, select on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;

-- tables created later get the same grants
alter default privileges in schema public grant select on tables to anon, authenticated;
alter default privileges in schema public grant insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;
