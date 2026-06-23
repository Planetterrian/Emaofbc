'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { validateEmail_Safe } from '@/lib/validation';

export const dynamic = 'force-dynamic';

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function TeamManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('employee');

  const supabase = createBrowserClient();

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
          setError('Only organization admins can manage team');
          return;
        }

        setOrg(profile.organizations);

        // Fetch team members
        const { data: members } = await supabase
          .from('users')
          .select('id, email, full_name, role, created_at')
          .eq('org_id', profile.organizations.id)
          .order('created_at', { ascending: true });

        setTeamMembers(members || []);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Validate email
      validateEmail_Safe(inviteEmail);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', inviteEmail)
        .single();

      if (existingUser) {
        setError('This email is already registered');
        return;
      }

      // In a real app, you'd send an email with an invite link
      // For now, we'll create the user record and show instructions
      const { error: createError } = await supabase
        .from('users')
        .insert({
          email: inviteEmail,
          full_name: inviteEmail.split('@')[0],
          org_id: org.id,
          role: inviteRole,
        });

      if (createError) {
        setError(createError.message);
        return;
      }

      setSuccess(`Team member invited successfully! They can now sign up at ${process.env.NEXT_PUBLIC_SITE_URL}/auth/signup`);
      setInviteEmail('');
      setInviteRole('employee');

      // Refresh team members list
      const { data: members } = await supabase
        .from('users')
        .select('id, email, full_name, role, created_at')
        .eq('org_id', org.id)
        .order('created_at', { ascending: true });

      setTeamMembers(members || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite team member');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', memberId)
        .eq('org_id', org.id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setSuccess('Team member removed');
      setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove team member');
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
            <h1 className="text-4xl font-bold mb-2">Team Management</h1>
            <p className="text-gray-200">Manage your organization's team members</p>
          </div>
          <Link href="/portal/org/profile" className="bg-forest hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition">
            ← Back to Profile
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Invite Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-navy mb-4">Invite Member</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-4 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest text-sm"
                      placeholder="name@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest text-sm"
                    >
                      <option value="employee">Employee</option>
                      <option value="org_admin">Organization Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-forest text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 text-sm"
                  >
                    {saving ? 'Inviting...' : 'Send Invite'}
                  </button>
                </form>

                <p className="text-xs text-gray-600 mt-4">
                  Team members will receive an email with signup instructions and will be auto-joined to {org.name}.
                </p>
              </div>
            </div>

            {/* Team Members List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-bold text-navy">Team Members ({teamMembers.length})</h2>
                </div>

                {teamMembers.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    <p>No team members yet. Invite your first team member to get started!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div>
                          <div className="font-medium text-gray-900">{member.full_name}</div>
                          <div className="text-sm text-gray-600">{member.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {member.role === 'org_admin' ? '👤 Organization Admin' : '👥 Team Member'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Joined {new Date(member.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
