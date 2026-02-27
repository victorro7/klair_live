import { ChevronDown, ChevronRight } from 'lucide-react';
import VerticalClipCard from '../clip-card/VerticalClipCard';
import { Clip } from '@/hooks/useClipEngine';
import { PlatformIcon } from './PlatformIcon';

interface CreatorSectionProps {
    name: string;
    platformName: string;
    clips: Clip[];
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => Promise<void> | void;
    onClipSelect: (clip: Clip) => void;
    selectedClipId?: string;
    onManagePlatform: (platformName: string) => void;
    // Batch Props
    isSelectionMode?: boolean;
    selectedClipIds?: Set<string>;
}

export function CreatorSection({
    name,
    platformName,
    clips,
    isCollapsed,
    onToggleCollapse,
    onDelete,
    onRename,
    onClipSelect,
    selectedClipId,
    onManagePlatform,
    isSelectionMode,
    selectedClipIds,
}: CreatorSectionProps) {
    return (
        <div className="mb-4">
            {/* Creator Header - Accordion Style */}
            <div
                className="flex items-center gap-3 mb-2 cursor-pointer select-none w-fit group"
                onClick={onToggleCollapse}
            >
                <div className="p-1 rounded-full bg-white/5 group-hover:bg-purple-500/20 text-gray-400 group-hover:text-purple-400 transition-colors">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>

                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onManagePlatform(platformName);
                    }}
                    className="cursor-pointer hover:scale-110 transition-transform"
                >
                    <PlatformIcon platformName={platformName} className="w-5 h-5" />
                </div>

                <h3
                    className="text-lg font-normal tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600 group-hover:from-purple-400 group-hover:to-purple-600 transition-all"
                    style={{ fontWeight: 400 }}
                >
                    {name}
                </h3>

                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-gray-400 border border-white/5">
                    {clips.length} {clips.length === 1 ? 'Clip' : 'Clips'}
                </span>
            </div>

            {/* Clips Grid */}
            {!isCollapsed && (
                <div className="flex flex-wrap px-2 md:px-0 gap-4">
                    {clips.map((clip) => (
                        <div key={clip.id} className="w-[calc(50%-8px)] md:min-w-[160px] md:w-[160px]">
                            <VerticalClipCard
                                clip={clip}
                                onDelete={onDelete}
                                onRename={onRename}
                                onClipSelect={onClipSelect}
                                isSelected={clip.id === selectedClipId}

                                // Batch Prop
                                isSelectionMode={isSelectionMode}
                                isBatchSelected={selectedClipIds?.has(String(clip.id))}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
