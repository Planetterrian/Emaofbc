export type EmailTemplate =
  | 'welcome'
  | 'membership-confirmation'
  | 'membership-renewal-reminder'
  | 'event-registration-confirmation'
  | 'event-reminder'
  | 'pd-credits-earned'
  | 'password-reset'
  | 'team-invite';

export interface EmailData {
  [key: string]: string | number | boolean | null;
}

export function getEmailTemplate(template: EmailTemplate, data: EmailData): { subject: string; html: string } {
  switch (template) {
    case 'welcome':
      return getWelcomeEmail(data);
    case 'membership-confirmation':
      return getMembershipConfirmationEmail(data);
    case 'membership-renewal-reminder':
      return getMembershipReminderEmail(data);
    case 'event-registration-confirmation':
      return getEventRegistrationEmail(data);
    case 'event-reminder':
      return getEventReminderEmail(data);
    case 'pd-credits-earned':
      return getPDCreditsEmail(data);
    case 'team-invite':
      return getTeamInviteEmail(data);
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}

function getWelcomeEmail(data: EmailData): { subject: string; html: string } {
  return {
    subject: 'Welcome to EMA of BC!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; }
          .content { padding: 20px; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
          a { color: #2d5f3f; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EMA of BC!</h1>
          </div>
          <div class="content">
            <p>Hello ${data.fullName},</p>
            <p>Thank you for creating your account with the Environmental Managers Association of BC. We're excited to have you as a member of our community!</p>
            <p>With your account, you can:</p>
            <ul>
              <li>Register for upcoming events and professional development sessions</li>
              <li>Track your professional development credits</li>
              <li>Browse our member directory to connect with peers</li>
              <li>Access member-only resources and benefits</li>
            </ul>
            <p><a href="${data.portalUrl}">Visit your member portal to get started →</a></p>
            <p>If you have any questions, don't hesitate to <a href="mailto:membership@emaofbc.com">contact us</a>.</p>
            <p>Best regards,<br>The EMA of BC Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Environmental Managers Association of BC</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

function getMembershipConfirmationEmail(data: EmailData): { subject: string; html: string } {
  return {
    subject: '✓ Membership Confirmed - EMA of BC',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; }
          .content { padding: 20px; }
          .highlight { background-color: #f0f4ff; padding: 15px; border-left: 4px solid #2d5f3f; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EMA of BC!</h1>
          </div>
          <div class="content">
            <p>Thank you for joining the Environmental Managers Association of BC!</p>
            <div class="highlight">
              <h3>Your Membership Details</h3>
              <p><strong>Organization:</strong> ${data.orgName}</p>
              <p><strong>Tier:</strong> ${data.tier}</p>
              <p><strong>Amount Paid:</strong> $${data.amount}</p>
              <p><strong>Valid Through:</strong> ${data.paidThrough}</p>
            </div>
            <p>Your organization members can now:</p>
            <ul>
              <li>Register for events at member pricing</li>
              <li>Earn professional development credits</li>
              <li>Submit award nominations</li>
              <li>Access the member directory</li>
            </ul>
            <p><a href="${data.portalUrl}">View your member portal →</a></p>
            <p>Questions? Contact <a href="mailto:membership@emaofbc.com">membership@emaofbc.com</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Environmental Managers Association of BC</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

function getMembershipReminderEmail(data: EmailData): { subject: string; html: string } {
  return {
    subject: 'Your EMA of BC membership is expiring soon',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; }
          .content { padding: 20px; }
          .cta { background-color: #2d5f3f; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
          .cta a { color: white; text-decoration: none; font-weight: bold; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Membership Renewal Reminder</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Your EMA of BC membership for <strong>${data.orgName}</strong> will expire on <strong>${data.expiresOn}</strong>.</p>
            <p>Renew your membership to ensure uninterrupted access to all benefits and member pricing on events.</p>
            <div class="cta">
              <a href="${data.renewalUrl}">Renew Your Membership Now</a>
            </div>
            <p><strong>Questions about renewal?</strong><br>
            Contact our membership team at <a href="mailto:membership@emaofbc.com">membership@emaofbc.com</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Environmental Managers Association of BC</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

function getEventRegistrationEmail(data: EmailData): { subject: string; html: string } {
  return {
    subject: `✓ Registered for ${data.eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; }
          .content { padding: 20px; }
          .event-box { background-color: #f0f4ff; padding: 15px; border-left: 4px solid #2d5f3f; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Confirmed</h1>
          </div>
          <div class="content">
            <p>Thank you for registering! You're all set for:</p>
            <div class="event-box">
              <h3>${data.eventTitle}</h3>
              <p><strong>Date:</strong> ${data.eventDate}</p>
              <p><strong>Time:</strong> ${data.eventTime}</p>
              <p><strong>Location:</strong> ${data.eventLocation}</p>
            </div>
            <p>We look forward to seeing you there!</p>
            <p><a href="${data.calendarDownloadUrl}">Download calendar file →</a></p>
            <p>Questions? Check the <a href="${data.eventUrl}">event details page</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Environmental Managers Association of BC</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

function getEventReminderEmail(data: EmailData): { subject: string; html: string } {
  return {
    subject: `Reminder: ${data.eventTitle} is happening ${data.daysUntilEvent} day(s) from now`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; }
          .content { padding: 20px; }
          .event-box { background-color: #f0f4ff; padding: 15px; border-left: 4px solid #2d5f3f; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${data.firstName},</p>
            <p>We hope you're looking forward to this upcoming event:</p>
            <div class="event-box">
              <h3>${data.eventTitle}</h3>
              <p><strong>Date:</strong> ${data.eventDate}</p>
              <p><strong>Time:</strong> ${data.eventTime}</p>
              <p><strong>Location:</strong> ${data.eventLocation}</p>
            </div>
            <p><a href="${data.eventUrl}">View full event details →</a></p>
            <p>See you there!</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Environmental Managers Association of BC</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

function getPDCreditsEmail(data: EmailData): { subject: string; html: string } {
  return {
    subject: 'Professional Development Credits Earned',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; }
          .content { padding: 20px; }
          .credit-box { background-color: #f0f4ff; padding: 15px; border-left: 4px solid #2d5f3f; text-align: center; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Credits Earned!</h1>
          </div>
          <div class="content">
            <p>Congratulations! You've earned professional development credits from attending <strong>${data.eventTitle}</strong>.</p>
            <div class="credit-box">
              <h3>${data.creditsEarned} Professional Development Credits</h3>
              <p>Added to your account on ${data.dateEarned}</p>
            </div>
            <p><a href="${data.pdDashboardUrl}">View your complete PD credit history →</a></p>
            <p>Keep up the great work on your professional development!</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Environmental Managers Association of BC</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

function getTeamInviteEmail(data: EmailData): { subject: string; html: string } {
  return {
    subject: `You've been invited to join ${data.orgName} on EMA of BC`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; }
          .content { padding: 20px; }
          .cta { background-color: #2d5f3f; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
          .cta a { color: white; text-decoration: none; font-weight: bold; }
          .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Invited!</h1>
          </div>
          <div class="content">
            <p>You've been invited by ${data.invitedBy} to join <strong>${data.orgName}</strong> on the EMA of BC member portal.</p>
            <p>Your role: <strong>${data.role === 'org_admin' ? 'Organization Administrator' : 'Team Member'}</strong></p>
            <div class="cta">
              <a href="${data.signupUrl}">Sign Up to Join Your Team</a>
            </div>
            <p>Questions? Contact your organization administrator or email <a href="mailto:support@emaofbc.com">support@emaofbc.com</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Environmental Managers Association of BC</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
