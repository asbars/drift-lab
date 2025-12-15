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
    
    console.log('Creating source with data:', body);
    
    const { data, error } = await supabase
      .from('sources')
      .insert(body)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error creating source:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create source', 
          details: error.message,
          hint: error.hint,
          code: error.code 
        },
        { status: 500 }
      );
    }
    
    console.log('Source created successfully:', data);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Unexpected error creating source:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

