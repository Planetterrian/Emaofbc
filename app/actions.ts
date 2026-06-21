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

export async function generateEventCopy(
  eventTitle: string,
  eventDescription: string,
  eventType: string
): Promise<string> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || 'grok-latest',
        messages: [
          {
            role: 'system',
            content: `You are an expert copywriter for EMA of BC, a professional environmental association. Write engaging, professional event marketing copy. Keep tone warm, professional, and action-oriented. Output markdown formatted text suitable for a website.`,
          },
          {
            role: 'user',
            content: `Generate compelling marketing copy for this event.
Title: ${eventTitle}
Type: ${eventType}
Description: ${eventDescription}

Provide 2-3 paragraphs of engaging copy that highlights the value and invites attendance.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Event copy generation failed:', error);
    throw error;
  }
}

export async function generateNewsletterDraft(
  recentEvents: string,
  memberUpdates: string
): Promise<string> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || 'grok-latest',
        messages: [
          {
            role: 'system',
            content: `You are a professional newsletter writer for EMA of BC (Environmental Managers Association of BC). Write engaging, informative newsletters that showcase member achievements and upcoming events. Maintain a professional but friendly tone.`,
          },
          {
            role: 'user',
            content: `Generate a newsletter draft based on this activity:

Recent Events: ${recentEvents}

Member Updates: ${memberUpdates}

Create a newsletter with:
1. Engaging subject line
2. Opening paragraph highlighting key events
3. Featured achievements
4. Upcoming opportunities
5. Call to action

Format as markdown suitable for email.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Newsletter generation failed:', error);
    throw error;
  }
}

export async function queryMemberAssistant(
  query: string,
  context: string
): Promise<string> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || 'grok-latest',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for EMA of BC members. You have access to information about the organization's events, members, and programs.

IMPORTANT: Only answer questions based on the provided context. If a question is outside the scope of what you know about EMA of BC, politely explain that you can only help with EMA-related questions and suggest contacting membership@emaofbc.com for other inquiries.

Be concise, friendly, and professional in your responses.`,
          },
          {
            role: 'user',
            content: `Context about EMA of BC:
${context}

Member question: ${query}

Please answer based only on the context provided above. If you cannot answer from the context, explain what you'd need to know.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Member assistant query failed:', error);
    throw error;
  }
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
