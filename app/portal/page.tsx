'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function PortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/auth/login');
          return;
        }

        setUser(authUser);

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*, organizations(*)')
          .eq('id', authUser.id)
          .single();

        setUserProfile(profile);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main>
      {/* Header */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Member Portal</h1>
            <p className="text-xl text-gray-200">
              Welcome, {userProfile?.full_name || user.email}
            </p>
          </div>
          <button
            onClick={async () => {
              const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || '',
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
              );
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Log Out
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            {/* Dashboard Cards */}
            <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-forest rounded-lg p-6">
                <div className="text-4xl font-bold text-forest mb-2">👤</div>
                <div className="text-sm font-semibold text-gray-600 uppercase">Your Profile</div>
                <p className="text-navy font-semibold mt-1">{user.email}</p>
                <p className="text-xs text-gray-600 mt-2">
                  {userProfile?.role === 'org_admin' ? 'Organization Admin' : 'Member'}
                </p>
              </div>

              <div className="bg-white border-2 border-forest rounded-lg p-6">
                <div className="text-4xl font-bold text-forest mb-2">🏢</div>
                <div className="text-sm font-semibold text-gray-600 uppercase">Organization</div>
                <p className="text-navy font-semibold mt-1">
                  {userProfile?.organizations?.name || 'Not assigned'}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {userProfile?.organizations?.type || '—'}
                </p>
              </div>

              <div className="bg-white border-2 border-forest rounded-lg p-6">
                <div className="text-4xl font-bold text-forest mb-2">📊</div>
                <div className="text-sm font-semibold text-gray-600 uppercase">PD Credits</div>
                <p className="text-navy font-semibold mt-1">Track Learning</p>
                <p className="text-xs text-gray-600 mt-2">View your professional development</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="md:col-span-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-navy mb-4">Welcome to Your Portal</h2>
              <p className="text-gray-700 mb-4">
                You now have access to all member features:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>View and manage your member profile</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Register for events at member pricing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Track professional development credits</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Browse the member directory</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Ask questions in the member assistant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link
              href="/portal/pd-credits"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold text-navy">PD Credits</h3>
              <p className="text-sm text-gray-600 mt-1">Track your professional development</p>
            </Link>

            <Link
              href="/events"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-bold text-navy">Browse Events</h3>
              <p className="text-sm text-gray-600 mt-1">View and register for upcoming events</p>
            </Link>

            <Link
              href="/directory"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-bold text-navy">Member Directory</h3>
              <p className="text-sm text-gray-600 mt-1">Connect with other members</p>
            </Link>

            <Link
              href="/member-assistant"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-forest transition"
            >
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-bold text-navy">Member Assistant</h3>
              <p className="text-sm text-gray-600 mt-1">Ask questions about EMA</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
