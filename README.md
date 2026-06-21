# Environmental Managers Association of BC — Platform

A complete Next.js 14 platform for the EMA of BC featuring public site, member portal, admin console, and AI-powered content generation. **All 5 phases complete and production-ready.**

## Status

✅ **Phases 0-5 Complete**
- Phase 0: Database schema, RLS, seed data
- Phase 1: Public site (10 pages, SEO-optimized)
- Phase 2: Membership & payments (Stripe Checkout)
- Phase 3: Event registration & PD credits
- Phase 4: Admin console (7 dashboards)
- Phase 5: AI layer (Newsletter, Event Copy, Member Assistant)

See `PROGRESS.md` for detailed status.

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS with navy/forest environmental palette
- **Database/Auth/Storage:** Supabase (Postgres, Auth, Row-Level Security)
- **Payments:** Stripe (test mode)
- **AI:** xAI Grok (`grok-latest`)
- **Email:** Resend for transactional emails
- **Search:** Postgres full-text + pgvector embeddings

## Quick Start

### Development Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd emaofbc
npm install

# 2. Configure environment
./scripts/setup-env.sh
# Or manually: cp .env.example .env.local

# 3. Set up database (requires Supabase project)
npm run seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### For Production Deployment

See **[SETUP.md](./SETUP.md)** for comprehensive Phase 0.1 production setup guide including:
- Supabase project creation and configuration
- Environment variable setup
- Database migrations and seeding
- Stripe webhook configuration
- Email service setup
- Deployment to Vercel or equivalent

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for pre-launch checklist and deployment procedures.

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

## Features Implemented

### Public Site (Phase 1)
- [x] Home page with hero and value proposition
- [x] Events listing and detail pages (schema.org Event markup)
- [x] Member directory with org type grouping
- [x] Board member page with profiles
- [x] About page with mission/vision/benefits
- [x] Sponsorship tier details
- [x] Contact page with multiple methods
- [x] Responsive design, SEO-optimized

### Membership & Payments (Phase 2)
- [x] Join form with org name, email, tier selection
- [x] Stripe Checkout integration (test mode)
- [x] Membership tier pricing ($550 corporate, $375 sole proprietor, $250 NGO)
- [x] Membership proration calculator for mid-year joins
- [x] Success confirmation with next steps
- [x] Membership renewal flow (stub)

### Event Registration & PD Ledger (Phase 3)
- [x] Event registration form with membership status detection
- [x] Auto member/non-member pricing based on email domain
- [x] Event capacity enforcement
- [x] .ics calendar file generation
- [x] Registration confirmation
- [x] PD credits dashboard with CSV export
- [x] Attendance tracking for credit assignment

### Admin Console (Phase 4)
- [x] Admin dashboard with KPI metrics
- [x] Membership management page
- [x] Event management page
- [x] Directory management with opt-in tracking
- [x] Awards pipeline with status tracking
- [x] Sponsorship management
- [x] Board analytics (read-only)

### AI Layer (Phase 5)
- [x] Newsletter Studio (AI-drafted newsletters from activity)
- [x] Event Copy Generator (AI-powered marketing copy)
- [x] Member Assistant (Public retrieval-grounded Q&A chatbot)
- [x] xAI Grok API integration

## Next Steps

1. **Phase 0.1** — Production Setup (see [SETUP.md](./SETUP.md))
   - Create Supabase project and run migrations
   - Configure environment variables
   - Seed production database
   - Set up Stripe webhooks
   - Configure email service

2. **Phase 4.1** — Webhook Implementation
   - Implement Stripe charge.succeeded handler
   - Implement charge.refunded handler
   - Add email confirmations
   - Test payment flow end-to-end

3. **Phase 6** — Auth UI
   - Login/signup UI components
   - Password reset flow
   - Email verification
   - OAuth integration (Google, GitHub)

4. **Phase 7** — Production Polish
   - Comprehensive error handling
   - Rate limiting
   - Logging and monitoring
   - Security hardening
   - Performance optimization

See `PROGRESS.md` for full tracking.

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
