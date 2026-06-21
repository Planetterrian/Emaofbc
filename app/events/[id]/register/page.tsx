'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Event } from '@/lib/types';
import { createRegistrationCheckout } from '@/app/actions';

interface RegisterPageProps {
  params: Promise<{ id: string }>;
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    orgEmail: '',
  });
  const [isMember, setIsMember] = useState(false);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState('');

  // Load event on mount
  const loadEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
        setEventId(id);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      setError('Failed to load event details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize on client mount
  useState(() => {
    const getParams = async () => {
      const p = await params;
      loadEvent(p.id);
    };
    getParams();
  });

  const checkMembership = async (email: string) => {
    if (!email.includes('@')) {
      setIsMember(false);
      return;
    }

    setIsCheckingMembership(true);
    try {
      const res = await fetch(`/api/check-membership?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setIsMember(data.isMember);
      } else {
        setIsMember(false);
      }
    } catch (err) {
      console.error('Membership check failed:', err);
      setIsMember(false);
    } finally {
      setIsCheckingMembership(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    checkMembership(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event || !formData.fullName || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    if (event.capacity) {
      // Check capacity
      try {
        const res = await fetch(`/api/events/${eventId}/capacity`);
        if (res.ok) {
          const data = await res.json();
          if (data.isFull) {
            setError('This event is at capacity');
            return;
          }
        }
      } catch (err) {
        console.error('Capacity check failed:', err);
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Determine price
      let priceInCents = 0;
      if (event.member_price_cents && isMember) {
        priceInCents = event.member_price_cents;
      } else if (event.nonmember_price_cents) {
        priceInCents = event.nonmember_price_cents;
      } else {
        // Free event
        priceInCents = 0;
      }

      if (priceInCents > 0) {
        // Redirect to Stripe Checkout
        const checkoutUrl = await createRegistrationCheckout(
          eventId,
          event.title,
          formData.email,
          formData.fullName,
          priceInCents,
          isMember
        );

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      } else {
        // Free registration - create without payment
        const res = await fetch('/api/registrations/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId,
            fullName: formData.fullName,
            email: formData.email,
            isMember,
          }),
        });

        if (res.ok) {
          window.location.href = `/events/${eventId}/confirmation?success=true`;
        } else {
          setError('Failed to complete registration');
        }
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Failed to process registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">Loading event details...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-navy mb-4">Event Not Found</h1>
                <Link href="/events" className="text-forest hover:text-forest-dark font-semibold">
                  ← Back to Events
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const priceText = isMember
    ? event.member_price_cents
      ? `$${(event.member_price_cents / 100).toFixed(2)} (Member)`
      : 'Free'
    : event.nonmember_price_cents
      ? `$${(event.nonmember_price_cents / 100).toFixed(2)} (Non-Member)`
      : 'Free';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-navy text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link href="/events" className="text-gray-200 hover:text-white mb-4 inline-block">
            ← Back to Events
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.title}</h1>
          <p className="text-xl text-gray-200">Event Registration</p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                      required
                    />
                    {isCheckingMembership && (
                      <p className="text-sm text-gray-500 mt-2">Checking membership...</p>
                    )}
                    {!isCheckingMembership && formData.email && (
                      <p className={`text-sm mt-2 ${isMember ? 'text-forest font-semibold' : 'text-gray-600'}`}>
                        {isMember ? '✓ Active member - member pricing applied' : 'Non-member pricing'}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isCheckingMembership}
                    className="w-full bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : `Continue to Payment (${priceText})`}
                  </button>
                </form>
              </div>
            </div>

            {/* Event Details Sidebar */}
            <div>
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                <h3 className="text-lg font-bold text-navy mb-4">Event Details</h3>

                {event.starts_at && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Date & Time</p>
                    <p className="text-navy font-semibold">
                      {new Date(event.starts_at).toLocaleDateString('en-CA', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                {event.venue && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Venue</p>
                    <p className="text-navy font-semibold">{event.venue}</p>
                  </div>
                )}

                {event.speaker && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Speaker</p>
                    <p className="text-navy font-semibold">{event.speaker}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Pricing</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    {event.member_price_cents !== undefined && (
                      <p>Member: ${(event.member_price_cents / 100).toFixed(2)}</p>
                    )}
                    {event.nonmember_price_cents !== undefined && (
                      <p>Non-Member: ${(event.nonmember_price_cents / 100).toFixed(2)}</p>
                    )}
                  </div>
                </div>

                {event.pd_eligible && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-blue-900">
                      ✓ Counts toward PD credits
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
