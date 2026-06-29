'use client';

import { useState } from 'react';
import { saveContent } from '@/app/actions';
import type { Content } from '@/lib/types';

export function ContentEditor({ items }: { items: Content[] }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'post' | 'recap' | 'archive'>('post');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function loadItem(item: Content) {
    setEditingId(item.id);
    setTitle(item.title);
    setBody(item.body || '');
    setType(item.type);
  }

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setBody('');
    setType('post');
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await saveContent({ id: editingId || undefined, type, title, body, publish });
      setSuccess(publish ? 'Published successfully' : 'Draft saved');
      resetForm();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-navy mb-4">
          {editingId ? 'Edit Content' : 'New Content'}
        </h2>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value="post">News Post</option>
              <option value="recap">Event Recap</option>
              <option value="archive">Archive</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Body (Markdown)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving || !title}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving || !title}
              className="bg-forest hover:bg-forest-dark text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Publish
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-600 hover:underline">
                Cancel edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-navy mb-4">Existing Content</h2>
        <ul className="space-y-3">
          {items.length === 0 ? (
            <li className="text-gray-600">No content yet</li>
          ) : (
            items.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.type} · {item.published_at ? 'Published' : 'Draft'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadItem(item)}
                  className="text-sm font-semibold text-forest hover:underline"
                >
                  Edit
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
