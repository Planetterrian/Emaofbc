'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Event } from '@/lib/types';

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; cancel?: string }>;
}

export default function ConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCanceled, setIsCanceled] = useState(false);
  const [eventId, setEventId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const p = await params;
      const sp = await searchParams;

      setEventId(p.id);
      setIsCanceled(!!sp.cancel);

      try {
        const res = await fetch(`/api/events/${p.id}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        }
      } catch (err) {
        console.error('Failed to load event:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params, searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  if (isCanceled) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-3xl font-bold text-navy mb-4">Registration Cancelled</h1>
              <p className="text-gray-600 mb-8">Your registration was not completed.</p>
              <Link
                href={`/events/${eventId}/register`}
                className="bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Try Again
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-navy mb-2">Registration Confirmed!</h1>
              <p className="text-gray-600">Your registration has been successfully processed.</p>
            </div>

            {event && (
              <>
                {/* Event Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-bold text-navy mb-4">{event.title}</h2>

                  <div className="space-y-3 text-sm text-gray-700">
                    {event.starts_at && (
                      <div>
                        <p className="font-semibold text-gray-600">Date & Time</p>
                        <p>
                          {new Date(event.starts_at).toLocaleDateString('en-CA', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}

                    {event.venue && (
                      <div>
                        <p className="font-semibold text-gray-600">Venue</p>
                        <p>{event.venue}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-navy">Next Steps</h3>

                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-forest text-white font-bold">
                          1
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-navy mb-1">Add to Your Calendar</p>
                        <p className="text-sm text-gray-600 mb-2">Download the event details in calendar format</p>
                        <a
                          href={`/api/events/${eventId}/calendar.ics`}
                          download={`${event.title}.ics`}
                          className="text-forest hover:text-forest-dark font-semibold text-sm"
                        >
                          Download .ics file →
                        </a>
                      </div>
                    </div>

                    {event.pd_eligible && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-forest text-white font-bold">
                            2
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-navy mb-1">Track PD Credits</p>
                          <p className="text-sm text-gray-600">
                            Attend the event to earn professional development credits
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-forest text-white font-bold">
                          {event.pd_eligible ? 3 : 2}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-navy mb-1">Check Your Email</p>
                        <p className="text-sm text-gray-600">
                          A confirmation email with event details has been sent to you
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition text-center"
              >
                Browse More Events
              </Link>
              <Link
                href="/portal"
                className="flex-1 bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-lg transition text-center"
              >
                Go to Member Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
