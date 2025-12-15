import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET all events
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const sortBy = searchParams.get('sortBy') || 'event_date';
    const order = searchParams.get('order') || 'asc';
    
    let query = supabase
      .from('events')
      .select('*, sources(*)')
      .eq('is_active', true);
    
    if (country) {
      query = query.eq('country', country);
    }
    
    if (city) {
      query = query.eq('city', city);
    }
    
    query = query.order(sortBy, { ascending: order === 'asc' });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

