import React from 'react';

interface PlatformIconProps {
    platformName: string;
    className?: string;
}

export function PlatformIcon({ platformName, className = "w-6 h-6" }: PlatformIconProps) {
    if (platformName === 'TWITCH') {
        return (
            <div className={`${className} rounded bg-[#9146FF] flex items-center justify-center text-white shadow-lg shadow-purple-900/20`}>
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h2.998L24 10.286V0H6zM2.286 4.286L21.714 4.286v9.714l-3.428 3.428h-3.429L11.429 20.857v-3.429H6.286V4.286z" />
                </svg>
            </div>
        );
    }
    if (platformName === 'YOUTUBE') {
        return (
            <div className={`${className} rounded bg-[#FF0000] flex items-center justify-center text-white shadow-lg shadow-red-900/20`}>
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            </div>
        );
    }
    if (platformName === 'KICK') {
        return (
            <div className={`${className} rounded bg-[#53FC18] flex items-center justify-center text-black font-bold text-[10px] shadow-lg shadow-green-900/20`}>
                K
            </div>
        );
    }
    if (platformName === 'TIKTOK') {
        return (
            <div className={`${className} rounded bg-[#000000] flex items-center justify-center text-white shadow-lg shadow-pink-500/20`}>
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.25-5.45c.16-.9.23-1.83.25-2.76V8.9a6.6 6.6 0 0 0 3-1.3c.7-.6 1.15-1.5 1.5-2.4h-3.4c-.1.2-.2.5-.3.8-.4.9-.9 1.7-1.5 2.4" />
                </svg>
            </div>
        );
    }
    return null;
}
