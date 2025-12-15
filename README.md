# 🧪 DriftLab - Testing Environment

A simplified admin webapp for testing drift event management functionality before integrating into the main Drift Aggregator app.

## Features

✅ **Public Event List** - View all active drift events  
✅ **Admin Dashboard** - Manage events with full CRUD operations  
✅ **Event Creation** - Add new events with comprehensive details  
✅ **Event Editing** - Update existing events  
✅ **Event Deletion** - Remove events from the system  
✅ **Filtering** - Filter events by country and city  
✅ **Active/Inactive Toggle** - Control event visibility  
✅ **No Authentication** - Simplified for testing purposes  

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account (https://supabase.com)
- Git

### 2. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Enter project details:
   - **Name:** `driftlab` (or any name)
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
4. Wait for project to be created (~2 minutes)

### 3. Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click **"Run"**
5. ✅ Database tables and policies created!

### 4. Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the long string)

### 5. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Project Structure

```
drift-lab/
├── app/
│   ├── page.tsx                      # Public event list
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   └── events/
│   │       ├── new/page.tsx          # Create event
│   │       └── [id]/edit/page.tsx    # Edit event
│   └── api/
│       ├── events/route.ts           # Public events API
│       └── admin/
│           ├── events/route.ts       # Admin events CRUD API
│           ├── events/[id]/route.ts  # Single event API
│           └── sources/route.ts      # Sources API
├── components/
│   └── EventForm.tsx                 # Reusable event form
├── lib/
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       └── server.ts                 # Server Supabase client
├── supabase/
│   └── schema.sql                    # Database schema
└── README.md
```

## Usage Guide

### Public Site (Homepage)

Visit http://localhost:3000

- View all active events
- Filter by country and city
- See event details (date, location, price, organizer, etc.)

### Admin Panel

Visit http://localhost:3000/admin

- View all events (including inactive)
- Create new events
- Edit existing events
- Delete events
- Toggle active/inactive status

### Creating an Event

1. Go to **Admin Panel**
2. Click **"+ Add Event"**
3. Fill in the form:
   - **Required fields:** Name, Event Date, Location, City, Country
   - **Optional fields:** Description, venue, price, organizer, etc.
4. Click **"Create Event"**
5. Event appears on both admin and public pages (if active)

### Editing an Event

1. In **Admin Panel**, click **"Edit"** next to an event
2. Update any fields
3. Click **"Update Event"**

### Deleting an Event

1. In **Admin Panel**, click **"Delete"** next to an event
2. Confirm deletion
3. Event is permanently removed

## Database Schema

### `sources` Table

Stores event sources (websites, manual entries, etc.)

- `id` (UUID, Primary Key)
- `name` (Text) - Source name
- `url` (Text) - Source URL
- `scraper_type` (Text) - Type: puppeteer, cheerio, ai, manual
- `scraper_config` (JSONB) - Scraper configuration
- `country_filter` (Text[]) - Target countries
- `is_active` (Boolean) - Active status
- `created_at`, `updated_at` (Timestamps)

### `events` Table

Stores drift events

- `id` (UUID, Primary Key)
- `source_id` (UUID, Foreign Key → sources)
- `name` (Text) - Event name
- `description` (Text) - Event description
- `event_date` (Timestamp) - Event start date/time
- `event_end_date` (Timestamp) - Event end date/time
- `location` (Text) - Full location string
- `venue` (Text) - Venue/track name
- `city` (Text) - City
- `country` (Text) - Country
- `latitude`, `longitude` (Float) - GPS coordinates
- `registration_url` (Text) - Registration link
- `price` (Text) - Entry price
- `organizer` (Text) - Event organizer
- `event_type` (Text) - Type (Drift Event, Championship, etc.)
- `track_name` (Text) - Track name
- `external_id` (Text) - External identifier
- `is_active` (Boolean) - Visibility status
- `created_at`, `last_updated`, `scraped_at` (Timestamps)

## Testing Scenarios

Use DriftLab to test:

1. **Manual Event Creation**
   - Test form validation
   - Test data formats (dates, prices, etc.)
   - Test required vs optional fields

2. **Event Display**
   - Test event list rendering
   - Test filtering functionality
   - Test sorting

3. **Event Updates**
   - Test editing events
   - Test active/inactive toggle
   - Test data persistence

4. **Data Import**
   - Test importing events from AI scraper
   - Test bulk event creation
   - Test duplicate handling

5. **UI/UX Testing**
   - Test responsive design
   - Test user flows
   - Test error handling

## Deployment to Vercel

### 1. Push to GitHub

```bash
cd /Users/abarsukov/Dropbox/Business_projects/drift-lab
git init
git add .
git commit -m "Initial DriftLab setup"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/drift-lab.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import your `drift-lab` repository
4. **Environment Variables:** Add your Supabase credentials
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **"Deploy"**
6. ✅ Your testing environment is live!

## Key Differences from Main App

| Feature | Main App | DriftLab |
|---------|----------|----------|
| **Authentication** | Required (Supabase Auth) | None (open access) |
| **Event Sources** | Automatic scraping | Manual entry |
| **Favorites** | User-specific favorites | Not implemented |
| **Search** | Full-text search | Basic filtering |
| **Pagination** | Paginated event list | Show all events |
| **RLS Policies** | User-based permissions | Public read/write |
| **Purpose** | Production app | Testing environment |

## API Endpoints

### Public Endpoints

- `GET /api/events` - Get all active events
  - Query params: `country`, `city`, `sortBy`, `order`

### Admin Endpoints

- `GET /api/admin/events` - Get all events (including inactive)
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events` - Update event
- `DELETE /api/admin/events?id={id}` - Delete event
- `GET /api/admin/events/{id}` - Get single event
- `GET /api/admin/sources` - Get all sources

## Tips

1. **Use "Manual Entry" source** for manually created events
2. **Test with realistic data** to simulate production scenarios
3. **Toggle active/inactive** instead of deleting when testing visibility
4. **Use External ID** to track events from scrapers
5. **Keep DriftLab separate** from main app database (use different Supabase project)

## Troubleshooting

### Database Connection Error

**Problem:** Events not loading

**Solution:**
1. Check `.env.local` has correct Supabase credentials
2. Verify Supabase project is running (check dashboard)
3. Ensure database schema was created (run `schema.sql`)

### Events Not Saving

**Problem:** Form submits but event doesn't appear

**Solution:**
1. Check browser console for errors
2. Verify all required fields are filled
3. Check Supabase RLS policies are set correctly
4. Ensure "Manual Entry" source exists in database

### Can't Edit Events

**Problem:** Edit page not loading

**Solution:**
1. Verify event ID in URL is correct
2. Check API route `/api/admin/events/[id]/route.ts` exists
3. Check browser console for fetch errors

## Next Steps

Once you've tested and validated features in DriftLab:

1. ✅ Implement the same feature in main app
2. ✅ Add proper authentication
3. ✅ Add error handling
4. ✅ Optimize for performance
5. ✅ Deploy to production

## Support

For issues or questions, check:
- Main project README
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs

---

**Remember:** DriftLab is for testing only. Don't use it for production data!
