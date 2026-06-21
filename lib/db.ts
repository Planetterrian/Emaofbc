import { createClient } from '@supabase/supabase-js';
import type {
  Organization,
  Event,
  User,
  Content,
  Sponsorship,
  Membership,
  Registration,
  PDCredit,
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Organizations
export async function getActiveOrganizations(): Promise<Organization[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .eq('status', 'active')
      .order('name');
    return data || [];
  } catch {
    return [];
  }
}

export async function getOrganizationWithDirectory(): Promise<Organization[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .eq('status', 'active')
      .eq('directory_opt_in', true)
      .order('name');
    return data || [];
  } catch {
    return [];
  }
}

export async function getOrganizationById(id: string): Promise<Organization | null> {
  try {
    if (!supabase) return null;
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    return data || null;
  } catch {
    return null;
  }
}

// Events
export async function getPublishedEvents(): Promise<Event[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('events')
      .select('*')
      .in('status', ['published', 'full', 'past'])
      .order('starts_at', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    if (!supabase) return [];
    const now = new Date().toISOString();
    const { data } = await supabase
      .from('events')
      .select('*')
      .in('status', ['published', 'full'])
      .gt('starts_at', now)
      .order('starts_at', { ascending: true })
      .limit(6);
    return data || [];
  } catch {
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    if (!supabase) return null;
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    return data || null;
  } catch {
    return null;
  }
}

export async function getEventsByType(type: string): Promise<Event[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('type', type)
      .in('status', ['published', 'full', 'past'])
      .order('starts_at', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

// Board members
export async function getBoardMembers(): Promise<User[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'board')
      .order('full_name');
    return data || [];
  } catch {
    return [];
  }
}

// Content
export async function getPublishedContent(limit = 10): Promise<Content[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('content')
      .select('*')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);
    return data || [];
  } catch {
    return [];
  }
}

export async function getContentByType(type: string, limit = 10): Promise<Content[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('content')
      .select('*')
      .eq('type', type)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);
    return data || [];
  } catch {
    return [];
  }
}

// Sponsorships
export async function getSponsorshipsForEvent(eventId: string): Promise<Sponsorship[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('sponsorships')
      .select('*, organizations(*)')
      .eq('event_id', eventId)
      .eq('payment_status', 'paid')
      .order('tier');
    return data || [];
  } catch {
    return [];
  }
}

// Users
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    if (!supabase) return null;
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return data || null;
  } catch {
    return null;
  }
}

// Memberships
export async function getActiveMembership(orgId: string): Promise<Membership | null> {
  try {
    if (!supabase) return null;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('memberships')
      .select('*')
      .eq('org_id', orgId)
      .eq('status', 'paid')
      .gte('period_end', today)
      .order('period_end', { ascending: false })
      .limit(1)
      .single();
    return data || null;
  } catch {
    return null;
  }
}

// Registrations
export async function getRegistrationCount(eventId: string): Promise<number> {
  try {
    if (!supabase) return 0;
    const { count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('payment_status', 'paid');
    return count || 0;
  } catch {
    return 0;
  }
}

export async function getRegistrationsByUser(userId: string): Promise<Registration[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('registrations')
      .select('*, events(*)')
      .eq('user_id', userId)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

// PD Credits
export async function getUserPDCredits(userId: string): Promise<number> {
  try {
    if (!supabase) return 0;
    const { data } = await supabase
      .from('pd_credits')
      .select('credits')
      .eq('user_id', userId);
    const total = data?.reduce((sum, row: any) => sum + parseFloat(row.credits.toString()), 0) || 0;
    return parseFloat(total.toFixed(2));
  } catch {
    return 0;
  }
}

export async function getPDCreditsHistory(userId: string): Promise<(PDCredit & { event?: Event })[]> {
  try {
    if (!supabase) return [];
    const { data } = await supabase
      .from('pd_credits')
      .select('*, events(*)')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}
