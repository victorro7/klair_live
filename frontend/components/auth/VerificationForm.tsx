/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface VerificationFormProps {
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onBack: () => void;
    onResend: () => Promise<void>;
    loading: boolean;
    resendLoading: boolean;
    error: string;
    email: string;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
    verificationCode,
    setVerificationCode,
    onSubmit,
    onBack,
    onResend,
    loading,
    resendLoading,
    error,
    email
}) => {
    return (
        <div className="w-full max-w-md mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-sm text-gray-400 hover:text-white mb-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> BACK
            </button>

            <form onSubmit={onSubmit} className="space-y-8 flex flex-col items-center">
                <div className="w-full space-y-2 text-center">
                    <input
                        id="verificationCode"
                        type="text"
                        placeholder=""
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        autoComplete="one-time-code"
                        className="w-full text-center text-4xl font-semibold bg-transparent border-b-2 border-gray-700 focus:border-[#6ee1fc] text-white py-2 focus:outline-none tracking-wider"
                        maxLength={8}
                    />

                    <p className="text-gray-300 text-base mt-4">
                        Enter the code sent to <strong>{email}</strong>.
                    </p>
                </div>

                {error && (
                    <div className="text-red-400 text-base w-full text-center">
                        {error}
                    </div>
                )}

                <div className="pt-6 space-y-6 w-full">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-full uppercase font-bold tracking-wide bg-white text-black hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10 transition-all focus:outline-none disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                    <button
                        type="button"
                        onClick={onResend}
                        disabled={resendLoading}
                        className="w-full text-center text-[#6ee1fc] hover:text-[#fc5efc] uppercase text-sm font-medium tracking-wide disabled:opacity-50"
                    >
                        {resendLoading ? "Sending..." : "Resend Verification Code"}
                    </button>
                </div>
            </form>
        </div>
    );
};
