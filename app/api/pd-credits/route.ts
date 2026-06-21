import { NextRequest, NextResponse } from 'next/server';
import { getPDCreditsHistory, getUserPDCredits } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // In a real app, you'd get userId from Supabase auth session
    // For now, we'll require it as a query param
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const [creditsHistory, total] = await Promise.all([
      getPDCreditsHistory(userId),
      getUserPDCredits(userId),
    ]);

    return NextResponse.json({ credits: creditsHistory, total });
  } catch (error) {
    console.error('PD credits fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch PD credits' }, { status: 500 });
  }
}
