'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateEventCopy } from '@/app/actions';
import type { Event, EventStatus, EventType } from '@/lib/types';

const EVENT_TYPES: EventType[] = ['monthly_session', 'workshop', 'tour', 'golf', 'gala'];
const STATUSES: EventStatus[] = ['draft', 'published', 'full', 'past'];

interface EventFormProps {
  event?: Event;
  mode: 'create' | 'edit';
}

export function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    type: (event?.type || 'monthly_session') as EventType,
    title: event?.title || '',
    description: event?.description || '',
    speaker: event?.speaker || '',
    venue: event?.venue || '',
    starts_at: event?.starts_at ? new Date(event.starts_at).toISOString().slice(0, 16) : '',
    capacity: event?.capacity?.toString() || '',
    member_price_cents: event?.member_price_cents != null ? (event.member_price_cents / 100).toString() : '',
    nonmember_price_cents:
      event?.nonmember_price_cents != null ? (event.nonmember_price_cents / 100).toString() : '',
    pd_eligible: event?.pd_eligible ?? false,
    status: (event?.status || 'draft') as EventStatus,
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleGenerateCopy() {
    if (!form.title.trim()) {
      setError('Enter a title before generating copy');
      return;
    }
    setGenerating(true);
    setError('');
    try {
      const copy = await generateEventCopy(form.title, form.description, form.type);
      update('description', copy);
    } catch {
      setError('Failed to generate copy');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      type: form.type,
      title: form.title,
      description: form.description || undefined,
      speaker: form.speaker || undefined,
      venue: form.venue || undefined,
      starts_at: new Date(form.starts_at).toISOString(),
      capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
      member_price_cents: form.member_price_cents
        ? Math.round(parseFloat(form.member_price_cents) * 100)
        : 0,
      nonmember_price_cents: form.nonmember_price_cents
        ? Math.round(parseFloat(form.nonmember_price_cents) * 100)
        : 0,
      pd_eligible: form.pd_eligible,
      status: form.status,
    };

    try {
      const { createEvent, updateEvent } = await import('@/app/actions');
      if (mode === 'create') {
        const created = await createEvent(payload);
        router.push(`/admin/events/${created.id}/edit`);
      } else if (event) {
        await updateEvent(event.id, payload);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Type</label>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Date &amp; Time *</label>
          <input
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => update('starts_at', e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Venue</label>
          <input
            type="text"
            value={form.venue}
            onChange={(e) => update('venue', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Speaker</label>
          <input
            type="text"
            value={form.speaker}
            onChange={(e) => update('speaker', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Capacity</label>
          <input
            type="number"
            value={form.capacity}
            onChange={(e) => update('capacity', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Member Price (CAD)</label>
          <input
            type="number"
            step="0.01"
            value={form.member_price_cents}
            onChange={(e) => update('member_price_cents', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Non-Member Price (CAD)</label>
          <input
            type="number"
            step="0.01"
            value={form.nonmember_price_cents}
            onChange={(e) => update('nonmember_price_cents', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Status</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-8">
          <input
            id="pd_eligible"
            type="checkbox"
            checked={form.pd_eligible}
            onChange={(e) => update('pd_eligible', e.target.checked)}
            className="h-4 w-4 accent-forest"
          />
          <label htmlFor="pd_eligible" className="text-sm font-semibold text-gray-700">
            PD eligible
          </label>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <button
            type="button"
            onClick={handleGenerateCopy}
            disabled={generating}
            className="text-sm font-semibold text-forest hover:underline disabled:opacity-50"
          >
            {generating ? 'Generating…' : '✨ Generate with AI'}
          </button>
        </div>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-forest hover:bg-forest-dark text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving…' : mode === 'create' ? 'Create Event' : 'Save Changes'}
        </button>
        <Link href="/admin/events" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
