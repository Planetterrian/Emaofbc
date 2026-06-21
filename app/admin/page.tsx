import Link from 'next/link';
import { getActiveOrganizations, getPublishedEvents } from '@/lib/db';

export default async function AdminDashboard() {
  const [orgs, events] = await Promise.all([getActiveOrganizations(), getPublishedEvents()]);

  // Calculate KPIs
  const activeMembers = orgs.filter((org) => org.status === 'active').length;
  const upcomingEvents = events.filter((e) => {
    const eventDate = new Date(e.starts_at);
    return eventDate > new Date() && e.status !== 'full';
  }).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-CA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-forest">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Active Members</p>
          <p className="text-4xl font-bold text-forest mb-2">{activeMembers}</p>
          <p className="text-xs text-gray-500">Organizations with active memberships</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-forest">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Upcoming Events</p>
          <p className="text-4xl font-bold text-forest mb-2">{upcomingEvents}</p>
          <p className="text-xs text-gray-500">Events not yet full or past</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">All Events</p>
          <p className="text-4xl font-bold text-navy mb-2">{events.length}</p>
          <p className="text-xs text-gray-500">Published events</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Organizations</p>
          <p className="text-4xl font-bold text-navy mb-2">{orgs.length}</p>
          <p className="text-xs text-gray-500">Active + inactive orgs</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Event Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-4">Event Management</h2>
          <p className="text-gray-600 text-sm mb-6">
            Create, edit, and manage EMA events. Draft event copy with AI assistance.
          </p>
          <div className="space-y-3">
            <Link
              href="/admin/events/new"
              className="block w-full bg-forest hover:bg-forest-dark text-white font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              + Create Event
            </Link>
            <Link
              href="/admin/events"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              View All Events
            </Link>
          </div>
        </div>

        {/* Membership Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-4">Membership Management</h2>
          <p className="text-gray-600 text-sm mb-6">
            Track membership renewals and send automated reminders to members.
          </p>
          <div className="space-y-3">
            <Link
              href="/admin/memberships/renewals"
              className="block w-full bg-forest hover:bg-forest-dark text-white font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              View Renewals Due
            </Link>
            <Link
              href="/admin/memberships"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              All Memberships
            </Link>
          </div>
        </div>

        {/* Awards Pipeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-4">Awards Pipeline</h2>
          <p className="text-gray-600 text-sm mb-6">
            Review and manage award submissions through the selection process.
          </p>
          <div className="space-y-3">
            <Link
              href="/admin/awards/review"
              className="block w-full bg-forest hover:bg-forest-dark text-white font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              Review Submissions
            </Link>
            <Link
              href="/admin/awards"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              All Awards
            </Link>
          </div>
        </div>

        {/* Directory & Approvals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-4">Directory & Approvals</h2>
          <p className="text-gray-600 text-sm mb-6">
            Manage organization directory listings and approve new members.
          </p>
          <div className="space-y-3">
            <Link
              href="/admin/directory/pending"
              className="block w-full bg-forest hover:bg-forest-dark text-white font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              Pending Approvals
            </Link>
            <Link
              href="/admin/directory"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-lg transition text-center"
            >
              Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-navy mb-4">System Information</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900 mb-1">Database Status</p>
            <p className="text-green-600 font-semibold">✓ Connected</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Stripe Integration</p>
            <p className="text-green-600 font-semibold">✓ Test Mode Active</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Email Service</p>
            <p className="text-green-600 font-semibold">✓ Resend Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
