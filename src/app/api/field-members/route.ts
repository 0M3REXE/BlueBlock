import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase/server';

// POST: add field member (contact upsert by email) and attach to site
// Body: { site_id: string, name?: string, email: string, phone?: string, role?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const body = await req.json();
    const { site_id, name, email, phone, role } = body || {};
    if (!site_id || !email) {
      return NextResponse.json({ error: 'site_id and email required' }, { status: 400 });
    }

    // Upsert contact by email
    const { data: contact, error: contactErr } = await supabase
      .from('contacts')
      .upsert({ name, email, phone }, { onConflict: 'email' })
      .select('*')
      .single();
    if (contactErr || !contact) {
      return NextResponse.json({ error: contactErr?.message || 'Contact upsert failed' }, { status: 500 });
    }

    // Link to site
    const { error: linkErr, data: link } = await supabase
      .from('site_field_members')
      .upsert({ site_id, contact_id: contact.id, role: role || 'member' }, { onConflict: 'site_id,contact_id' })
      .select('*')
      .single();
    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 500 });
    }

    return NextResponse.json({ contact, membership: link });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: remove membership. Query params: site_id, contact_id
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(req.url);
    const site_id = searchParams.get('site_id');
    const contact_id = searchParams.get('contact_id');
    if (!site_id || !contact_id) {
      return NextResponse.json({ error: 'site_id & contact_id required' }, { status: 400 });
    }
    const { error } = await supabase
      .from('site_field_members')
      .delete()
      .match({ site_id, contact_id });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
