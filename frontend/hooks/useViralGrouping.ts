/**
 * useViralGrouping Hook
 * Groups clips by viral score: Viral Hits (90+), Trending (75-89), Inbox (<75)
 * Partial clips are separated into a "Needs Retry" section.
 */

import { useMemo } from 'react';
import { Clip } from '@/hooks/useClipEngine';
import { GroupedViralClips, GroupedPlatform } from '@/app/types/dashboard';

export function useViralGrouping(sortedClips: Clip[]): GroupedViralClips {
    return useMemo(() => {
        const viral: Clip[] = [];
        const trending: Clip[] = [];
        const inboxClips: Clip[] = [];
        const needsRetry: Clip[] = [];

        // 1. Bucketing — pull out clips without AI scores first
        sortedClips.forEach((clip) => {
            const score = clip.viral_score || 0;

            // Only put in "Needs Retry" if it lacks an AI score
            if (clip.status === 'partial' && score <= 0) {
                needsRetry.push(clip);
                return;
            }

            if (score >= 90) {
                viral.push(clip);
            } else if (score >= 75) {
                trending.push(clip);
            } else {
                inboxClips.push(clip);
            }
        });

        // 2. Group Inbox Clips by Platform -> Creator
        const groups: Record<string, Record<string, Clip[]>> = {};
        const allCreatorsByPlatform: Record<string, Set<string>> = {};

        inboxClips.forEach((clip) => {
            const p = (clip.platform || 'twitch').toUpperCase();
            const c = (clip.creator || 'unknown').toUpperCase();

            if (!groups[p]) groups[p] = {};
            if (!groups[p][c]) groups[p][c] = [];

            groups[p][c].push(clip);

            if (!allCreatorsByPlatform[p]) allCreatorsByPlatform[p] = new Set();
            allCreatorsByPlatform[p].add(c);
        });

        const inbox: GroupedPlatform[] = Object.keys(groups).map((platform) => {
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

        // Sort platforms (Twitch first, then alphabetical)
        inbox.sort((a, b) => {
            if (a.platformName === 'TWITCH') return -1;
            if (b.platformName === 'TWITCH') return 1;
            return a.platformName.localeCompare(b.platformName);
        });

        return {
            viral,
            trending,
            inbox,
            needsRetry,
        };

    }, [sortedClips]);
}
