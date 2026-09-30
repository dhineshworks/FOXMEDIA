# FOXMEDIA — Adobe & Canva Subscription & Redemption Platform

A complete, production-ready, serverless React application for an Adobe Creative Cloud + Canva Pro digital subscription business.

---

## 🏛️ Architecture & Zero-Backend Design

```
                  ┌───────────────────────────────┐
                  │    React 19 + Vite + TS       │
                  │       Customer Website        │
                  └──────────────┬────────────────┘
                                 │
                                 │ Direct Supabase Client
                                 ▼ (Public Anon Key ONLY)
                  ┌───────────────────────────────┐
                  │           Supabase            │
                  │   • PostgreSQL Database       │
                  │   • Authentication            │
                  │   • Row Level Security (RLS)  │
                  │   • Atomic Database RPCs      │
                  └──────────────┬────────────────┘
                                 ▲
                                 │ Direct Supabase Client
                                 │ (RLS Admin Protected)
                  ┌──────────────┴────────────────┐
                  │       React Admin Portal      │
                  │       (/admin/dashboard)      │
                  └───────────────────────────────┘
```

> **IMPORTANT ARCHITECTURAL GUARANTEE:**
> - **NO separate Node.js / Express backend server.**
> - **NO separate backend deployment or maintenance.**
> - Frontend deploys directly to **Vercel** with SPA routing (`vercel.json`).
> - Supabase serves as the backend infrastructure, database, authentication, and execution layer.
> - **Zero Service Role Key Exposure**: Frontend communicates exclusively via the safe `VITE_SUPABASE_ANON_KEY`. All authorization and concurrency locks are strictly enforced at the database layer via PostgreSQL Row Level Security (RLS) and PostgreSQL functions (`validate_redemption_token`, `redeem_redemption_token`).

---

## 🚀 Key Features

### 1. Customer Website
- **Hero Section**:
  - Headline: *"Premium Creative Tools. Simple Pricing."*
  - Subheadline: *"Get powerful Adobe and Canva plans for your creative workflow."*
  - Direct CTAs: *"View Plans"* & *"Chat on WhatsApp"*
- **Product Plans**:
  - **Adobe Pro Plus (4 Month)** — `₹1,199`: 4 Months Full Access, No profile switching problem, All Standard Features, FireFly Video Generations, 4000 AI Credits Per Month, 1TB Cloud Storage, Advanced AI Features (Nano Banana), Priority Support 24/7.
  - **Canva Pro (1 Year)** — `₹199`: 1 Year Full Access, 100+ Million Premium Assets, Instant Background Removal, Magic Resize & Animation, All Fonts, Premium Templates, Official License.
- **WhatsApp Order Routing**:
  - Pre-filled WhatsApp message generation dynamically linked to `9865488886`.
  - Floating WhatsApp support action.
- **How It Works & FAQ**: 4-step clear workflow and accordion FAQ.

### 2. Public Redemption System (`/redeem/:token`)
- **No Login Required**: Instant customer redemption.
- **Safe Inspection**: Opening the link queries `validate_redemption_token(token)` via RPC to preview status, product name, duration, and expiration without redeeming.
- **Atomic Single/Multi-Use Redemption**:
  - Executed ONLY when the user clicks **"Redeem Now"**.
  - Calls `redeem_redemption_token(token)` which acquires a PostgreSQL `FOR UPDATE` row lock, preventing race conditions or double-redemptions.
  - Comprehensive status states:
    - `ACTIVE` (Ready)
    - `USED` (Link Already Used)
    - `EXPIRED` (Link Expired)
    - `DISABLED` (Link Disabled)
    - `LIMIT_REACHED` (Usage Limit Reached)
    - `INVALID` (Invalid Redemption Link)

### 3. Protected Admin Portal (`/admin`)
- **Route Guard & Authentication**:
  - Unauthenticated visits to `/admin/*` are automatically redirected to `/admin/login`.
  - Enforced by Supabase Auth and `profiles.role = 'admin'`.
- **Admin Dashboard** (`/admin/dashboard`):
  - KPI Stat Cards: Total Generated, Active & Ready, Redeemed (Used), Expired / Limit Reached.
  - Live Redemption Audit Stream with timestamps and product names.
- **Redemption Links Manager** (`/admin/links`):
  - Filter by status (`ALL`, `ACTIVE`, `USED`, `EXPIRED`, `DISABLED`, `LIMIT_REACHED`).
  - Search by custom name, token, or product.
  - **[Copy Link]** for each row.
  - **[Copy All Links]** formatted for bulk sharing.
  - **[Download CSV]** formatted with `Custom Name, Product, Redeem URL, Status, Usage Type, Uses / Max, Created At, Expires At`.
  - Enable/Disable toggle and link deletion.
- **Bulk Token Generator** (`/admin/links/create`):
  - Choose Product, Custom Prefix (e.g. `SEP30` → `SEP30-001` ... `SEP30-100`).
  - Cryptographically secure random tokens generated independently from display names (e.g. `r_8Fj29KxP7mQ2Ls91`).
  - Expiration options: None, 1h, 6h, 12h, 1d, 3d, 7d, custom.
  - Usage options: Single Use (default) or Multiple Use with custom max uses.
  - Quantity presets: 1, 10, 50, 100, custom up to 500.
  - Instant success dialog with 1-click **Copy All** and **Download CSV**.
- **Product Management** (`/admin/products`):
  - Edit prices, descriptions, duration labels, active status, and feature lists.
- **Platform Settings** (`/admin/settings`):
  - Business name, WhatsApp phone number, support operational hours, and website URL.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Router**: React Router v7 with Vercel rewrites
- **Database & Auth**: Supabase PostgreSQL + Auth + RLS + Database RPCs

---

## ⚡ Setup & Deployment Instructions

### 1. Local Development
```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev

# Run automated test & verification suite
node --experimental-strip-types scripts/verify-all.mjs

# Build production bundle
npm run build
```

### 2. Connect Your Live Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the Supabase dashboard, open **SQL Editor**.
3. Copy the contents of [`supabase/schema.sql`](file:///d:/foxmedia%20website/supabase/schema.sql) and run it.
4. Copy the contents of [`supabase/seed.sql`](file:///d:/foxmedia%20website/supabase/seed.sql) and run it.
5. In Supabase **Authentication -> Users**, create an admin user (e.g. `admin@foxmedia.com`).
6. In **SQL Editor**, grant the user admin role:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'admin@foxmedia.com';
   ```
7. In your project, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
8. Set your Supabase public credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

*(Note: If `.env` is left empty or unconfigured, the app runs in **Local Preview Mode** with persistent browser storage and demo login `admin@foxmedia.com` / `admin123` so you can test all features immediately!)*

### 3. Deploy to Vercel
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Complete FOXMEDIA subscription & redemption web app"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. In **Project Settings -> Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! Vercel will automatically detect Vite and use `vercel.json` for single-page routing.
