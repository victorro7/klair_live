import { useRef, useState, useEffect, useCallback, RefObject } from 'react';
import { parseTime } from '../../../utils/timeHelpers';

interface UseVideoPlaybackProps {
    clipId: string | number;
    startTimeStr?: string;
    endTimeStr?: string;
    isSelected?: boolean;
    isSelectionMode?: boolean;
    shouldLoop?: boolean;
    autoPlay?: boolean;
    allowSeeking?: boolean;
}

interface UseVideoPlaybackReturn {
    videoRef: RefObject<HTMLVideoElement | null>;
    isHovered: boolean;
    isMuted: boolean;
    keepPlaying: boolean;
    videoFit: 'cover' | 'contain';
    isLooping: boolean;
    startTime: number;
    endTime: number | null;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleTimeUpdate: () => void;
    handleVideoEnded: () => void;
    handleLoadedMetadata: () => void;
    toggleMute: () => void;
    toggleKeepPlaying: () => void;
    toggleVideoFit: () => void;
    toggleLoop: () => void;
    clearCloseTimeout: () => void;
}

/**
 * Custom hook for video playback control in clip cards
 * Encapsulates all video state and playback logic
 */
export function useVideoPlayback({
    clipId,
    startTimeStr,
    endTimeStr,
    isSelected = false,
    isSelectionMode = false,
    shouldLoop = true,
    autoPlay = false,
    allowSeeking = false,
}: UseVideoPlaybackProps): UseVideoPlaybackReturn {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Playback controls
    // Playback controls
    const [isMuted, setIsMuted] = useState(true);
    const [keepPlaying, setKeepPlaying] = useState(autoPlay);
    const [videoFit, setVideoFit] = useState<'cover' | 'contain'>('cover');
    const [isLooping, setIsLooping] = useState(shouldLoop);

    // Sync isLooping with prop changes
    useEffect(() => {
        setIsLooping(shouldLoop);
    }, [shouldLoop]);

    // Reset playback state when clip changes
    useEffect(() => {
        setKeepPlaying(autoPlay);
    }, [clipId, autoPlay]);

    // Hover state
    const [isHovered, setIsHovered] = useState(false);

    // Refs for state tracking to avoid closure staleness
    const shouldPlayRef = useRef(false);
    const isSeekingRef = useRef(false);
    const lastTimeRef = useRef<number>(0);
    const stallCountRef = useRef<number>(0);
    const playPromiseRef = useRef<Promise<void> | null>(null);

    // Timeout refs
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Parse times
    const startTime = parseTime(startTimeStr) || 0;
    const endTime = parseTime(endTimeStr);

    /**
     * Safe Play Helper
     * Wraps video.play() to handle AbortError and prevent race conditions.
     */
    const safePlay = useCallback(async (vid: HTMLVideoElement, force = false) => {
        if (!force && playPromiseRef.current) {
            // Already trying to play, let it finish unless forced
            return;
        }

        try {
            playPromiseRef.current = vid.play();
            await playPromiseRef.current;
        } catch (error: any) {
            // AbortError is expected if we pause/seek while loading
            if (error.name !== 'AbortError') {
                if (process.env.NODE_ENV === 'development') console.error("Video Playback Error:", error);
            }
        } finally {
            // Only clear if we are the current promise (handling race of forced plays)
            // Actually, just clear it.
            playPromiseRef.current = null;
        }
    }, []);

    // Auto-unmute when selected (Inspector mode) - UPDATED: Now we STOP playing when selected
    useEffect(() => {
        if (isSelected && !isSelectionMode) {
            setKeepPlaying(false);
            setIsMuted(true);
        } else {
            setKeepPlaying(false);
            setIsMuted(true);
        }
    }, [isSelected, isSelectionMode]);

    // Main playback effect
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        // Don't play if selected (since it's playing in the main player)
        const shouldPlay = !isSelected && Boolean((isHovered && !isSelectionMode) || keepPlaying);
        shouldPlayRef.current = shouldPlay;

        if (shouldPlay) {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
                pauseTimeoutRef.current = null;
            }
            vid.muted = isMuted;

            // Only force reset time if we are WAY off
            if (vid.currentTime < startTime || (endTime && vid.currentTime >= endTime)) {
                vid.currentTime = startTime;
            }

            safePlay(vid);
        } else {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
            // Small delay to prevent flickering on quick mouse interactions
            pauseTimeoutRef.current = setTimeout(() => {
                vid.pause();
                // Reset to start when leaving
                vid.currentTime = startTime;
            }, 200);
        }

        return () => {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
        };
    }, [isHovered, keepPlaying, isMuted, startTime, endTime, isSelected, isSelectionMode, safePlay]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            const vid = videoRef.current;
            if (vid) {
                vid.pause();
                playPromiseRef.current = null;
            }
        }
    }, []);

    // Recovery effect: Resume if React re-render paused it unexpectedly
    useEffect(() => {
        const vid = videoRef.current;
        if (vid && shouldPlayRef.current && vid.paused && !isSeekingRef.current) {
            safePlay(vid);
        }
    });

    // Watchdog: Periodically check if video is stuck
    useEffect(() => {
        const checkInterval = setInterval(() => {
            const vid = videoRef.current;
            if (!vid) return;

            // Only intervene if we expect it to be playing
            if (shouldPlayRef.current && !isSeekingRef.current) {
                const currentTime = vid.currentTime;
                const effectiveEndTime = endTime || vid.duration;

                // Case 0: Explicitly finished (non-looping)
                if (!shouldLoop && effectiveEndTime && currentTime >= effectiveEndTime - 0.2 && vid.paused) {
                    // We are paused at the end and shouldn't loop. Do nothing.
                    return;
                }

                // Case 1: Video managed to go past endTime manually
                if (endTime && currentTime >= endTime && !vid.ended) {
                    if (shouldLoop) {
                        // Force loop immediately.
                        vid.currentTime = startTime;
                        safePlay(vid, true);
                        stallCountRef.current = 0;
                    } else {
                        vid.pause();
                        stallCountRef.current = 0;
                    }
                }
                // Case 2: Stuck/Paused unexpectedly
                else if (vid.paused && !vid.ended && vid.readyState > 2) {
                    // Check if valid to play
                    if (playPromiseRef.current === null) {
                        const isFinished = !shouldLoop && effectiveEndTime && currentTime >= effectiveEndTime - 0.2;
                        if (!isFinished) {
                            safePlay(vid);
                        }
                    }
                }
                // Case 3: Stall detection - Video is "playing" but time hasn't moved
                else if (!vid.paused && !vid.ended && vid.readyState > 2) {
                    if (Math.abs(currentTime - lastTimeRef.current) < 0.01) {
                        stallCountRef.current += 1;

                        const isNearEnd = effectiveEndTime && (effectiveEndTime - currentTime < 0.5);

                        // If we stall near the end, it's likely the Chrome EOF freeze bug.
                        // Rescue immediately (don't wait 1s).
                        // Otherwise wait for ~1s (4 ticks) for generic buffering/stalls.
                        const stallThreshold = isNearEnd ? 1 : 4;

                        if (stallCountRef.current >= stallThreshold) {
                            if (process.env.NODE_ENV === 'development') console.log("Watchdog: Stall rescue", { isNearEnd, currentTime, readyState: vid.readyState });
                            vid.pause();
                            vid.currentTime = startTime;
                            requestAnimationFrame(() => safePlay(vid, true));
                            stallCountRef.current = 0;
                        }
                    } else {
                        stallCountRef.current = 0;
                    }
                }

                lastTimeRef.current = currentTime;
            } else {
                stallCountRef.current = 0;
            }
        }, 250);

        return () => clearInterval(checkInterval);
    }, [startTime, endTime, safePlay, shouldLoop]);

    // Seek event listener for Inspector timeline clicks
    useEffect(() => {
        const handleSeek = (e: CustomEvent) => {
            // Only respond if seeking is explicitly allowed for this instance
            if (!allowSeeking || !e.detail || String(e.detail.clipId) !== String(clipId)) {
                return;
            }

            const vid = videoRef.current;
            if (vid) {
                isSeekingRef.current = true;
                stallCountRef.current = 0;

                let seekTime = e.detail.time;
                // Clamp
                if (Number.isFinite(vid.duration)) {
                    seekTime = Math.min(Math.max(0, seekTime), vid.duration - 0.01);
                }

                if (process.env.NODE_ENV === 'development') console.log("handleSeek: Executing seek", { seekTime });

                // We don't need to force pause if we just update currentTime
                // But for smoothness, sometimes pausing helps.
                // Let's rely on browser behavior: setting currentTime might trigger 'seeking'
                vid.currentTime = seekTime;

                // If it was playing, or SHOULD be playing, ensure it seeks then plays
                if (shouldPlayRef.current) {
                    // Wait for seek to mostly be done?
                    // Actually, just calling play() after setting currentTime is usually fine
                    // unless we spam it. safePlay handles the spam.
                    safePlay(vid, true).finally(() => { // Force play
                        // Small delay to allow seek to settle internally
                        setTimeout(() => {
                            isSeekingRef.current = false;
                        }, 100);
                    });
                } else {
                    isSeekingRef.current = false;
                }
            }
        };

        window.addEventListener('seekTimestamp', handleSeek as EventListener);
        return () => {
            window.removeEventListener('seekTimestamp', handleSeek as EventListener);
        };
    }, [allowSeeking, clipId, safePlay]);

    // Handlers
    const clearCloseTimeout = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);

    const handleMouseEnter = useCallback(() => {
        clearCloseTimeout();
        setIsHovered(true);
    }, [clearCloseTimeout]);

    const handleMouseLeave = useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 40);
    }, []);

    const handleTimeUpdate = useCallback(() => {
        const vid = videoRef.current;
        if (!vid || isSeekingRef.current) return;

        // 1. Sanity Check
        if (vid.currentTime < startTime - 0.5) {
            if (startTime > 0) vid.currentTime = startTime;
        }

        // 2. Loop Logic
        const effectiveEndTime = endTime || vid.duration;

        if (effectiveEndTime && Number.isFinite(effectiveEndTime)) {
            // Calculate a safe threshold for active looping.
            // Standard: 0.1s before end.
            // Short clips: Must NOT trigger before startTime or we get infinite loops at start.
            const clipDuration = effectiveEndTime - startTime;

            // If clip is extremely short (<0.2s), limit the buffer to 10% of duration
            // otherwise use 0.1s buffer.
            const buffer = (clipDuration < 0.2) ? (clipDuration * 0.1) : 0.1;
            const threshold = effectiveEndTime - buffer;

            if (vid.currentTime >= threshold) {
                // Check if we are already effectively at start (loop happened) to avoid spamming
                if (vid.currentTime < startTime + (buffer * 0.5)) return;

                if (isLooping) {
                    vid.pause();
                    vid.currentTime = startTime;
                    stallCountRef.current = 0;
                    safePlay(vid, true);
                } else {
                    // Stop playing effectively
                    vid.pause();
                    setKeepPlaying(false); // Update state to reflect stopped
                }
            }
        }
    }, [startTime, endTime, safePlay, isLooping]);

    const handleVideoEnded = useCallback(() => {
        const vid = videoRef.current;
        if (process.env.NODE_ENV === 'development') console.log("handleVideoEnded triggered");
        if (vid) {
            stallCountRef.current = 0;
            if (isLooping) {
                vid.currentTime = startTime;
                requestAnimationFrame(() => safePlay(vid, true));
            } else {
                vid.pause();
                setKeepPlaying(false);
            }
        }
    }, [startTime, safePlay, isLooping]);

    const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);
    const toggleKeepPlaying = useCallback(() => setKeepPlaying(prev => !prev), []);
    const toggleVideoFit = useCallback(() => setVideoFit(prev => prev === 'cover' ? 'contain' : 'cover'), []);
    const toggleLoop = useCallback(() => setIsLooping(prev => !prev), []);

    const handleLoadedMetadata = useCallback(() => {
        const vid = videoRef.current;
        if (vid && !shouldPlayRef.current) {
            // Force a slight seek to ensure the first frame renders on iOS
            vid.currentTime = startTime + 0.01;
        }
    }, [startTime]);

    return {
        videoRef,
        isHovered,
        isMuted,
        keepPlaying,
        videoFit,
        isLooping,
        startTime,
        endTime,
        handleMouseEnter,
        handleMouseLeave,
        handleTimeUpdate,
        handleVideoEnded,
        handleLoadedMetadata,
        toggleMute,
        toggleKeepPlaying,
        toggleVideoFit,
        toggleLoop,
        clearCloseTimeout,
    };
}
