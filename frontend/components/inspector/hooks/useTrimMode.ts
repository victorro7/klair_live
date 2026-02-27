import { useState, useCallback } from 'react';
import { parseTime } from '../../../utils/timeHelpers';

interface UseTrimModeProps {
    clipId: string | number;
    startTimeStr?: string;
    endTimeStr?: string;
    onUpdate?: (id: string, updates: { start_time?: string; end_time?: string }) => Promise<void>;
}

interface UseTrimModeReturn {
    trimMode: boolean;
    setTrimMode: (value: boolean) => void;
    adjustedStartTime: number | null;
    adjustedEndTime: number | null;
    originalStartTime: number;
    originalEndTime: number | null;
    effectiveStartTime: number;
    effectiveEndTime: number | null;
    isTrimDirty: boolean;
    draggingHandle: 'start' | 'end' | null;
    setDraggingHandle: (value: 'start' | 'end' | null) => void;
    handleSaveTrimChanges: () => Promise<void>;
    handleResetTrim: () => void;
    handleBracketDrag: (wordTime: number, handle: 'start' | 'end') => void;
    isSaving: boolean;
}

/**
 * Custom hook for managing clip trim mode
 * Handles adjusted start/end times and save/reset operations
 */
export function useTrimMode({
    clipId,
    startTimeStr,
    endTimeStr,
    onUpdate,
}: UseTrimModeProps): UseTrimModeReturn {
    const [trimMode, setTrimMode] = useState(false);
    const [adjustedStartTime, setAdjustedStartTime] = useState<number | null>(null);
    const [adjustedEndTime, setAdjustedEndTime] = useState<number | null>(null);
    const [draggingHandle, setDraggingHandle] = useState<'start' | 'end' | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Parse original clip times
    const originalStartTime = parseTime(startTimeStr) ?? 0;
    const originalEndTime = parseTime(endTimeStr);

    // Effective times (adjusted or original)
    const effectiveStartTime = adjustedStartTime ?? originalStartTime;
    const effectiveEndTime = adjustedEndTime ?? originalEndTime;

    // Check if boundaries have been modified
    const isTrimDirty = adjustedStartTime !== null || adjustedEndTime !== null;

    const handleSaveTrimChanges = useCallback(async () => {
        if (!onUpdate || !isTrimDirty) return;
        setIsSaving(true);
        try {
            const updates: { start_time?: string; end_time?: string } = {};
            if (adjustedStartTime !== null) {
                updates.start_time = String(adjustedStartTime);
            }
            if (adjustedEndTime !== null) {
                updates.end_time = String(adjustedEndTime);
            }
            await onUpdate(String(clipId), updates);
            // Clear adjustments after successful save
            setAdjustedStartTime(null);
            setAdjustedEndTime(null);
            setTrimMode(false);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to save trim changes", e);
        } finally {
            setIsSaving(false);
        }
    }, [onUpdate, isTrimDirty, adjustedStartTime, adjustedEndTime, clipId]);

    const handleResetTrim = useCallback(() => {
        setAdjustedStartTime(null);
        setAdjustedEndTime(null);
    }, []);

    // Handle bracket drag to adjust times
    const handleBracketDrag = useCallback((wordTime: number, handle: 'start' | 'end') => {
        if (handle === 'start') {
            setAdjustedStartTime(wordTime);
        } else {
            setAdjustedEndTime(wordTime);
        }
        // Dispatch seek event to scrub video
        const event = new CustomEvent('seekTimestamp', {
            detail: { time: wordTime, clipId }
        });
        window.dispatchEvent(event);
    }, [clipId]);

    return {
        trimMode,
        setTrimMode,
        adjustedStartTime,
        adjustedEndTime,
        originalStartTime,
        originalEndTime,
        effectiveStartTime,
        effectiveEndTime,
        isTrimDirty,
        draggingHandle,
        setDraggingHandle,
        handleSaveTrimChanges,
        handleResetTrim,
        handleBracketDrag,
        isSaving,
    };
}
