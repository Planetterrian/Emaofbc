# EMA of BC Platform - Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment (1-2 weeks before launch)

### Code Readiness
- [x] All 5 phases implemented and tested
- [x] TypeScript strict mode compiling clean
- [x] No console errors or warnings
- [x] Error handling for all API calls
- [x] Graceful fallbacks when services unavailable

### Database Setup
- [ ] Supabase project created and configured
- [ ] pgvector extension enabled
- [ ] Migrations applied successfully
- [ ] Seed data loaded
- [ ] Row-Level Security policies verified
- [ ] Backups configured

### Third-Party Services
- [ ] Stripe account created (test mode initially)
- [ ] Stripe keys saved to `.env.local`
- [ ] Test Stripe payment flow works
- [ ] xAI API key obtained and tested
- [ ] Resend account created and configured
- [ ] Test email sending works
- [ ] All API keys stored securely (not in git)

### Infrastructure
- [ ] Vercel account created (or equivalent hosting)
- [ ] Domain name registered and configured
- [ ] SSL certificate ready
- [ ] CDN/edge caching configured
- [ ] Database backups tested

## Deployment Day

### 1. Final Code Review (Morning)
- [ ] Review git log since last deployment
- [ ] Verify all commits are intentional
- [ ] Check for any debug code or console.log statements
- [ ] Run full test suite locally
- [ ] Build production bundle locally
- [ ] Run security checks

```bash
npm run build
npm run lint
```

### 2. Environment Setup (Mid-morning)
- [ ] Create production `.env.local` (never commit)
- [ ] Verify all required variables present
- [ ] Test database connection
- [ ] Test Stripe connection
- [ ] Test xAI API connection
- [ ] Test email service connection

```bash
./scripts/setup-env.sh
npm run verify:env  # if exists
```

### 3. Database Migration (Midday)
- [ ] Backup current database (if upgrading)
- [ ] Run migrations on production database
- [ ] Verify all tables created
- [ ] Verify RLS policies enabled
- [ ] Run seed script for initial data
- [ ] Spot-check data integrity

```bash
supabase db push --project-ref [prod-ref]
npm run seed  # with PRODUCTION env vars
```

### 4. Pre-Launch Testing (Afternoon)
- [ ] Test home page on staging/production
- [ ] Test event listing and detail pages
- [ ] Test member directory
- [ ] Test join flow with Stripe test card
- [ ] Test event registration
- [ ] Test admin console access
- [ ] Test member assistant chatbot
- [ ] Test admin features:
  - [ ] Newsletter generation
  - [ ] Event copy generation
  - [ ] Dashboard metrics
- [ ] Verify all email flows work (test email)
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit

### 5. Deploy to Production (Late afternoon)
- [ ] Create release branch from main
- [ ] Tag version (e.g., v1.0.0)
- [ ] Push to production deployment platform
- [ ] Verify build completes successfully
- [ ] Verify all CI checks pass
- [ ] Deploy to production

```bash
git tag -a v1.0.0 -m "EMA of BC Platform v1.0.0"
git push origin v1.0.0
vercel deploy --prod  # or equivalent
```

### 6. Post-Deployment Verification (Evening)
- [ ] Access production URL
- [ ] Verify no errors in console
- [ ] Test homepage loads in <2s
- [ ] Test API endpoints respond
- [ ] Verify database connection working
- [ ] Check monitoring dashboard
- [ ] Monitor error logs for anomalies
- [ ] Test critical user journeys:
  - [ ] New member signup with payment
  - [ ] Event registration
  - [ ] PD credit tracking
  - [ ] Admin dashboard access
  - [ ] Member assistant chatbot

### 7. Communication (After verification)
- [ ] Notify users of launch
- [ ] Update status page
- [ ] Post announcements on social media
- [ ] Send launch email to stakeholders
- [ ] Update website copy (if applicable)

## Post-Deployment (First Week)

### Monitoring
- [ ] Check error tracking (Sentry, etc.)
- [ ] Monitor database performance
- [ ] Monitor API response times
- [ ] Check Stripe webhook deliveries
- [ ] Review email delivery stats
- [ ] Monitor xAI API usage
- [ ] Track user sign-ups and activity

### Issue Response
- [ ] Document any issues that arise
- [ ] Create hotfix branch if needed
- [ ] Deploy hotfixes immediately
- [ ] Test thoroughly before production deployment
- [ ] Keep stakeholders informed

### User Feedback
- [ ] Gather feedback from early users
- [ ] Monitor support tickets
- [ ] Address critical bugs immediately
- [ ] Plan improvements based on feedback

## Rollback Procedure (If Critical Issue)

### Immediate Action (Within 1 hour)
1. Identify the issue
2. Assess severity (critical/high/medium/low)
3. If critical:
   - Revert to previous deployment in Vercel
   - Notify users
   - Begin investigation in staging

### Investigation (Parallel with rollback)
1. Check application logs
2. Check database logs
3. Check payment system logs
4. Check email delivery
5. Check AI API usage

### Resolution
1. Fix issue in development
2. Test thoroughly in staging
3. Deploy to production once verified
4. Communicate resolution to users

### Post-Incident
1. Root cause analysis
2. Document lessons learned
3. Update monitoring/alerting
4. Implement preventative measures

## Deployment Success Criteria

✅ **Deployment is successful when:**
- Application loads without errors
- All pages respond in <2 seconds
- Database queries perform normally
- Stripe payments process correctly
- Emails send successfully
- Admin features accessible
- No critical errors in logs
- Monitoring shows healthy metrics
- Users can complete key journeys

❌ **Rollback if:**
- Error rate >1% of requests
- Payment processing failing
- Database performance degraded >50%
- Critical security issue discovered
- Core business logic broken
- Unable to restore service within 1 hour

## Maintenance Schedule

### Daily (Automated)
- Database backups
- Log rotation
- Performance monitoring

### Weekly
- Review error logs
- Check database performance
- Verify backups working
- Monitor API quota usage

### Monthly
- Security updates
- Dependency updates (tested)
- Performance optimization review
- Cost analysis

### Quarterly
- Major version updates
- Security audit
- Performance testing
- Capacity planning

## Emergency Contacts

- **Database:** Supabase support
- **Payments:** Stripe support
- **Email:** Resend support
- **AI API:** xAI support
- **Hosting:** Vercel support
- **Domain/DNS:** Domain registrar

## Version Control

- **Main branch:** Production-ready code
- **Staging branch:** Pre-production testing
- **Feature branches:** Development features
- **Hotfix branches:** Critical production fixes

Tag production releases:
```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## Documentation

- Update CHANGELOG.md after each deployment
- Document any manual steps taken
- Update API documentation if changed
- Document new environment variables
- Update architecture diagrams if applicable

---

**Last Updated:** 2026-06-21  
**Status:** Ready for Phase 0.1 Production Setup
