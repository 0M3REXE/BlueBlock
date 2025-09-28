import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface Rule { pattern: RegExp; roles: string[] }
const rules: Rule[] = [
  { pattern: /^\/dashboard\/org/, roles: ['org'] },
  { pattern: /^\/dashboard\/projects/, roles: ['org'] },
  { pattern: /^\/dashboard\/anchors/, roles: ['org'] },
  { pattern: /^\/dashboard\/field/, roles: ['field'] },
  { pattern: /^\/dashboard\/verifier/, roles: ['verifier'] },
  { pattern: /^\/dashboard\/sites/, roles: ['org','field'] },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();
  const role = req.cookies.get('bb_role')?.value;
  const rule = rules.find(r => r.pattern.test(pathname));
  if (!rule) return NextResponse.next();
  if (!role || !rule.roles.includes(role)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
