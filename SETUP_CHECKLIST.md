# DriftLab Setup Checklist

Follow these steps to get DriftLab running:

## ☐ Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `driftlab-test` (or any name)
   - Database Password: __________ (save this!)
   - Region: (choose closest)
4. Wait ~2 minutes for setup

## ☐ Step 2: Run Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/schema.sql` in this project
4. Copy all contents
5. Paste into SQL Editor
6. Click **"Run"**
7. Should see "Success" message

## ☐ Step 3: Get API Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxxxx.supabase.co`
   - **anon public key:** `eyJh...` (long string)

## ☐ Step 4: Configure Environment

1. Copy environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<paste Project URL here>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon key here>
   ```

## ☐ Step 5: Install & Run

```bash
npm install
npm run dev
```

## ☐ Step 6: Test It!

1. Open http://localhost:3000
2. Should see "DriftLab" homepage (empty)
3. Click **"Admin Panel"**
4. Click **"+ Add Event"**
5. Fill in event details:
   - Name: `Test Drift Day`
   - Event Date: (pick a future date)
   - Location: `Circuit Zandvoort, Zandvoort, Netherlands`
   - City: `Zandvoort`
   - Country: `Netherlands`
   - Venue: `Circuit Zandvoort`
   - Price: `€45`
6. Click **"Create Event"**
7. Event should appear in admin list
8. Go back to homepage - event should appear there too!

---

## ✅ You're Done!

DriftLab is ready for testing!

## Next Steps

- Add more test events
- Test filtering by country/city
- Test editing events
- Test deleting events
- Test active/inactive toggle
- Import events from AI scraper

---

## Troubleshooting

**Events not loading?**
- Check `.env.local` has correct credentials
- Check Supabase dashboard - project should be "Active"
- Check browser console for errors

**Can't save events?**
- Verify database schema was run successfully
- Check Supabase Table Editor - should see `sources` and `events` tables
- Make sure all required fields are filled

**Still having issues?**
- Check `README.md` for detailed troubleshooting
- Verify Node.js version: `node --version` (should be 18+)

