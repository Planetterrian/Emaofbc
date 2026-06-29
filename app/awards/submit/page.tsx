'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { submitAward } from '@/app/actions';

const CATEGORIES = [
  'Environmental Excellence',
  'Innovation in Remediation',
  'Community Engagement',
  'Emerging Professional',
];

export default function SubmitAwardPage() {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [materialsUrl, setMaterialsUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/awards/submit');
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile?.org_id) {
      setError('You must belong to an organization to submit an award');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await submitAward({
        category,
        org_id: profile.org_id,
        submitter_user_id: profile.id,
        materials_url: materialsUrl || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-ink-soft">Loading…</p>
      </div>
    );
  }

  if (success) {
    return (
      <section className="section">
        <div className="container-px max-w-xl text-center">
          <div className="card">
            <h1 className="text-2xl font-bold text-forest">Submission received</h1>
            <p className="mt-3 text-ink-soft">Thank you! The awards committee will review your submission.</p>
            <Link href="/portal" className="btn btn-md btn-primary mt-6">Back to Portal</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-20">
          <span className="eyebrow text-sage-light">Awards</span>
          <h1 className="mt-4 text-4xl font-extrabold">Submit an award nomination</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Recognize excellence in environmental management across BC.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px max-w-2xl">
          <div className="card">
            <p className="text-sm text-ink-soft">
              Submitting as <strong>{profile?.organizations?.name || 'your organization'}</strong>
            </p>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-navy">Award category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="materials" className="mb-2 block text-sm font-semibold text-navy">
                  Supporting materials URL (optional)
                </label>
                <input
                  id="materials"
                  type="url"
                  value={materialsUrl}
                  onChange={(e) => setMaterialsUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-black/10 px-4 py-3"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn btn-lg btn-primary w-full disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit Nomination'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
