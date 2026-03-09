import { NextRequest, NextResponse } from 'next/server';

const ADMIN_UI_COOKIE_NAME = 'adminUiSession';
const ADMIN_ROOT_PATH = '/admin';
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasUiSession = request.cookies.get(ADMIN_UI_COOKIE_NAME)?.value === '1';

  if (pathname === ADMIN_ROOT_PATH) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = hasUiSession ? ADMIN_DASHBOARD_PATH : ADMIN_LOGIN_PATH;
    return NextResponse.redirect(redirectUrl);
  }

  const isLoginPath = pathname === ADMIN_LOGIN_PATH;

  if (!hasUiSession && !isLoginPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ADMIN_LOGIN_PATH;
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (hasUiSession && isLoginPath) {
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
