import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that URL is not a placeholder
function isValidSupabaseUrl(url?: string): boolean {
  if (!url) return false;
  // Reject placeholder URLs with [PROJECT-ID] or similar
  if (url.includes('[') || url.includes(']')) return false;
  // Reject URLs that don't start with https://
  if (!url.startsWith('https://')) return false;
  // Reject URLs that aren't actually URLs
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Create a safe supabase client that handles missing credentials
export const supabase = isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl as string, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ then: (resolve: any) => resolve({ data: null, error: null }) }),
      }),
    } as any;

// Browser client for client components. Returns null when credentials are
// missing or malformed (e.g. during a build/prerender pass without env vars),
// which avoids "Invalid supabaseUrl" crashes. At runtime in the browser the
// public env vars are present, so a real client is returned.
export function createBrowserClient() {
  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey) {
    return null as unknown as ReturnType<typeof createClient>;
  }
  return createClient(supabaseUrl as string, supabaseAnonKey);
}

// Server-side client with service role (admin access)
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isValidSupabaseUrl(supabaseUrl) || !serviceRoleKey) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl as string, serviceRoleKey);
}
