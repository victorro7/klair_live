import { useState, useEffect, useRef, useCallback } from 'react';
import { Clip, EngineStatus, BufferConfig, LogEntry } from '../app/types/clip';
import { clipService } from '../app/services/clipService';
import { supabase } from '@/lib/supabase';

const isDev = process.env.NODE_ENV === 'development';

export type { Clip, EngineStatus, BufferConfig };

/**
 * useClipEngine Hook
 * Manages engine state, logs, and clip operations via clipService
 */
export function useClipEngine() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [status, setStatus] = useState<EngineStatus | null>(null);
    const [clips, setClips] = useState<Clip[]>([]);
    const [config, setConfig] = useState<BufferConfig | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const [isLoadingClips, setIsLoadingClips] = useState(true);

    // --- Data Fetching ---

    const fetchStatus = useCallback(async () => {
        try {
            const data = await clipService.fetchStatus();
            setStatus(data);
        } catch (e) {
            if (isDev) console.error("Failed to fetch status", e);
        }
    }, []);

    const fetchClips = useCallback(async () => {
        try {
            const data = await clipService.fetchClips();
            setClips(data);
        } catch (e) {
            if (isDev) console.error("Failed to fetch clips", e);
        } finally {
            setIsLoadingClips(false);
        }
    }, []);

    const fetchConfig = useCallback(async () => {
        try {
            const data = await clipService.fetchConfig();
            setConfig(data);
        } catch (e) {
            if (isDev) console.error("Failed to fetch config", e);
        }
    }, []);

    // --- Polling & WebSocket ---

    useEffect(() => {
        fetchStatus();
        fetchClips();
        fetchConfig();

        // --- 1. Subscriptions ---
        // Listen to engine_state
        const engineSub = supabase.channel('engine_state_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'engine_state' }, (payload) => {
                const newRow = payload.new as { is_running?: boolean, stream_url?: string };
                if (newRow && typeof newRow.is_running !== 'undefined') {
                    setStatus(prev => prev ? {
                        ...prev,
                        running: newRow.is_running ?? false,
                        stream_url: newRow.stream_url ?? ""
                    } : {
                        running: newRow.is_running ?? false,
                        stream_url: newRow.stream_url ?? "",
                        clip_cooldown: config?.clip_cooldown || 60
                    });
                }
            })
            .subscribe();

        // Listen to clips
        // Realtime sends raw DB columns — transform to match Clip interface
        const transformRealtimeClip = (raw: any): Clip => {
            let created = 0;
            if (raw.created_at) {
                try { created = new Date(raw.created_at).getTime() / 1000; } catch { }
            }
            return {
                id: raw.id,
                filename: raw.filename || '',
                created,
                url: raw.download_url || '',
                viral_score: raw.viral_score,
                status: raw.status || 'ready',
                description: raw.description,
                reason: raw.viral_reason,
                hashtags: raw.hashtags || [],
                captions: raw.captions || [],
                start_time: raw.start_time,
                end_time: raw.end_time,
                platform: raw.platform,
                creator: raw.creator,
                transcript: raw.transcript,
                transcript_json: raw.transcript_json,
                posted_to_tiktok_at: raw.posted_to_tiktok_at,
            };
        };

        const clipsSub = supabase.channel('clips_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clips' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    const raw = payload.new;
                    // Skip clips still processing (no video URL yet)
                    if (raw.status === 'processing') return;
                    setClips(prev => [transformRealtimeClip(raw), ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    const raw = payload.new;
                    const transformed = transformRealtimeClip(raw);
                    setClips(prev => {
                        const exists = prev.some(clip => clip.id === raw.id);
                        if (exists) {
                            // Update existing clip with transformed data
                            return prev.map(clip =>
                                clip.id === raw.id ? { ...clip, ...transformed } : clip
                            );
                        } else if (raw.status !== 'processing') {
                            // Clip transitioned from processing → ready/partial, add it
                            return [transformed, ...prev];
                        }
                        return prev;
                    });
                } else if (payload.eventType === 'DELETE') {
                    setClips(prev => prev.filter(clip => clip.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(engineSub);
            supabase.removeChannel(clipsSub);
        };
    }, [fetchStatus, fetchClips, fetchConfig, config?.clip_cooldown]);

    useEffect(() => {
        const connectWS = async () => {
            // Get token for WebSocket Auth
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;

            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            // Pass token to getWsUrl
            const ws = new WebSocket(clipService.getWsUrl(token));
            ws.onopen = () => { if (isDev) console.log('WS Connected'); };
            ws.onmessage = (event) => {
                const logEntry = { message: event.data, timestamp: new Date() };
                setLogs((prev) => [...prev.slice(-99), logEntry]);
            };
            ws.onclose = () => { if (isDev) console.log('WS Disconnected'); };
            wsRef.current = ws;
        };

        connectWS();
        return () => {
            wsRef.current?.close();
        };
    }, []);

    // --- Actions ---

    const deleteClip = useCallback(async (id: string | number) => {
        try {
            await clipService.deleteClip(id);
            await fetchClips();
        } catch (e) {
            if (isDev) console.error("Delete failed", e);
            throw e;
        }
    }, [fetchClips]);

    const renameClip = useCallback(async (id: string | number, newFilename: string) => {
        try {
            await clipService.renameClip(id, newFilename);
            await fetchClips();
        } catch (e) {
            if (isDev) console.error("Rename failed", e);
            throw e;
        }
    }, [fetchClips]);

    const updateClip = useCallback(async (id: string | number, updates: Partial<Clip>) => {
        try {
            await clipService.updateClip(id, updates);
            await fetchClips();
        } catch (e) {
            if (isDev) console.error("Update failed", e);
            throw e;
        }
    }, [fetchClips]);

    const deleteClipsBatch = useCallback(async (ids: string[]) => {
        try {
            await clipService.deleteClipsBatch(ids);
            await fetchClips();
        } catch (e) {
            if (isDev) console.error("Batch delete failed", e);
            throw e;
        }
    }, [fetchClips]);

    const startEngine = useCallback(async (props?: { url?: string, platform?: string, username?: string }) => {
        try {
            await clipService.startEngine(props);
            fetchStatus();
        } catch (e) {
            if (isDev) console.error("Start failed", e);
        }
    }, [fetchStatus]);

    const stopEngine = useCallback(async () => {
        try {
            await clipService.stopEngine();
            fetchStatus();
        } catch (e) {
            if (isDev) console.error("Stop failed", e);
        }
    }, [fetchStatus]);

    const manualTrigger = useCallback(async () => {
        try {
            await clipService.manualTrigger();
        } catch (e) {
            if (isDev) console.error("Trigger failed", e);
        }
    }, []);

    return {
        logs,
        status,
        clips,
        config,
        isLoadingClips,
        startEngine,
        stopEngine,
        manualTrigger,
        fetchClips,
        fetchConfig,
        deleteClip,
        deleteClipsBatch,
        renameClip,
        updateClip
    };
}
