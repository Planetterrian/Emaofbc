import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a safe supabase client that handles missing credentials
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ then: (resolve: any) => resolve({ data: null, error: null }) }),
      }),
    } as any;

// Server-side client with service role (admin access)
export function createServiceRoleClient() {
  if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
