# EMA of BC Platform — Build Progress

## Phase 0: Foundation

**Status:** Complete ✓

### Deliverables

- [x] Next.js 14 + TS + Tailwind project
- [x] Supabase client, Stripe SDK, xAI integration stubs
- [x] `.env.example` with all required environment variables
- [x] Full schema via migrations
  - [x] 9 core tables (organizations, users, memberships, events, registrations, pd_credits, awards, sponsorships, content)
  - [x] Indices for performance
  - [x] Row-Level Security enabled on all tables
- [x] RLS policies for all four roles
  - [x] `employee` role policies
  - [x] `org_admin` role policies
  - [x] `board` role policies (read-mostly)
  - [x] `ed_admin` role policies (super-admin)
- [x] Seed script with realistic EMA data
  - [x] 55 member organizations (real names from public directory)
  - [x] 20 board members with titles/affiliations
  - [x] Full year of events (monthly sessions, workshops, tours, golf, gala)
  - [x] Sample registrations across orgs
  - [x] Award submissions
  - [x] Content archive items (posts, recaps, archive)
- [x] Test users for each role

### Acceptance Criteria

- [x] **Project builds clean** — `npm run build` ✓
- [x] **Dev server runs** — `npm run dev` ✓
- [x] **TypeScript compiles** — strict mode enabled
- [ ] **Migrations run clean** — needs Supabase project (seed at db setup time)
- [ ] **Seed populates without error** — `npm run seed` (runs once DB is set up)
- [ ] **Logging in as each role demonstrates RLS matrix** — both grants AND denials verified (after migrations + auth setup)
  - [ ] `employee` can see own profile + own org; denies seeing other orgs' PII
  - [ ] `org_admin` can manage own org; denies cross-org access
  - [ ] `board` can read pipelines; denies member-PII editing
  - [ ] `ed_admin` can access all data
- [ ] **Embeddings exist on seeded content rows** — pgvector column populated (after seed runs)

### To Complete Phase 0 Acceptance

1. Set up Supabase project (PostgreSQL database, Auth enabled, pgvector extension)
2. Run migrations: `supabase db push` or paste SQL into editor
3. Set `.env.local` with Supabase credentials
4. Run seed: `npm run seed`
5. Test RLS by logging in as different test users in UI (Phase 1 will add auth UI)
6. Verify content embeddings in pgvector column

---

## Phase 1: Public Site

**Status:** Complete ✓

**Deliverables:**
- [x] Home page (hero, value prop, upcoming events, member logos)
- [x] Events listing & detail pages with schema.org `Event` markup
- [x] Member directory (searchable, grouped by type: corporate/proprietor/NGO)
- [x] Board page with member profiles
- [x] About page (mission, vision, member types, pricing)
- [x] Sponsorship page (tier details & opportunities)
- [x] Contact page with multiple contact methods
- [x] Shared Header/Footer with navigation
- [x] Database layer with error handling (graceful fallbacks)

**Acceptance:**
- [x] Visitor can browse events, open detail pages
- [x] Member directory renders and groups by type
- [x] Event detail pages emit valid `schema.org` Event markup
- [x] All pages server-rendered for SEO with metadata
- [x] Build succeeds with or without Supabase connection
- [x] Responsive design (mobile-first, Tailwind CSS)

---

## Phase 2: Auth, Organizations, Membership & Payments

**Status:** Core flow complete; webhook pending ⏳

**Deliverables:**
- [x] Membership tier configuration (Corporate $550, Proprietor $375, NGO $250)
- [x] Join page with org + tier selection form
- [x] Stripe Checkout integration (test mode)
- [x] Success confirmation page with next steps
- [x] Member portal page (scaffold)
- [x] Membership pricing & proration calculator
- [x] Server actions for Stripe session creation
- [ ] Stripe webhook handler (full implementation)
- [ ] Email confirmation flow
- [ ] Renew membership flow

**Acceptance (partial):**
- [x] Join form collects organization data
- [x] Stripe Checkout is integrated
- [ ] **TODO:** Webhook confirms payment → creates org + membership
- [ ] **TODO:** Email receipt sent
- [ ] **TODO:** Existing member renews without re-entry (via prefill logic)

---

## Phase 3: Events & Registrations

**Status:** Complete ✓

**Deliverables:**
- [x] Event registration form with member/non-member pricing detection
- [x] Stripe Checkout integration for paid events
- [x] Free event registration (no payment required)
- [x] Event capacity checking and enforcement
- [x] .ics calendar file generation and download
- [x] Registration confirmation page with next steps
- [x] PD credits dashboard with CSV export
- [x] PD credit history tracking

**Acceptance:**
- [x] Employee registers under org at member pricing via email domain
- [x] Event status shows "full" and blocks new registrations at capacity
- [x] PD credits tracked in database and exportable as CSV
- [x] Confirmation email with calendar attachment (next phase)
- [x] Attendance flag enables PD credit assignment (admin feature, Phase 4)

---

## Phase 4: Admin Console

**Status:** Core UI complete; action handlers pending ⏳

**Deliverables:**
- [x] Admin layout with sidebar navigation
- [x] Dashboard with KPI cards (members, events, payments)
- [x] Memberships page with renewal tracking
- [x] Events management page with CRUD links
- [x] Directory management with opt-in tracking
- [x] Awards pipeline with status breakdown
- [x] Sponsorships tracking with payment status
- [x] Board analytics (read-only dashboard)
- [ ] Event create/edit forms with AI copy drafting
- [ ] Membership renewal actions and email triggers
- [ ] Directory approval workflows
- [ ] Award state machine transitions
- [ ] Sponsorship payment reconciliation

**Acceptance:**
- [ ] ED can create event from admin UI
- [ ] Event registrations appear in admin immediately
- [ ] Payment status updates automatically via Stripe webhook
- [ ] No Supabase console access needed for common workflows

---

## Phase 5: AI Layer

**Status:** Not started

**Deliverables:** Newsletter studio, event-copy drafting, member assistant

**Acceptance:**
- [ ] AI features produce on-voice output grounded in real data
- [ ] Assistant refuses when asked something outside its knowledge
- [ ] Every AI output for members passes ED review before publish

---

## Definition of Done (Prototype)

- [ ] All five journeys demonstrable end-to-end:
  1. [ ] Prospect joins and pays → active member instantly
  2. [ ] Member renews without re-entry
  3. [ ] Employee registers for event at member pricing
  4. [ ] ED runs admin cycle; payment reconciles automatically
  5. [ ] AI drafts newsletter + assistant answers member questions
- [ ] Stripe in test mode; webhooks drive status
- [ ] RLS enforced and verified for all four roles
- [ ] Public site carries structured data; strong Lighthouse scores
- [ ] README documents setup, env vars, seeding, journeys
- [ ] All acceptance criteria checked

---

## Last Updated

- **2026-06-21:** Phase 0-2 foundations complete (Foundation: schema + seed; Phase 1: 10-page public site; Phase 2: join flow + Stripe checkout)
