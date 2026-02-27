/**
 * StatusBadge Component
 * Displays live/System Idle status with animated indicator
 */

import clsx from 'clsx';

interface StatusBadgeProps {
    status: 'live' | 'System Idle';
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const isLive = status === 'live';

    return (
        <div
            className={clsx(
                "relative overflow-hidden flex items-center gap-2 px-4 py-1.5 rounded-full",
                "text-[10px] font-bold border transition-all duration-500 uppercase tracking-widest whitespace-nowrap",
                "backdrop-blur-xl shadow-lg ring-1 ring-white/5",
                isLive
                    ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-green-900/20"
                    : "bg-red-500/10 border-red-500/30 text-red-500 shadow-red-900/20"
            )}
        >
            {/* Background Gradient */}
            <div
                className={clsx(
                    "absolute inset-0 bg-gradient-to-r opacity-20",
                    isLive ? "from-green-500/20 to-transparent" : "from-red-500/20 to-transparent"
                )}
            />

            {/* Status Indicator */}
            <div
                className={clsx(
                    "w-2 h-2 rounded-full relative z-10 flex-shrink-0",
                    isLive
                        ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                        : "bg-red-500"
                )}
            />

            {/* Status Text */}
            <span className="relative z-10">{isLive ? 'LIVE' : 'System Idle'}</span>
        </div>
    );
}
