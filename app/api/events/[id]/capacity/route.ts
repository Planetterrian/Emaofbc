import { NextRequest, NextResponse } from 'next/server';
import { getEventById, getRegistrationCount } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!event.capacity) {
      return NextResponse.json({ isFull: false, remaining: null });
    }

    const registrationCount = await getRegistrationCount(id);
    const isFull = registrationCount >= event.capacity;
    const remaining = event.capacity - registrationCount;

    return NextResponse.json({ isFull, remaining, capacity: event.capacity, registrations: registrationCount });
  } catch (error) {
    console.error('Capacity check failed:', error);
    return NextResponse.json({ isFull: false, remaining: null });
  }
}
