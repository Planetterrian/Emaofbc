'use client';

import { useState } from 'react';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="card text-center">
        <h2 className="text-xl font-bold text-forest">Message sent</h2>
        <p className="mt-2 text-ink-soft">We'll get back to you soon.</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn btn-md btn-outline mt-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {status === 'error' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to send. You can also email info@emaofbc.com directly.
        </div>
      )}
      {[
        ['name', 'Your name', 'text'],
        ['email', 'Email address', 'email'],
        ['subject', 'Subject', 'text'],
      ].map(([key, label, type]) => (
        <div key={key}>
          <label htmlFor={key} className="mb-2 block text-sm font-semibold text-navy">{label}</label>
          <input
            id={key}
            type={type}
            required
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full rounded-xl border border-black/10 px-4 py-3 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>
      ))}
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-navy">Message</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl border border-black/10 px-4 py-3 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
        />
      </div>
      <button type="submit" disabled={status === 'loading'} className="btn btn-lg btn-primary disabled:opacity-50">
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
