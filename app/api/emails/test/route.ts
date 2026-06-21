import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/mailer';
import { getEmailTemplate, EmailTemplate, EmailData } from '@/lib/email-templates';
import { logger } from '@/lib/logging';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify user is org admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userProfile?.role !== 'org_admin' && userProfile?.role !== 'ed_admin') {
      logger.info('Unauthorized test email attempt', { userId: user.id, role: userProfile?.role });
      return NextResponse.json({ error: 'Only admins can send test emails' }, { status: 403 });
    }

    const { template, data, recipientEmail } = await req.json();

    if (!template || !data || !recipientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: template, data, recipientEmail' },
        { status: 400 }
      );
    }

    // Validate template type
    const validTemplates: EmailTemplate[] = [
      'welcome',
      'membership-confirmation',
      'membership-renewal-reminder',
      'event-registration-confirmation',
      'event-reminder',
      'pd-credits-earned',
      'team-invite',
      'password-reset',
    ];

    if (!validTemplates.includes(template as EmailTemplate)) {
      return NextResponse.json(
        { error: `Invalid template. Must be one of: ${validTemplates.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate email
    const { subject, html } = getEmailTemplate(template as EmailTemplate, data as EmailData);

    // Send test email
    await sendEmail(recipientEmail, `[TEST] ${subject}`, html);

    logger.info('Test email sent successfully', {
      template,
      recipientEmail,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${recipientEmail}`,
      preview: {
        subject: `[TEST] ${subject}`,
        template,
      },
    });
  } catch (error) {
    logger.error('Test email send failed', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test email' },
      { status: 500 }
    );
  }
}

// GET endpoint to list available templates
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        description: 'Sent when users create their account',
        requiredFields: ['fullName', 'portalUrl'],
      },
      {
        id: 'membership-confirmation',
        name: 'Membership Confirmation',
        description: 'Sent when organization membership is confirmed',
        requiredFields: ['orgName', 'tier', 'amount', 'paidThrough', 'portalUrl'],
      },
      {
        id: 'membership-renewal-reminder',
        name: 'Membership Renewal Reminder',
        description: 'Sent before membership expires',
        requiredFields: ['orgName', 'expiresOn', 'renewalUrl'],
      },
      {
        id: 'event-registration-confirmation',
        name: 'Event Registration Confirmation',
        description: 'Sent when user registers for an event',
        requiredFields: ['eventTitle', 'eventDate', 'eventTime', 'eventLocation', 'eventUrl', 'calendarDownloadUrl'],
      },
      {
        id: 'event-reminder',
        name: 'Event Reminder',
        description: 'Sent a few days before an event',
        requiredFields: ['firstName', 'eventTitle', 'eventDate', 'eventTime', 'eventLocation', 'eventUrl', 'daysUntilEvent'],
      },
      {
        id: 'pd-credits-earned',
        name: 'PD Credits Earned',
        description: 'Sent when user earns professional development credits',
        requiredFields: ['eventTitle', 'creditsEarned', 'dateEarned', 'pdDashboardUrl'],
      },
      {
        id: 'team-invite',
        name: 'Team Invitation',
        description: 'Sent when user is invited to join a team',
        requiredFields: ['invitedBy', 'orgName', 'role', 'signupUrl'],
      },
    ];

    return NextResponse.json({
      templates,
      count: templates.length,
    });
  } catch (error) {
    logger.error('Failed to list templates', error);
    return NextResponse.json(
      { error: 'Failed to list templates' },
      { status: 500 }
    );
  }
}
