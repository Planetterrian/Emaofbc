import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/db';
import { EventForm } from '@/components/EventForm';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/events" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Events
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Edit Event</h1>
        <p className="text-gray-600">{event.title}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-8">
        <EventForm event={event} mode="edit" />
      </div>
    </div>
  );
}
