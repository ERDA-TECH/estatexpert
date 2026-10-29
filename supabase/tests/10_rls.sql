\set ON_ERROR_STOP on
\set A '''aaaaaaaa-0000-0000-0000-000000000001'''
\set B '''bbbbbbbb-0000-0000-0000-000000000002'''
\echo == setup: two users, B is promoted to admin by the service role
insert into auth.users (id,email,raw_user_meta_data) values (:A,'seller@example.com','{"full_name":"Seller One"}'), (:B,'admin@example.com','{"full_name":"Admin Two"}');
update profiles set role='admin' where id=:B;
grant select,insert,update,delete on all tables in schema public to anon, authenticated;
grant usage,select on all sequences in schema public to anon, authenticated;
grant select,insert,delete on all tables in schema storage to authenticated;

\echo == 1. anonymous visitors see only live listings
set role anon;
do $$ declare n int; begin
  select count(*) into n from properties; assert n = 29, 'anon should see 29 live listings, saw '||n;
  select count(*) into n from properties where status <> 'live'; assert n = 0, 'anon sees non-live rows';
  select count(*) into n from property_private; assert n = 0, 'anon can read private contact rows';
  select count(*) into n from enquiries; assert n = 0, 'anon can read enquiries';
  select count(*) into n from property_documents where property_id = 101; assert n = 0, 'anon sees docs of a pending listing';
  select count(*) into n from states; assert n = 4, 'reference data should be public';
end $$;

\echo == 2. anonymous enquiry works for a live listing and fails for a pending one
do $$ begin
  insert into enquiries (property_id,name,email,kind) values (1,'Test Buyer','buyer@example.com','enquiry');
  begin
    insert into enquiries (property_id,name,email,kind) values (101,'Test Buyer','buyer@example.com','enquiry');
    raise exception 'insert on a pending listing should have failed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

\echo == 3. seller A submits a listing, it is forced to pending and cannot self-publish
set role authenticated;
select set_config('request.jwt.claim.sub', :A, false);
do $$ declare pid bigint; st listing_status; v boolean; begin
  insert into properties (title,type,locality_id,price_inr,status,verified,beds,built_up_sqft) values ('Seller test flat','Flat','kondapur',9000000,'live',true,2,1000) returning id into pid;
  select status,verified into st,v from properties where id = pid;
  assert st = 'pending' and v = false, 'insert must be forced to pending/unverified';
  begin update properties set status='live' where id = pid; raise exception 'self-publish should have failed';
  exception when others then if sqlerrm like '%self-publish%' then raise; end if; end;
  begin update properties set verified=true where id = pid; raise exception 'self-verify should have failed';
  exception when others then if sqlerrm like '%self-verify%' then raise; end if; end;
  update properties set title='Seller test flat, edited' where id = pid;
  insert into property_private (property_id,owner_name,owner_phone) values (pid,'Seller One','+1 555 0100');
  insert into property_documents (property_id,doc_key,status) values (pid,'title','verified');
  select count(*) into pid from property_documents where status='verified' and property_id = (select max(id) from properties);
  assert pid = 0, 'seller must not be able to insert a verified document';
end $$;
do $$ declare n int; begin
  select count(*) into n from properties; assert n = 30, 'seller sees live + own pending (30), saw '||n;
  select count(*) into n from property_private; assert n = 1, 'seller sees own private row';
  begin update profiles set role='admin' where id = auth.uid(); raise exception 'role escalation should have failed';
  exception when others then if sqlerrm like '%escalation%' then raise; end if; end;
  select count(*) into n from enquiries; assert n = 0, 'seller must not read buyer enquiries';
end $$;
\echo == 4. seller saves a property and sets an alert
insert into saved_properties (user_id,property_id) values (:A, 1);
insert into alerts (user_id,city_id,property_type,max_price_inr) values (:A,'hyd','Flat',20000000);
reset role;

\echo == 5. admin sees everything and approves the seller listing
set role authenticated;
select set_config('request.jwt.claim.sub', :B, false);
do $$ declare n int; pid bigint; pub timestamptz; begin
  select count(*) into n from properties; assert n = 33, 'admin sees all 33 rows, saw '||n;
  select count(*) into n from enquiries; assert n >= 7, 'admin sees leads, saw '||n;
  select count(*) into n from property_private; assert n = 1, 'admin sees private contact';
  select count(*) into n from saved_properties; assert n = 0, 'admin must not see other users saved lists';
  select id into pid from properties where title like 'Seller test flat%';
  update properties set status='live', verified=true where id = pid;
  select published_at into pub from properties where id = pid; assert pub is not null, 'published_at should be set on approval';
  update enquiries set status='contacted' where status='new';
  update property_documents set status='verified' where property_id = pid and doc_key='title';
end $$;
reset role;

\echo == 6. after approval the public sees 30 listings and the haversine helper works
select set_config('request.jwt.claim.sub', '', false);  -- a real anonymous request carries no user id
set role anon;
do $$ declare n int; d numeric; begin
  select count(*) into n from properties; assert n = 30, 'public should now see 30, saw '||n;
  select public.haversine_km(17.38,78.48,13.08,80.27) into d; assert d between 500 and 530, 'Hyderabad to Chennai is ~515 km in a straight line, got '||d;
end $$;
reset role;
\echo ALL DATABASE TESTS PASSED
