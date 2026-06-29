import { NextResponse } from 'next/server';
import { getPDCreditsHistory, getUserPDCredits } from '@/lib/db';
import { createServerSupabaseClient } from '@/lib/auth';
import { createApiHandler } from '@/lib/api-handler';

export const dynamic = 'force-dynamic';

async function handler() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [creditsHistory, total] = await Promise.all([
    getPDCreditsHistory(user.id),
    getUserPDCredits(user.id),
  ]);

  return NextResponse.json({ credits: creditsHistory, total });
}

export const GET = createApiHandler(async () => handler(), {
  method: 'GET',
  rateLimit: { limit: 30, window: 60 },
});
