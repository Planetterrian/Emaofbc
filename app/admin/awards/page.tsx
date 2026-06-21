export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase';
import type { Award, Organization } from '@/lib/types';

interface AwardWithOrg extends Award {
  organizations?: Organization;
}

export default async function AwardsPage() {
  let awards: AwardWithOrg[] = [];
  let error = '';

  try {
    const supabase = createServiceRoleClient();
    const { data, error: dbError } = await supabase
      .from('awards')
      .select('*, organizations(*)')
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;
    awards = data || [];
  } catch (err) {
    error = 'Failed to load awards';
    console.error(err);
  }

  const awardsByStatus = {
    submitted: awards.filter((a) => a.status === 'submitted'),
    under_review: awards.filter((a) => a.status === 'under_review'),
    shortlisted: awards.filter((a) => a.status === 'shortlisted'),
    decided: awards.filter((a) => a.status === 'decided'),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-navy mb-2">Awards Pipeline</h1>
          <p className="text-gray-600">Manage award submissions and review process</p>
        </div>
        <Link
          href="/admin/awards/review"
          className="bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Review Submissions ({awardsByStatus.submitted.length})
        </Link>
      </div>

      {/* Pipeline Status */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Submitted</p>
          <p className="text-4xl font-bold text-blue-600">{awardsByStatus.submitted.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Under Review</p>
          <p className="text-4xl font-bold text-yellow-600">{awardsByStatus.under_review.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Shortlisted</p>
          <p className="text-4xl font-bold text-orange-600">{awardsByStatus.shortlisted.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Decided</p>
          <p className="text-4xl font-bold text-green-600">{awardsByStatus.decided.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Awards Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Materials</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    No awards found
                  </td>
                </tr>
              ) : (
                awards.map((award) => {
                  const statusColor =
                    award.status === 'submitted'
                      ? 'text-blue-600 bg-blue-50'
                      : award.status === 'under_review'
                        ? 'text-yellow-600 bg-yellow-50'
                        : award.status === 'shortlisted'
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-green-600 bg-green-50';

                  return (
                    <tr key={award.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-navy">{award.category}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(award.organizations as any)?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(award.created_at).toLocaleDateString('en-CA')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          {award.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {award.materials_url ? (
                          <a
                            href={award.materials_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-forest hover:text-forest-dark font-semibold text-sm"
                          >
                            View →
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/awards/${award.id}`}
                          className="text-forest hover:text-forest-dark font-semibold text-sm"
                        >
                          Review
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
