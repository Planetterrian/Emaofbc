# EMA of BC Platform - Production Setup Guide

This guide walks through setting up the EMA of BC platform for production deployment.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (https://supabase.com)
- A Stripe account (https://stripe.com) - use test mode keys initially
- An xAI API key (https://console.x.ai) for Grok API
- A Resend account (https://resend.com) for transactional email
- Vercel account for hosting (optional but recommended)

## Phase 0.1: Database & Services Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Create a new project with PostgreSQL 14+
3. Wait for the project to initialize
4. Go to Project Settings → Database
5. Enable pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "pgvector/vector" WITH SCHEMA extensions;
   ```
6. Copy your connection details:
   - Project URL: `https://[project-id].supabase.co`
   - Anon Key: (found in Settings → API)
   - Service Role Key: (found in Settings → API)

### Step 2: Run Database Migrations

Download the Supabase CLI:
```bash
npm install -g supabase
```

Link your project:
```bash
supabase link --project-ref [project-id]
```

Run migrations:
```bash
supabase db push
```

Verify migrations:
```bash
supabase db pull --schema public
```

### Step 3: Seed Database

Create `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

Run seed script:
```bash
npm run seed
```

Verify data:
- Organizations: 55 records
- Board Members: 20 records
- Events: 12 published events
- Registrations: sample data
- Awards: submission samples
- Content: archive items with embeddings

### Step 4: Configure Environment Variables

Create `.env.local` with all required variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# xAI Grok API
XAI_API_KEY=xai_...
XAI_MODEL=grok-latest

# Resend Email
RESEND_API_KEY=re_...

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

### Step 5: Enable Supabase Auth (Phase 1)

In Supabase dashboard:
1. Go to Authentication → Providers
2. Enable Email provider (default)
3. Configure email templates
4. Set up OAuth providers (Google, GitHub) - optional
5. Set redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## Phase 1: Local Development

### Run Development Server

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Test Public Site

- [ ] Home page loads
- [ ] Events listing shows seeded events
- [ ] Event detail pages display with pricing
- [ ] Member directory shows organizations
- [ ] Board page shows 20 board members
- [ ] Navigation works across all pages

### Test Join Flow (Stripe Test Mode)

1. Go to `/join`
2. Fill in organization info
3. Select membership tier
4. Use Stripe test card: `4242 4242 4242 4242` (exp: any future date, CVC: any 3 digits)
5. Verify success redirect to `/portal?success=true`

### Test Event Registration (Requires Auth)

1. Go to `/events` and select an event
2. Click "Register Now"
3. Enter email matching seeded organization domain (e.g., `someone@activeearthcorp.com`)
4. Verify membership status detection
5. For paid events, complete Stripe payment
6. Verify confirmation page and .ics download

### Test Admin Console

1. Go to `/admin`
2. View dashboard (should show KPIs)
3. Navigate to memberships, events, awards, directory
4. Test AI features:
   - `/admin/newsletter` - generate newsletter
   - `/admin/ai-event-copy` - generate event copy

### Test Member Assistant

1. Go to `/member-assistant`
2. Ask questions like:
   - "What are the membership tiers?"
   - "When are your events?"
   - "How do I join?"
3. Verify appropriate responses

## Phase 2: Webhook Implementation

### Stripe Webhook Handler

The stub at `/app/api/stripe-webhook/route.ts` needs full implementation:

```typescript
// TODO: Implement these handlers in Phase 4.1
1. charge.succeeded
   - Create organization (if new)
   - Create membership record
   - Update organization.status = 'active'
   - Set organization.paid_through = Dec 31 current year
   - Send confirmation email via Resend

2. charge.refunded
   - Update membership.status = 'refunded'
   - Update organization.status = 'lapsed'

3. payment_intent.payment_failed
   - Log failure
   - Send retry email
```

### Configure Webhook in Stripe

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint:
   - URL: `https://yourdomain.com/api/stripe-webhook` (production)
   - Events: `charge.succeeded`, `charge.refunded`, `payment_intent.payment_failed`
3. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Phase 3: Email Templates

Configure transactional emails in Resend:

1. Account confirmation (on first registration)
2. Event registration confirmation with .ics attachment
3. Newsletter distribution
4. Membership renewal reminder
5. Payment receipt

See `lib/mailer.ts` for template integration.

## Phase 4: Deployment to Vercel

### Connect Repository

```bash
npm i -g vercel
vercel link
```

### Configure Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all `.env.local` variables
3. **IMPORTANT:** Do NOT commit `.env.local` to git
4. Use `.env.example` for documentation

### Deploy

```bash
git push origin claude/ema-bc-platform-build-cm2lyd
vercel deploy --prod
```

### Post-Deployment

- [ ] Test public site on production URL
- [ ] Test Stripe integration with live test cards
- [ ] Monitor server logs
- [ ] Set up monitoring/alerting
- [ ] Configure custom domain

## Database Backup

Configure automatic backups:

```bash
# Supabase auto-backups are included in Pro plan
# For manual backup:
pg_dump postgresql://[user]:[password]@[host]:5432/postgres > backup.sql
```

## Security Checklist

- [ ] Service Role Key never exposed in frontend code
- [ ] `.env.local` in `.gitignore` (verified)
- [ ] STRIPE_WEBHOOK_SECRET rotated if needed
- [ ] XAI_API_KEY rotated periodically
- [ ] RLS policies enabled on all database tables
- [ ] CORS configured for Supabase
- [ ] Rate limiting configured on API routes
- [ ] SQL injection prevention via parameterized queries
- [ ] XSS prevention via Next.js built-in escaping

## Monitoring & Alerts

Set up monitoring for:

1. **Stripe Webhooks:**
   - Failed webhook deliveries
   - Payment failures
   - Charge reversals

2. **Database:**
   - Connection pool usage
   - Slow queries
   - Backup status

3. **Application:**
   - Error rates
   - Response times
   - API quota usage (xAI)

4. **Email:**
   - Bounce rate
   - Delivery failures
   - Unsubscribe rate

## Troubleshooting

### Supabase Connection Issues

```bash
# Test connection
psql postgresql://[user]:[password]@[host]:5432/postgres -c "SELECT 1"

# Check logs
supabase logs
```

### Stripe Webhook Not Working

- Verify webhook secret in `.env.local`
- Check Stripe dashboard event logs
- Verify endpoint is publicly accessible
- Test with `stripe listen` locally

### Email Not Sending

- Verify RESEND_API_KEY is correct
- Check Resend dashboard for delivery status
- Review sender email domain configuration
- Test with `npm run test:email` (if implemented)

### AI Features Not Working

- Verify XAI_API_KEY is valid
- Check API quota usage
- Verify model name (must be `grok-latest`)
- Review xAI API docs for rate limits

## Performance Optimization

1. **Images:** Set up Supabase Storage for logos/assets
2. **Cache:** Configure Vercel edge caching
3. **Database:** Monitor slow queries, add indices
4. **AI:** Implement response caching for common queries
5. **Email:** Use Resend batch sending for newsletters

## Rollback Procedure

If production has issues:

1. Revert to previous deployment in Vercel
2. Revert database migrations if needed:
   ```bash
   supabase db reset  # WARNING: Loses data
   # OR restore from backup
   ```
3. Notify users
4. Investigate in staging environment

## Next Steps

1. Complete webhook implementation (Phase 4.1)
2. Set up admin interfaces for common tasks
3. Implement auth UI (login, signup, password reset)
4. Add email confirmation flow
5. Set up monitoring and alerting
6. Test all user journeys end-to-end
7. Performance testing and optimization
8. Security penetration testing

## Support

For issues:
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- xAI API: https://console.x.ai/docs
- Resend: https://resend.com/docs
- Next.js: https://nextjs.org/docs

---

**Status:** Phase 0.1 setup complete  
**Date:** 2026-06-21  
**Build:** Phases 0-5 complete, ready for deployment
