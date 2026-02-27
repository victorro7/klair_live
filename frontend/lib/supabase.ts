import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

// Ensure the cookie is set at the root domain level so that
// klair.live (Landing page) and app.klair.live (Dashboard) can share it.
function getSharedCookieDomain() {
    if (typeof window === 'undefined') return undefined;

    const hostname = window.location.hostname;
    if (hostname.includes('klair.live')) {
        return '.klair.live';
    }
    if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
        return 'localhost';
    }
    return undefined;
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
        domain: getSharedCookieDomain(),
        path: '/',
        sameSite: 'lax',
        maxAge: 31536000,
    }
})
