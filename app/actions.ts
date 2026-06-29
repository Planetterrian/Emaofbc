'use server';

import Stripe from 'stripe';
import { MEMBERSHIP_TIERS, MembershipTier, calculateProration } from '@/lib/membership';
import {
  generateEventCopyAI,
  generateNewsletterDraftAI,
  queryMemberAssistantAI,
} from '@/lib/ai';
import { buildAssistantContext, buildNewsletterInputs } from '@/lib/ai-context';
import { createServiceRoleClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/mailer';
import { headers } from 'next/headers';
import { requireAdminRole } from '@/lib/auth';
import type { EventType, EventStatus } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export async function createStripeCheckout(
  orgName: string,
  orgType: MembershipTier,
  orgEmail: string,
  isProratedRenewal?: boolean,
  prorationAmount?: number
) {
  try {
    const tierInfo = MEMBERSHIP_TIERS[orgType];
    const prorated = prorationAmount ?? calculateProration(orgType, new Date());
    const amount = isProratedRenewal ? prorated : tierInfo.priceCents;

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
      success_url: `${siteUrl()}/join?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/join?cancel=true`,
      customer_email: orgEmail,
      metadata: {
        orgName,
        orgType,
        orgEmail,
        isProratedRenewal: isProratedRenewal ? 'true' : 'false',
        flow: 'membership',
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
  await requireAdminRole();
  return generateEventCopyAI(eventTitle, eventDescription, eventType);
}

export async function generateNewsletterDraft(
  recentEvents?: string,
  memberUpdates?: string
): Promise<string> {
  await requireAdminRole();
  const inputs =
    recentEvents && memberUpdates
      ? { recentEvents, memberUpdates }
      : await buildNewsletterInputs();
  return generateNewsletterDraftAI(inputs.recentEvents, inputs.memberUpdates);
}

export async function publishNewsletter(subject: string, htmlBody: string): Promise<{ sent: number }> {
  await requireAdminRole();
  const supabase = createServiceRoleClient();

  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .is('unsubscribed_at', null);

  const emails = (subscribers || []).map((s) => s.email);
  if (emails.length === 0) {
    throw new Error('No newsletter subscribers found');
  }

  let sent = 0;
  for (const email of emails) {
    try {
      await sendEmail(email, subject, htmlBody.replace(/\n/g, '<br>'));
      sent++;
    } catch (err) {
      console.error(`Failed to send newsletter to ${email}:`, err);
    }
  }

  return { sent };
}

export async function queryMemberAssistant(
  query: string,
  _context?: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'anonymous';

  const context = await buildAssistantContext();

  let enrichedQuery = query;
  if (conversationHistory && conversationHistory.length > 0) {
    const historyText = conversationHistory
      .slice(-4)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
    enrichedQuery = `Previous conversation:\n${historyText}\n\nCurrent question: ${query}`;
  }

  return queryMemberAssistantAI(enrichedQuery, context, `assistant:${ip}`);
}

export async function createRegistrationCheckout(
  eventId: string,
  eventTitle: string,
  userEmail: string,
  userName: string,
  priceInCents: number,
  isMemberPrice: boolean
) {
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
    success_url: `${siteUrl()}/events/${eventId}/confirmation?success=true`,
    cancel_url: `${siteUrl()}/events/${eventId}/register?cancel=true`,
    customer_email: userEmail,
    metadata: {
      flow: 'event_registration',
      eventId,
      eventTitle,
      userEmail,
      userName,
      isMemberPrice: isMemberPrice ? 'true' : 'false',
    },
  });

  return session.url;
}

export interface EventFormData {
  type: EventType;
  title: string;
  description?: string;
  speaker?: string;
  venue?: string;
  starts_at: string;
  capacity?: number;
  member_price_cents?: number;
  nonmember_price_cents?: number;
  pd_eligible: boolean;
  status: EventStatus;
}

export async function createEvent(data: EventFormData) {
  await requireAdminRole();
  const supabase = createServiceRoleClient();
  const { data: event, error } = await supabase
    .from('events')
    .insert({ ...data, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return event;
}

export async function updateEvent(id: string, data: Partial<EventFormData>) {
  await requireAdminRole();
  const supabase = createServiceRoleClient();
  const { data: event, error } = await supabase
    .from('events')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return event;
}

export async function updateOrganizationDirectory(
  orgId: string,
  updates: {
    directory_opt_in?: boolean;
    focus?: string;
    website?: string;
    logo_url?: string;
    status?: string;
  }
) {
  await requireAdminRole();
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('organizations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', orgId);
  if (error) throw error;
}

export async function updateAwardStatus(awardId: string, status: string) {
  await requireAdminRole();
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('awards')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', awardId);
  if (error) throw error;
}

export async function saveContent(data: {
  id?: string;
  type: 'post' | 'recap' | 'archive';
  title: string;
  body?: string;
  event_id?: string;
  publish?: boolean;
}) {
  await requireAdminRole();
  const supabase = createServiceRoleClient();
  const payload = {
    type: data.type,
    title: data.title,
    body: data.body,
    event_id: data.event_id || null,
    published_at: data.publish ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    const { data: content, error } = await supabase
      .from('content')
      .update(payload)
      .eq('id', data.id)
      .select()
      .single();
    if (error) throw error;
    return content;
  }

  const { data: content, error } = await supabase.from('content').insert(payload).select().single();
  if (error) throw error;
  return content;
}

export async function submitAward(data: {
  category: string;
  org_id: string;
  submitter_user_id: string;
  materials_url?: string;
}) {
  const supabase = createServiceRoleClient();
  const { data: award, error } = await supabase.from('awards').insert(data).select().single();
  if (error) throw error;
  return award;
}

export async function inviteOrgAdmin(email: string, fullName: string, orgId: string) {
  const supabase = createServiceRoleClient();

  const { data: authUser, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl()}/auth/reset-password-confirm`,
  });

  if (inviteError) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((u) => u.email === email);
    if (!found) throw inviteError;
  }

  const userId = authUser?.user?.id;
  if (userId) {
    await supabase.from('users').upsert({
      id: userId,
      email,
      full_name: fullName,
      org_id: orgId,
      role: 'org_admin',
      updated_at: new Date().toISOString(),
    });
  }
}
