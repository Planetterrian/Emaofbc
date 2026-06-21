import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedEvents } from '@/lib/db';
import { formatDate } from 'date-fns';

export const metadata: Metadata = {
  title: 'Events | EMA of BC',
  description: 'Upcoming events, workshops, and professional development sessions for environmental managers.',
};

async function EventsPage() {
  const events = await getPublishedEvents();

  const upcomingEvents = events.filter((e) => new Date(e.starts_at) > new Date());
  const pastEvents = events.filter((e) => new Date(e.starts_at) <= new Date());

  return (
    <main>
      {/* Header */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
          <p className="text-xl text-gray-200">
            Professional development events, networking sessions, and workshops for EMA members.
          </p>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/events"
              className="px-4 py-2 bg-white border-2 border-forest text-forest rounded-full font-semibold text-sm hover:bg-forest hover:text-white transition"
            >
              All Events
            </Link>
            <Link
              href="/events?type=monthly_session"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full font-semibold text-sm hover:border-forest transition"
            >
              Monthly Sessions
            </Link>
            <Link
              href="/events?type=workshop"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full font-semibold text-sm hover:border-forest transition"
            >
              Workshops
            </Link>
            <Link
              href="/events?type=tour"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full font-semibold text-sm hover:border-forest transition"
            >
              Site Tours
            </Link>
            <Link
              href="/events?type=golf"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full font-semibold text-sm hover:border-forest transition"
            >
              Golf
            </Link>
            <Link
              href="/events?type=gala"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full font-semibold text-sm hover:border-forest transition"
            >
              Awards Gala
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12">Upcoming Events</h2>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event) => {
                const startDate = new Date(event.starts_at);
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-forest transition group"
                  >
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      <div>
                        <div className="text-sm font-semibold text-forest uppercase tracking-wide">
                          {event.type.replace(/_/g, ' ')}
                        </div>
                        <h3 className="text-2xl font-bold text-navy mt-2 group-hover:text-forest transition">
                          {event.title}
                        </h3>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 font-semibold">DATE & TIME</div>
                        <div className="text-navy font-semibold">
                          {formatDate(startDate, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-gray-600">{formatDate(startDate, 'h:mm a')}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 font-semibold">LOCATION</div>
                        <div className="text-navy">{event.venue}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-600 font-semibold mb-2">PRICE</div>
                        <div>
                          <span className="text-2xl font-bold text-forest">
                            ${(event.member_price_cents ? event.member_price_cents / 100 : 0).toFixed(2)}
                          </span>
                          <div className="text-xs text-gray-600">Member price</div>
                        </div>
                        {event.pd_eligible && (
                          <div className="mt-2 text-xs font-bold text-forest">✓ PD ELIGIBLE</div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 p-12 rounded-lg text-center">
              <p className="text-gray-600 text-lg">No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-navy mb-12">Past Events</h2>

            <div className="space-y-4">
              {pastEvents.map((event) => {
                const startDate = new Date(event.starts_at);
                return (
                  <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {event.type.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-lg font-bold text-navy">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(startDate, 'MMM dd, yyyy')} at {formatDate(startDate, 'h:mm a')}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">PAST</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default EventsPage;
