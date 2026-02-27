/**
 * useClipFiltering Hook
 * Manages creator visibility and collapse state
 */

import { useState, useCallback } from 'react';

export function useClipFiltering() {
    const [hiddenCreators, setHiddenCreators] = useState<Set<string>>(new Set());
    const [collapsedCreators, setCollapsedCreators] = useState<Set<string>>(new Set());

    const toggleCreatorVisibility = useCallback((creator: string) => {
        setHiddenCreators((prev) => {
            const next = new Set(prev);
            if (next.has(creator)) {
                next.delete(creator);
            } else {
                next.add(creator);
            }
            return next;
        });
    }, []);

    const toggleCreatorCollapse = useCallback((creator: string) => {
        setCollapsedCreators((prev) => {
            const next = new Set(prev);
            if (next.has(creator)) {
                next.delete(creator);
            } else {
                next.add(creator);
            }
            return next;
        });
    }, []);

    return {
        hiddenCreators,
        collapsedCreators,
        setHiddenCreators,
        setCollapsedCreators,
        toggleCreatorVisibility,
        toggleCreatorCollapse,
    };
}
