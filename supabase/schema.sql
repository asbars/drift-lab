-- DriftLab Testing Database Schema
-- Simplified version for testing event management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  scraper_type TEXT NOT NULL CHECK (scraper_type IN ('puppeteer', 'cheerio', 'ai', 'manual')),
  scraper_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  country_filter TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  scrape_frequency TEXT NOT NULL DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_end_date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  venue TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  registration_url TEXT,
  price TEXT,
  organizer TEXT,
  event_type TEXT,
  track_name TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  external_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, external_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_source_id ON events(source_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_country ON events(country);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);

-- Row Level Security (RLS) - Simplified for testing
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for testing)
CREATE POLICY "Sources are viewable by everyone"
  ON sources FOR SELECT
  USING (true);

CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Public write access (for admin interface - no auth for simplicity)
CREATE POLICY "Anyone can insert sources"
  ON sources FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update sources"
  ON sources FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete sources"
  ON sources FOR DELETE
  USING (true);

CREATE POLICY "Anyone can insert events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON events FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete events"
  ON events FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_last_updated BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

-- Insert a default "Manual Entry" source for admin-created events
INSERT INTO sources (name, url, scraper_type, scraper_config, country_filter) VALUES
  ('Manual Entry', 'https://manual', 'manual', '{}'::jsonb, ARRAY['Netherlands', 'Germany', 'Belgium', 'France'])
ON CONFLICT DO NOTHING;

