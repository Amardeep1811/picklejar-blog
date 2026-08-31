import { NextResponse } from 'next/server';

export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const scriptSrc = isDev ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'` : `'self' 'nonce-${nonce}' 'strict-dynamic'`;
  
  // Extract origin for CSP if a full URL is provided (to prevent path-matching blocks)
  let apiCspUrl = '';
  try {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (rawApiUrl.startsWith('http')) {
      apiCspUrl = new URL(rawApiUrl).origin;
    } else {
      apiCspUrl = rawApiUrl;
    }
  } catch (e) {
    apiCspUrl = '';
  }

  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://res.cloudinary.com https://via.placeholder.com;
    font-src 'self' https://fonts.gstatic.com;
    frame-src 'none';
    connect-src 'self' ${apiCspUrl} https://api.cloudinary.com https://*.sentry.io;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', csp);

  // Protect admin routes
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/admin/forgot-password') && !pathname.startsWith('/admin/reset-password')) {
    const token = request.cookies.get('token'); 
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
