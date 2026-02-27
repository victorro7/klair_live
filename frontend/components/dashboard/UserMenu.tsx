import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

interface UserMenuProps {
    compact?: boolean;
}

export function UserMenu({ compact = false }: UserMenuProps) {
    const [user, setUser] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (!user) {
        return (
            <button
                onClick={() => router.push('/login')}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
                Log In
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center gap-2 rounded-full bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group backdrop-blur-xl shadow-lg ring-1 ring-white/5",
                    compact ? "p-2" : "px-4 py-1.5"
                )}
            >
                <UserIcon size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                {!compact && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white max-w-[100px] truncate transition-colors">
                        {user.email?.split('@')[0]}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-48 py-1 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Signed in as</p>
                            <p className="text-xs font-medium text-white truncate">{user.email}</p>
                        </div>

                        <button
                            onClick={() => { setIsOpen(false); router.push('/profile'); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                        >
                            <Settings size={14} />
                            Profile Settings
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
