import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Environment variables missing',
        details: {
          NEXT_PUBLIC_SUPABASE_URL: hasUrl ? 'Set' : 'MISSING',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: hasKey ? 'Set' : 'MISSING',
        }
      }, { status: 500 });
    }
    
    // Try to connect to Supabase
    const supabase = await createClient();
    
    // Try a simple query
    const { data, error } = await supabase
      .from('sources')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        details: {
          error: error.message,
          code: error.code,
          hint: error.hint,
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection working!',
      details: {
        NEXT_PUBLIC_SUPABASE_URL: 'Set correctly',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Set correctly',
        database: 'Connected',
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      details: {
        error: error?.message || 'Unknown error',
      }
    }, { status: 500 });
  }
}

