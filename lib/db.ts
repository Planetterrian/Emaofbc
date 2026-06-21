import { createClient } from '@supabase/supabase-js';
import type {
  Organization,
  Event,
  User,
  Content,
  Sponsorship,
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
