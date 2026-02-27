/**
 * StreamInput Component
 * Handles stream URL or manual platform/username input
 */

import { Globe } from 'lucide-react';
import { InputMode, Platform } from '@/app/types/dashboard';
import { Dropdown, DropdownOption } from '../ui/Dropdown';

interface StreamInputProps {
    mode: InputMode;
    onModeChange: (mode: InputMode) => void;
    url: string;
    onUrlChange: (url: string) => void;
    platform: Platform;
    onPlatformChange: (platform: Platform) => void;
    username: string;
    onUsernameChange: (username: string) => void;
    disabled: boolean;
    compact?: boolean;
}

export function StreamInput({
    mode,
    onModeChange,
    url,
    onUrlChange,
    platform,
    onPlatformChange,
    username,
    onUsernameChange,
    disabled,
    compact = false,
}: StreamInputProps) {
    const platformOptions: DropdownOption<Platform>[] = [
        { value: 'twitch', label: 'Twitch' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'kick', label: 'Kick' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
    ];

    if (compact) {
        return (
            <div className="relative group/input w-full">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-500" />

                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                    type="text"
                    placeholder="Paste Link..."
                    value={mode === 'url' ? url : username}
                    onChange={(e) => {
                        onModeChange('url');
                        onUrlChange(e.target.value);
                    }}
                    disabled={disabled}
                    className="relative w-full bg-transparent hover:bg-white/5 focus:bg-white/10 border-none rounded-full pl-10 pr-4 py-2.5 text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mode Toggle - Liquid Glass */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-xl border border-white/5 shadow-inner">
                <button
                    onClick={() => onModeChange('url')}
                    disabled={disabled}
                    className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'url'
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    URL
                </button>
                <button
                    onClick={() => onModeChange('manual')}
                    disabled={disabled}
                    className={`py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'manual'
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Manual
                </button>
            </div>

            {/* URL Input Mode - Liquid Glass */}
            {mode === 'url' && (
                <div className="relative group/input">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-500" />

                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                    <input
                        type="text"
                        placeholder="https://www.twitch.tv/..."
                        value={url}
                        onChange={(e) => onUrlChange(e.target.value)}
                        disabled={disabled}
                        className="relative w-full bg-white/5 hover:bg-white/10 focus:bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-xs font-medium text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
            )}

            {/* Manual Input Mode - Liquid Glass */}
            {mode === 'manual' && (
                <div className="space-y-3">
                    <Dropdown
                        options={platformOptions}
                        value={platform}
                        onChange={onPlatformChange}
                        placeholder="Select Platform"
                    />
                    <div className="relative group/input">
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-500" />

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => onUsernameChange(e.target.value)}
                            disabled={disabled}
                            className="relative w-full bg-white/5 hover:bg-white/10 focus:bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-xs font-medium text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
