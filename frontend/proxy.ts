import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';

    // Check if we are on the app subdomain (either local or production)
    const isAppSubdomain = hostname.startsWith('app.klair.live') || hostname.startsWith('app.localhost');

    if (isAppSubdomain) {
        // If an app user tries to hit the marketing landing page (root path), send them to dashboard
        if (url.pathname === '/') {
            url.pathname = '/dashboard';
            return NextResponse.rewrite(url);
        }

        // If an app user tries to hit the login page, redirect them to marketing login to preserve root cookie
        if (url.pathname === '/login') {
            const isLocal = process.env.NODE_ENV === 'development';
            if (!isLocal) {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://klair.live';
                return NextResponse.redirect(`${baseUrl}/login`);
            }
        }
    } else {
        // We are on the ROOT domain (klair.live)

        // If a root user tries to access the dashboard directly, redirect them to the app subdomain
        if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/profile')) {
            const isLocal = process.env.NODE_ENV === 'development';
            if (!isLocal) {
                const base = process.env.NEXT_PUBLIC_APP_URL || `https://app.klair.live`;
                // Preserve query params (e.g. TikTok OAuth ?code=...&state=...)
                const search = url.search || '';
                return NextResponse.redirect(`${base}${url.pathname}${search}`);
            }
        }
    }

    // Always rewrite /demo to /dashboard (preserves Demo Mode logic on localhost)
    if (url.pathname === '/demo') {
        url.pathname = '/dashboard';
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Apply middleware to all paths except Next.js internals and static assets
        '/((?!api|_next/static|_next/image|favicon.ico|klair_demos).*)',
    ],
};
