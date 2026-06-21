'use server';

import Stripe from 'stripe';
import { MEMBERSHIP_TIERS, MembershipTier } from '@/lib/membership';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function createStripeCheckout(
  orgName: string,
  orgType: MembershipTier,
  orgEmail: string,
  isProratedRenewal?: boolean,
  prorationAmount?: number
) {
  try {
    const tierInfo = MEMBERSHIP_TIERS[orgType];
    const amount = prorationAmount || tierInfo.priceCents;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `EMA of BC Membership - ${tierInfo.name}`,
              description: `${orgName} - Annual membership (${isProratedRenewal ? 'Prorated Renewal' : 'Annual'})`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/portal?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/join?cancel=true`,
      customer_email: orgEmail,
      metadata: {
        orgName,
        orgType,
        orgEmail,
        isProratedRenewal: isProratedRenewal ? 'true' : 'false',
      },
    });

    return session.url;
  } catch (error) {
    console.error('Stripe checkout creation failed:', error);
    throw error;
  }
}

export async function verifyWebhookSignature(body: string, signature: string): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('Webhook secret not configured');

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}

export async function createRegistrationCheckout(
  eventId: string,
  eventTitle: string,
  userEmail: string,
  userName: string,
  priceInCents: number,
  isMemberPrice: boolean
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `EMA of BC - ${eventTitle}`,
              description: `Event registration (${isMemberPrice ? 'Member' : 'Non-Member'} pricing)`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${eventId}/confirmation?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${eventId}/register?cancel=true`,
      customer_email: userEmail,
      metadata: {
        eventId,
        eventTitle,
        userEmail,
        userName,
        isMemberPrice: isMemberPrice ? 'true' : 'false',
      },
    });

    return session.url;
  } catch (error) {
    console.error('Event registration checkout creation failed:', error);
    throw error;
  }
}
