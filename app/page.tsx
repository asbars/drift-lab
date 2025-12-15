'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  event_end_date: string | null;
  location: string;
  venue: string | null;
  city: string;
  country: string;
  price: string | null;
  organizer: string | null;
  event_type: string | null;
  is_active: boolean;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    country: '',
    city: ''
  });

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.country) params.append('country', filter.country);
      if (filter.city) params.append('city', filter.city);

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();
      setEvents(data.data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const countries = Array.from(new Set(events.map(e => e.country))).sort();
  const cities = Array.from(new Set(events.filter(e => !filter.country || e.country === filter.country).map(e => e.city))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧪 DriftLab</h1>
              <p className="text-gray-600 mt-1">Testing Environment for Drift Event Management</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={filter.country}
                onChange={(e) => setFilter({ ...filter, country: e.target.value, city: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={filter.city}
                onChange={(e) => setFilter({ ...filter, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!filter.country}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Drift Events ({events.length})
            </h2>
            <button
              onClick={loadEvents}
              className="text-blue-600 hover:text-blue-700"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600 text-lg">No events found</p>
              <Link
                href="/admin"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700"
              >
                Add your first event →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="text-center min-w-[80px]">
                          <div className="text-3xl font-bold text-blue-600">
                            {new Date(event.event_date).getDate()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {event.name}
                          </h3>
                          {event.description && (
                            <p className="text-gray-600 mb-3">{event.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span>📍</span>
                              <span>{event.city}, {event.country}</span>
                            </div>
                            {event.venue && (
                              <div className="flex items-center gap-1">
                                <span>🏁</span>
                                <span>{event.venue}</span>
                              </div>
                            )}
                            {event.price && (
                              <div className="flex items-center gap-1">
                                <span>💰</span>
                                <span>{event.price}</span>
                              </div>
                            )}
                            {event.organizer && (
                              <div className="flex items-center gap-1">
                                <span>👥</span>
                                <span>{event.organizer}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {event.event_type && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {event.event_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
