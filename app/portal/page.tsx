'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const QUICK_LINKS = [
  { href: '/portal/pd-credits', icon: '📊', title: 'PD Credits', desc: 'Track your professional development' },
  { href: '/events', icon: '📅', title: 'Browse Events', desc: 'View and register for upcoming events' },
  { href: '/directory', icon: '👥', title: 'Member Directory', desc: 'Connect with other members' },
  { href: '/member-assistant', icon: '✨', title: 'AI Assistant', desc: 'Ask questions about EMA' },
  { href: '/portal/notifications', icon: '🔔', title: 'Notifications', desc: 'Manage email preferences' },
];

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
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push('/auth/login');
          return;
        }
        setUser(authUser);
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

  async function signOut() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-ink-soft">Loading your portal…</p>
      </div>
    );
  }
  if (!user) return null;

  const isAdmin = userProfile?.role === 'org_admin';

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px flex flex-col gap-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <span className="eyebrow text-sage-light">Member Portal</span>
            <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Welcome, {userProfile?.full_name || user.email}
            </h1>
          </div>
          <button onClick={signOut} className="btn btn-md border border-white/25 text-white hover:bg-white/10 self-start">
            Log Out
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card">
              <div className="text-3xl">👤</div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">Your profile</div>
              <p className="mt-1 font-semibold text-navy">{user.email}</p>
              <p className="mt-1 text-sm text-ink-soft">{isAdmin ? 'Organization Admin' : 'Member'}</p>
            </div>
            <div className="card">
              <div className="text-3xl">🏢</div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">Organization</div>
              <p className="mt-1 font-semibold text-navy">{userProfile?.organizations?.name || 'Not assigned'}</p>
              <p className="mt-1 text-sm text-ink-soft">{userProfile?.organizations?.type || '—'}</p>
            </div>
            <div className="card">
              <div className="text-3xl">📊</div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">PD credits</div>
              <p className="mt-1 font-semibold text-navy">Track learning</p>
              <Link href="/portal/pd-credits" className="link-arrow mt-1 text-sm">View credits →</Link>
            </div>
          </div>

          <h2 className="mt-14 text-2xl font-bold text-navy">Quick links</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((q) => (
              <Link key={q.href} href={q.href} className="card card-hover">
                <div className="text-2xl">{q.icon}</div>
                <h3 className="mt-3 font-bold text-navy">{q.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{q.desc}</p>
              </Link>
            ))}
            {isAdmin && (
              <Link href="/portal/org/profile" className="card card-hover">
                <div className="text-2xl">⚙️</div>
                <h3 className="mt-3 font-bold text-navy">Manage Organization</h3>
                <p className="mt-1 text-sm text-ink-soft">Org profile &amp; team settings</p>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
