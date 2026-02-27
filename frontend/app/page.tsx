import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LandingPageClient from '@/components/LandingPageClient';

export default async function LandingPage() {
    const cookieStore = await cookies();

    // We create a generic server client just to check session state on initial load.
    // We only need the 'get' method since we're just reading the session token.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) { },
                remove(name: string, options: any) { }
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    return <LandingPageClient initialUser={user} />;
}
