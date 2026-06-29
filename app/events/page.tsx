import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedEvents } from '@/lib/db';
import { formatDate } from 'date-fns';

export const metadata: Metadata = {
  title: 'Events | EMA of BC',
  description: 'Upcoming events, workshops, and professional development sessions for environmental managers.',
};

export const dynamic = 'force-dynamic';

const FILTERS = [
  { label: 'All Events', href: '/events', type: undefined },
  { label: 'Monthly Sessions', href: '/events?type=monthly_session', type: 'monthly_session' },
  { label: 'Workshops', href: '/events?type=workshop', type: 'workshop' },
  { label: 'Site Tours', href: '/events?type=tour', type: 'tour' },
  { label: 'Golf', href: '/events?type=golf', type: 'golf' },
  { label: 'Awards Gala', href: '/events?type=gala', type: 'gala' },
];

const EVENT_EMOJI: Record<string, string> = {
  monthly_session: '🎤', workshop: '🛠️', tour: '🚌', golf: '⛳', gala: '🏆',
};

async function EventsPage({ searchParams }: { searchParams: { type?: string } }) {
  const events = await getPublishedEvents().catch(() => []);
  const filterType = searchParams?.type;
  const filtered = filterType ? events.filter((e: any) => e.type === filterType) : events;
  const now = new Date();
  const upcomingEvents = filtered.filter((e: any) => new Date(e.starts_at) > now);
  const pastEvents = filtered.filter((e: any) => new Date(e.starts_at) <= now);

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <span className="eyebrow text-sage-light">What’s on</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Events &amp; workshops</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Professional development events, networking sessions, site tours, and workshops for
            environmental managers across BC.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b border-black/[0.06] bg-white/60 backdrop-blur sticky top-[64px] z-30">
        <div className="container-px flex flex-wrap gap-2.5 py-4">
          {FILTERS.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                (filterType || undefined) === f.type
                  ? 'bg-forest text-white'
                  : 'border border-black/10 bg-white text-ink-soft hover:border-forest/40 hover:text-forest'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container-px">
          <h2 className="text-3xl font-bold text-navy">Upcoming events</h2>

          {upcomingEvents.length > 0 ? (
            <div className="mt-10 space-y-5">
              {upcomingEvents.map((event: any) => {
                const startDate = new Date(event.starts_at);
                return (
                  <Link key={event.id} href={`/events/${event.id}`} className="card card-hover group block">
                    <div className="grid items-center gap-6 md:grid-cols-12">
                      <div className="md:col-span-5">
                        <span className="pill-forest">{EVENT_EMOJI[event.type] || '📅'} {event.type.replace(/_/g, ' ')}</span>
                        <h3 className="mt-3 text-2xl font-bold text-navy group-hover:text-forest">{event.title}</h3>
                      </div>
                      <div className="md:col-span-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Date &amp; time</div>
                        <div className="mt-1 font-semibold text-navy">{formatDate(startDate, 'MMM dd, yyyy')}</div>
                        <div className="text-ink-soft">{formatDate(startDate, 'h:mm a')}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Location</div>
                        <div className="mt-1 text-navy">{event.venue || 'TBA'}</div>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        <div className="text-2xl font-bold text-forest">
                          {event.member_price_cents ? `$${(event.member_price_cents / 100).toFixed(0)}` : 'Free'}
                        </div>
                        <div className="text-xs text-ink-soft">member price</div>
                        {event.pd_eligible && <div className="mt-2 inline-block text-xs font-bold text-gold">✓ PD eligible</div>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-forest/20 bg-forest-50/40 p-14 text-center">
              <div className="text-4xl">🌿</div>
              <p className="mt-3 text-lg font-semibold text-navy">No upcoming events scheduled</p>
              <p className="mt-1 text-ink-soft">New events are being planned — check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {pastEvents.length > 0 && (
        <section className="section bg-mesh pt-0">
          <div className="container-px">
            <h2 className="text-3xl font-bold text-navy">Past events</h2>
            <div className="mt-8 space-y-3">
              {pastEvents.map((event: any) => {
                const startDate = new Date(event.starts_at);
                return (
                  <div key={event.id} className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
                    <div>
                      <span className="text-xs font-semibold uppercase text-ink-soft">{event.type.replace(/_/g, ' ')}</span>
                      <h3 className="text-lg font-bold text-navy">{event.title}</h3>
                      <p className="text-sm text-ink-soft">{formatDate(startDate, 'MMM dd, yyyy')} at {formatDate(startDate, 'h:mm a')}</p>
                    </div>
                    <span className="pill bg-black/[0.04] text-ink-soft">Past</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default EventsPage;
