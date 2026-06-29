'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Subscribe failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address for newsletter"
        disabled={status === 'loading' || status === 'success'}
        className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="btn btn-lg btn-light shrink-0 disabled:opacity-60"
      >
        {status === 'loading' ? '…' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <span className="sr-only" role="alert">Subscription failed. Please try again.</span>
      )}
    </form>
  );
}
