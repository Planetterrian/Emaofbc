import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createApiHandler } from '@/lib/api-handler';
import { getUserByEmail, getActiveMembership } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function handler(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (!emailDomain) {
    return NextResponse.json({ isMember: false });
  }

  // Check if user exists with active org membership
  const user = await getUserByEmail(email);
  if (user?.org_id) {
    const membership = await getActiveMembership(user.org_id);
    if (membership) {
      return NextResponse.json({ isMember: true });
    }
  }

  // Fall back to org-level membership by email domain
  try {
    const supabase = createServiceRoleClient();
    const { data: org } = await supabase
      .from('organizations')
      .select('id, status, paid_through')
      .eq('email_domain', emailDomain)
      .eq('status', 'active')
      .single();

    if (org) {
      const membership = await getActiveMembership(org.id);
      return NextResponse.json({ isMember: !!membership });
    }
  } catch {
    // Service role may not be configured in dev
  }

  return NextResponse.json({ isMember: false });
}

export const GET = createApiHandler(handler, {
  method: 'GET',
  rateLimit: { limit: 60, window: 60 },
});
