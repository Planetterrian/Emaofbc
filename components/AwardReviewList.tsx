'use client';

import { useState } from 'react';
import { updateAwardStatus } from '@/app/actions';

interface AwardRow {
  id: string;
  category: string;
  status: string;
  created_at: string;
  organizations?: { name: string };
}

export function AwardReviewList({ awards }: { awards: AwardRow[] }) {
  const [items, setItems] = useState(awards);
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await updateAwardStatus(id, status);
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Organization</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Submitted</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                No submissions awaiting review
              </td>
            </tr>
          ) : (
            items.map((award) => (
              <tr key={award.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-navy">{award.category}</td>
                <td className="px-6 py-4">{award.organizations?.name || 'Unknown'}</td>
                <td className="px-6 py-4">
                  {new Date(award.created_at).toLocaleDateString('en-CA')}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {['under_review', 'shortlisted', 'decided'].map((status) => (
                    <button
                      key={status}
                      disabled={updating === award.id}
                      onClick={() => handleStatus(award.id, status)}
                      className="text-sm font-semibold text-forest hover:underline disabled:opacity-50"
                    >
                      {status.replace(/_/g, ' ')}
                    </button>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
