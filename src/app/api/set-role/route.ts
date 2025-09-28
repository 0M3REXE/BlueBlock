import { NextRequest, NextResponse } from 'next/server';

const VALID_ROLES = ['org','field','verifier'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const role = body?.role;
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Invalid role', valid: VALID_ROLES }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true, role });
    res.cookies.set('bb_role', role, { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 8 });
    return res;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
