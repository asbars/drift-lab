# Deploy DriftLab to Vercel

## Prerequisites

✅ GitHub repository created: https://github.com/asbars/drift-lab  
✅ Code pushed to GitHub  
⏳ Supabase project needed  
⏳ Vercel account needed  

---

## Step 1: Create Supabase Project

If you haven't already:

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name:** `driftlab` (or any name)
   - **Database Password:** (save this - you'll need it!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for setup to complete

---

## Step 2: Set Up Database

1. In Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Go to your GitHub repo: https://github.com/asbars/drift-lab/blob/main/supabase/schema.sql
4. Copy the entire SQL file
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. Should see "Success. No rows returned"

**Verify it worked:**
- Click **"Table Editor"** in sidebar
- You should see two tables: `sources` and `events`
- `sources` should have 1 row (Manual Entry)

---

## Step 3: Get Supabase Credentials

1. In Supabase Dashboard, click **Settings** (gear icon) → **API**
2. Find and copy these values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public key:** (Click "Copy" button)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Keep these handy - you'll need them in the next step!

---

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new

2. If first time:
   - Click **"Continue with GitHub"**
   - Authorize Vercel to access your GitHub

3. **Import Git Repository:**
   - Find `drift-lab` in the list
   - Click **"Import"**

4. **Configure Project:**
   - **Project Name:** `drift-lab` (or any name)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `next build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

5. **Environment Variables** (Click "Add" for each):

   Add these two variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` (your URL) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (your anon key) |

6. Click **"Deploy"**

7. Wait 2-3 minutes for deployment ⏳

8. ✅ **Done!** Your app will be live at: `https://drift-lab.vercel.app`

---

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Navigate to project
cd /Users/abarsukov/Dropbox/Business_projects/drift-lab

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? drift-lab
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted

# Deploy to production
vercel --prod
```

---

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://drift-lab.vercel.app`)

2. You should see the DriftLab homepage with:
   - "🧪 DriftLab" header
   - "No events found" message
   - "Admin Panel" button

3. Click **"Admin Panel"**

4. Click **"+ Add Event"**

5. Create a test event:
   - **Name:** `Test Drift Day`
   - **Event Date:** (pick a future date)
   - **Location:** `Circuit Zandvoort, Zandvoort, Netherlands`
   - **City:** `Zandvoort`
   - **Country:** `Netherlands`
   - **Venue:** `Circuit Zandvoort`
   - **Price:** `€45`

6. Click **"Create Event"**

7. Go back to homepage - event should appear!

✅ **If you see the event, deployment is successful!**

---

## Troubleshooting

### Issue: "Failed to fetch events"

**Cause:** Environment variables not set correctly

**Solution:**
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your `drift-lab` project
3. Go to **Settings** → **Environment Variables**
4. Verify both variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. If incorrect, update them
6. Go to **Deployments** → Click "..." on latest → **Redeploy**

---

### Issue: "Database error" or "Table does not exist"

**Cause:** Database schema not created

**Solution:**
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Check if `events` and `sources` tables exist
4. If not, go back to **Step 2** and run the schema.sql again

---

### Issue: Events not saving

**Cause:** RLS policies or missing source

**Solution:**
1. Go to Supabase Dashboard → **Table Editor**
2. Click on `sources` table
3. Verify there's at least one row (should be "Manual Entry")
4. If empty, run this SQL:
   ```sql
   INSERT INTO sources (name, url, scraper_type, scraper_config, country_filter) 
   VALUES ('Manual Entry', 'https://manual', 'manual', '{}'::jsonb, 
           ARRAY['Netherlands', 'Germany', 'Belgium', 'France']);
   ```

---

### Issue: Build fails on Vercel

**Error:** `Type error` or `Module not found`

**Solution:**
1. Check build logs in Vercel Dashboard
2. Common fixes:
   ```bash
   # Locally, ensure build works:
   npm run build
   
   # If it works locally, force redeploy:
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

---

## Your URLs

- **GitHub Repo:** https://github.com/asbars/drift-lab
- **Vercel App:** https://drift-lab.vercel.app (or your custom domain)
- **Supabase Dashboard:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID

---

## Update Deployment

When you make changes:

```bash
cd /Users/abarsukov/Dropbox/Business_projects/drift-lab

# Make your changes, then:
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically deploy!
```

---

## Custom Domain (Optional)

Want a custom URL like `driftlab.yourdomain.com`?

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain
5. Follow DNS configuration instructions

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiI...` |

**Note:** The `NEXT_PUBLIC_` prefix is required for client-side access.

---

## Production Checklist

Before sharing with others:

- ✅ Database schema created
- ✅ Environment variables set
- ✅ Deployment successful
- ✅ Test event creation works
- ✅ Test event editing works
- ✅ Test event deletion works
- ✅ Public site displays events
- ✅ Filtering works (country/city)

---

## Security Note

DriftLab has **no authentication** - anyone with the URL can add/edit/delete events.

This is intentional for testing, but don't use it for production data!

For production, use the main Drift Aggregator app with proper authentication.

---

## Next Steps

1. ✅ Share URL with team for testing
2. ✅ Import AI scraped events
3. ✅ Test all features thoroughly
4. ✅ Use learnings to improve main app
5. ✅ Deploy main app when ready

---

Need help? Check the main README.md or create an issue on GitHub!

