# EMA of BC — New Platform: Improvements & Pre-Launch Considerations

_Prepared June 22, 2026 · Live preview: https://emaofbc.vercel.app_

## Executive summary

The previous emaofbc.com was a dated, static WordPress brochure site: a handful of
informational pages, no member accounts, no online payments, no events engine, and no
way for members to self-serve. The new platform is a modern, full-stack web application
(Next.js + Supabase + Stripe + Resend) with a member portal, an admin dashboard, online
membership and event payments, automated email, and AI-powered tools — wrapped in a
fresh, professional "modern environmental" brand. This document summarizes what changed
and what still needs attention before a full public launch.

---

## What's improved over the old site

### Brand & visual design
The old site looked generic and aging. The new site introduces a cohesive
"modern environmental" identity: a deep forest-green and navy palette with sage and gold
accents, a custom logo mark, professional display typography (Plus Jakarta Sans + Inter),
layered gradient heroes, organic shapes, consistent cards and buttons, smooth animations,
and a fully responsive layout with a proper mobile menu. Every page now shares one design
system, so the experience is consistent end to end.

### Information architecture
The old navigation was thin. The new site has a clear structure: Home, About, Events,
Directory, Board, Sponsorship, AI Assistant, and Contact, plus a Member Portal and a
"Become a Member" call to action that are present on every page. Footer adds a newsletter
sign-up, quick links, and social.

### Functionality the old site never had
The new platform is interactive, not just informational:

- Online membership signup with tiered pricing and secure Stripe checkout.
- A full events engine with listings, filters, detail pages, and paid/free registration.
- A member portal (profile, organization, billing history, team management, PD credits,
  notification preferences).
- An admin dashboard (events, memberships, sponsorships, awards, directory, newsletter,
  email templates).
- A searchable member directory and a board-of-directors page driven by live data.
- Automated transactional email (welcome, confirmations, reminders, renewals, PD credits,
  team invites) via Resend.
- Scheduled background jobs (daily) for renewal and event reminders.

### AI-powered tools (new category entirely)
The new site is positioned as the first AI-powered environmental association in BC, with
an AI member assistant, smart event recommendations, AI event-copy generation, and AI
newsletter drafting (powered by xAI Grok).

### Technical foundation & security
- Modern framework (Next.js 14, React 18) with server-side rendering and fast performance.
- Production Postgres database (Supabase) with Row-Level Security enabled on every table.
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy) and origin-scoped CORS.
- Rate limiting on public API endpoints.
- Secrets stored in Vercel environment variables, not in code.
- Continuous deployment: every push to the main branch auto-builds and deploys.

### Operations & documentation
Production Supabase project, Vercel hosting/CD, generated launch docs (FAQ, privacy
policy, terms of service, admin guide), and a draft site that's already live for review.

---

## Old vs. new at a glance

| Capability | Old site | New site |
|---|---|---|
| Platform | Static WordPress | Next.js + Supabase + Stripe |
| Visual design | Dated, generic | Modern environmental brand system |
| Mobile experience | Limited | Fully responsive, mobile menu |
| Membership signup | Manual / offline | Online, tiered, Stripe checkout |
| Event registration | None / external | Built-in, free & paid |
| Member portal | None | Profile, billing, team, PD credits |
| Admin tools | WordPress admin | Purpose-built dashboard |
| Email automation | None | Resend transactional + reminders |
| AI tools | None | Assistant, recommendations, copy, newsletter |
| Security | Basic | RLS, headers, CORS, rate limiting |
| Hosting/deploys | Traditional host | Vercel continuous deployment |

---

## Additional items to consider before going live

These are the gaps between the current draft and a production launch. Items are grouped
by priority.

### Critical (blockers for real users)
- **Custom domain.** emaofbc.com isn't owned yet; the site runs on emaofbc.vercel.app.
  Purchase/secure the domain, point DNS to Vercel, and confirm SSL.
- **Stripe live mode.** Complete Stripe identity/bank verification and replace the
  placeholder keys with live keys; configure the webhook endpoint and signing secret.
  Until then, payments cannot be processed.
- **Supabase service-role key.** Currently a placeholder in Vercel — server-side features
  (admin actions, some data writes) need the real key from the Supabase dashboard.
- **Email domain verification (Resend).** Add the SPF/DKIM/CNAME DNS records and verify
  the sending domain so member emails don't land in spam.
- **Re-enable strict build checks.** The draft build currently ignores TypeScript and
  ESLint errors so it could ship quickly; turn these back on and fix any surfaced issues
  before launch to avoid hidden runtime bugs.

### High
- **Real content.** Replace placeholder copy, stats ("20+", "100s"), and sample data with
  real events, board members, member organizations, and the actual logo.
- **End-to-end testing.** Test the full flows with real keys: signup → payment →
  confirmation email → portal access; free and paid event registration; admin event
  creation; all seven email templates.
- **Logo & imagery.** Swap the placeholder leaf mark for the official EMA logo and add
  real photography (events, BC environment) to heroes and cards.
- **Accessibility pass.** Verify color contrast, keyboard navigation, focus states, alt
  text, and screen-reader labels (WCAG AA).
- **AI cost & guardrails.** Set usage limits/budget alerts on the xAI key, and add prompt
  guardrails so the assistant stays on-topic and doesn't expose sensitive data.

### Medium
- **Monitoring & analytics.** Add error tracking (e.g., Sentry), uptime monitoring, and
  web analytics (e.g., Google Analytics or Plausible).
- **SEO.** Confirm metadata, Open Graph/Twitter cards, sitemap.xml, robots.txt, and
  structured data on key pages.
- **Performance check.** Run Lighthouse/PageSpeed; optimize images and any slow queries.
- **Legal review.** Have counsel review the privacy policy and terms (the current versions
  are solid templates with placeholders to fill).
- **Backups & recovery.** Confirm Supabase backup cadence and document a restore process.

### Nice to have
- **Content management** for non-technical staff to edit pages/news without code.
- **Calendar integration** ("add to calendar" / iCal feed) for events.
- **Payment receipts/invoices** with GST handling for Canadian members.
- **Renewal automation** UI and dunning for lapsed memberships.
- **Sponsor logos** showcased on the homepage and event pages.

---

## Current status

Live and working on the draft URL: production Supabase (migrations applied, RLS on),
Vercel continuous deployment, the new design system, redesigned homepage, all public
pages, and the Grok key configured. In progress: member portal and admin redesign, and
wiring the four AI tools to be fully functional.
