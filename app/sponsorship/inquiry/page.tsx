'use client';

import { useState } from 'react';
import Link from 'next/link';

const TIERS = ['Platinum', 'Gold', 'Silver', 'Bronze'];

export default function SponsorshipInquiryPage() {
  const [form, setForm] = useState({
    org_name: '',
    contact_name: '',
    email: '',
    event_interest: '',
    tier: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/sponsorship/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSuccess(true);
    } catch {
      setError('Failed to submit inquiry. Please email sponsorship@emaofbc.com directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="section">
        <div className="container-px max-w-xl text-center">
          <div className="card">
            <h1 className="text-2xl font-bold text-forest">Inquiry sent</h1>
            <p className="mt-3 text-ink-soft">We'll be in touch shortly about sponsorship options.</p>
            <Link href="/sponsorship" className="btn btn-md btn-primary mt-6">Back to Sponsorship</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-20">
          <Link href="/sponsorship" className="text-white/70 hover:text-white text-sm">← Back to sponsorship</Link>
          <h1 className="mt-4 text-4xl font-extrabold">Sponsorship inquiry</h1>
          <p className="mt-4 max-w-2xl text-white/80">Tell us about your organization and sponsorship interests.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-px max-w-2xl">
          <div className="card">
            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              {(
                [
                  ['org_name', 'Organization name', 'text', true],
                  ['contact_name', 'Contact name', 'text', true],
                  ['email', 'Email', 'email', true],
                  ['event_interest', 'Event of interest', 'text', false],
                ] as const
              ).map(([key, label, type, required]) => (
                <div key={key}>
                  <label htmlFor={key} className="mb-2 block text-sm font-semibold text-navy">
                    {label}{required ? ' *' : ''}
                  </label>
                  <input
                    id={key}
                    type={type}
                    required={required}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-4 py-3"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="tier" className="mb-2 block text-sm font-semibold text-navy">Preferred tier</label>
                <select
                  id="tier"
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-3"
                >
                  <option value="">Select a tier</option>
                  {TIERS.map((t) => (
                    <option key={t} value={t.toLowerCase()}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-navy">Message</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-black/10 px-4 py-3"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn btn-lg btn-primary w-full disabled:opacity-50">
                {submitting ? 'Sending…' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
