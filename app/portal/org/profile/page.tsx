'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { validateString } from '@/lib/validation';

export default function OrgProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [directoryOptIn, setDirectoryOptIn] = useState(false);

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
          setError('Only organization admins can edit profile');
          return;
        }

        setOrg(profile.organizations);
        setName(profile.organizations.name || '');
        setType(profile.organizations.type || '');
        setEmail(profile.organizations.email_domain || '');
        setWebsite(profile.organizations.website || '');
        setAddress(profile.organizations.address || '');
        setDirectoryOptIn(profile.organizations.directory_opt_in || false);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Validate inputs
      validateString(name, 'Organization name', { min: 2, max: 100 });
      validateString(website, 'Website', { max: 255 });
      validateString(address, 'Address', { max: 500 });

      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          name,
          website: website || null,
          address: address || null,
          directory_opt_in: directoryOptIn,
          updated_at: new Date().toISOString(),
        })
        .eq('id', org.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess('Organization profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
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
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Organization Profile</h1>
          <p className="text-gray-200">Manage your organization's information</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Organization Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              {/* Organization Type (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Type
                </label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  <span className="capitalize text-gray-700 font-medium">
                    {type.replace(/_/g, ' ')}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">Contact support to change organization type</p>
                </div>
              </div>

              {/* Email Domain (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Domain
                </label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  <span className="text-gray-700 font-medium">{email}</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Employees with this domain are auto-associated
                  </p>
                </div>
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, city, province"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              {/* Directory Opt-in */}
              <div className="flex items-start gap-3">
                <input
                  id="directoryOptIn"
                  type="checkbox"
                  checked={directoryOptIn}
                  onChange={(e) => setDirectoryOptIn(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <label htmlFor="directoryOptIn" className="text-sm text-gray-700">
                  <span className="font-medium">List in Member Directory</span>
                  <p className="text-gray-600 mt-1">
                    Allow other members to find your organization in our public directory
                  </p>
                </label>
              </div>

              {/* Membership Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-navy mb-2">Current Membership</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium capitalize">{org.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Through:</span>
                    <span className="font-medium">
                      {org.paid_through
                        ? new Date(org.paid_through).toLocaleDateString()
                        : 'Not active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-forest text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {/* Quick Links */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold text-navy mb-4">Organization Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/portal/org/team"
                  className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-forest transition"
                >
                  <div className="font-medium text-navy">Manage Team</div>
                  <div className="text-sm text-gray-600">Add and manage your team members</div>
                </Link>

                <Link
                  href="/portal/org/billing"
                  className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-forest transition"
                >
                  <div className="font-medium text-navy">Billing History</div>
                  <div className="text-sm text-gray-600">View invoices and payment history</div>
                </Link>

                <Link
                  href="/portal/org/members"
                  className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-forest transition"
                >
                  <div className="font-medium text-navy">Organization Members</div>
                  <div className="text-sm text-gray-600">View all registered members from your org</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
