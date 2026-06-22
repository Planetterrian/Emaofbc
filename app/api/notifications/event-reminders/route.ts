import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/mailer';
import { getEmailTemplate, EmailData } from '@/lib/email-templates';
import { logger } from '@/lib/logging';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.NOTIFICATION_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Find events happening in the next 3-7 days that haven't had reminders sent
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: events, error: eventError } = await supabase
      .from('events')
      .select('*')
      .gte('starts_at', threeDaysFromNow.toISOString())
      .lte('starts_at', sevenDaysFromNow.toISOString())
      .eq('status', 'published')
      .is('reminder_sent', false);

    if (eventError) {
      logger.error('Failed to query events for reminders', eventError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    let reminderCount = 0;
    let failedCount = 0;

    for (const event of events || []) {
      try {
        // Get all registrations for this event
        const { data: registrations } = await supabase
          .from('registrations')
          .select('user_id')
          .eq('event_id', event.id)
          .eq('payment_status', 'paid');

        if (!registrations || registrations.length === 0) {
          continue;
        }

        // Get user emails
        const userIds = registrations.map((r) => r.user_id);
        const { data: users } = await supabase
          .from('users')
          .select('id, email, full_name')
          .in('id', userIds);

        if (!users) {
          continue;
        }

        const eventDate = new Date(event.starts_at);
        const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Send reminder to each registered user
        for (const user of users) {
          try {
            const emailData: EmailData = {
              firstName: user.full_name?.split(' ')[0] || 'there',
              eventTitle: event.title,
              eventDate: eventDate.toLocaleDateString('en-CA', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              eventTime: eventDate.toLocaleTimeString('en-CA', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              eventLocation: event.venue || 'TBD',
              eventUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/events/${event.id}`,
              daysUntilEvent,
            };

            const { subject, html } = getEmailTemplate('event-reminder', emailData);
            await sendEmail(user.email, subject, html);
            reminderCount++;

            logger.info('Event reminder sent', {
              eventId: event.id,
              userId: user.id,
              email: user.email,
            });
          } catch (emailError) {
            failedCount++;
            logger.error('Failed to send event reminder', emailError, {
              eventId: event.id,
              userId: user.id,
            });
          }
        }

        // Mark event as reminder sent
        await supabase
          .from('events')
          .update({ reminder_sent: true })
          .eq('id', event.id);
      } catch (error) {
        failedCount++;
        logger.error('Error processing event for reminders', error, {
          eventId: event.id,
        });
      }
    }

    logger.info('Event reminder batch completed', {
      eventsFound: events?.length || 0,
      remindersSent: reminderCount,
      remindersFailed: failedCount,
    });

    return NextResponse.json({
      success: true,
      message: 'Event reminders processed',
      stats: {
        eventsFound: events?.length || 0,
        remindersSent: reminderCount,
        remindersFailed: failedCount,
      },
    });
  } catch (error) {
    logger.error('Event reminder notification failed', error);
    return NextResponse.json(
      { error: 'Failed to process event reminders' },
      { status: 500 }
    );
  }
}

// GET endpoint to get status of events needing reminders
export async function GET(req: NextRequest) {
  try {
    // Verify authorization
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.NOTIFICATION_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: events } = await supabase
      .from('events')
      .select('id, title, starts_at, reminder_sent')
      .gte('starts_at', threeDaysFromNow.toISOString())
      .lte('starts_at', sevenDaysFromNow.toISOString())
      .eq('status', 'published');

    return NextResponse.json({
      success: true,
      eventsNeedingReminders: events?.filter((e) => !e.reminder_sent).length || 0,
      totalEventsInWindow: events?.length || 0,
      events: events || [],
    });
  } catch (error) {
    logger.error('Failed to get event reminder status', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}
