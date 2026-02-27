/**
 * useClipSorting Hook
 * Manages clip sorting logic and state
 */

import { useState, useMemo, useEffect } from 'react';
import { Clip } from './useClipEngine';
import { SortOption } from '@/app/types/dashboard';

export function useClipSorting(clips: Clip[]) {
    const [sortOption, setSortOption] = useState<SortOption>('viral-desc');

    useEffect(() => {
        try {
            const savedSort = localStorage.getItem('klair_dashboard_sortOption') as SortOption | null;
            if (savedSort && ['viral-desc', 'viral-asc', 'newest', 'oldest'].includes(savedSort)) {
                setSortOption(savedSort);
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to read sortOption from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('klair_dashboard_sortOption', sortOption);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to save sortOption to localStorage", e);
        }
    }, [sortOption]);

    const sortedClips = useMemo(() => {
        const sorted = [...clips];
        return sorted.sort((a, b) => {
            if (sortOption === 'viral-desc') return (b.viral_score || 0) - (a.viral_score || 0);
            if (sortOption === 'viral-asc') return (a.viral_score || 0) - (b.viral_score || 0);
            if (sortOption === 'newest') return b.created - a.created;
            if (sortOption === 'oldest') return a.created - b.created;
            return 0;
        });
    }, [clips, sortOption]);

    return {
        sortedClips,
        sortOption,
        setSortOption,
    };
}
