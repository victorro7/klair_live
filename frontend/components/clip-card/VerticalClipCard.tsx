import React, { useState, memo } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { Clip } from '@/hooks/useClipEngine';
import { GlassPanel } from '../ui/GlassPanel';
import clsx from 'clsx';
import { motion } from 'framer-motion';

// Sub-components
import { VideoPlayer } from './VideoPlayer';
import { VideoControls } from './VideoControls';
import { ClipMetadata } from './ClipMetadata';

// Hooks
import { useVideoPlayback } from './hooks/useVideoPlayback';

// Utils
import { calculateDuration } from '../../utils/timeHelpers';
import { getBackendUrl } from '../../utils/clipHelpers';

// --- Component Types ---
interface VerticalClipCardProps {
    clip: Clip;
    onDownload?: (filename: string) => void;
    onDelete: (id: string) => void | Promise<void>;
    onRename: (id: string, newN: string) => Promise<void> | void;
    onClipSelect: (clip: Clip) => void;
    isSelected?: boolean;
    isSelectionMode?: boolean;
    isBatchSelected?: boolean;
}

/**
 * VerticalClipCard Component
 * A video clip card with playback controls, metadata display, and selection state
 */
const VerticalClipCard: React.FC<VerticalClipCardProps> = memo(({
    clip,
    onDelete,
    onClipSelect,
    isSelected,
    isSelectionMode,
    isBatchSelected
}) => {
    // Loading/error state
    const [isLoading, setIsLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Use video playback hook
    const {
        videoRef,
        isHovered,
        isMuted,
        keepPlaying,
        videoFit,
        startTime,
        handleMouseEnter,
        handleMouseLeave,
        handleTimeUpdate,
        handleVideoEnded,
        handleLoadedMetadata,
        toggleMute,
        toggleKeepPlaying,
        toggleVideoFit,
        clearCloseTimeout,
    } = useVideoPlayback({
        clipId: clip.id,
        startTimeStr: clip.start_time,
        endTimeStr: clip.end_time,
        isSelected,
        isSelectionMode,
        shouldLoop: !isSelected, // Don't loop if selected
    });

    // Derived values
    const duration = calculateDuration(clip.start_time, clip.end_time);
    const viralityScore = clip.viral_score;
    const backendUrl = getBackendUrl();
    // Append #t=startTime to force iOS to render the frame at that timestamp
    const videoSrcUrl = clip.url?.startsWith("http") ? clip.url : `${backendUrl}${clip.url || ""}`;
    const videoSrc = `${videoSrcUrl}#t=${startTime}`;

    // Handlers
    const handleVideoLoad = () => {
        setIsLoading(false);
        setVideoError(false);
    };

    const handleVideoError = () => {
        setVideoError(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(String(clip.id));
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error("Delete failed", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // "Glass shard" ease
            className="relative h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Main Card */}
            <GlassPanel
                className={clsx(
                    "h-full flex flex-col overflow-hidden transition-all duration-300 cursor-pointer group !border-x-0 !border-t-0 !border-b !border-white/20 !ring-0 !rounded-[24px]",
                    isHovered && !isSelectionMode ? "scale-[1.02] shadow-2xl shadow-purple-500/10" : "",
                    isSelected ? "shadow-[0_0_40px_rgba(168,85,247,0.4)]" : "",
                    isSelectionMode && "ring-1 ring-white/10 hover:ring-white/30",
                    isBatchSelected && "bg-purple-500/10"
                )}
                glowColor={isHovered || isSelected ? "purple" : "none"}
                onClick={() => onClipSelect(clip)}
            >
                {/* Active Gradient Border Overlay - Faded Top */}
                {isSelected && !isSelectionMode && (
                    <div className="absolute inset-0 z-50 pointer-events-none rounded-none"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent 20%, black 80%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 80%)'
                        }}
                    >
                        <div className="absolute inset-0 rounded-none border-[2px] border-transparent bg-gradient-to-br from-purple-400 via-fuchsia-400 to-indigo-500"
                            style={{
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                                WebkitMaskComposite: 'xor',
                            }}
                        />
                    </div>
                )}

                {/* Batch Selection Overlay */}
                {isSelectionMode && (
                    <div className="absolute top-2 left-2 z-50 pointer-events-none">
                        <div className={clsx(
                            "w-5 h-5 rounded border flex items-center justify-center transition-all",
                            isBatchSelected ? "bg-red-500 border-red-500" : "bg-black/40 border-white/30"
                        )}>
                            {isBatchSelected && <Trash2 size={12} className="text-white" />}
                        </div>
                    </div>
                )}

                {/* Active Selection Overlay */}
                {isSelected && !isSelectionMode && (
                    <div className="absolute inset-0 z-40 bg-purple-500/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none border-[3px] border-purple-500/50">
                        <div className="bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-xl animate-in fade-in zoom-in duration-300">
                            <Eye className="w-6 h-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        </div>
                        <div className="absolute bottom-16 bg-black/60 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-wider text-purple-200">
                            Viewing
                        </div>
                    </div>
                )}

                {/* Video Player */}
                <VideoPlayer
                    videoRef={videoRef}
                    videoSrc={videoSrc}
                    videoFit={videoFit}
                    isMuted={isMuted}
                    isHovered={isHovered}
                    keepPlaying={keepPlaying}
                    isLoading={isLoading}
                    videoError={videoError}
                    viralityScore={viralityScore}
                    duration={duration}
                    hideViralBadge={isSelected}
                    isPartial={clip.status === 'partial'}
                    onLoadedData={handleVideoLoad}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    className="aspect-[9/16]"
                />





                {/* Metadata (when not selected) */}
                {!isSelected && (
                    <ClipMetadata
                        viralityScore={viralityScore}
                        createdTimestamp={clip.created}
                        videoSrc={videoSrc}
                        isDeleting={isDeleting}
                        isSelectionMode={isSelectionMode}
                        onDelete={handleDelete}
                        isHovered={isHovered}
                        controls={
                            <VideoControls
                                isMuted={isMuted}
                                keepPlaying={keepPlaying}
                                videoFit={videoFit}
                                isVisible={true} // Always valid when rendered here
                                isSelectionMode={isSelectionMode}
                                onMuteToggle={toggleMute}
                                onKeepPlayingToggle={toggleKeepPlaying}
                                onVideoFitToggle={toggleVideoFit}
                                onMouseEnter={clearCloseTimeout}
                                className="scale-90 origin-right" // Slightly smaller to fit
                            />
                        }
                    />
                )}
            </GlassPanel>
        </motion.div>
    );
});

VerticalClipCard.displayName = 'VerticalClipCard';

export default VerticalClipCard;
