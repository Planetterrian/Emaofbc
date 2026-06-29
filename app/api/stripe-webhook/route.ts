import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/app/actions';
import { sendEmail } from '@/lib/mailer';
import { getEmailTemplate, EmailData } from '@/lib/email-templates';
import { getMembershipExpiry, MembershipTier } from '@/lib/membership';
import { createServiceRoleClient } from '@/lib/supabase';
import { inviteOrgAdmin } from '@/app/actions';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

type Metadata = Record<string, string>;

async function handleEventRegistration(
  supabase: ReturnType<typeof createServiceRoleClient>,
  metadata: Metadata,
  amountCents: number,
  stripeRef: string
): Promise<void> {
  const eventId = metadata.eventId;
  const userEmail = metadata.userEmail;
  const userName = metadata.userName;

  if (!eventId || !userEmail || !userName) {
    throw new Error('Missing required event metadata');
  }

  let { data: user } = await supabase.from('users').select('*').eq('email', userEmail).single();
  let userId = user?.id;

  if (!user) {
    const emailDomain = userEmail.split('@')[1];
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('email_domain', emailDomain)
      .single();

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email: userEmail,
        full_name: userName,
        org_id: org?.id || null,
        role: 'employee',
      })
      .select()
      .single();

    if (userError) throw userError;
    userId = newUser.id;
    user = newUser;
  }

  const { data: existingReg } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();

  if (existingReg) return;

  const { error: regError } = await supabase.from('registrations').insert({
    event_id: eventId,
    user_id: userId,
    org_id: user?.org_id || null,
    payment_status: 'paid',
    price_paid_cents: amountCents,
    attended: false,
    pd_credit_recorded: false,
  });

  if (regError) throw regError;

  const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single();

  if (event) {
    try {
      const eventDate = new Date(event.starts_at).toLocaleDateString('en-CA', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const eventTime = new Date(event.starts_at).toLocaleTimeString('en-CA', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const emailData: EmailData = {
        eventTitle: event.title,
        eventDate,
        eventTime,
        eventLocation: event.venue || 'TBD',
        calendarDownloadUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/events/${eventId}/calendar.ics`,
        eventUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/events/${eventId}`,
      };

      const { subject, html } = getEmailTemplate('event-registration-confirmation', emailData);
      await sendEmail(userEmail, subject, html);
    } catch (emailError) {
      console.error('Failed to send event registration email:', emailError);
    }
  }

  console.log(`Event registration processed: ${userId} -> ${eventId} (${stripeRef})`);
}

async function handleMembershipPayment(
  supabase: ReturnType<typeof createServiceRoleClient>,
  metadata: Metadata,
  amountCents: number,
  stripeRef: string
): Promise<void> {
  const orgName = metadata.orgName;
  const orgType = metadata.orgType as MembershipTier;
  const orgEmail = metadata.orgEmail;

  if (!orgName || !orgType || !orgEmail) {
    throw new Error('Missing required membership metadata');
  }

  const emailDomain = orgEmail.split('@')[1];

  let organization = null;
  const { data: existingOrgs } = await supabase
    .from('organizations')
    .select('*')
    .eq('email_domain', emailDomain)
    .limit(1);

  if (existingOrgs && existingOrgs.length > 0) {
    organization = existingOrgs[0];
  } else {
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName,
        type: orgType,
        email_domain: emailDomain,
        status: 'active',
        directory_opt_in: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orgError) throw orgError;
    organization = newOrg;
  }

  const membershipStart = new Date();
  const membershipEnd = getMembershipExpiry(orgType, membershipStart);

  const { error: membershipError } = await supabase.from('memberships').insert({
    org_id: organization.id,
    period_start: membershipStart.toISOString().split('T')[0],
    period_end: membershipEnd.toISOString().split('T')[0],
    tier: orgType,
    amount_cents: amountCents,
    status: 'paid',
    stripe_ref: stripeRef,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (membershipError) throw membershipError;

  await supabase
    .from('organizations')
    .update({
      status: 'active',
      paid_through: membershipEnd.toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    })
    .eq('id', organization.id);

  try {
    await inviteOrgAdmin(orgEmail, orgName, organization.id);
  } catch (inviteError) {
    console.error('Failed to invite org admin:', inviteError);
  }

  try {
    const data: EmailData = {
      orgName,
      tier: orgType,
      amount: amountCents / 100,
      paidThrough: membershipEnd.toLocaleDateString(),
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/portal`,
    };
    const { subject, html } = getEmailTemplate('membership-confirmation', data);
    await sendEmail(orgEmail, subject, html, { replyTo: 'membership@emaofbc.com' });
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }

  console.log(`Membership processed: ${orgName} (${organization.id})`);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const supabase = createServiceRoleClient();
  const metadata = (session.metadata || {}) as Metadata;
  const amountCents = session.amount_total || 0;
  const stripeRef = (session.payment_intent as string) || session.id;

  if (metadata.flow === 'event_registration' || metadata.eventId) {
    await handleEventRegistration(supabase, metadata, amountCents, stripeRef);
  } else {
    await handleMembershipPayment(supabase, metadata, amountCents, stripeRef);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const supabase = createServiceRoleClient();
  if (!charge.id) throw new Error('Missing charge ID');

  const { data: memberships } = await supabase
    .from('memberships')
    .select('*')
    .eq('stripe_ref', charge.id)
    .limit(1);

  if (!memberships || memberships.length === 0) return;

  const membership = memberships[0];
  await supabase
    .from('memberships')
    .update({ status: 'unpaid', updated_at: new Date().toISOString() })
    .eq('id', membership.id);
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await verifyWebhookSignature(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          await handleCheckoutCompleted(session);
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
