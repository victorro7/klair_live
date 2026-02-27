/**
 * GlassPanel Component
 * Reusable glass morphism container with ambient glows
 */

import { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    glowColor?: 'purple' | 'blue' | 'green' | 'none';
}

export function GlassPanel({ children, className, glowColor = 'purple', ...props }: GlassPanelProps) {
    return (
        <div
            className={clsx(
                "relative overflow-visible rounded-3xl border border-white/20",
                "bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]",
                "ring-1 ring-white/10 group transition-all duration-500",
                className
            )}
            {...props}
        >
            {/* Ambient Glows */}
            {glowColor !== 'none' && (
                <>
                    <div
                        className={clsx(
                            "absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-all duration-700",
                            glowColor === 'purple' && "bg-purple-500/10 group-hover:bg-purple-500/20",
                            glowColor === 'blue' && "bg-blue-500/10 group-hover:bg-blue-500/20",
                            glowColor === 'green' && "bg-green-500/10 group-hover:bg-green-500/20"
                        )}
                    />
                    <div
                        className={clsx(
                            "absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-all duration-700",
                            glowColor === 'purple' && "bg-blue-500/10 group-hover:bg-blue-500/20",
                            glowColor === 'blue' && "bg-purple-500/10 group-hover:bg-purple-500/20",
                            glowColor === 'green' && "bg-green-500/10 group-hover:bg-green-500/20"
                        )}
                    />
                </>
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </div>
    );
}
