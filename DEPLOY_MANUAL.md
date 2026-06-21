# EMA of BC Platform - Manual Deployment Guide

This guide walks you through deploying the platform to production using Supabase and Vercel.

## Step 1: Create Supabase Project

### 1.1 Create the project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name:** emaofbc
   - **Organization:** Your organization
   - **Region:** Canada (ca-central-1) - closest to BC
   - **Database Password:** Create a strong password
4. Click "Create new project"
5. Wait 3-5 minutes for the project to initialize

### 1.2 Get your Supabase credentials
Once the project is ready:

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL:** (example: `https://vyoxguypfipibnrwmkwe.supabase.co`)
   - **Anon Key:** (starts with `eyJhbGc...`)
   - **Service Role Key:** (starts with `eyJhbGc...` - keep this SECRET)

Save these - you'll need them in Step 4.

### 1.3 Enable pgvector extension
1. In your Supabase project, go to **SQL Editor**
2. Create a new query and run:
```sql
CREATE EXTENSION IF NOT EXISTS "pgvector/vector" WITH SCHEMA extensions;
```
3. Click "RUN"

### 1.4 Run database migrations
1. Go to **SQL Editor**
2. Copy and run this SQL (from `supabase/migrations/001_initial_schema.sql`):
   - Click "Create a new query"
   - Paste the entire content of `supabase/migrations/001_initial_schema.sql`
   - Click "RUN"
3. Repeat for `supabase/migrations/002_rls_policies.sql`

**Alternative: Use Supabase CLI**
```bash
npm install -g supabase
supabase link --project-ref [PROJECT-ID]
supabase db push
```

### 1.5 Seed the database
1. Update your `.env.local` with Supabase credentials
2. Run: `npm run seed`
3. Verify data loaded:
   - Go to Supabase **Table Editor**
   - Check `organizations` table (should have 55 rows)
   - Check `events` table (should have 12 rows)

## Step 2: Get API Keys from Third-Party Services

### 2.1 Stripe Keys (Test Mode)
1. Go to https://stripe.com/test/keys
2. Copy:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)
3. Go to **Developers → Webhooks**
4. Copy **Webhook Signing Secret** (starts with `whsec_test_`)

### 2.2 xAI Grok API Key
1. Go to https://console.x.ai
2. Create API key in account settings
3. Copy the key (starts with `xai_`)

### 2.3 Resend Email API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Copy the key (starts with `re_`)

## Step 3: Deploy to Vercel

### 3.1 Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import the GitHub repository:
   - Connect your GitHub account if needed
   - Select `Planetterrian/Emaofbc` repository
   - Click "Import"
4. Configure project:
   - **Project Name:** emaofbc
   - **Framework:** Next.js
   - **Root Directory:** ./ (default)

### 3.2 Add Environment Variables to Vercel
1. In Vercel project settings, go to **Settings → Environment Variables**
2. Add each variable below (use values from Step 1 & 2):

```
NEXT_PUBLIC_SUPABASE_URL = https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [ANON-KEY-FROM-STEP-1]
SUPABASE_SERVICE_ROLE_KEY = [SERVICE-ROLE-KEY-FROM-STEP-1]
STRIPE_SECRET_KEY = sk_test_[YOUR-KEY]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_[YOUR-KEY]
STRIPE_WEBHOOK_SECRET = whsec_test_[YOUR-KEY]
XAI_API_KEY = xai_[YOUR-KEY]
XAI_MODEL = grok-latest
RESEND_API_KEY = re_[YOUR-KEY]
NEXT_PUBLIC_SITE_URL = https://emaofbc.vercel.app
```

3. For each variable, select **All** for environment (Production, Preview, Development)
4. Click "Deploy" to start the deployment

### 3.3 Wait for Deployment
- Vercel will automatically build and deploy
- Check the deployment status in the "Deployments" tab
- Once complete, your site will be available at `https://emaofbc.vercel.app`

## Step 4: Configure Stripe Webhooks

