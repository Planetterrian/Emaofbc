import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createApiHandler } from '@/lib/api-handler';
import { sendEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

async function handler(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('contact_inquiries').insert({
    name,
    email,
    subject: subject || 'General inquiry',
    message,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }

  try {
    await sendEmail(
      'info@emaofbc.com',
      `Contact form: ${subject || 'General inquiry'}`,
      `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, '<br>')}</p>`,
      { replyTo: email }
    );
  } catch {
    // Stored in DB even if notification email fails
  }

  return NextResponse.json({ success: true });
}

export const POST = createApiHandler(handler, {
  method: 'POST',
  rateLimit: { limit: 10, window: 3600 },
});
