'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MEMBERSHIP_TIERS, MembershipTier } from '@/lib/membership';
import { createStripeCheckout } from '@/app/actions';

export default function JoinPage() {
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<MembershipTier>('corporate');
  const [orgEmail, setOrgEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check for success query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccess(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const checkoutUrl = await createStripeCheckout(orgName, orgType, orgEmail);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen">
        <section className="bg-forest text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to EMA!</h1>
            <p className="text-xl text-gray-100">Your membership is being set up.</p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-green-50 border-2 border-forest p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-forest mb-4">✓ Payment Received</h2>
              <p className="text-gray-700 mb-4">
                Thank you for your membership payment. Your organization is now an active member of
                the EMA of BC.
              </p>
              <p className="text-gray-700 mb-8">
                You'll receive a confirmation email shortly with your member benefits and next steps.
              </p>

              <Link
                href="/portal"
                className="inline-block bg-forest hover:bg-forest-dark text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Go to Member Portal
              </Link>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-lg font-bold text-navy mb-4">What's Next?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-forest font-bold">1.</span>
                  <span>Check your email for the membership confirmation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest font-bold">2.</span>
                  <span>Set up your organization profile in the member portal</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest font-bold">3.</span>
                  <span>Invite your employees to the directory</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest font-bold">4.</span>
                  <span>Browse and register for upcoming events</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join EMA of BC</h1>
          <p className="text-xl text-gray-200">
            Become part of BC's premier environmental professionals network
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Membership Application</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Organization Name */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-forest"
                      placeholder="Your organization name"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-forest"
                      placeholder="contact@organization.ca"
                    />
                  </div>

                  {/* Membership Type */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-4">
                      Membership Type *
                    </label>
                    <div className="space-y-3">
                      {Object.entries(MEMBERSHIP_TIERS).map(([key, tier]) => (
                        <label key={key} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="orgType"
                            value={key}
                            checked={orgType === key}
                            onChange={(e) => setOrgType(e.target.value as MembershipTier)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-navy">{tier.name}</div>
                            <p className="text-sm text-gray-600">{tier.description}</p>
                            <div className="text-lg font-bold text-forest mt-2">
                              ${(tier.priceCents / 100).toFixed(2)} CAD + GST
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || !orgName || !orgEmail}
                      className="w-full bg-forest hover:bg-forest-dark text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : `Proceed to Payment`}
                    </button>
                    <p className="text-xs text-gray-600 text-center mt-3">
                      You'll be redirected to Stripe for secure payment processing.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Benefits Sidebar */}
            <div>
              <div className="bg-forest/10 border-2 border-forest p-6 rounded-lg">
                <h3 className="text-lg font-bold text-navy mb-6">Member Benefits</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-forest">✓</span>
                    <span>Access to all EMA events and workshops</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-forest">✓</span>
                    <span>Discounted event pricing for all employees</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-forest">✓</span>
                    <span>Professional development credits</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-forest">✓</span>
                    <span>Listed in member directory</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-forest">✓</span>
                    <span>Employee benefits</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-forest">✓</span>
                    <span>Sponsorship opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-navy mb-2">What's included in membership?</h3>
              <p className="text-gray-700">
                Membership includes access to all EMA events, member pricing discounts, professional
                development credits, directory listing, and networking opportunities with other
                environmental professionals.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-navy mb-2">When does my membership expire?</h3>
              <p className="text-gray-700">
                Memberships are annual and expire on December 31st. You'll receive a renewal notice
                before expiration.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-navy mb-2">Can I change my membership tier?</h3>
              <p className="text-gray-700">
                Yes, you can upgrade or downgrade your membership tier by contacting us at{' '}
                <a href="mailto:membership@emaofbc.com" className="text-forest hover:text-forest-dark font-semibold">
                  membership@emaofbc.com
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-navy mb-2">Is there a money-back guarantee?</h3>
              <p className="text-gray-700">
                We stand behind our membership. If you're not satisfied within 30 days, please contact
                us for a refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
