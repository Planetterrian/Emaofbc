'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface Member {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function OrgMembersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

        setOrg(profile.organizations);

        // Fetch all organization members
        const { data: orgMembers } = await supabase
          .from('users')
          .select('id, email, full_name, role, created_at')
          .eq('org_id', profile.organizations.id)
          .order('created_at', { ascending: false });

        setMembers(orgMembers || []);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const filteredMembers = members.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'org_admin':
        return 'bg-purple-100 text-purple-800';
      case 'board':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'org_admin':
        return 'Organization Admin';
      case 'board':
        return 'Board Member';
      case 'ed_admin':
        return 'ED Admin';
      default:
        return 'Team Member';
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
            <h1 className="text-4xl font-bold mb-2">Organization Members</h1>
            <p className="text-gray-200">All members from {org.name}</p>
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

          {/* Search and Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-navy">Members ({filteredMembers.length})</h2>
              <Link
                href="/portal/org/team"
                className="text-forest hover:text-forest-dark font-semibold transition"
              >
                Manage Team →
              </Link>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          {/* Members Grid */}
          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {searchTerm ? (
                <p className="text-gray-600">No members found matching "{searchTerm}"</p>
              ) : (
                <p className="text-gray-600">No members in your organization yet</p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-navy mb-1">
                        {member.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getRoleColor(member.role)}`}>
                      {getRoleLabel(member.role)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Joined{' '}
                      {new Date(member.created_at).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {filteredMembers.length > 0 && (
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-forest mb-2">
                  {members.filter((m) => m.role === 'org_admin').length}
                </div>
                <div className="text-sm text-gray-600">Organization Admins</div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-forest mb-2">
                  {members.filter((m) => m.role === 'employee').length}
                </div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-forest mb-2">
                  {members.length}
                </div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
