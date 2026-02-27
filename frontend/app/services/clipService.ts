import { Clip, ClipUpdatePayload, StartEnginePayload, EngineStatus, BufferConfig } from '../types/clip';
import { getBackendUrl } from '@/utils/clipHelpers';

const isDev = process.env.NODE_ENV === 'development';
const API_URL = getBackendUrl();
const WS_URL = `${API_URL.replace(/^http/, 'ws')}/ws/logs`;

import { supabase } from '@/lib/supabase';

/**
 * Helper to get current session token
 */
async function getAuthToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
}

/**
 * ClipService - API Abstraction Layer
 */
export const clipService = {
    // --- WebSocket URL ---
    getWsUrl: (token?: string) => {
        if (token) return `${WS_URL}?token=${token}`;
        return WS_URL;
    },

    // --- Status & Config ---
    async fetchStatus(): Promise<EngineStatus> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        try {
            const res = await fetch(`${API_URL}/status`, { headers });
            if (!res.ok) throw new Error("Failed to fetch status");
            return res.json();
        } catch (e) {
            // Return offline status to prevent UI errors/logs when backend is down
            return { running: false, stream_url: "", clip_cooldown: 0 };
        }
    },

    async fetchConfig(): Promise<BufferConfig> {
        const token = await getAuthToken();

        // If not logged in, return defaults to mask actual server state
        if (!token) {
            return {
                pre_buffer: 30, // Default visual state
                post_buffer: 10,
                enable_realtime_voice: false
            };
        }

        const headers: HeadersInit = { 'Authorization': `Bearer ${token}` };

        try {
            const res = await fetch(`${API_URL}/config`, { headers });
            if (!res.ok) throw new Error("Failed to fetch config");
            return res.json();
        } catch (e) {
            if (isDev) console.warn("Config fetch failed, using defaults", e);
            return {
                pre_buffer: 30,
                post_buffer: 10,
                enable_realtime_voice: false
            };
        }
    },

    // --- Clip Management ---
    async fetchClips(): Promise<Clip[]> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/clips`, { headers });
        if (!res.ok) {
            if (isDev) console.error("Failed to fetch clips API error", await res.text().catch(() => ""));
            return [];
        }
        return res.json();
    },

    async deleteClip(id: string | number): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/clips/${id}`, {
            method: 'DELETE',
            headers
        });
        if (!res.ok) throw new Error("Failed to delete clip");
    },

    async retryClip(id: string | number): Promise<{ message: string; status: string }> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/clips/retry/${id}`, {
            method: 'POST',
            headers
        });
        if (!res.ok) throw new Error("Failed to retry clip");
        return res.json();
    },

    async deleteClipsBatch(ids: string[]): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const res = await fetch(`${API_URL}/clips/delete-batch`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ clip_ids: ids })
        });
        if (!res.ok) throw new Error("Failed to batch delete clips");
    },

    async renameClip(id: string | number, newName: string): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const res = await fetch(`${API_URL}/clips/rename`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ id, new_name: newName })
        });
        if (!res.ok) throw new Error("Failed to rename clip");
    },

    async updateClip(id: string | number, updates: ClipUpdatePayload): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const res = await fetch(`${API_URL}/clips/update`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ id, ...updates })
        });
        if (!res.ok) throw new Error("Failed to update clip");
    },

    // --- Engine Control ---
    // Engine Control routes (start/stop) are technically protected in full system but currently open in router logic?
    // Let's check backend... backend router logic often open for control but better to wrap them too just in case.
    // For now we assume control routes might be open or we just add token if we have it.
    async startEngine(payload?: StartEnginePayload): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        await fetch(`${API_URL}/control/start`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload || {})
        });
    },

    async stopEngine(): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        await fetch(`${API_URL}/control/stop`, { method: 'POST', headers });
    },

    async manualTrigger(): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        await fetch(`${API_URL}/control/trigger`, { method: 'POST', headers });
    },

    // --- Profile Management ---
    async getProfile(): Promise<{ platform_handles: Record<string, string[] | string> }> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/profile`, { headers });
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
    },

    async updateProfile(platform_handles: Record<string, string[] | string>): Promise<void> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const res = await fetch(`${API_URL}/profile`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ platform_handles })
        });
        if (!res.ok) throw new Error("Failed to update profile");
    },

    async getTikTokAuthUrl(): Promise<{ url: string }> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/tiktok/auth-url`, { headers });
        if (!res.ok) throw new Error("Failed to get TikTok auth URL");
        return res.json();
    },

    async exchangeTikTokCode(code: string, state: string): Promise<{ status: string, username: string }> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const res = await fetch(`${API_URL}/tiktok/exchange`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ code, state })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.detail || "Failed to exchange TikTok code");
        }

        return res.json();
    },

    async getTikTokCreatorInfo(): Promise<any> {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        try {
            const res = await fetch(`${API_URL}/tiktok/creator-info`, { headers });
            if (!res.ok) throw new Error("Failed to get TikTok creator info");
            const resJson = await res.json();
            return resJson.data;
        } catch (error) {
            if (isDev) console.error(error);
            return null;
        }
    },

    async publishToTikTok(
        clipId: string,
        target: 'direct' | 'inbox',
        caption: string,
        hashtags: string[],
        options?: {
            privacy_level?: string;
            disable_comment?: boolean;
            disable_duet?: boolean;
            disable_stitch?: boolean;
        }
    ): Promise<any> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const res = await fetch(`${API_URL}/tiktok/publish`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                clip_id: clipId,
                target,
                caption,
                hashtags,
                ...(options || {})
            })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.detail || "Failed to publish to TikTok");
        }

        return res.json();
    },

    async getTikTokPublishStatus(publishId: string): Promise<any> {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const res = await fetch(`${API_URL}/tiktok/publish/status`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ publish_id: publishId })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.detail || "Failed to get TikTok publish status");
        }

        return res.json();
    }
};
