# Environmental Managers Association of BC — Platform Prototype

A Next.js 14 prototype for the EMA of BC platform featuring a public site, member portal, and admin console.

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS with navy/forest environmental palette
- **Database/Auth/Storage:** Supabase (Postgres, Auth, Row-Level Security)
- **Payments:** Stripe (test mode)
- **AI:** xAI Grok (`grok-latest`)
- **Email:** Resend for transactional emails
- **Search:** Postgres full-text + pgvector embeddings

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd emaofbc
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

You will need:
- **Supabase:** Project URL, anon key, and service-role key
- **Stripe:** Test mode publishable and secret keys, webhook secret
- **xAI:** API key for Grok
- **Resend:** API key for email
- **Site URL:** typically `http://localhost:3000` for dev

### 3. Set up Supabase database

If you have a Supabase project:

1. Go to your Supabase dashboard
2. Open the SQL editor
3. Copy and run both migration files:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`

Or use the Supabase CLI:

```bash
supabase db pull  # pulls schema from remote if already set up
supabase migration up  # runs local migrations
```

### 4. Seed data

Populate the database with realistic EMA data (55 member orgs, 20 board members, events, etc.):

```bash
npm run seed
```

### 5. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Utilities & services
│   ├── supabase.ts        # Supabase client
│   ├── ai.ts              # xAI Grok integration
│   ├── mailer.ts          # Email service
│   └── types.ts           # TypeScript types
├── supabase/
│   └── migrations/        # Database migrations
├── scripts/
│   └── seed.ts            # Seed data script
├── .env.example           # Environment template
└── README.md
```

## Data Model

### Core entities

- **organizations** — member entities (corporate, sole proprietor, NGO)
- **users** — individuals with roles (employee, org_admin, board, ed_admin)
- **memberships** — annual member subscriptions
- **events** — monthly sessions, workshops, tours, golf, gala
- **registrations** — person ↔ event attendance
- **pd_credits** — professional development credit ledger
- **awards** — award submissions and pipeline
- **sponsorships** — event sponsorship opportunities
- **content** — posts, recaps, archive items with embeddings

### Role-based access (RLS)

| Role | Can see / do |
|---|---|
| `employee` | Own profile; own org profile; register for events; own PD ledger |
| `org_admin` | ↑ Plus manage org profile + roster + renew membership |
| `board` | Read-mostly access to pipelines + metrics; no member PII editing |
| `ed_admin` | Super-admin: all operations |

## Test Users

After seeding, you can log in as:

- **ED Admin:** `ed@emaofbc.com`
- **Board Member:** `sarah.mitchell@emaofbc.com` (or any board member email)
- **Org Admin:** `employee1@<any-member-domain>` (e.g., `employee1@stantec.com`)
- **Employee:** `employee2@<any-member-domain>`

## Development Workflow

### Building a feature

1. Create a server component or server action in `app/`
2. Use the Supabase client from `lib/supabase.ts` for queries
3. Call xAI if needed via `lib/ai.ts`
4. Test RLS policies by logging in as different roles
5. Commit with a descriptive message

### Testing RLS

Each role's access is enforced via Supabase Row-Level Security. Denials are logged. Verify:

```sql
-- In Supabase SQL editor, test as a specific role
SET ROLE authenticated;
SELECT * FROM organizations LIMIT 1;
```

## Phase 0 Acceptance Criteria

- [x] Next.js 14 + TypeScript + Tailwind project
- [x] Supabase client, Stripe SDK, xAI integration stubs
- [x] Full schema (9 tables) with RLS for all four roles
- [x] Seed script with 55 member orgs, 20 board members, events, registrations, awards, content
- [x] Test users for each role
- [ ] Migrations run clean; seed populates without error (verify in Supabase)
- [ ] RLS matrix verified for all four roles (both grants and denials)
- [ ] Embeddings exist on seeded content rows

## Next Steps

After Phase 0 is verified:

1. **Phase 1** — Public site (home, events, directory, sponsorship, contact)
2. **Phase 2** — Auth, organizations, membership & payments (join/renew + Stripe)
3. **Phase 3** — Event registrations + PD ledger
4. **Phase 4** — Admin console (membership, events, awards, sponsorship pipelines)
5. **Phase 5** — AI layer (newsletter studio, event copy, member assistant)

See `PROGRESS.md` for tracking.

## Troubleshooting

**"NEXT_PUBLIC_SUPABASE_URL is empty"**
- Ensure `.env.local` exists and is populated

**Seed script fails**
- Check that migrations have run successfully in Supabase
- Verify service-role key is set correctly

**Stripe webhook not firing**
- In test mode, use `stripe listen` or forward webhooks manually in Stripe dashboard

---

Built with Claude Code. See companion spec: *EMA of BC — AI-Optimized Website & Member Platform*.
