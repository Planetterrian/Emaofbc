import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/app/actions';
import { sendEmail } from '@/lib/mailer';
import { getEmailTemplate, EmailData } from '@/lib/email-templates';
import { getMembershipExpiry, MembershipTier } from '@/lib/membership';
import { createServiceRoleClient } from '@/lib/supabase';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  const supabase = createServiceRoleClient();

  const metadata = charge.metadata || {};
  const orgName = metadata.orgName as string;
  const orgType = metadata.orgType as MembershipTier;
  const orgEmail = metadata.orgEmail as string;

  if (!orgName || !orgType || !orgEmail) {
    console.error('Missing required metadata:', { orgName, orgType, orgEmail });
    throw new Error('Missing required metadata');
  }

  // Extract email domain for auto-association
  const emailDomain = orgEmail.split('@')[1];

  // Check if organization already exists
  let organization = null;
  const { data: existingOrgs } = await supabase
    .from('organizations')
    .select('*')
    .eq('email_domain', emailDomain)
    .limit(1);

  if (existingOrgs && existingOrgs.length > 0) {
    organization = existingOrgs[0];
  } else {
    // Create new organization
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName,
        type: orgType,
        email_domain: emailDomain,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orgError) {
      console.error('Failed to create organization:', orgError);
      throw orgError;
    }

    organization = newOrg;
  }

  // Create or update membership
  const membershipStart = new Date();
  const membershipEnd = getMembershipExpiry(orgType, membershipStart);

  const { error: membershipError } = await supabase
    .from('memberships')
    .insert({
      org_id: organization.id,
      period_start: membershipStart.toISOString().split('T')[0],
      period_end: membershipEnd.toISOString().split('T')[0],
      tier: orgType,
      amount_cents: charge.amount,
      status: 'paid',
      stripe_ref: charge.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (membershipError) {
    console.error('Failed to create membership:', membershipError);
    throw membershipError;
  }

  // Update organization status and paid_through date
  const { error: updateError } = await supabase
    .from('organizations')
    .update({
      status: 'active',
      paid_through: membershipEnd.toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    })
    .eq('id', organization.id);

  if (updateError) {
    console.error('Failed to update organization:', updateError);
    throw updateError;
  }

  // Send confirmation email using template
  try {
    const data: EmailData = {
      orgName,
      tier: orgType,
      amount: charge.amount / 100,
      paidThrough: membershipEnd.toLocaleDateString(),
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/portal/org/profile`,
    };
    const { subject, html } = getEmailTemplate('membership-confirmation', data);
    await sendEmail(orgEmail, subject, html, { replyTo: 'membership@emaofbc.com' });
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
    // Don't throw - email failure shouldn't block the payment processing
  }

  console.log(`Successfully processed membership for organization: ${orgName} (${organization.id})`);
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const supabase = createServiceRoleClient();

  if (!charge.id) {
    throw new Error('Missing charge ID');
  }

  // Find membership by stripe_ref
  const { data: memberships, error: findError } = await supabase
    .from('memberships')
    .select('*')
    .eq('stripe_ref', charge.id)
    .limit(1);

  if (findError) {
    console.error('Failed to find membership:', findError);
    throw findError;
  }

  if (!memberships || memberships.length === 0) {
    console.warn(`No membership found for charge: ${charge.id}`);
    return;
  }

  const membership = memberships[0];

  // Update membership status to reflect refund
  const { error: updateError } = await supabase
    .from('memberships')
    .update({
      status: 'unpaid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', membership.id);

  if (updateError) {
    console.error('Failed to update membership status:', updateError);
    throw updateError;
  }

  // Get organization for notification email
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', membership.org_id)
    .single();

  if (org) {
    const refundHtml = `
      <h2>Membership Refund Processed</h2>
      <p>We have processed a refund for your EMA of BC membership.</p>
      <p><strong>Organization:</strong> ${org.name}</p>
      <p><strong>Amount Refunded:</strong> $${(charge.amount / 100).toFixed(2)}</p>
      <p>If you have questions about this refund, please contact <a href="mailto:membership@emaofbc.com">membership@emaofbc.com</a></p>
    `;

    try {
      await sendEmail(
        org.email_domain ? `billing@${org.email_domain}` : '',
        'EMA of BC - Membership Refund Processed',
        refundHtml
      );
    } catch (emailError) {
      console.error('Failed to send refund email:', emailError);
    }
  }

  console.log(`Successfully processed refund for membership: ${membership.id}`);
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent): Promise<void> {
  console.error('Payment intent failed:', {
    id: intent.id,
    status: intent.status,
    last_payment_error: intent.last_payment_error?.message,
  });

  // Log for monitoring - in production, this would trigger alerts
  // TODO: Send notification to admins about failed payment
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

    // Handle different event types
    switch (event.type) {
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeSucceeded(charge);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(intent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
