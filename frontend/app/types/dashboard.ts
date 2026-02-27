/**
 * Dashboard Type Definitions
 * Shared types for the dashboard feature
 */

import { Clip } from './clip';

export type SortOption = 'viral-desc' | 'viral-asc' | 'newest' | 'oldest';
export type InputMode = 'url' | 'manual';
export type Platform = 'twitch' | 'youtube' | 'kick' | 'instagram' | 'tiktok';

export interface StreamConfig {
    mode: InputMode;
    url?: string;
    platform?: Platform;
    username?: string;
}

export interface GroupedCreator {
    name: string;
    clips: Clip[];
    newestTimestamp: number;
}

export interface GroupedPlatform {
    platformName: string;
    creators: GroupedCreator[];
    allCreators: string[];
}

export type ViewMode = 'streamer' | 'viral';

export interface GroupedViralClips {
    viral: Clip[];      // Score >= 90
    trending: Clip[];   // Score 75-89
    inbox: GroupedPlatform[]; // Score < 75
    needsRetry: Clip[]; // Status === 'partial'
}
