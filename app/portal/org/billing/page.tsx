'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface Invoice {
  id: string;
  period_start: string;
  period_end: string;
  amount_cents: number;
  tier: string;
  status: 'paid' | 'unpaid' | 'prorated';
  stripe_ref: string;
  created_at: string;
}

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState('');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/auth/login');
          return;
        }

        setUser(authUser);

        // Fetch user profile and org
        const { data: profile } = await supabase
          .from('users')
          .select('*, organizations(*)')
          .eq('id', authUser.id)
          .single();

        if (!profile?.organizations) {
          setError('You are not associated with an organization');
          return;
        }

        if (profile.role !== 'org_admin') {
          setError('Only organization admins can view billing');
          return;
        }

        setOrg(profile.organizations);

        // Fetch membership history (invoices)
        const { data: memberships } = await supabase
          .from('memberships')
          .select('*')
          .eq('org_id', profile.organizations.id)
          .order('created_at', { ascending: false });

        setInvoices(memberships || []);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Paid</span>;
      case 'unpaid':
        return <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Unpaid</span>;
      case 'prorated':
        return <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Prorated</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || !org) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Billing & Invoices</h1>
            <p className="text-gray-200">View your organization's payment history</p>
          </div>
          <Link href="/portal/org/profile" className="bg-forest hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition">
            ← Back to Profile
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Billing Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-navy mb-4">Current Status</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Membership Status</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{org.status}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Paid Through</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {org.paid_through
                      ? new Date(org.paid_through).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not active'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Invoices</div>
                  <div className="text-lg font-semibold text-gray-900">{invoices.length}</div>
                </div>
              </div>
            </div>

            {/* Renewal */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-navy mb-4">Renew Membership</h2>
              <p className="text-gray-700 mb-4">
                Renew your membership to continue enjoying all the benefits of EMA of BC.
              </p>
              <Link
                href="/join"
                className="inline-block bg-forest text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                Renew Now
              </Link>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-navy">Invoice History</h2>
            </div>

            {invoices.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                <p>No invoices found. Your membership will appear here once activated.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Period</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tier</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(invoice.period_start).toLocaleDateString('en-CA')} -{' '}
                          {new Date(invoice.period_end).toLocaleDateString('en-CA')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                          {invoice.tier.replace(/_/g, ' ')}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(invoice.amount_cents)}
                        </td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(invoice.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(invoice.created_at).toLocaleDateString('en-CA')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {invoice.stripe_ref ? (
                            <a
                              href={`https://dashboard.stripe.com/test/payments/${invoice.stripe_ref}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-forest hover:text-forest-dark font-medium transition"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Support */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-navy mb-2">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              If you have questions about your billing or invoices, please contact our membership team:
            </p>
            <a
              href="mailto:membership@emaofbc.com"
              className="text-forest hover:text-forest-dark font-semibold transition"
            >
              membership@emaofbc.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
