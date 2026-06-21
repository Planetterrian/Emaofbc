export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase';
import type { Sponsorship, Event, Organization } from '@/lib/types';

interface SponsorshipWithDetails extends Sponsorship {
  events?: Event;
  organizations?: Organization;
}

export default async function SponsorshipsPage() {
  let sponsorships: SponsorshipWithDetails[] = [];
  let error = '';

  try {
    const supabase = createServiceRoleClient();
    const { data, error: dbError } = await supabase
      .from('sponsorships')
      .select('*, events(*), organizations(*)')
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;
    sponsorships = data || [];
  } catch (err) {
    error = 'Failed to load sponsorships';
    console.error(err);
  }

  const paidSponsors = sponsorships.filter((s) => s.payment_status === 'paid').length;
  const unpaidSponsors = sponsorships.filter((s) => s.payment_status === 'unpaid').length;
  const totalRevenue = sponsorships
    .filter((s) => s.payment_status === 'paid')
    .reduce((sum, s) => sum + s.amount_cents, 0);

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold text-navy mb-2">Sponsorships</h1>
        <p className="text-gray-600 mb-8">Manage event sponsorships and payments</p>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Paid</p>
          <p className="text-4xl font-bold text-green-600">{paidSponsors}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Unpaid</p>
          <p className="text-4xl font-bold text-red-600">{unpaidSponsors}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-forest">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Revenue</p>
          <p className="text-4xl font-bold text-forest">${(totalRevenue / 100).toFixed(0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Total</p>
          <p className="text-4xl font-bold text-navy">{sponsorships.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Sponsorships Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Event</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Sponsor</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Placement</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    No sponsorships found
                  </td>
                </tr>
              ) : (
                sponsorships.map((sponsorship) => {
                  const paymentColor =
                    sponsorship.payment_status === 'paid'
                      ? 'text-green-600 bg-green-50'
                      : sponsorship.payment_status === 'unpaid'
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-600 bg-gray-50';

                  const placementColor =
                    sponsorship.placement_status === 'placed'
                      ? 'text-green-600 bg-green-50'
                      : sponsorship.placement_status === 'pending'
                        ? 'text-yellow-600 bg-yellow-50'
                        : 'text-red-600 bg-red-50';

                  return (
                    <tr key={sponsorship.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-navy">{(sponsorship.events as any)?.title || 'Unknown'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(sponsorship.organizations as any)?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded capitalize">
                          {sponsorship.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-navy font-semibold">
                        ${(sponsorship.amount_cents / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${paymentColor}`}
                        >
                          {sponsorship.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${placementColor}`}
                        >
                          {sponsorship.placement_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/sponsorships/${sponsorship.id}`}
                          className="text-forest hover:text-forest-dark font-semibold text-sm"
                        >
                          Manage
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
