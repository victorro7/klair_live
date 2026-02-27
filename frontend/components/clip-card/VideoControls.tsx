import React from 'react';
import { Volume2, VolumeX, Repeat, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';

interface VideoControlsProps {
    isMuted: boolean;
    keepPlaying: boolean;
    videoFit: 'cover' | 'contain';
    isVisible: boolean;
    isSelectionMode?: boolean;
    onMuteToggle: () => void;
    onKeepPlayingToggle: () => void;
    onVideoFitToggle: () => void;
    onMouseEnter?: () => void;
}

/**
 * VideoControls Component
 * Mute, loop, and video fit toggle buttons
 */
export function VideoControls({
    isMuted,
    keepPlaying,
    videoFit,
    isVisible,
    isSelectionMode = false,
    onMuteToggle,
    onKeepPlayingToggle,
    onVideoFitToggle,
    onMouseEnter,
    className,
}: VideoControlsProps & { className?: string }) {
    return (
        <div
            className={clsx(
                "flex gap-1.5 transition-all duration-300 z-20",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                isSelectionMode ? "opacity-0 pointer-events-none" : "",
                className
            )}
            onMouseEnter={onMouseEnter}
        >
            {/* Mute Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
                className={clsx(
                    "p-1.5 rounded-lg backdrop-blur-xl border transition-all shadow-lg hover:scale-105",
                    isMuted
                        ? "bg-black/60 border-white/10 text-gray-300 hover:text-white"
                        : "bg-purple-500/80 border-purple-400/30 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                )}
            >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            {/* Keep Playing Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onKeepPlayingToggle(); }}
                className={clsx(
                    "p-1.5 rounded-lg backdrop-blur-xl border transition-all shadow-lg hover:scale-105",
                    keepPlaying
                        ? "bg-green-500/80 border-green-400/30 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        : "bg-black/60 border-white/10 text-gray-300 hover:text-white"
                )}
            >
                <Repeat size={14} />
            </button>

            {/* Video Fit Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onVideoFitToggle(); }}
                className={clsx(
                    "p-1.5 rounded-lg backdrop-blur-xl border transition-all shadow-lg hover:scale-105",
                    videoFit === 'contain'
                        ? "bg-blue-500/80 border-blue-400/30 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "bg-black/60 border-white/10 text-gray-300 hover:text-white"
                )}
                title={videoFit === 'cover' ? "Show full video" : "Fill screen"}
            >
                {videoFit === 'contain' ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
        </div>
    );
}
