import React, { useState, RefObject } from 'react';
import { Play, RefreshCw, AlertTriangle, Star } from 'lucide-react';
import clsx from 'clsx';
import { isViralScore } from '../../utils/scoreHelpers';

interface VideoPlayerProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    videoSrc: string;
    videoFit: 'cover' | 'contain';
    isMuted: boolean;
    isHovered: boolean;
    keepPlaying: boolean;
    isLoading: boolean;
    videoError: boolean;
    viralityScore?: number | null;
    duration: number;
    hideViralBadge?: boolean;
    isPartial?: boolean;
    onLoadedData: () => void;
    onLoadedMetadata?: () => void;
    onTimeUpdate: () => void;
    onEnded: () => void;
    onError: () => void;
    className?: string;
}

/**
 * VideoPlayer Component
 * Renders the video element with loading/error states and badges
 */
export function VideoPlayer({
    videoRef,
    videoSrc,
    videoFit,
    isMuted,
    isHovered,
    keepPlaying,
    isLoading,
    videoError,
    viralityScore,
    duration,
    hideViralBadge,
    isPartial,
    onLoadedData,
    onLoadedMetadata,
    onTimeUpdate,
    onEnded,
    onError,
    className,
}: VideoPlayerProps) {
    return (
        <div className={clsx("relative w-full bg-black flex-1", className)}>
            <video
                ref={videoRef}
                className={clsx(
                    "absolute inset-0 w-full h-full transition-all duration-300",
                    videoFit === 'cover' ? "object-cover" : "object-contain bg-black",
                    "opacity-90 group-hover:opacity-100"
                )}
                preload="auto"
                muted={isMuted}
                playsInline
                src={videoSrc}
                onLoadedData={onLoadedData}
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                onError={(e) => {
                    const target = e.currentTarget;
                    if (target.networkState === target.NETWORK_NO_SOURCE) {
                        if (process.env.NODE_ENV === 'development') console.error("Video Error: Failed to load video source");
                        onError();
                    }
                }}
                onEnded={onEnded}
            />

            {/* Loading State - Only show when trying to play */}
            {isLoading && !videoError && (isHovered || keepPlaying) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                    <RefreshCw className="animate-spin text-purple-400 w-6 h-6 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                </div>
            )}

            {/* Error State */}
            {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center z-10 border border-red-500/10">
                    <AlertTriangle className="text-red-500 w-8 h-8 mb-2 drop-shadow-lg" />
                    <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Unavailable</span>
                </div>
            )}

            {/* Viral Badge */}
            {!hideViralBadge && isViralScore(viralityScore) && (
                <div className="absolute bottom-2 left-2 z-20">
                    <div className="relative overflow-hidden bg-green-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-400/50">
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                        <Star size={10} className="mr-1 fill-black" /> VIRAL
                    </div>
                </div>
            )}

            {/* Partial Badge */}
            {!hideViralBadge && isPartial && (
                <div className="absolute top-2 left-2 z-20">
                    <div className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center border border-amber-500/30 backdrop-blur-md">
                        <AlertTriangle size={10} className="" />
                    </div>
                </div>
            )}



            {/* Play Button Overlay - Show if not hovering/playing */}
            {(!isHovered && !keepPlaying) && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10">
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="text-white fill-white w-5 h-5 ml-0.5 drop-shadow-md" />
                    </div>
                </div>
            )}
        </div>
    );
}
