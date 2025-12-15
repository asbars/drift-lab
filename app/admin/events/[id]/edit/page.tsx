'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import EventForm from '@/components/EventForm';
import Link from 'next/link';

export default function EditEventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`);
      const data = await response.json();
      
      if (data.data) {
        // Format dates for datetime-local input
        const formattedEvent = {
          ...data.data,
          event_date: data.data.event_date ? new Date(data.data.event_date).toISOString().slice(0, 16) : '',
          event_end_date: data.data.event_end_date ? new Date(data.data.event_end_date).toISOString().slice(0, 16) : '',
          latitude: data.data.latitude?.toString() || '',
          longitude: data.data.longitude?.toString() || '',
        };
        setEvent(formattedEvent);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
              <p className="text-gray-600 mt-1">Update event details</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading event...</p>
          </div>
        ) : event ? (
          <EventForm mode="edit" event={event} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">Event not found</p>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Admin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

