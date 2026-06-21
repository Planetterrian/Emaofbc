export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getPublishedEvents } from '@/lib/db';
import { formatDate } from 'date-fns';

export default async function EventsPage() {
  const events = await getPublishedEvents();

  const eventsByStatus = {
    published: events.filter((e) => e.status === 'published'),
    full: events.filter((e) => e.status === 'full'),
    past: events.filter((e) => e.status === 'past'),
  };

  const upcomingCount = eventsByStatus.published.filter(
    (e) => new Date(e.starts_at) > new Date()
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-navy mb-2">Events</h1>
          <p className="text-gray-600">Create and manage EMA events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          + Create Event
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-forest">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Upcoming</p>
          <p className="text-4xl font-bold text-forest">{upcomingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Full</p>
          <p className="text-4xl font-bold text-yellow-600">{eventsByStatus.full.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Past</p>
          <p className="text-4xl font-bold text-gray-600">{eventsByStatus.past.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Total</p>
          <p className="text-4xl font-bold text-navy">{events.length}</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">PD</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const statusColor =
                    event.status === 'published'
                      ? 'text-green-600 bg-green-50'
                      : event.status === 'full'
                        ? 'text-yellow-600 bg-yellow-50'
                        : 'text-gray-600 bg-gray-50';

                  return (
                    <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-navy">{event.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(new Date(event.starts_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                          {event.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {event.capacity ? `${event.capacity} seats` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {event.pd_eligible ? (
                          <span className="text-green-600 font-semibold">✓</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-forest hover:text-forest-dark font-semibold text-sm"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
