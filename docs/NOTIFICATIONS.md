# Email Notification System

EMA of BC uses a comprehensive email notification system built on Resend for email delivery. This system automatically sends professional HTML emails to users and organizations at key moments in their journey.

## Architecture

### Email Templates
All email templates are centralized in `lib/email-templates.ts` and follow a consistent design pattern:
- Navy header with EMA of BC branding
- Professional content section with key information
- Clear call-to-action buttons
- Footer with copyright information
- Consistent styling using EMA of BC color palette

### User Preferences
Users can control which emails they receive via their notification preferences at `/portal/notifications`. Each email type can be individually toggled on or off.

### Notification Preferences Table
```sql
notification_preferences {
  id: UUID
  user_id: UUID (foreign key to users)
  email_welcome: BOOLEAN
  email_membership_confirmation: BOOLEAN
  email_membership_renewal_reminder: BOOLEAN
  email_event_registration_confirmation: BOOLEAN
  email_event_reminder: BOOLEAN
  email_pd_credits_earned: BOOLEAN
  email_team_invite: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

## Email Types

### 1. Welcome Email (`welcome`)
**Sent when:** User creates their account
**Template fields:** `fullName`, `portalUrl`
**Description:** Introduces the platform and available member features

### 2. Membership Confirmation (`membership-confirmation`)
**Sent when:** Organization membership payment succeeds via Stripe
**Template fields:** `orgName`, `tier`, `amount`, `paidThrough`, `portalUrl`
**Trigger:** Stripe webhook `charge.succeeded` with membership metadata
**Description:** Confirms membership purchase and outlines member benefits

### 3. Membership Renewal Reminder (`membership-renewal-reminder`)
**Sent when:** Background job runs for orgs with memberships expiring in 30 days
**Template fields:** `orgName`, `expiresOn`, `renewalUrl`
**Trigger:** `/api/notifications/membership-renewals` endpoint
**Description:** Reminds org admins to renew before expiration

### 4. Event Registration Confirmation (`event-registration-confirmation`)
**Sent when:** User completes event registration (paid or free)
**Template fields:** `eventTitle`, `eventDate`, `eventTime`, `eventLocation`, `eventUrl`, `calendarDownloadUrl`
**Trigger:** 
  - Free events: `/api/registrations/create` endpoint
  - Paid events: Stripe webhook `charge.succeeded` with event metadata
**Description:** Confirms registration and provides event details

### 5. Event Reminder (`event-reminder`)
**Sent when:** Background job runs for events happening in 3-7 days
**Template fields:** `firstName`, `eventTitle`, `eventDate`, `eventTime`, `eventLocation`, `eventUrl`, `daysUntilEvent`
**Trigger:** `/api/notifications/event-reminders` endpoint
**Description:** Reminds attendees about upcoming event

### 6. PD Credits Earned (`pd-credits-earned`)
**Sent when:** Admin awards PD credits to a user
**Template fields:** `eventTitle`, `creditsEarned`, `dateEarned`, `pdDashboardUrl`
**Trigger:** `/api/notifications/pd-credits` endpoint
**Description:** Notifies users of professional development credits earned

### 7. Team Invite (`team-invite`)
**Sent when:** Org admin invites new team member
**Template fields:** `invitedBy`, `orgName`, `role`, `signupUrl`
**Trigger:** Team invitation workflow
**Description:** Invites user to join organization team

## Integration Points

### Stripe Webhook (`/api/stripe-webhook`)
Automatically sends confirmation emails when Stripe payments succeed:
- **Membership payments:** Sends `membership-confirmation` email
- **Event registrations:** Sends `event-registration-confirmation` email

The webhook checks charge metadata to determine email type:
```javascript
if (metadata.eventId) {
  // Event registration - use event-registration-confirmation
} else {
  // Membership - use membership-confirmation
}
```

### Event Registration API (`/api/registrations/create`)
When a user registers for a free event, automatically sends `event-registration-confirmation` email with event details.

### Background Job Endpoints
These endpoints are designed to be called by a scheduler (e.g., GitHub Actions, Vercel Cron, etc.):

#### Membership Renewal Reminders
```bash
POST /api/notifications/membership-renewals
Headers: x-api-key: <NOTIFICATION_API_KEY>
```

Finds organizations with active memberships expiring within 30 days and sends reminders to all org admins.

**GET endpoint** to check status:
```bash
GET /api/notifications/membership-renewals
Headers: x-api-key: <NOTIFICATION_API_KEY>
```

#### Event Reminders
```bash
POST /api/notifications/event-reminders
Headers: x-api-key: <NOTIFICATION_API_KEY>
```

Finds events happening in 3-7 days and sends reminders to all registered attendees. Marks events as `reminder_sent = true`.

**GET endpoint** to check status:
```bash
GET /api/notifications/event-reminders
Headers: x-api-key: <NOTIFICATION_API_KEY>
```

#### PD Credits Notification
```bash
POST /api/notifications/pd-credits
Headers: x-api-key: <NOTIFICATION_API_KEY>
Body: {
  "userId": "uuid",
  "eventId": "uuid", 
  "creditsEarned": 2.5
}
```

Sends PD credits earned notification to specific user.

## Admin Features

### Email Template Testing
Admins can test and preview email templates at `/admin/email-templates`:

1. Select a template from the list
2. Fill in required data fields with sample values
3. Enter recipient email address
4. Click "Send Test Email"
5. Email is sent with [TEST] prefix in subject line

### Available Test Templates
- Welcome Email
- Membership Confirmation
- Membership Renewal Reminder
- Event Registration Confirmation
- Event Reminder
- PD Credits Earned
- Team Invitation

Each template includes helpful descriptions and pre-filled sample values.

## Environment Variables

Required for email functionality:
```env
# Email Service
RESEND_API_KEY=<resend-api-key>

