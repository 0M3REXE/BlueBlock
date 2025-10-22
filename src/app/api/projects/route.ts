import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();

    // For MVP, use a default organization_id (first org in DB)
    // In production, this would come from authenticated user's org
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .single();

    if (!orgs) {
      return NextResponse.json(
        { error: 'No organization found. Please create an organization first.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...body,
        organization_id: orgs.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
