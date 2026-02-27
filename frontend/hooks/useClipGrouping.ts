/**
 * useClipGrouping Hook
 * Groups clips by platform and creator with sorting
 */

import { useMemo } from 'react';
import { Clip } from './useClipEngine';
import { GroupedPlatform } from '@/app/types/dashboard';

export function useClipGrouping(sortedClips: Clip[]): GroupedPlatform[] {
    return useMemo(() => {
        const groups: Record<string, Record<string, Clip[]>> = {};
        const allCreatorsByPlatform: Record<string, Set<string>> = {};

        // 1. Group clips by platform and creator
        sortedClips.forEach((clip) => {
            const p = (clip.platform || 'twitch').toUpperCase();
            const c = (clip.creator || 'unknown').toUpperCase();

            if (!groups[p]) groups[p] = {};
            if (!groups[p][c]) groups[p][c] = [];

            groups[p][c].push(clip);

            if (!allCreatorsByPlatform[p]) allCreatorsByPlatform[p] = new Set();
            allCreatorsByPlatform[p].add(c);
        });

        // 2. Transform to array structure
        const platformList = Object.keys(groups).map((platform) => {
            const creators = Object.keys(groups[platform]).map((creator) => {
                const cClips = groups[platform][creator];
                const newest = Math.max(...cClips.map((c) => c.created));

                return {
                    name: creator,
                    clips: cClips,
                    newestTimestamp: newest,
                };
            });

            // Sort creators by most recent activity
            creators.sort((a, b) => b.newestTimestamp - a.newestTimestamp);

            return {
                platformName: platform,
                creators: creators,
                allCreators: Array.from(allCreatorsByPlatform[platform] || []),
            };
        });

        // 3. Sort platforms (Twitch first, then alphabetical)
        platformList.sort((a, b) => {
            if (a.platformName === 'TWITCH') return -1;
            if (b.platformName === 'TWITCH') return 1;
            return a.platformName.localeCompare(b.platformName);
        });

        return platformList;
    }, [sortedClips]);
}
