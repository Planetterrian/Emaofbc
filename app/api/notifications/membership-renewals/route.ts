import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/mailer';
import { getEmailTemplate, EmailData } from '@/lib/email-templates';
import { logger } from '@/lib/logging';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Verify authorization - expect an API key in header
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.NOTIFICATION_API_KEY) {
      logger.warn('Unauthorized membership renewal notification request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Find organizations with memberships expiring in the next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: orgs, error: queryError } = await supabase
      .from('organizations')
      .select('*')
      .eq('status', 'active')
      .lte('paid_through', thirtyDaysFromNow.toISOString().split('T')[0])
      .gt('paid_through', new Date().toISOString().split('T')[0]);

    if (queryError) {
      logger.error('Failed to query organizations', queryError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const org of orgs || []) {
      try {
        // Find admin contacts for the organization
        const { data: admins } = await supabase
          .from('users')
          .select('email')
          .eq('org_id', org.id)
          .eq('role', 'org_admin');

        if (!admins || admins.length === 0) {
          logger.warn(`No org admins found for organization ${org.id}`, { orgName: org.name });
          continue;
        }

        const emailData: EmailData = {
          orgName: org.name,
          expiresOn: new Date(org.paid_through).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          renewalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/join`,
        };

        const { subject, html } = getEmailTemplate('membership-renewal-reminder', emailData);

        // Send to all org admins
        for (const admin of admins) {
          try {
            await sendEmail(admin.email, subject, html);
            sentCount++;
            logger.info('Membership renewal reminder sent', {
              orgId: org.id,
              orgName: org.name,
              email: admin.email,
            });
          } catch (emailError) {
            failedCount++;
            logger.error('Failed to send membership renewal reminder', emailError, {
              orgId: org.id,
              email: admin.email,
            });
          }
        }
      } catch (error) {
        failedCount++;
        logger.error('Error processing organization for renewal reminder', error, {
          orgId: org.id,
        });
      }
    }

    logger.info('Membership renewal notification batch completed', {
      totalOrgs: orgs?.length || 0,
      sentCount,
      failedCount,
    });

    return NextResponse.json({
      success: true,
      message: 'Membership renewal reminders processed',
      stats: {
        organizationsFound: orgs?.length || 0,
        emailsSent: sentCount,
        emailsFailed: failedCount,
      },
    });
  } catch (error) {
    logger.error('Membership renewal notification failed', error);
    return NextResponse.json(
      { error: 'Failed to process membership renewal notifications' },
      { status: 500 }
    );
  }
}

// GET endpoint to get status/count of organizations needing renewal reminders
export async function GET(req: NextRequest) {
  try {
    // Verify authorization
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.NOTIFICATION_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Count organizations needing renewal reminders
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: orgs, error: queryError } = await supabase
      .from('organizations')
      .select('id, name, paid_through, status')
      .eq('status', 'active')
      .lte('paid_through', thirtyDaysFromNow.toISOString().split('T')[0])
      .gt('paid_through', new Date().toISOString().split('T')[0]);

    if (queryError) {
      logger.error('Failed to query organizations for renewal reminder count', queryError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      organizationsNeedingReminder: orgs?.length || 0,
      organizations: orgs || [],
    });
  } catch (error) {
    logger.error('Failed to get renewal reminder status', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}
