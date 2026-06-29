import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { UserRole } from './types';

const ADMIN_ROLES: UserRole[] = ['ed_admin', 'board'];

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can fail in Server Components; middleware handles refresh.
          }
        },
      },
    }
  );
}

export async function getSessionUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function requireAuth(redirectTo = '/auth/login') {
  const user = await getSessionUser();
  if (!user) {
    const { redirect } = await import('next/navigation');
    redirect(redirectTo);
  }
  return user;
}

export async function requireAdminRole() {
  const profile = await getUserProfile();
  if (!profile || !ADMIN_ROLES.includes(profile.role as UserRole)) {
    const { redirect } = await import('next/navigation');
    redirect('/portal');
  }
  return profile;
}

export function isAdminRole(role?: string): boolean {
  return !!role && ADMIN_ROLES.includes(role as UserRole);
}
