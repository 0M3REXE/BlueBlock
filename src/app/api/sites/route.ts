import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase/server';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    // TODO: scope to auth user via session; for now return first 50 sites
    const { data, error } = await supabase.from('sites').select('id,name,location_name,centroid_lat,centroid_lon').limit(50);
    if (error) {
      console.error('supabase error', error.message);
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(data || []);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 200 });
  }
}
