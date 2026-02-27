/**
 * PlatformSection Component
 * Displays all creators and clips for a specific platform
 */

import { CreatorSection } from './CreatorSection';
import { Clip } from '@/hooks/useClipEngine';

interface Creator {
    name: string;
    clips: Clip[];
    newestTimestamp: number;
}

interface PlatformSectionProps {
    platformName: string;
    creators: Creator[];
    allCreators: string[];
    hiddenCreators: Set<string>;
    collapsedCreators: Set<string>;
    onToggleCreatorCollapse: (creator: string) => void;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => void;
    onClipSelect: (clip: Clip) => void;
    selectedClipId?: string;
    onManagePlatform: (platform: string) => void;
    // Batch Props
    isSelectionMode?: boolean;
    selectedClipIds?: Set<string>;
}

export function PlatformSection({
    platformName,
    creators,
    allCreators,
    hiddenCreators,
    collapsedCreators,
    onToggleCreatorCollapse,
    onDelete,
    onRename,
    onClipSelect,
    selectedClipId,
    onManagePlatform,
    isSelectionMode,
    selectedClipIds,
}: PlatformSectionProps) {
    // Platform icons and colors - MOVED TO PlatformIcon.tsx

    // Filter visible creators
    const visibleCreators = creators.filter((c) => !hiddenCreators.has(c.name));
    const totalClips = visibleCreators.reduce((sum, c) => sum + c.clips.length, 0);

    if (visibleCreators.length === 0) return null;

    return (
        <div id={platformName} className="scroll-mt-20 mb-6">
            {/* Creator Sections */}
            {visibleCreators.map(({ name, clips }) => (
                <CreatorSection
                    key={name}
                    name={name}
                    platformName={platformName}
                    clips={clips}
                    isCollapsed={collapsedCreators.has(name)}
                    onToggleCollapse={() => onToggleCreatorCollapse(name)}
                    onDelete={onDelete}
                    onRename={onRename}
                    onClipSelect={onClipSelect}
                    selectedClipId={selectedClipId}
                    onManagePlatform={onManagePlatform}

                    // Batch Props
                    isSelectionMode={isSelectionMode}
                    selectedClipIds={selectedClipIds}
                />
            ))}
        </div>
    );
}
