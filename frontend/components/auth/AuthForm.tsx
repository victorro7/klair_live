"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

// Import custom components
import { AuthLayout } from './AuthLayout';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { VerificationForm } from './VerificationForm';
import { SocialLogin } from './SocialLogin';

interface AuthFormProps {
    className?: string;
    redirect?: string;
}

export function AuthForm({ className, redirect = "/" }: AuthFormProps) {
    // State
    const [isSignUp, setIsSignUp] = useState(false);
    const [verificationStep, setVerificationStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [resendLoading, setResendLoading] = useState(false);

    // Helper for cross-domain redirects
    const doRedirect = () => {
        if (typeof window === 'undefined') return;

        // If we are currently on the app subdomain, a relative redirect is fine
        if (window.location.hostname.startsWith('app.')) {
            window.location.href = redirect;
            return;
        }

        // We are on the landing page domain, redirect to the app subdomain
        const isLocal = process.env.NODE_ENV === 'development';
        if (isLocal) {
            window.location.href = redirect;
            return;
        }

        const base = process.env.NEXT_PUBLIC_APP_URL || `https://app.klair.live`;
        window.location.href = `${base}${redirect === '/dashboard' ? '/' : redirect}`;
    };

    // Handlers
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Success
            doRedirect();
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        username: username || email.split('@')[0],
                    }
                }
            });

            if (error) throw error;

            // Check if session exists (auto-confirmed) or email confirm needed
            if (data.session) {
                if (typeof window !== 'undefined') {
                    window.location.href = redirect;
                }
            } else if (data.user) {
                // User created but needs verification
                setVerificationStep(true);
            }
        } catch (err: any) {
            setError(err.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: verificationCode,
                type: 'signup'
            });

            if (error) throw error;

            // Success
            if (typeof window !== 'undefined') {
                window.location.href = redirect;
            }
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email
            });
            if (error) throw error;
            alert("Verification code resent!");
        } catch (err: any) {
            setError(err.message || "Failed to resend code");
        } finally {
            setResendLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setVerificationStep(false);
    };

    const backToSignUpForm = () => {
        setVerificationStep(false);
    };

    const renderForm = () => {
        if (verificationStep) {
            return (
                <VerificationForm
                    verificationCode={verificationCode}
                    setVerificationCode={setVerificationCode}
                    onSubmit={handleVerification}
                    onBack={backToSignUpForm}
                    onResend={handleResendCode}
                    loading={loading}
                    resendLoading={resendLoading}
                    error={error}
                    email={email}
                />
            );
        } else if (isSignUp) {
            return (
                <>
                    <SignUpForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        username={username}
                        setUsername={setUsername}
                        onSubmit={handleSignUp}
                        onToggleMode={toggleMode}
                        loading={loading}
                        error={error}
                    />
                    <SocialLogin />
                </>
            );
        } else {
            return (
                <>
                    <SignInForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        onSubmit={handleSignIn}
                        onToggleMode={toggleMode}
                        loading={loading}
                        error={error}
                    />
                    <SocialLogin />
                </>
            );
        }
    };

    return (
        <AuthLayout
            title={verificationStep ? "Verify Email" : isSignUp ? "Create Account" : "Log In"}
            className={className}
        >
            {renderForm()}
        </AuthLayout>
    );
}
