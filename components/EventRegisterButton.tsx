'use client';

import Link from 'next/link';

interface EventRegisterButtonProps {
  eventId: string;
  isPast: boolean;
  isFull: boolean;
}

export function EventRegisterButton({ eventId, isPast, isFull }: EventRegisterButtonProps) {
  if (isPast) {
    return (
      <span className="block w-full rounded-lg bg-gray-200 py-3 px-4 text-center font-bold text-gray-600">
        Event Passed
      </span>
    );
  }

  if (isFull) {
    return (
      <span className="block w-full rounded-lg bg-yellow-100 py-3 px-4 text-center font-bold text-yellow-800">
        Event Full — Contact Us
      </span>
    );
  }

  return (
    <Link
      href={`/events/${eventId}/register`}
      className="block w-full bg-forest hover:bg-forest-dark text-white font-bold py-3 px-4 rounded-lg transition text-center"
    >
      Register Now
    </Link>
  );
}
