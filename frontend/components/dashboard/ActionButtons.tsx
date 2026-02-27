/**
 * ActionButtons Component
 * Start, Stop, and Config buttons for stream control
 */

import { Play, Square, Settings, Scissors } from 'lucide-react';
import { forwardRef } from 'react';

interface ActionButtonsProps {
    isRunning: boolean;
    onStart: () => void;
    onStop: () => void;
    onSettings: () => void;
    isSettingsOpen: boolean;
    onSettingsHover?: (isHovered: boolean) => void;
    configButtonRef?: React.RefObject<HTMLButtonElement | null>;
    compact?: boolean;
    onManualTrigger?: () => void;
}

export const ActionButtons = forwardRef<HTMLDivElement, ActionButtonsProps>(({
    isRunning,
    onStart,
    onStop,
    onSettings,
    isSettingsOpen,
    onSettingsHover,
    configButtonRef,
    compact = false,
    onManualTrigger,
}, ref) => {
    if (compact) {
        return (
            <div ref={ref} className="flex items-center gap-1">
                {/* Start/Stop Buttons - Mutually Exclusive */}
                {!isRunning ? (
                    <button
                        onClick={onStart}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-green-500/10 text-gray-400 hover:text-green-400 border border-transparent hover:border-green-500/30 transition-all group"
                    >
                        <Play className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100" />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Start</span>
                    </button>
                ) : (
                    <button
                        onClick={onStop}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all group"
                    >
                        <Square className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100" />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Stop</span>
                    </button>
                )}

                {/* Manual Clip Button - Only show if running or allow always? Usually enabled when running */}
                {onManualTrigger && (
                    <button
                        onClick={onManualTrigger}
                        disabled={!isRunning}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 border border-transparent hover:border-purple-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                        title="Clip Last"
                    >
                        <Scissors className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Clip</span>
                    </button>
                )}

                {/* Config Button */}
                <button
                    ref={configButtonRef}
                    onClick={onSettings}
                    onMouseEnter={() => onSettingsHover?.(true)}
                    onMouseLeave={() => onSettingsHover?.(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all group ${isSettingsOpen
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-white/5 hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 border border-transparent hover:border-purple-500/30'
                        }`}
                >
                    <Settings className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Configs</span>
                </button>
            </div>
        );
    }

    return (
        <div ref={ref} className="grid grid-cols-3 gap-3">
            {/* Start Button - Liquid Glass */}
            <button
                onClick={onStart}
                disabled={isRunning}
                className="relative overflow-hidden flex flex-col items-center justify-center gap-2 bg-black/40 hover:bg-green-500/5 text-gray-400 hover:text-green-400 border border-white/10 hover:border-green-500/30 p-5 rounded-3xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group backdrop-blur-2xl shadow-lg hover:shadow-green-900/10 ring-1 ring-white/5"
            >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                <span className="text-[10px] font-bold uppercase tracking-wider relative z-10">Start</span>
            </button>

            {/* Stop Button - Liquid Glass */}
            <button
                onClick={onStop}
                disabled={!isRunning}
                className="relative overflow-hidden flex flex-col items-center justify-center gap-2 bg-black/40 hover:bg-red-500/5 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 p-5 rounded-3xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group backdrop-blur-2xl shadow-lg hover:shadow-red-900/10 ring-1 ring-white/5"
            >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Square className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                <span className="text-[10px] font-bold uppercase tracking-wider relative z-10">Stop</span>
            </button>

            {/* Config Button - Liquid Glass */}
            <button
                ref={configButtonRef}
                onClick={onSettings}
                onMouseEnter={() => onSettingsHover?.(true)}
                onMouseLeave={() => onSettingsHover?.(false)}
                className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 p-5 rounded-3xl transition-all group backdrop-blur-2xl shadow-lg ring-1 ring-white/5 ${isSettingsOpen
                    ? 'bg-black/40 border-purple-500/30 text-purple-400 shadow-purple-900/10'
                    : 'bg-black/40 hover:bg-purple-500/5 text-gray-400 hover:text-purple-400 border border-white/10 hover:border-purple-500/30 hover:shadow-purple-900/10'
                    }`}
            >
                {/* Hover/Active Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent transition-opacity ${isSettingsOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                <Settings className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                <span className="text-[10px] font-bold uppercase tracking-wider relative z-10">Configs</span>
            </button>
        </div>
    );
});

ActionButtons.displayName = 'ActionButtons';

