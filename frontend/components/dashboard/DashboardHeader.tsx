import { useRef, useState, useEffect } from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { StreamInput } from './StreamInput';
import { ActionButtons } from './ActionButtons';
import BufferSettingsModal from '@/components/dashboard/BufferSettingsModal';
import { InputMode, Platform, ViewMode } from '@/app/types/dashboard';
import { UserMenu } from './UserMenu';
import { Dropdown } from '../ui/Dropdown';
import clsx from 'clsx';
import Link from 'next/link';

interface DashboardHeaderProps {
    isLive: boolean;
    // View Mode
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    // Stream input props
    inputMode: InputMode;
    onInputModeChange: (mode: InputMode) => void;
    streamUrl: string;
    onStreamUrlChange: (url: string) => void;
    platform: Platform;
    onPlatformChange: (platform: Platform) => void;
    username: string;
    onUsernameChange: (username: string) => void;

    // Action button props
    onStart: () => void;
    onStop: () => void;
    onManualTrigger: () => void;

    // Config
    config: any;
    onConfigSaved: () => void;
}

export function DashboardHeader({
    isLive,
    viewMode,
    onViewModeChange,
    inputMode,
    onInputModeChange,
    streamUrl,
    onStreamUrlChange,
    platform,
    onPlatformChange,
    username,
    onUsernameChange,
    onStart,
    onStop,
    onManualTrigger,
    config,
    onConfigSaved,
}: DashboardHeaderProps) {
    const [isSettingsHovered, setIsSettingsHovered] = useState(false);
    const [isSettingsPinned, setIsSettingsPinned] = useState(false);
    const configButtonRef = useRef<HTMLButtonElement>(null);
    const modalHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isSettingsOpen = isSettingsHovered || isSettingsPinned;

    useEffect(() => {
        return () => {
            if (modalHoverTimeoutRef.current) {
                clearTimeout(modalHoverTimeoutRef.current);
            }
        };
    }, []);

    const handleSettingsToggle = () => {
        setIsSettingsPinned(!isSettingsPinned);
    };

    const handleModalHover = (isHovered: boolean) => {
        if (modalHoverTimeoutRef.current) {
            clearTimeout(modalHoverTimeoutRef.current);
            modalHoverTimeoutRef.current = null;
        }

        if (isHovered) {
            setIsSettingsHovered(true);
        } else {
            modalHoverTimeoutRef.current = setTimeout(() => {
                setIsSettingsHovered(false);
            }, 200);
        }
    };

    const handleSettingsClose = () => {
        setIsSettingsPinned(false);
        setIsSettingsHovered(false);
    };

    // Determine active color based on platform/status
    const getGlowColor = () => {
        if (!isLive) return 'rgba(255,255,255,0.05)';
        return platform === 'twitch' ? 'rgba(168,85,247,0.4)' : 'rgba(239,68,68,0.4)';
    };

    return (
        <header className="fixed top-6 left-0 right-0 z-50 pointer-events-none">
            <div className="max-w-[1920px] mx-auto px-6 flex justify-between items-start">

                {/* DESKTOP LAYOUT (Hidden on mobile) */}
                <div className="hidden xl:flex w-full items-start justify-between">
                    {/* Left: Logo */}
                    <div className="w-64 pt-2 pointer-events-auto flex items-center gap-2">
                        <Link href={process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_BASE_URL || 'https://klair.live')} className="hover:opacity-80 transition-opacity">
                            <span className="text-2xl tracking-[-0.03em] font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                KLAIR
                            </span>
                        </Link>
                    </div>

                    {/* Center: Command Deck (Floating HUD) */}
                    <div className="flex-1 flex justify-center pointer-events-auto -mt-1">
                        <div
                            className={clsx(
                                "relative flex items-center gap-1 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full transition-all duration-500",
                                isLive ? "shadow-[0_0_50px_-10px_var(--glow-color)] border-white/20" : "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                            )}
                            style={{ '--glow-color': getGlowColor() } as React.CSSProperties}
                        >
                            {/* Inner Bevel */}
                            <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />

                            {/* Stream Input Channel */}
                            <div className="min-w-[400px]">
                                <StreamInput
                                    mode={inputMode}
                                    onModeChange={onInputModeChange}
                                    url={streamUrl}
                                    onUrlChange={onStreamUrlChange}
                                    platform={platform}
                                    onPlatformChange={onPlatformChange}
                                    username={username}
                                    onUsernameChange={onUsernameChange}
                                    disabled={isLive}
                                    compact={true}
                                />
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-white/10 mx-3" />

                            {/* Action Buttons */}
                            <ActionButtons
                                isRunning={isLive}
                                onStart={onStart}
                                onStop={onStop}
                                onSettings={handleSettingsToggle}
                                isSettingsOpen={isSettingsOpen}
                                onSettingsHover={handleModalHover}
                                configButtonRef={configButtonRef}
                                compact={true}
                                onManualTrigger={onManualTrigger}
                            />

                            {/* Status Indicator (Pulse) */}
                            <div className={clsx(
                                "absolute -top-1 -right-1 w-3 h-3 rounded-full border border-black/50 transition-all duration-500 z-50",
                                isLive
                                    ? platform === 'twitch' ? "bg-purple-500 shadow-[0_0_10px_purple]" : "bg-red-500 shadow-[0_0_10px_red]"
                                    : "bg-gray-600 scale-0"
                            )} />
                        </div>
                    </div>

                    {/* Right: Status Badge & User */}
                    <div className="w-80 flex justify-end items-center gap-4 pt-2 pointer-events-auto">
                        <UserMenu />
                        <StatusBadge status={isLive ? 'live' : 'System Idle'} />
                    </div>
                </div>

                {/* MOBILE LAYOUT */}
                <div className="xl:hidden w-full pointer-events-auto">
                    {/* Top Bar: Logo, Toggle (Center), & Status Indicator */}
                    <div className="relative flex items-center justify-between w-full">
                        {/* Left Group: Logo & Status Indicator */}
                        <div className="relative z-10 flex items-center gap-3 shrink-0">
                            <Link href={process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_BASE_URL || 'https://klair.live')} className="hover:opacity-80 transition-opacity">
                                <span className="text-2xl tracking-[-0.03em] font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    KLAIR
                                </span>
                            </Link>

                            {/* Status Indicator */}
                            <div className={clsx(
                                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                                isLive
                                    ? "bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"
                                    : "bg-red-500 shadow-[0_0_10px_#ef4444]"
                            )} />
                        </div>

                        {/* Centered Toggle - Transparent Background */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                            <div className="bg-black/10 backdrop-blur-sm p-0.5 rounded-full flex items-center border border-white/5">
                                <button
                                    onClick={() => onViewModeChange('streamer')}
                                    className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                        viewMode === 'streamer'
                                            ? "bg-white/10 text-white shadow-sm border border-white/10"
                                            : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    Streamer
                                </button>
                                <button
                                    onClick={() => onViewModeChange('viral')}
                                    className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                        viewMode === 'viral'
                                            ? "bg-white/10 text-white shadow-sm border border-white/10"
                                            : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    Viral
                                </button>
                            </div>
                        </div>

                        {/* Mobile User Menu */}
                        <div className="relative z-10 pr-0">
                            <UserMenu compact />
                        </div>
                    </div>

                    {/* Bottom Floating Bar: Input & Actions */}
                    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
                        <div className="pointer-events-auto w-full max-w-md flex items-center gap-1.5 p-1.5 bg-black/20 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-full">
                            <div className="flex-1 min-w-0">
                                <StreamInput
                                    mode="url"
                                    onModeChange={onInputModeChange}
                                    url={streamUrl}
                                    onUrlChange={onStreamUrlChange}
                                    platform={platform}
                                    onPlatformChange={onPlatformChange}
                                    username={username}
                                    onUsernameChange={onUsernameChange}
                                    disabled={isLive}
                                    compact={true}
                                />
                            </div>

                            {/* Mobile Actions: Just Start/Stop and Configs */}
                            <div className="shrink-0 flex items-center">
                                <ActionButtons
                                    isRunning={isLive}
                                    onStart={onStart}
                                    onStop={onStop}
                                    onSettings={handleSettingsToggle}
                                    isSettingsOpen={isSettingsOpen}
                                    compact={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Modal - Positioned relatively to the config button */}
            <div className="pointer-events-auto">
                <BufferSettingsModal
                    isOpen={isSettingsOpen}
                    onConfigSaved={onConfigSaved}
                    onClose={handleSettingsClose}
                    configButtonRef={configButtonRef}
                    onModalHover={handleModalHover}
                />
            </div>
        </header>
    );
}

