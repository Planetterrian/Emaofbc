import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createApiHandler } from '@/lib/api-handler';
import { sendEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

async function handler(req: NextRequest) {
  const { org_name, contact_name, email, event_interest, tier, message } = await req.json();

  if (!org_name || !contact_name || !email) {
    return NextResponse.json({ error: 'Organization, contact name, and email are required' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('sponsorship_inquiries').insert({
    org_name,
    contact_name,
    email,
    event_interest,
    tier,
    message,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }

  try {
    await sendEmail(
      'sponsorship@emaofbc.com',
      `Sponsorship inquiry from ${org_name}`,
      `<p><strong>Organization:</strong> ${org_name}</p>
       <p><strong>Contact:</strong> ${contact_name} (${email})</p>
       <p><strong>Event:</strong> ${event_interest || 'Not specified'}</p>
       <p><strong>Tier:</strong> ${tier || 'Not specified'}</p>
       <p>${(message || '').replace(/\n/g, '<br>')}</p>`,
      { replyTo: email }
    );
  } catch {
    // Stored in DB
  }

  return NextResponse.json({ success: true });
}

export const POST = createApiHandler(handler, {
  method: 'POST',
  rateLimit: { limit: 10, window: 3600 },
});
