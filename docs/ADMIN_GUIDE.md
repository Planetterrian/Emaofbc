# Admin Guide

_Last updated: June 22, 2026_

A practical guide for administrators of the EMA of BC platform.

## Roles

The platform uses four roles, stored on each user record:

| Role | Who | Can do |
|------|-----|--------|
| `employee` | Member of an organization | View events, register, see own PD credits and profile |
| `org_admin` | Organization's manager | Manage their org profile, team members, registrations, and billing |
| `board` | Board members | Read-only access to memberships, awards, and sponsorships for review |
| `ed_admin` | Executive director / platform admin | Full access to all data and the admin dashboard |

To promote a user to platform admin, set their role in the Supabase SQL editor:

```sql
UPDATE users SET role = 'ed_admin' WHERE email = 'admin@emaofbc.com';
```

## The Admin Dashboard

Admin tools live under `/admin` and require the `ed_admin` role. Available sections:

- **Events** (`/admin/events`) — create, edit, publish, and manage events.
- **AI Event Copy** (`/admin/ai-event-copy`) — generate event descriptions (requires `XAI_API_KEY`).
- **Email Templates** (`/admin/email-templates`) — preview and send test emails.
- **Memberships** (`/admin/memberships`) — view and manage organization memberships.
- **Sponsorships** (`/admin/sponsorships`) — manage event sponsors and placements.
- **Awards** (`/admin/awards`) — review award submissions.
- **Board** (`/admin/board`) — board-facing views.
- **Directory** (`/admin/directory`) — manage the member directory.
- **Newsletter** (`/admin/newsletter`) — newsletter tools.

## Creating an Event

1. Go to `/admin/events` and choose to create a new event.
2. Set the type (monthly session, workshop, tour, golf, gala), title, description, speaker, venue, and start time.
3. Set capacity and pricing in cents (member and non-member). Leave prices empty/zero for free events.
4. Toggle **PD eligible** if attendance should award professional development credits.
5. Set status to **published** when ready for the public to see it. Draft events are not publicly visible.

## Email Templates

All transactional email is sent through Resend from `noreply@emaofbc.com` (configured in `lib/mailer.ts`). The seven template types are: welcome, membership confirmation, membership renewal reminder, event registration confirmation, event reminder, PD credits earned, and team invite.

Use `/admin/email-templates` to send yourself a test of each before launch. Always check the spam folder and verify links and branding render correctly.

## Scheduled Notifications

Three endpoints drive automated emails, each protected by the `NOTIFICATION_API_KEY` header (`x-api-key`):

- `/api/notifications/membership-renewals`
- `/api/notifications/event-reminders`
- `/api/notifications/pd-credits`

These run automatically once a day via **Vercel Cron** (`/api/cron`, scheduled in `vercel.json` at 09:00 UTC). The cron route is protected by `CRON_SECRET`. A GitHub Actions fallback exists at `.github/workflows/notifications.yml` — use only one scheduler to avoid duplicate emails.

To trigger manually for testing:

```bash
curl -X POST https://<your-domain>/api/notifications/membership-renewals \
  -H "x-api-key: <NOTIFICATION_API_KEY>"
```

## Environment Variables

See `.env.production.example` for the full list. Critical ones for launch: the three Supabase keys, the three Stripe keys, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`/`NEXT_PUBLIC_SITE_URL`, and `NOTIFICATION_API_KEY`. Recommended: `XAI_API_KEY`, `CRON_SECRET`, and an error-tracking/analytics ID.

## Common Tasks

**Make a user an org admin:**
```sql
UPDATE users SET role = 'org_admin' WHERE email = 'manager@example.com';
```

**Attach a user to an organization:**
```sql
UPDATE users
SET org_id = (SELECT id FROM organizations WHERE name = 'Org Name')
WHERE email = 'user@example.com';
```

**Mark an organization active through a date:**
```sql
UPDATE organizations SET status = 'active', paid_through = '2027-12-31'
WHERE name = 'Org Name';
```

## Before You Launch

Work through `DEPLOYMENT.md` and the production launch checklist. Confirm: migrations applied, all environment variables set in Vercel, custom domain + SSL live, Resend domain verified (SPF/DKIM), test emails received, and the end-to-end signup, membership, and registration flows all pass.
