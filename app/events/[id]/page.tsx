import Link from 'next/link';
import type { Metadata } from 'next';
import { getEventById, getSponsorshipsForEvent } from '@/lib/db';
import { formatDate } from 'date-fns';
import { generateEventSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import { EventRegisterButton } from '@/components/EventRegisterButton';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const event = await getEventById(params.id);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.title} | EMA of BC`,
    description: event.description || '',
  };
}

async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, sponsorships] = await Promise.all([
    getEventById(params.id),
    getSponsorshipsForEvent(params.id),
  ]);

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.starts_at);
  const isPast = startDate < new Date();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateEventSchema(event)),
        }}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link href="/events" className="text-gray-300 hover:text-white mb-4 inline-block">
            ← Back to Events
          </Link>
          <div className="mt-4 flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-forest rounded-full text-sm font-semibold">
              {event.type.replace(/_/g, ' ').toUpperCase()}
            </span>
            {isPast && <span className="inline-block px-3 py-1 bg-gray-600 rounded-full text-sm font-semibold">PAST</span>}
            {event.pd_eligible && (
              <span className="inline-block px-3 py-1 bg-forest rounded-full text-sm font-semibold">
                PD ELIGIBLE
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{event.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none text-gray-700 mb-12">
                <p>{event.description}</p>
              </div>

              {/* Event Details */}
              <div className="bg-gray-50 p-8 rounded-lg mb-12">
                <h2 className="text-2xl font-bold text-navy mb-6">Event Details</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Date & Time</div>
                    <div className="text-lg text-navy font-semibold">
                      {formatDate(startDate, 'EEEE, MMMM dd, yyyy')}
                    </div>
                    <div className="text-lg text-navy">
                      {formatDate(startDate, 'h:mm a')}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Location</div>
                    <div className="text-lg text-navy font-semibold">{event.venue}</div>
                  </div>

                  {event.speaker && (
                    <div>
                      <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Speaker</div>
                      <div className="text-lg text-navy font-semibold">{event.speaker}</div>
                    </div>
                  )}

                  {event.capacity && (
                    <div>
                      <div className="text-sm font-semibold text-gray-600 uppercase mb-1">Capacity</div>
                      <div className="text-lg text-navy font-semibold">{event.capacity} attendees</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-forest/10 border-2 border-forest p-8 rounded-lg mb-12">
                <h3 className="text-xl font-bold text-navy mb-4">Pricing</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-sm font-semibold text-gray-600 uppercase mb-2">EMA Members</div>
                    <div className="text-3xl font-bold text-forest">
                      ${(event.member_price_cents ? event.member_price_cents / 100 : 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Non-Members</div>
                    <div className="text-3xl font-bold text-navy">
                      ${(event.nonmember_price_cents ? event.nonmember_price_cents / 100 : 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sponsorships */}
              {sponsorships.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-navy mb-6">Event Sponsors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {sponsorships.map((sponsor: any) => (
                      <div key={sponsor.id} className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="text-xs font-bold text-forest uppercase mb-3">
                          {sponsor.tier} Sponsor
                        </div>
                        <div className="text-navy font-semibold">
                          {sponsor.organizations?.name || 'Sponsor'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white border-2 border-navy rounded-lg p-8 sticky top-24">
                <h3 className="text-xl font-bold text-navy mb-6">Register</h3>

                {isPast ? (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700">This event has already taken place.</p>
                  </div>
                ) : event.status === 'full' ? (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                    <p className="text-yellow-800 font-semibold">Event is currently full</p>
                    <p className="text-yellow-700 text-sm mt-1">Join the waitlist to be notified if space becomes available.</p>
                  </div>
                ) : null}

                <div className="mb-4">
                  <EventRegisterButton
                    eventId={params.id}
                    isPast={isPast}
                    isFull={event.status === 'full'}
                  />
                </div>

                {!isPast && event.status !== 'full' && (
                  <p className="text-xs text-gray-600 text-center">
                    Click to proceed to registration and payment via Stripe.
                  </p>
                )}

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-600 uppercase mb-4">About This Event</div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-forest mt-1">✓</span>
                      <span>Open to members and non-members</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-forest mt-1">✓</span>
                      <span>Light refreshments included</span>
                    </li>
                    {event.pd_eligible && (
                      <li className="flex items-start gap-3">
                        <span className="text-forest mt-1">✓</span>
                        <span>Professional development credit eligible</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EventDetailPage;
