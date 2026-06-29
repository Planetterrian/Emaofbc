'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MEMBERSHIP_TIERS, MembershipTier, calculateProration } from '@/lib/membership';
import { createStripeCheckout } from '@/app/actions';

const BENEFITS = [
  'Access to all EMA events and workshops',
  'Discounted event pricing for all employees',
  'Professional development credits',
  'Listed in the member directory',
  'Employee benefits across your organization',
  'Sponsorship opportunities',
];

const FAQ = [
  { q: 'What’s included in membership?', a: 'Access to all EMA events, member pricing, professional development credits, directory listing, and networking with other environmental professionals.' },
  { q: 'When does my membership expire?', a: 'Memberships are annual and expire on December 31st. You’ll receive a renewal notice before expiration.' },
  { q: 'Can I change my membership tier?', a: 'Yes — contact membership@emaofbc.com to upgrade or downgrade your tier.' },
  { q: 'Is there a money-back guarantee?', a: 'If you’re not satisfied within 30 days, contact us for a refund.' },
];

export default function JoinPage() {
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<MembershipTier>('corporate');
  const [orgEmail, setOrgEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') setSuccess(true);
  }, []);

  const proratedCents = calculateProration(orgType, new Date());
  const isMidYear = new Date().getMonth() > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const checkoutUrl = await createStripeCheckout(
        orgName,
        orgType,
        orgEmail,
        isMidYear,
        isMidYear ? proratedCents : undefined
      );
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <section className="bg-forest-gradient text-white">
          <div className="container-px py-16 md:py-20">
            <span className="eyebrow text-sage-light">Welcome aboard</span>
            <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">Welcome to EMA!</h1>
            <p className="mt-4 text-lg text-white/80">Your membership is being set up.</p>
          </div>
        </section>
        <section className="section">
          <div className="container-px max-w-2xl">
            <div className="rounded-3xl border border-forest/20 bg-forest-50 p-8">
              <h2 className="text-2xl font-bold text-forest">✓ Payment received</h2>
              <p className="mt-3 text-ink-soft">
                Thank you for your membership payment — your organization is now an active member of EMA of BC.
                You’ll receive a confirmation email shortly with your benefits and next steps.
              </p>
              <Link href="/portal" className="btn btn-lg btn-primary mt-6">Go to Member Portal</Link>
            </div>
            <div className="card mt-8">
              <h3 className="text-lg font-bold text-navy">What’s next?</h3>
              <ol className="mt-4 space-y-3 text-ink-soft">
                {['Check your email for the membership confirmation', 'Set up your organization profile in the member portal', 'Invite your employees to the directory', 'Browse and register for upcoming events'].map((s, i) => (
                  <li key={i} className="flex gap-3"><span className="font-bold text-forest">{i + 1}.</span><span>{s}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <span className="eyebrow text-sage-light">Membership</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Join EMA of BC</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Become part of BC’s premier environmental professionals network.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-navy">Membership application</h2>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">Organization Name *</label>
                  <input
                    type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} required
                    placeholder="Your organization name"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">Contact Email *</label>
                  <input
                    type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} required
                    placeholder="contact@organization.ca"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-navy">Membership Type *</label>
                  <div className="space-y-3">
                    {Object.entries(MEMBERSHIP_TIERS).map(([key, tier]: [string, any]) => (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                          orgType === key ? 'border-forest bg-forest-50' : 'border-black/10 hover:border-forest/40'
                        }`}
                      >
                        <input
                          type="radio" name="orgType" value={key} checked={orgType === key}
                          onChange={(e) => setOrgType(e.target.value as MembershipTier)} className="mt-1 accent-[#1f6b48]"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-navy">{tier.name}</div>
                          <p className="text-sm text-ink-soft">{tier.description}</p>
                          <div className="mt-2 text-lg font-bold text-forest">
                            {isMidYear ? (
                              <>
                                ${(proratedCents / 100).toFixed(2)} CAD + GST
                                <span className="ml-2 text-sm font-normal text-ink-soft line-through">
                                  ${(tier.priceCents / 100).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <>${(tier.priceCents / 100).toFixed(2)} CAD + GST</>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit" disabled={isLoading || !orgName || !orgEmail}
                    className="btn btn-lg btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Processing…' : 'Proceed to Payment'}
                  </button>
                  <p className="mt-3 text-center text-xs text-ink-soft">
                    You’ll be redirected to Stripe for secure payment processing.
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-forest/20 bg-forest-50 p-6">
              <h3 className="text-lg font-bold text-navy">Member benefits</h3>
              <ul className="mt-5 space-y-3 text-sm text-ink-soft">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex gap-3"><span className="font-bold text-forest">✓</span><span>{b}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-mesh pt-0">
        <div className="container-px max-w-3xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Questions</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="mt-10 space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="card">
                <h3 className="text-lg font-bold text-navy">{f.q}</h3>
                <p className="mt-2 text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
