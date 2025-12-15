'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface EventFormData {
  id?: string;
  source_id?: string;
  source_name: string;
  name: string;
  description: string;
  event_date: string;
  event_end_date: string;
  location: string;
  venue: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  registration_url: string;
  price: string;
  organizer: string;
  event_type: string;
  track_name: string;
  external_id: string;
  is_active: boolean;
}

interface EventFormProps {
  event?: Partial<EventFormData>;
  mode: 'create' | 'edit';
}

export default function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    source_name: 'Manual Entry',
    name: '',
    description: '',
    event_date: '',
    event_end_date: '',
    location: '',
    venue: '',
    city: '',
    country: 'Netherlands',
    latitude: '',
    longitude: '',
    registration_url: '',
    price: '',
    organizer: '',
    event_type: 'Drift Event',
    track_name: '',
    external_id: '',
    is_active: true,
    ...event,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get or create source
      let sourceId = formData.source_id;
      
      if (!sourceId && formData.source_name) {
        // Create a new source
        const sourceResponse = await fetch('/api/admin/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.source_name,
            url: 'https://manual',
            scraper_type: 'manual',
            scraper_config: {},
            country_filter: ['Netherlands', 'Germany', 'Belgium', 'France'],
            is_active: true,
          }),
        });
        
        if (sourceResponse.ok) {
          const sourceData = await sourceResponse.json();
          sourceId = sourceData.data.id;
        }
      }

      // Clean up form data
      const submitData: any = {
        ...formData,
        source_id: sourceId,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        description: formData.description || null,
        event_end_date: formData.event_end_date || null,
        venue: formData.venue || null,
        registration_url: formData.registration_url || null,
        price: formData.price || null,
        organizer: formData.organizer || null,
        event_type: formData.event_type || null,
        track_name: formData.track_name || null,
        external_id: formData.external_id || null,
      };
      
      // Remove source_name from submit data
      delete submitData.source_name;

      const method = mode === 'create' ? 'POST' : 'PUT';
      const response = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}${error.details ? ` - ${error.details}` : ''}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Dutch Drift Championship - Round 1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Event description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Event Date *
            </label>
            <input
              type="datetime-local"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Event End Date
            </label>
            <input
              type="datetime-local"
              name="event_end_date"
              value={formData.event_end_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Event Type
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="Drift Event">Drift Event</option>
              <option value="Championship">Championship</option>
              <option value="Track Day">Track Day</option>
              <option value="Training">Training</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Source (optional)
            </label>
            <input
              type="text"
              name="source_name"
              value={formData.source_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Manual Entry, AI Scraper, etc."
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Circuit Zandvoort, Zandvoort, Netherlands"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Venue / Track
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Circuit Zandvoort"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Track Name
            </label>
            <input
              type="text"
              name="track_name"
              value={formData.track_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="GP Circuit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Zandvoort"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="Netherlands">Netherlands</option>
              <option value="Germany">Germany</option>
              <option value="Belgium">Belgium</option>
              <option value="France">France</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Spain">Spain</option>
              <option value="Portugal">Portugal</option>
              <option value="Italy">Italy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="52.3888"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="4.5403"
            />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="€45 or From €45"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Organizer
            </label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Dutch Drift Association"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Registration URL
            </label>
            <input
              type="url"
              name="registration_url"
              value={formData.registration_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="https://example.com/register"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              External ID
            </label>
            <input
              type="text"
              name="external_id"
              value={formData.external_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="event-123"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-900">
              Active (visible on public site)
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Update Event'}
        </button>
      </div>
    </form>
  );
}

