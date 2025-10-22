import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server'; // Uncomment when authentication is enabled

// DISABLED FOR NOW - NO AUTHENTICATION REQUIRED
// This middleware will be enabled when user authentication is implemented

/* Role-based access control rules (for future use):
interface Rule { pattern: RegExp; roles: string[] }
const rules: Rule[] = [
  { pattern: /^\/dashboard\/org/, roles: ['org'] },
  { pattern: /^\/dashboard\/anchors/, roles: ['org'] },
  { pattern: /^\/dashboard\/field/, roles: ['field'] },
  { pattern: /^\/dashboard\/verifier/, roles: ['verifier'] },
  { pattern: /^\/dashboard\/sites\/[^/]+$/, roles: ['org','field'] }, // Site detail view only
  { pattern: /^\/dashboard\/sites$/, roles: ['org'] }, // Site list/create only for org
];
*/

export function middleware() {
  // BYPASS AUTHENTICATION FOR NOW
  // All dashboard routes are accessible without role checking
  return NextResponse.next();

  /* UNCOMMENT WHEN AUTHENTICATION IS READY:
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();
  const role = req.cookies.get('bb_role')?.value;
  const rule = rules.find(r => r.pattern.test(pathname));
  if (!rule) return NextResponse.next();
  if (!role || !rule.roles.includes(role)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
  */
}

export const config = { matcher: ['/dashboard/:path*'] };
