import React from 'react';
import Link from 'next/link';
import { FormInput } from './FormInput';
import { AuthButton } from './AuthButton';

interface SignInFormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onToggleMode: () => void;
    loading: boolean;
    error: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({
    email,
    setEmail,
    password,
    setPassword,
    onSubmit,
    onToggleMode,
    loading,
    error
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-5 max-w-lg w-full mx-auto px-2 sm:px-0">
            <div>
                <FormInput
                    id="email"
                    type="text"
                    placeholder="Email Address" // Supabase SignIn prefers Email
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                />
            </div>

            <div>
                <FormInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 text-center text-sm my-4">
                    {error}
                </div>
            )}

            <div className="pt-6 space-y-3">
                <AuthButton
                    type="submit"
                    loading={loading}
                    variant="primary"
                >
                    Log In
                </AuthButton>

                <AuthButton
                    type="button"
                    onClick={onToggleMode}
                    variant="gradient"
                    className="bg-gradient-to-r from-[#6ee1fc]/20 to-[#fc5efc]/20 border-0 hover:from-[#6ee1fc]/30 hover:to-[#fc5efc]/30 opacity-50 cursor-not-allowed"
                    disabled={true}
                >
                    Create Account (Disabled)
                </AuthButton>

                <Link href={process.env.NODE_ENV === 'development' ? '/demo' : `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.klair.live'}/demo`} className="block w-full text-center py-3 text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-wide font-medium">
                    &larr; Continue as Guest (Demo Mode)
                </Link>
            </div>
        </form>
    );
}; 