### 4.1 Set Webhook Endpoint in Stripe
1. Go to https://stripe.com/test/webhooks
2. Click "Add endpoint"
3. Fill in:
   - **URL:** `https://emaofbc.vercel.app/api/stripe-webhook`
   - **Events:** Select "charge.succeeded", "charge.refunded", "payment_intent.payment_failed"
4. Click "Add endpoint"
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Update in Vercel: **Settings → Environment Variables → STRIPE_WEBHOOK_SECRET**

### 4.2 Test Webhook
1. In Stripe test mode, go to **Events**
2. Look for your endpoint
3. Click to view events (they should show successful deliveries)

## Step 5: Verify Production Setup

### 5.1 Test Public Site
- [ ] Visit https://emaofbc.vercel.app
- [ ] Home page loads without errors
- [ ] Navigation works (Events, Directory, About, Contact, etc.)
- [ ] Events listing shows 12 seeded events

### 5.2 Test Membership Join Flow
- [ ] Go to /join
- [ ] Fill in organization info
- [ ] Select membership tier
- [ ] Click "Proceed to Payment"
- [ ] Use Stripe test card: `4242 4242 4242 4242`
  - Exp: any future date
  - CVC: any 3 digits
- [ ] Verify redirect to success page

### 5.3 Test Event Registration
- [ ] Go to /events
- [ ] Click on an event
- [ ] Click "Register Now"
- [ ] Enter email matching seeded org domain (e.g., `test@activeearthcorp.com`)
- [ ] Verify membership status detected
- [ ] Complete registration

### 5.4 Test Admin Console
- [ ] Go to /admin
- [ ] Verify dashboard shows KPIs
- [ ] Navigate to each section (Memberships, Events, Awards, etc.)

### 5.5 Test AI Features
- [ ] Go to /member-assistant
- [ ] Ask questions like "What are your membership tiers?"
- [ ] Verify appropriate responses

## Step 6: Monitor Production

### 6.1 Set Up Monitoring
- [ ] Check Vercel deployment logs regularly
- [ ] Monitor error rate in Vercel Analytics
- [ ] Check Supabase logs in SQL Editor → Logs
- [ ] Monitor Stripe webhooks for failures

### 6.2 Configure Alerts
- [ ] Supabase: Set up alerts for slow queries
- [ ] Vercel: Enable error notifications
- [ ] Stripe: Monitor failed payments

## Troubleshooting

### Issue: "NEXT_PUBLIC_SUPABASE_URL is empty"
**Solution:** 
- Verify all environment variables are set in Vercel
- Redeploy after updating variables
- Check that variables are set for Production environment

### Issue: Stripe webhook not firing
**Solution:**
- Verify webhook URL is accessible: `curl https://emaofbc.vercel.app/api/stripe-webhook`
- Check Stripe webhook logs for errors
- Verify signing secret is correct

### Issue: Database migration fails
**Solution:**
- Check Supabase SQL Editor logs
- Verify pgvector extension is enabled
- Run migrations one at a time
- Check for SQL syntax errors

### Issue: Deployment fails
**Solution:**
- Check Vercel build logs
- Verify all environment variables are set
- Try manual rebuild: Click "Redeploy" in Vercel
- Check TypeScript errors: `npm run build` locally

## What's Next

### Phase 4.1: Webhook Implementation
The webhook handler needs implementation:
1. Update `/app/api/stripe-webhook/route.ts`
2. Implement `charge.succeeded` handler to:
   - Create organization (if new)
   - Create membership record
   - Send confirmation email via Resend

### Phase 6: Auth UI
- Implement login/signup pages
- Connect to Supabase Auth
- Set up password reset flow

### Phase 7: Email Service
- Set up email templates in Resend
- Connect to registration confirmation
- Set up newsletter distribution

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **xAI API:** https://console.x.ai/docs
- **Resend:** https://resend.com/docs

---

**Estimated Time:** 30-45 minutes  
**Cost:** $10/month Supabase + Vercel Hobby/Pro plan  
**Status:** All 5 phases ready for production deployment
