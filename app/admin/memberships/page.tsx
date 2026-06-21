export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase';
import type { Membership, Organization } from '@/lib/types';

interface MembershipWithOrg extends Membership {
  organizations?: Organization;
}

export default async function MembershipsPage() {
  let memberships: MembershipWithOrg[] = [];
  let error = '';

  try {
    const supabase = createServiceRoleClient();
    const { data, error: dbError } = await supabase
      .from('memberships')
      .select('*, organizations(*)')
      .order('period_end', { ascending: true });

    if (dbError) throw dbError;
    memberships = data || [];
  } catch (err) {
    error = 'Failed to load memberships';
    console.error(err);
  }

  const today = new Date().toISOString().split('T')[0];
  const paidCount = memberships.filter((m) => m.status === 'paid').length;
  const renewalDueCount = memberships.filter((m) => m.period_end < today).length;

  const membershipsByStatus = {
    paid: memberships.filter((m) => m.status === 'paid'),
    unpaid: memberships.filter((m) => m.status === 'unpaid'),
    prorated: memberships.filter((m) => m.status === 'prorated'),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-navy mb-2">Memberships</h1>
          <p className="text-gray-600">Manage organization memberships and renewals</p>
        </div>
        <Link
          href="/admin/memberships/renewals"
          className="bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Renewals Due ({renewalDueCount})
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Paid</p>
          <p className="text-4xl font-bold text-green-600">{paidCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Prorated</p>
          <p className="text-4xl font-bold text-yellow-600">{membershipsByStatus.prorated.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Unpaid</p>
          <p className="text-4xl font-bold text-red-600">{membershipsByStatus.unpaid.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Memberships Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    No memberships found
                  </td>
                </tr>
              ) : (
                memberships.map((membership) => {
                  const isRenewalDue = membership.period_end < today;
                  const statusColor =
                    membership.status === 'paid'
                      ? 'text-green-600 bg-green-50'
                      : membership.status === 'unpaid'
                        ? 'text-red-600 bg-red-50'
                        : 'text-yellow-600 bg-yellow-50';

                  return (
                    <tr
                      key={membership.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition ${isRenewalDue ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-navy">
                          {(membership.organizations as any)?.name || 'Unknown'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                          {membership.tier.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-navy font-semibold">
                        ${(membership.amount_cents / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(membership.period_start).toLocaleDateString('en-CA')} →{' '}
                        {new Date(membership.period_end).toLocaleDateString('en-CA')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          {membership.status}
                          {isRenewalDue && ' ⚠️'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/memberships/${membership.id}`}
                          className="text-forest hover:text-forest-dark font-semibold text-sm"
                        >
                          View
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
