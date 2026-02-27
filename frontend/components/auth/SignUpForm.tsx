import React from 'react';
import { FormInput } from './FormInput';
import { AuthButton } from './AuthButton';

interface SignUpFormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    firstName: string;
    setFirstName: (name: string) => void;
    lastName: string;
    setLastName: (name: string) => void;
    username: string;
    setUsername: (username: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onToggleMode: () => void;
    loading: boolean;
    error: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    onSubmit,
    onToggleMode,
    loading,
    error
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-lg w-full mx-auto px-2 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <FormInput
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                    />
                </div>
                <div>
                    <FormInput
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                    />
                </div>
            </div>

            <div>
                <FormInput
                    id="username"
                    type="text"
                    placeholder="Username (Optional)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />
            </div>

            <div>
                <FormInput
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
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
                    autoComplete="new-password"
                />
            </div>

            <div>
                <FormInput
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 text-center text-sm my-4">
                    {error}
                </div>
            )}

            <div className="pt-6">
                <AuthButton
                    type="submit"
                    loading={loading}
                    variant="primary"
                >
                    Create Account
                </AuthButton>
            </div>

            <div className="text-center">
                <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-[#6ee1fc] hover:text-[#fc5efc] font-medium uppercase text-sm"
                >
                    Already have an account? | Log In
                </button>
            </div>
        </form>
    );
}; 