# Notification API Security
NOTIFICATION_API_KEY=<random-secure-key>

# App URLs
NEXT_PUBLIC_APP_URL=https://emaofbc.com
```

## User Opt-Out Behavior

When a user opts out of an email type via notification preferences:
1. The email type toggle is set to `false` in their notification_preferences
2. When `sendEmail()` is called with their user ID, it checks their preferences
3. If opted out, email is skipped (logged as info level)
4. User still receives critical transactional emails (payment confirmations, etc.)

### Preference Override (Planned)
Critical emails (password reset, billing alerts) should bypass user preferences.

## Best Practices

### For Email Content
- Keep subject lines under 50 characters for mobile
- Use consistent navy (#1e3a5f) and forest (#2d5f3f) colors
- Always include a clear call-to-action button
- Provide alternative text links in addition to buttons
- Test emails before sending in production

### For Scheduling
- Run membership renewal reminders daily or weekly
- Run event reminders 3-7 days before events
- Check event reminder status before sending to avoid duplicates
- Log all notification attempts for debugging

### For Error Handling
- Email failures should not block main operations
- Use try-catch blocks around email sends
- Log all email errors with user/event context
- Consider retry logic for transient failures

## Sending Emails Programmatically

### Using Server Actions
```typescript
import { sendEmail } from '@/lib/mailer';
import { getEmailTemplate } from '@/lib/email-templates';

const { subject, html } = getEmailTemplate('welcome', {
  fullName: 'John Doe',
  portalUrl: 'https://emaofbc.com/portal'
});

await sendEmail('user@example.com', subject, html);
```

### Using Notification Preferences
```typescript
import { sendEmail } from '@/lib/send-email';

// This respects user opt-outs
const result = await sendEmail(
  'user@example.com',
  'welcome',
  { fullName: 'John Doe', portalUrl: '...' },
  userId // Optional: checks user preferences
);
```

## Testing

### Test Email Endpoint
Use the admin email template tester at `/admin/email-templates` for manual testing.

### API Testing
```bash
# Test membership renewal reminders
curl -X POST http://localhost:3000/api/notifications/membership-renewals \
  -H "x-api-key: your-notification-api-key"

# Test event reminders
curl -X GET http://localhost:3000/api/notifications/event-reminders \
  -H "x-api-key: your-notification-api-key"

# Test PD credits notification
curl -X POST http://localhost:3000/api/notifications/pd-credits \
  -H "x-api-key: your-notification-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "eventId": "event-uuid",
    "creditsEarned": 2.5
  }'
```

## Monitoring

All email sends are logged with:
- Email type
- Recipient email
- User/org context
- Timestamp
- Success/failure status
- Error details (if failed)

Logs are viewable in Supabase logs or application logging system.

## Future Enhancements

- [ ] Email digest/batching for multiple notifications
- [ ] SMS notifications for critical alerts
- [ ] Custom email templates per organization
- [ ] Email preview in UI before sending
- [ ] Delivery tracking and bounce handling
- [ ] A/B testing for email content
- [ ] Scheduling emails for optimal send times
