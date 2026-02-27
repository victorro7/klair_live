/**
 * ViralHitsSection Component
 * Displays clips with Viral Score 90+
 */

import { Flame, ChevronDown, ChevronRight } from 'lucide-react';
import VerticalClipCard from '../clip-card/VerticalClipCard';
import { Clip } from '@/hooks/useClipEngine';
import { useState } from 'react';

interface ViralHitsSectionProps {
    clips: Clip[];
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => Promise<void> | void;
    onClipSelect: (clip: Clip) => void;
    selectedClipId?: string;
    isSelectionMode?: boolean;
    selectedClipIds?: Set<string>;
}

export function ViralHitsSection({
    clips,
    onDelete,
    onRename,
    onClipSelect,
    selectedClipId,
    isSelectionMode,
    selectedClipIds
}: ViralHitsSectionProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (clips.length === 0) return null;

    return (
        <div id="viral-hits" className="scroll-mt-20 ml-2 mb-12">
            {/* Header */}
            <div
                className="flex items-center gap-3 mb-6 cursor-pointer group select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="p-2 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <Flame className="w-6 h-6 fill-red-500" />
                </div>
                <h2 className="text-2xl font-light tracking-[-0.02em] text-white group-hover:text-red-200 transition-colors">
                    Viral Hits <span className="text-sm font-bold text-red-500 ml-2 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">{clips.length}</span>
                </h2>
                <div className="ml-auto p-1 rounded-full text-gray-400 group-hover:text-white transition-colors">
                    {isCollapsed ? <ChevronRight /> : <ChevronDown />}
                </div>
            </div>

            {/* Grid / Carousel */}
            {!isCollapsed && (
                <div className="flex flex-wrap px-4 gap-4 pt-2 pb-4">
                    {clips.map((clip) => (
                        <div key={clip.id} className="relative group w-[calc(50%-8px)] md:min-w-[160px] md:w-[160px]">
                            {/* Glow Effect for Viral Hits */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                            <VerticalClipCard
                                clip={clip}
                                onDelete={onDelete}
                                onRename={onRename}
                                onClipSelect={onClipSelect}
                                isSelected={clip.id === selectedClipId}
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
