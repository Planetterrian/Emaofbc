'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      if (!authData.user) {
        setError('Failed to create user account');
        return;
      }
      const emailDomain = email.split('@')[1];
      let orgId = null;
      const { data: orgs } = await supabase
        .from('organizations')
        .select('id')
        .eq('email_domain', emailDomain)
        .limit(1);
      if (orgs && orgs.length > 0) orgId = orgs[0].id;
      const { error: userError } = await supabase
        .from('users')
        .insert({ id: authData.user.id, email, full_name: fullName, org_id: orgId, role: 'employee' });
      if (userError) console.error('Failed to create user record:', userError);
      router.push('/auth/login?signup=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-gradient px-4 py-16">
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-forest-light/30 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2.5 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-lg font-bold">E</span>
          <span className="font-display text-lg font-extrabold">EMA of BC</span>
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-[var(--shadow-glow)]">
          <h1 className="text-2xl font-bold text-navy">Create account</h1>
          <p className="mt-1 text-sm text-ink-soft">Join EMA of BC to access member benefits</p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-navy">Full name</label>
              <input
                id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                placeholder="Your name"
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy">Email address</label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-navy">Password</label>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
              <p className="mt-1 text-xs text-ink-soft">Minimum 8 characters</p>
            </div>
            <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-forest hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
