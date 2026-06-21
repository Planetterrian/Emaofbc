# EMA of BC Platform — Build Progress

## Phase 0: Foundation

**Status:** In Progress

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

- [ ] **Migrations run clean** — no SQL errors
- [ ] **Seed populates without error** — all data inserted successfully
- [ ] **Logging in as each role demonstrates RLS matrix** — both grants AND denials verified
  - [ ] `employee` can see own profile + own org; denies seeing other orgs' PII
  - [ ] `org_admin` can manage own org; denies cross-org access
  - [ ] `board` can read pipelines; denies member-PII editing
  - [ ] `ed_admin` can access all data
- [ ] **Embeddings exist on seeded content rows** — pgvector column populated

### Outstanding

- Verify migrations run in actual Supabase project
- Verify seed script completes without errors
- Test RLS policies with test users
- Confirm pgvector embeddings are created

---

## Phase 1: Public Site

**Status:** Not started

**Deliverables:** Home, About, Vision, Board, Events (listing + calendar), Member Directory (searchable), Sponsorship, Contact

**Acceptance:**
- [ ] Visitor can browse events, open detail pages
- [ ] Member directory is searchable + filterable by type/specialty
- [ ] Lighthouse SEO + Accessibility ≥ 95
- [ ] Event detail pages emit valid `schema.org` structured data

---

## Phase 2: Auth, Organizations, Membership & Payments

**Status:** Not started

**Deliverables:** Email auth, org association, join/renew flow, Stripe Checkout, member portal

**Acceptance:**
- [ ] Prospect joins and pays in test mode → instantly active member
- [ ] Existing member renews without re-entering data
- [ ] Killing browser tab after payment still results in correct status (webhook-driven)

---

## Phase 3: Events & Registrations

**Status:** Not started

**Deliverables:** Event registration with capacity limits, member/non-member pricing, PD ledger

**Acceptance:**
- [ ] Employee registers under org at member pricing
- [ ] Full event blocks further registration
- [ ] PD credit recorded on attendance + exportable

---

## Phase 4: Admin Console

**Status:** Not started

**Deliverables:** Dashboard, membership management, event management, directory, awards pipeline, sponsorship pipeline, board view

**Acceptance:**
- [ ] ED can create event, watch registration arrive, see payment reconcile automatically
- [ ] No database access needed for common workflows

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

- **2026-06-21:** Foundation phase setup, schema, migrations, seed script created
