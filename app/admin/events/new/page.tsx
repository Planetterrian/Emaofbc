import Link from 'next/link';
import { EventForm } from '@/components/EventForm';

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/events" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Events
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Create Event</h1>
        <p className="text-gray-600">Add a new event with optional AI-generated copy</p>
      </div>
      <div className="bg-white rounded-lg shadow p-8">
        <EventForm mode="create" />
      </div>
    </div>
  );
}
