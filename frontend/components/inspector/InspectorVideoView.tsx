import React from 'react';
import { Clip } from '@/hooks/useClipEngine';
import { VideoPlayer } from '../clip-card/VideoPlayer';
import { useVideoPlayback } from '../clip-card/hooks/useVideoPlayback';
import { GlassPanel } from '../ui/GlassPanel';
import { X, Volume2, VolumeX, Repeat, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculateDuration } from '../../utils/timeHelpers';

export interface InspectorVideoViewProps {
    clip: Clip;
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

export function InspectorVideoView({ clip, onClose, onNext, onPrevious, hasNext, hasPrevious }: InspectorVideoViewProps) {
    const {
        videoRef,
        isHovered,
        isMuted,
        keepPlaying,
        videoFit,
        handleMouseEnter,
        handleMouseLeave,
        handleTimeUpdate,
        handleVideoEnded,
        toggleMute,
        toggleKeepPlaying,
        toggleVideoFit,
        toggleLoop,
        isLooping,
        clearCloseTimeout
    } = useVideoPlayback({
        clipId: clip.id,
        startTimeStr: clip.start_time,
        endTimeStr: clip.end_time,
        autoPlay: true,
        allowSeeking: true, // Enable transcript clicking for this view
    });

    // Backend URL handling
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const videoSrc = clip.url?.startsWith("http") ? clip.url : `${backendUrl}${clip.url || ""}`;

    // Calculate duration
    const duration = calculateDuration(clip.start_time, clip.end_time);

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if sensitive elements are focused
            if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            if (e.key.toLowerCase() === 'm') {
                toggleMute();
            } else if (e.key.toLowerCase() === 'l') {
                toggleLoop();
            } else if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                toggleKeepPlaying();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleMute, toggleKeepPlaying, toggleLoop]);

    return (
        <GlassPanel className="h-full flex flex-col relative overflow-hidden bg-black/40 ring-1 ring-white/10" glowColor="purple">
            {/* Top Control Bar */}
            <div className="p-2 border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
                {/* Duration Badge */}
                <div className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-white/70">
                    {Math.round(duration)}s
                </div>

                <div className="flex items-center gap-1">
                    {/* Navigation */}
                    <button
                        onClick={onPrevious}
                        disabled={!hasPrevious}
                        className={`p-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-200 group ${hasPrevious
                            ? 'bg-black/50 hover:bg-black/80 text-white/70 hover:text-white'
                            : 'bg-black/20 text-white/20 cursor-not-allowed border-white/5'
                            }`}
                    >
                        <ChevronLeft size={16} className={`transition-transform ${hasPrevious ? 'group-hover:-translate-x-0.5' : ''}`} />
                    </button>

                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className={`p-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-200 group ${hasNext
                            ? 'bg-black/50 hover:bg-black/80 text-white/70 hover:text-white'
                            : 'bg-black/20 text-white/20 cursor-not-allowed border-white/5'
                            }`}
                    >
                        <ChevronRight size={16} className={`transition-transform ${hasNext ? 'group-hover:translate-x-0.5' : ''}`} />
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white/70 hover:text-white transition-all duration-200 group backdrop-blur-md"
                    >
                        <X size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Video Area */}
            <div
                className="flex-1 min-h-0 flex items-center justify-center bg-black/5 relative cursor-pointer" // Added cursor-pointer
                onClick={toggleKeepPlaying} // Toggle play/pause on click
            >
                <div className="relative w-full h-full shadow-2xl bg-black overflow-hidden border border-white/5">
                    <VideoPlayer
                        videoRef={videoRef}
                        videoSrc={videoSrc}
                        videoFit={videoFit}
                        isMuted={isMuted}
                        isHovered={isHovered}
                        keepPlaying={keepPlaying} // Allow hook to control state
                        isLoading={false}
                        videoError={false}
                        viralityScore={null}
                        duration={duration}
                        onLoadedData={() => { }}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleVideoEnded}
                        onError={() => { }}
                        className="h-full"
                    />
                </div>
            </div>

            {/* Footer with Controls */}
            <div className="p-4 border-t border-white/5 flex items-center justify-center gap-3">
                {/* Mute Toggle */}
                <button
                    onClick={toggleMute}
                    className={`p-2 rounded-lg border transition-all duration-200 ${isMuted
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                        : 'bg-purple-500/10 border-white/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-500/30'
                        }`}
                    title={isMuted ? "Unmute (m)" : "Mute (m)"}
                >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Loop Toggle */}
                <button
                    onClick={toggleLoop}
                    className={`p-2 rounded-lg border transition-all duration-200 ${isLooping
                        ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    title={isLooping ? "Loop On (l)" : "Loop Off (l)"}
                >
                    <Repeat size={16} />
                </button>

                {/* Fit/Fill Toggle */}
                <button
                    onClick={toggleVideoFit}
                    className={`p-2 rounded-lg border transition-all duration-200 ${videoFit === 'contain'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    title={videoFit === 'cover' ? "Show full video" : "Fill screen"}
                >
                    {videoFit === 'contain' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
            </div>
        </GlassPanel>
    );
}
