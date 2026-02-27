/**
 * Shared Clip Types
 */

export interface EngineStatus {
    running: boolean;
    stream_url: string;
    clip_cooldown: number;
}

export interface Clip {
    id: string | number;
    filename: string;
    created: number;
    url: string;
    viral_score?: number;
    status?: 'processing' | 'ready' | 'partial';
    description?: string;
    reason?: string;
    hashtags?: string[];
    captions?: string[];
    start_time?: string;
    end_time?: string;
    platform?: string;
    creator?: string;
    transcript?: string;
    transcript_json?: any;
    posted_to_tiktok_at?: string;
}

export interface BufferConfig {
    pre_buffer: number;
    post_buffer: number;
    enable_realtime_voice?: boolean;
    clip_cooldown?: number;
}

export interface ClipUpdatePayload {
    filename?: string;
    transcript?: string;
    description?: string;
    hashtags?: string[];
    captions?: string[];
    transcript_json?: any;
    start_time?: string;
    end_time?: string;
}

export interface StartEnginePayload {
    url?: string;
    platform?: string;
    username?: string;
}

export interface LogEntry {
    message: string;
    timestamp: Date;
}
