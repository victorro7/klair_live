import React from 'react';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'gradient';
    loading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    children,
    className,
    variant = 'primary',
    loading,
    disabled,
    ...props
}) => {
    const baseStyles = "w-full py-3 rounded-full text-white uppercase font-medium tracking-wide transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-black border border-gray-600 hover:border-[#6ee1fc] hover:bg-gray-900",
        secondary: "bg-transparent text-[#6ee1fc] hover:text-[#fc5efc] border-none",
        gradient: "bg-gradient-to-r from-[#6ee1fc]/20 to-[#fc5efc]/20 hover:from-[#6ee1fc]/30 hover:to-[#fc5efc]/30 border-0"
    };

    return (
        <button
            className={cn(baseStyles, variantStyles[variant], className)}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? "Processing..." : children}
        </button>
    );
};
