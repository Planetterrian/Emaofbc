'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { PDCredit, Event } from '@/lib/types';

interface PDCreditWithEvent extends PDCredit {
  event?: Event;
}

export default function PDCreditsPage() {
  const [credits, setCredits] = useState<PDCreditWithEvent[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const res = await fetch('/api/pd-credits');
        if (res.ok) {
          const data = await res.json();
          setCredits(data.credits || []);
          setTotalCredits(data.total || 0);
        } else if (res.status === 401) {
          setError('Please log in to view your PD credits');
        } else {
          setError('Failed to load PD credits');
        }
      } catch (err) {
        console.error('Failed to load PD credits:', err);
        setError('Failed to load PD credits');
      } finally {
        setLoading(false);
      }
    };

    loadCredits();
  }, []);

  const handleExportCSV = () => {
    if (credits.length === 0) {
      setError('No credits to export');
      return;
    }

    const headers = ['Date', 'Event', 'Credits'];
    const rows = credits.map((credit) => [
      new Date(credit.recorded_at).toLocaleDateString('en-CA'),
      credit.event?.title || 'Unknown Event',
      credit.credits.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      '',
      `Total Credits,${totalCredits}`,
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pd-credits-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">Loading your PD credits...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-navy text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link href="/portal" className="text-gray-200 hover:text-white mb-4 inline-block">
            ← Back to Portal
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Professional Development Credits</h1>
          <p className="text-xl text-gray-200">Track your attendance and credits earned</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Total Credits Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-forest">
              <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Credits Earned</p>
              <p className="text-5xl font-bold text-forest mb-2">{totalCredits.toFixed(2)}</p>
              <p className="text-sm text-gray-600">From attended events</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-forest">
              <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Attended Events</p>
              <p className="text-5xl font-bold text-navy">{credits.length}</p>
              <p className="text-sm text-gray-600">Professional development events</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Credits Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy">Credit History</h2>
              <button
                onClick={handleExportCSV}
                className="bg-forest hover:bg-forest-dark text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Export as CSV
              </button>
            </div>

            {credits.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">You haven't earned any PD credits yet.</p>
                <Link href="/events" className="text-forest hover:text-forest-dark font-semibold">
                  Browse Events →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Event</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credits.map((credit) => (
                      <tr key={credit.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-navy">
                            {new Date(credit.recorded_at).toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700">{credit.event?.title || 'Unknown Event'}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-block bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full">
                            {credit.credits.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-navy mb-4">About PD Credits</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Earn 1 credit for each PD-eligible event you attend</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Credits are recorded upon attendance confirmation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Export your credit history as CSV for your records</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>PD credits are tracked for professional development purposes</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
