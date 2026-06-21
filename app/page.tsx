import Link from 'next/link';
import { getUpcomingEvents, getActiveOrganizations } from '@/lib/db';
import { formatDate } from 'date-fns';

async function HomePage() {
  const [upcomingEvents, allOrgs] = await Promise.all([
    getUpcomingEvents(),
    getActiveOrganizations(),
  ]);

  const memberLogos = allOrgs
    .filter((org) => org.directory_opt_in && org.logo_url)
    .slice(0, 12);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-navy to-navy-dark text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Environmental Excellence in BC
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            The Environmental Managers Association of BC is the premier professional network
            advancing environmental due diligence and sustainability across British Columbia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="bg-forest hover:bg-forest-dark text-white px-8 py-3 rounded-lg font-semibold text-lg transition inline-block"
            >
              Become a Member
            </Link>
            <Link
              href="/events"
              className="bg-white hover:bg-gray-100 text-navy px-8 py-3 rounded-lg font-semibold text-lg transition inline-block"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-navy">Why Join EMA?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-navy mb-3">Professional Network</h3>
              <p className="text-gray-600">
                Connect with environmental professionals across corporate, government, and NGO
                sectors. Build relationships and expand your professional circle.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-navy mb-3">Continuing Education</h3>
              <p className="text-gray-600">
                Earn professional development credits through workshops, seminars, and site tours.
                Stay current with environmental regulations and best practices.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-navy mb-3">Due Diligence Defence</h3>
              <p className="text-gray-600">
                Demonstrate your organization's commitment to environmental excellence and
                professional standards. Evidence of industry engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-navy">Upcoming Events</h2>
            <Link href="/events" className="text-forest hover:text-forest-dark font-semibold">
              View All →
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                const startDate = new Date(event.starts_at);
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-forest transition group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-forest/10 text-forest rounded-full text-sm font-semibold">
                        {event.type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {event.pd_eligible && (
                        <span className="text-xs font-bold text-forest">PD ELIGIBLE</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-forest transition">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">{event.description?.slice(0, 100)}...</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>📅 {formatDate(startDate, 'MMM dd, yyyy')}</div>
                      <div>🕐 {formatDate(startDate, 'h:mm a')}</div>
                      {event.venue && <div>📍 {event.venue}</div>}
                    </div>

                    {event.member_price_cents !== undefined && (
                      <div className="pt-4 border-t border-gray-200">
                        <span className="font-semibold text-navy">
                          ${(event.member_price_cents / 100).toFixed(2)}
                        </span>
                        <span className="text-gray-600 text-sm ml-1">for members</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 p-12 rounded-lg text-center">
              <p className="text-gray-600 text-lg">No upcoming events at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Member Logos */}
      {memberLogos.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-navy mb-12">Our Members</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center">
              {memberLogos.map((org) => (
                <Link
                  key={org.id}
                  href={`/directory/${org.id}`}
                  className="bg-white p-6 rounded-lg flex items-center justify-center hover:shadow-md transition h-32"
                  title={org.name}
                >
                  {org.logo_url ? (
                    <img
                      src={org.logo_url}
                      alt={org.name}
                      className="max-w-full max-h-20 object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-semibold text-navy text-center">{org.name}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/directory"
                className="inline-block text-forest hover:text-forest-dark font-semibold text-lg"
              >
                View Full Member Directory →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Involved?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of environmental professionals advancing excellence in BC.
          </p>
          <Link
            href="/join"
            className="inline-block bg-forest hover:bg-forest-dark text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            Join EMA Today
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
