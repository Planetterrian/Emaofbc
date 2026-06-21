export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getActiveOrganizations } from '@/lib/db';

export default async function DirectoryPage() {
  const orgs = await getActiveOrganizations();

  const directedOrgs = orgs.filter((o) => o.directory_opt_in);
  const optedOutOrgs = orgs.filter((o) => !o.directory_opt_in);

  const orgsByType = {
    corporate: orgs.filter((o) => o.type === 'corporate'),
    sole_proprietor: orgs.filter((o) => o.type === 'sole_proprietor'),
    ngo: orgs.filter((o) => o.type === 'ngo'),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-navy mb-2">Directory</h1>
          <p className="text-gray-600">Manage member directory and approvals</p>
        </div>
        <Link
          href="/admin/directory/pending"
          className="bg-forest hover:bg-forest-dark text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Pending Approvals
        </Link>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-forest">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Listed</p>
          <p className="text-4xl font-bold text-forest">{directedOrgs.length}</p>
          <p className="text-xs text-gray-500 mt-2">In public directory</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Not Listed</p>
          <p className="text-4xl font-bold text-gray-600">{optedOutOrgs.length}</p>
          <p className="text-xs text-gray-500 mt-2">Private members</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Corporate</p>
          <p className="text-4xl font-bold text-navy">{orgsByType.corporate.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">NGO/SP</p>
          <p className="text-4xl font-bold text-navy">
            {orgsByType.ngo.length + orgsByType.sole_proprietor.length}
          </p>
        </div>
      </div>

      {/* Listed Organizations */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-navy">Listed in Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Focus</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Website</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {directedOrgs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                    No organizations listed in directory
                  </td>
                </tr>
              ) : (
                directedOrgs.map((org) => (
                  <tr key={org.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-navy">{org.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                        {org.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{org.focus || '—'}</td>
                    <td className="px-6 py-4">
                      {org.website ? (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-forest hover:text-forest-dark text-sm"
                        >
                          Visit →
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/directory/${org.id}/edit`}
                        className="text-forest hover:text-forest-dark font-semibold text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Private Members */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-navy">Private Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {optedOutOrgs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                    All members are listed in directory
                  </td>
                </tr>
              ) : (
                optedOutOrgs.map((org) => (
                  <tr key={org.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-navy">{org.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                        {org.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        Private
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/directory/${org.id}/edit`}
                        className="text-forest hover:text-forest-dark font-semibold text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
