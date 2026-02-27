/**
 * useStreamControls Hook
 * Manages stream input state and configuration
 */

import { useState, useCallback } from 'react';
import { InputMode, Platform, StreamConfig } from '@/app/types/dashboard';

export function useStreamControls() {
    const [inputMode, setInputMode] = useState<InputMode>('url');
    const [streamUrl, setStreamUrl] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('twitch');
    const [targetUsername, setTargetUsername] = useState('');

    const getStreamConfig = useCallback((): StreamConfig => {
        if (inputMode === 'url') {
            return { mode: 'url', url: streamUrl };
        } else {
            return {
                mode: 'manual',
                platform: selectedPlatform,
                username: targetUsername
            };
        }
    }, [inputMode, streamUrl, selectedPlatform, targetUsername]);

    return {
        inputMode,
        setInputMode,
        streamUrl,
        setStreamUrl,
        selectedPlatform,
        setSelectedPlatform,
        targetUsername,
        setTargetUsername,
        getStreamConfig,
    };
}
