# estateXpert

Resale homes in Telangana, Andhra Pradesh, Kerala and Tamil Nadu for NRI families. Next.js 15 (App Router) + Supabase.
All listings, names, prices and distances are **sample data**.

## Run it now (demo mode, no accounts needed)

    npm install
    npm run dev          # http://localhost:3000

With no env vars the app keeps sample data in server memory (resets on restart). Use the **Sign in** page to
continue as buyer, seller or admin.

## Go live with Supabase (free tier)

1. Create a project at supabase.com.
2. SQL editor: run `supabase/migrations/0001_schema.sql`, then `0002_contact.sql`, then (optional sample data) `supabase/seed.sql`.
3. Authentication > Providers: enable Email. Authentication > URL configuration: add `https://YOUR-DOMAIN/auth/callback` (and `http://localhost:3000/auth/callback`).
4. Copy `.env.example` to `.env.local` and fill in the project URL and anon key (Settings > API).
5. Sign in once on the site, then make yourself admin in the SQL editor:
   `update profiles set role='admin' where id = (select id from auth.users where email='you@example.com');`
6. Deploy to Cloudflare Pages or Netlify (Vercel Hobby is non-commercial) and set the same two env vars.

## What is verified

- Database schema and row-level security: `npm run db:test` (needs local Postgres 16) passes.
- App in demo mode: browse, filter, map, property page, enquiry and video-call booking, save, sell flow, account, admin approve, contact, NRI page.
- **Not yet tested against a live Supabase project.** The Supabase adapter (`lib/db/supabase.js`) follows the same interface as the demo one; expect small fixes on first connection.

## Still to do (needs your input)

Brand name, logo, domain; real photos and listing content; legal pages (terms, privacy) reviewed by a lawyer;
translations (Telugu, Malayalam, Tamil); real map (OpenStreetMap); email/WhatsApp notifications; compare page.
Filters run in JS over the full list, fine for hundreds of listings; move to SQL with pagination as it grows.
