import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getActiveMembership } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Find user by email
    const user = await getUserByEmail(email);

    if (!user || !user.org_id) {
      return NextResponse.json({ isMember: false });
    }

    // Check if org has active membership
    const membership = await getActiveMembership(user.org_id);

    return NextResponse.json({ isMember: !!membership });
  } catch (error) {
    console.error('Membership check failed:', error);
    return NextResponse.json({ isMember: false });
  }
}
