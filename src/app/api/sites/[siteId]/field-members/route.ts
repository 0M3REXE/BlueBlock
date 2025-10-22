import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

interface Context {
  params: { siteId: string };
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const supabase = getSupabaseServer();
    const { siteId } = params;

    const { data, error } = await supabase
      .from('site_field_members')
      .select(`
        id,
        role,
        added_at,
        contact:contacts(id, full_name, email, phone, role)
      `)
      .eq('site_id', siteId)
      .order('added_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching field members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch field members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const supabase = getSupabaseServer();
    const { siteId } = params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('site_field_members')
      .insert({
        site_id: siteId,
        contact_id: body.contact_id,
        role: body.role,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding field member:', error);
    return NextResponse.json(
      { error: 'Failed to add field member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('site_field_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing field member:', error);
    return NextResponse.json(
      { error: 'Failed to remove field member' },
      { status: 500 }
    );
  }
}
