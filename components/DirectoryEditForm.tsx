'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateOrganizationDirectory } from '@/app/actions';
import type { Organization } from '@/lib/types';

export function DirectoryEditForm({ org }: { org: Organization }) {
  const router = useRouter();
  const [form, setForm] = useState({
    focus: org.focus || '',
    website: org.website || '',
    logo_url: org.logo_url || '',
    directory_opt_in: org.directory_opt_in,
    status: org.status,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateOrganizationDirectory(org.id, form);
      router.push('/admin/directory');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Focus / Description</label>
        <textarea
          value={form.focus}
          onChange={(e) => setForm({ ...form, focus: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Website</label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Logo URL</label>
        <input
          type="url"
          value={form.logo_url}
          onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="directory_opt_in"
          type="checkbox"
          checked={form.directory_opt_in}
          onChange={(e) => setForm({ ...form, directory_opt_in: e.target.checked })}
          className="h-4 w-4 accent-forest"
        />
        <label htmlFor="directory_opt_in" className="text-sm font-semibold text-gray-700">
          Listed in public directory
        </label>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as Organization['status'] })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="lapsed">Lapsed</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-forest hover:bg-forest-dark text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <Link href="/admin/directory" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
