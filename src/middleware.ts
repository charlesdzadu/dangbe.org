import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge, therefore no Prisma: it only sends a visitor with no session cookie
 * to the login page, with the path to come back to. Authorisation is decided
 * by the layouts and the actions, never here.
 */
export const config = { matcher: ['/espace/:path*'] };

export function middleware(req: NextRequest) {
  if (req.cookies.get('dangbe_session')?.value) return NextResponse.next();
  const url = new URL('/connexion', req.url);
  url.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
