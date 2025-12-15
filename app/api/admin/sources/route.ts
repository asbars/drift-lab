import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .order('name');
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch sources' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('sources')
      .insert(body)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating source:', error);
      return NextResponse.json(
        { error: 'Failed to create source', details: error.message },
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

