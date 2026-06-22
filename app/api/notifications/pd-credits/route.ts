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

    const { userId, eventId, creditsEarned } = await req.json();

    if (!userId || !eventId || creditsEarned === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, eventId, creditsEarned' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Fetch user
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch event
    const { data: event } = await supabase
      .from('events')
      .select('title')
      .eq('id', eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Send PD credits email
    const emailData: EmailData = {
      eventTitle: event.title,
      creditsEarned,
      dateEarned: new Date().toLocaleDateString('en-CA'),
      pdDashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/portal/pd-credits`,
    };

    const { subject, html } = getEmailTemplate('pd-credits-earned', emailData);
    await sendEmail(user.email, subject, html);

    logger.info('PD credits earned notification sent', {
      userId,
      eventId,
      creditsEarned,
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      message: `PD credits notification sent to ${user.email}`,
    });
  } catch (error) {
    logger.error('Failed to send PD credits notification', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
