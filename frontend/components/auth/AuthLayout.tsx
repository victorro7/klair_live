import React from 'react';
import Link from 'next/link';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    className
}) => {
    // Animation variants
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    // Create words array for typewriter effect
    const words = [
        {
            text: title,
            className: "text-2xl sm:text-4xl font-medium text-white"
        }
    ];

    // If title is "Log In" or "Create Account", add a colored version
    if (title === "Log In" || title === "Create Account") {
        words.push({
            text: "to Klair",
            className: "text-2xl sm:text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#6ee1fc] to-[#fc5efc]"
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-black relative overflow-hidden">
            {/* Logo Back Button */}
            <div className="absolute top-6 left-6 z-50 pointer-events-auto">
                <Link href={process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_BASE_URL || 'https://klair.live')} className="hover:opacity-80 transition-opacity">
                    <span className="text-2xl tracking-[-0.03em] font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        KLAIR
                    </span>
                </Link>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <BackgroundBeams />
            </div>

            {/* Floating gradient orbs */}
            <div className="absolute top-1/4 right-[15%] w-64 h-64 rounded-full bg-gradient-to-r from-[#6ee1fc]/20 to-[#fc5efc]/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-[15%] w-72 h-72 rounded-full bg-gradient-to-r from-[#fc5efc]/10 to-[#6ee1fc]/10 blur-3xl pointer-events-none"></div>

            {/* Content */}
            <motion.div
                className={cn("w-full max-w-md mx-auto z-10", className)}
                initial="hidden"
                animate="visible"
                variants={formVariants}
            >
                {/* Header with Typewriter Effect */}
                <div className="flex flex-col items-center mb-12">
                    <TypewriterEffectSmooth words={words} className="text-center mb-2" />
                </div>

                {/* Auth Form */}
                <div className="bg-transparent px-4">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}; 
