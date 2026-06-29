export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase';
import { formatDate } from 'date-fns';

export default async function RenewalsPage() {
  const supabase = createServiceRoleClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: memberships } = await supabase
    .from('memberships')
    .select('*, organizations(*)')
    .lte('period_end', today)
    .order('period_end', { ascending: true });

  const due = memberships || [];

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/memberships" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Memberships
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Renewals Due</h1>
        <p className="text-gray-600">{due.length} memberships need renewal attention</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Expired</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {due.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                  No renewals due — all memberships are current
                </td>
              </tr>
            ) : (
              due.map((m: any) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-navy">{m.organizations?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{m.tier.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4">{formatDate(new Date(m.period_end), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      Renewal due
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
