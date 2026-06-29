import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createApiHandler } from '@/lib/api-handler';
import { sendEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

async function handler(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from('newsletter_subscribers').upsert(
    { email: normalized, subscribed_at: new Date().toISOString(), unsubscribed_at: null },
    { onConflict: 'email' }
  );

  if (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }

  try {
    await sendEmail(
      normalized,
      'Welcome to EMA of BC updates',
      `<p>Thanks for subscribing to EMA of BC event and news updates.</p>
       <p>You'll hear about upcoming workshops, sessions, and member news.</p>
       <p>— EMA of BC</p>`
    );
  } catch {
    // Non-blocking welcome email
  }

  return NextResponse.json({ success: true });
}

export const POST = createApiHandler(handler, {
  method: 'POST',
  rateLimit: { limit: 5, window: 3600 },
});
