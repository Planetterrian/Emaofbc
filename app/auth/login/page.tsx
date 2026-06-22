'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('signup') === 'success') setSignupSuccess(true);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.push('/portal');
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
          <h1 className="text-2xl font-bold text-navy">Member login</h1>
          <p className="mt-1 text-sm text-ink-soft">Access your EMA of BC account</p>

          {signupSuccess && (
            <div className="mt-5 rounded-2xl border border-forest/20 bg-forest-50 px-4 py-3 text-sm text-forest-700">
              Account created successfully! Please log in with your credentials.
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
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
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="Your password"
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </div>
            <div className="flex justify-end">
              <Link href="/auth/password-reset" className="text-sm font-medium text-forest hover:underline">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full disabled:opacity-50">
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Don’t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold text-forest hover:underline">Sign up</Link>
          </p>

          <div className="mt-6 border-t border-black/[0.06] pt-5">
            <p className="mb-3 text-center text-sm text-ink-soft">Not a member yet?</p>
            <Link href="/join" className="btn btn-md btn-outline w-full">Join as an Organization</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-canvas"><p className="text-ink-soft">Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
