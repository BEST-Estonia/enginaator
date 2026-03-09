import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_COOKIE_NAME = 'adminToken';
const ADMIN_ROOT_PATH = '/admin';
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
    const payload = JSON.parse(atob(padded));

    return typeof payload === 'object' && payload !== null ? payload : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== 'number') return true;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return exp <= currentTimestamp;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value;
  const hasValidToken = Boolean(token) && !isTokenExpired(token as string);

  if (pathname === ADMIN_ROOT_PATH) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = hasValidToken ? ADMIN_DASHBOARD_PATH : ADMIN_LOGIN_PATH;
    return NextResponse.redirect(redirectUrl);
  }

  const isLoginPath = pathname === ADMIN_LOGIN_PATH;

  if (!hasValidToken && !isLoginPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ADMIN_LOGIN_PATH;
    redirectUrl.searchParams.set('next', pathname);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete(ADMIN_TOKEN_COOKIE_NAME);
    return response;
  }

  if (hasValidToken && isLoginPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ADMIN_DASHBOARD_PATH;
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
