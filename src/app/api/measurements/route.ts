import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const site_id = searchParams.get('site_id');

    const supabase = getSupabaseServer();
    let query = supabase
      .from('measurements')
      .select('*')
      .order('measurement_date', { ascending: false })
      .limit(50);

    if (site_id) {
      query = query.eq('site_id', site_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch measurements' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const body = await req.json();
    const { site_id, planting_batch_id, species_id } = body || {};
    if (!site_id) {
      return NextResponse.json({ error: 'site_id required' }, { status: 400 });
    }
    // Minimal insert; measured_at defaults now
    const { data, error } = await supabase
      .from('measurements')
      .insert({ site_id, planting_batch_id, species_id, avg_height_cm: null, survival_rate_percent: null })
      .select('id, site_id, measured_at')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ measurement: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
