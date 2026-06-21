import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { eventId, fullName, email } = await req.json();

    if (!eventId || !fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Find or create user
    let user = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    let userId = user.data?.id;

    if (!user.data) {
      // Extract domain from email for org lookup
      const emailDomain = email.split('@')[1];

      // Try to find org by email domain
      let orgId = null;
      const orgResult = await supabase
        .from('organizations')
        .select('id')
        .eq('email_domain', emailDomain)
        .single();

      if (orgResult.data) {
        orgId = orgResult.data.id;
      }

      // Create new user
      const createUserResult = await supabase
        .from('users')
        .insert({
          email,
          full_name: fullName,
          org_id: orgId,
          role: 'employee',
        })
        .select()
        .single();

      if (createUserResult.error) {
        console.error('Failed to create user:', createUserResult.error);
        return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
      }

      userId = createUserResult.data.id;
    }

    // Check if registration already exists
    const existingReg = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (existingReg.data) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      );
    }

    // Create registration (for free events)
    const regResult = await supabase
      .from('registrations')
      .insert({
        event_id: eventId,
        user_id: userId,
        org_id: user.data?.org_id,
        payment_status: 'paid',
        price_paid_cents: 0,
        attended: false,
        pd_credit_recorded: false,
      })
      .select()
      .single();

    if (regResult.error) {
      console.error('Failed to create registration:', regResult.error);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, registration: regResult.data });
  } catch (error) {
    console.error('Registration creation failed:', error);
    return NextResponse.json({ error: 'Failed to process registration' }, { status: 500 });
  }
}
