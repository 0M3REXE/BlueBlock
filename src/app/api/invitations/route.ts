import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase/server';
import { generateInvitationToken } from '../../../lib/invitations/token';

// NOTE: Placeholder auth. Replace with real user/org resolution (e.g., from session JWT)
async function getActingUser() {
  return { user_id: '00000000-0000-0000-0000-000000000000', organization_id: null as string | null, role: 'org_admin' as const };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organization_id, emails, role = 'field_agent', site_ids = [], expires_in_days = 7 } = body || {};
    if (!organization_id) return NextResponse.json({ error: 'organization_id required' }, { status: 400 });
    if (!Array.isArray(emails) || emails.length === 0) return NextResponse.json({ error: 'emails array required' }, { status: 400 });
    if (!['field_agent','verifier'].includes(role)) return NextResponse.json({ error: 'invalid role' }, { status: 400 });

    const acting = await getActingUser();
    // Placeholder: enforce acting.organization_id === organization_id when auth wired
    const supabase = getSupabaseServer();

    const now = Date.now();
    const expiresAt = new Date(now + expires_in_days * 24 * 60 * 60 * 1000).toISOString();

    const rows = emails.map((rawEmail: string) => {
      const email = rawEmail.trim().toLowerCase();
      const { raw, hash } = generateInvitationToken();
      return { email, token_raw: raw, token_hash: hash, expires_at: expiresAt };
    });

    const insertPayload = rows.map(r => ({
      organization_id,
      email: r.email,
      role,
      site_ids: site_ids.length ? site_ids : null,
      token_hash: r.token_hash,
      expires_at: r.expires_at,
      invited_by: acting.user_id,
    }));

    const { data, error } = await supabase.from('invitations').insert(insertPayload).select('id,email,token_hash,expires_at');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Map back token raw values (not stored) for email dispatch client-side for now
    const linkBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const result = data?.map(rec => {
      const match = rows.find(r => r.token_hash === rec.token_hash);
      const rawToken = match?.token_raw || '';
      return {
        email: rec.email,
        invite_id: rec.id,
        expires_at: rec.expires_at,
        link: `${linkBase}/accept-invite?token=${rawToken}`
      };
    });

    return NextResponse.json({ invitations: result }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
