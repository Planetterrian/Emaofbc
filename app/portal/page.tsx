import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Portal | EMA of BC',
  description: 'EMA of BC member portal for organizations and employees.',
};

export default function PortalPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Member Portal</h1>
            <p className="text-xl text-gray-200">Manage your organization and membership</p>
          </div>
          <Link
            href="/join"
            className="bg-forest hover:bg-forest-dark text-white px-6 py-3 rounded-lg font-semibold transition hidden md:inline-block"
          >
            Renew →
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            {/* Dashboard Cards */}
            <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-forest rounded-lg p-6">
                <div className="text-4xl font-bold text-forest mb-2">—</div>
                <div className="text-sm font-semibold text-gray-600 uppercase">Status</div>
                <p className="text-navy font-semibold mt-1">Member Portal</p>
                <p className="text-xs text-gray-600 mt-2">Coming in Phase 2</p>
              </div>

              <div className="bg-white border-2 border-forest rounded-lg p-6">
                <div className="text-4xl font-bold text-forest mb-2">—</div>
                <div className="text-sm font-semibold text-gray-600 uppercase">Membership</div>
                <p className="text-navy font-semibold mt-1">Organization Management</p>
                <p className="text-xs text-gray-600 mt-2">Profile, billing, team</p>
              </div>

              <div className="bg-white border-2 border-forest rounded-lg p-6">
                <div className="text-4xl font-bold text-forest mb-2">—</div>
                <div className="text-sm font-semibold text-gray-600 uppercase">Events</div>
                <p className="text-navy font-semibold mt-1">Registrations & PD</p>
                <p className="text-xs text-gray-600 mt-2">View credits & history</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="md:col-span-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-navy mb-4">Member Portal Coming Soon</h2>
              <p className="text-gray-700 mb-4">
                We're building a comprehensive member portal where you can:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Manage your organization's membership and billing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Update your profile and directory listing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Invite and manage employees</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Register employees for events</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Track professional development credits</span>
                </li>
              </ul>
              <p className="text-gray-700">
                In the meantime, please contact{' '}
                <a href="mailto:membership@emaofbc.com" className="text-forest hover:text-forest-dark font-semibold">
                  membership@emaofbc.com
                </a>{' '}
                for assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link
              href="/events"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-bold text-navy">Browse Events</h3>
              <p className="text-sm text-gray-600 mt-1">View and register for upcoming events</p>
            </Link>

            <Link
              href="/directory"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-bold text-navy">Member Directory</h3>
              <p className="text-sm text-gray-600 mt-1">Connect with other members</p>
            </Link>

            <Link
              href="/about"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">ℹ️</div>
              <h3 className="font-bold text-navy">Member Benefits</h3>
              <p className="text-sm text-gray-600 mt-1">Learn what's included in your membership</p>
            </Link>

            <Link
              href="/contact"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-bold text-navy">Contact Us</h3>
              <p className="text-sm text-gray-600 mt-1">Reach out with questions</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
