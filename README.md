# Gifted Delites Store — Setup Guide

A storefront where customers browse products and check out via WhatsApp/Instagram,
plus a password-protected `/admin` area where staff add, edit, and delete products
through a form — no code editing required after this initial setup.

This guide assumes no prior experience with Supabase or Vercel. It takes about 20-30 minutes.

## 1. Create your Supabase project (free database)

1. Go to https://supabase.com and sign up / log in.
2. Click **New project**. Pick any name and password (save the password somewhere — you won't need it day-to-day, but keep it).
3. Once the project finishes setting up (~2 min), go to the **SQL Editor** tab.
4. Open the file `supabase/schema.sql` from this project, copy its contents, paste into the SQL Editor, and click **Run**.
   This creates the `products` table.
5. Go to **Storage** (left sidebar) → **New bucket** → name it exactly `product-images` → toggle **Public bucket** ON → Create.
   This is where staff-uploaded photos will live.
6. Go to **Project Settings** → **API**. You'll need three values from this page in step 3 below:
   - **Project URL**
   - **anon public** key
   - **service_role** key (click "Reveal" — keep this one secret, never share it)

## 2. Push this code to GitHub

1. Create a new (private is fine) repository on GitHub.
2. Upload this entire folder to it (drag-and-drop on GitHub's web UI works, or use `git` if you're comfortable with it).

## 3. Deploy to Vercel (free hosting)

1. Go to https://vercel.com and sign up / log in (you can sign in with your GitHub account).
2. Click **Add New… → Project**, then **Import** the GitHub repo you just created.
3. Before clicking Deploy, open **Environment Variables** and add each of these
   (see `.env.example` in this project for the full list with explanations):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase step 1.6 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key from Supabase step 1.6 |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key from Supabase step 1.6 |
   | `ADMIN_PASSWORD` | a password you choose for staff to log into `/admin` |
   | `SESSION_SECRET` | any long random string — generate one at https://generate-secret.vercel.app/32 |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | your WhatsApp number, digits only, international format (e.g. `2348012345678`) |
   | `NEXT_PUBLIC_INSTAGRAM_HANDLE` | your Instagram username |

4. Click **Deploy**. After a couple of minutes you will receive your live store URL.

That's it — your storefront is live at that URL, and staff can manage products at `yourdomain.com/admin`.

## 4. Using the admin area day-to-day

- Go to `yourdomain.com/admin`, enter the shared password (whatever you set as `ADMIN_PASSWORD`).
- **Add Product**: fill in the form, upload photos directly (drag files in, no need to name them or host them anywhere yourself), click Add Product. It appears on the live site immediately.
- **Edit/Delete**: from the products table, click Edit or Delete on any row.
- To change the shared password later, update `ADMIN_PASSWORD` in Vercel's Environment Variables and redeploy (Vercel does this automatically when you change env vars and trigger a redeploy).

## 5. Local development (optional, if you want to test changes before deploying)

```bash
npm install
cp .env.example .env.local   # then fill in the real values
npm run dev
```
Visit http://localhost:3000

## Project structure, if you want to make changes later

- `app/page.tsx` + `components/Storefront.tsx` — the public storefront
- `app/admin/**` — staff-only pages (product list, add, edit, login)
- `app/api/products` — public read-only API the storefront calls
- `app/api/admin/**` — staff-only API for creating/editing/deleting products and uploading images
- `lib/supabaseClient.ts` — public database client (read-only, safe for the browser)
- `lib/supabaseAdmin.ts` — server-only database client (full access — never import this into a "use client" file)
- `middleware.ts` — blocks anyone without a valid admin session from reaching `/admin` or its API routes
