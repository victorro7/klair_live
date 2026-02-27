/**
 * TrendingSwimlane Component
 * Displays clips with Viral Score 75-89 in a horizontal scroll
 */

import { TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';
import VerticalClipCard from '../clip-card/VerticalClipCard';
import { Clip } from '@/hooks/useClipEngine';
import { useState } from 'react';

interface TrendingSwimlaneProps {
    clips: Clip[];
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => Promise<void> | void;
    onClipSelect: (clip: Clip) => void;
    selectedClipId?: string;
    isSelectionMode?: boolean;
    selectedClipIds?: Set<string>;
    // Customization props
    title?: string;
    icon?: ReactNode;
    color?: 'orange' | 'amber';
    id?: string;
}

const colorMap = {
    orange: {
        bg: 'bg-orange-500/10',
        bgHover: 'group-hover:bg-orange-500/20',
        text: 'text-orange-400',
        hoverText: 'group-hover:text-orange-200',
        badgeBg: 'bg-orange-500/10',
        badgeBorder: 'border-orange-500/20',
    },
    amber: {
        bg: 'bg-amber-500/10',
        bgHover: 'group-hover:bg-amber-500/20',
        text: 'text-amber-400',
        hoverText: 'group-hover:text-amber-200',
        badgeBg: 'bg-amber-500/10',
        badgeBorder: 'border-amber-500/20',
    },
};

export function TrendingSwimlane({
    clips,
    onDelete,
    onRename,
    onClipSelect,
    selectedClipId,
    isSelectionMode,
    selectedClipIds,
    title = 'Trending',
    icon,
    color = 'orange',
    id: sectionId = 'trending',
}: TrendingSwimlaneProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (clips.length === 0) return null;

    const c = colorMap[color];

    return (
        <div id={sectionId} className="scroll-mt-20 ml-2 mb-12">
            {/* Header */}
            <div
                className="flex items-center gap-3 mb-4 cursor-pointer group select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className={`p-1.5 rounded-full ${c.bg} ${c.text} ${c.bgHover} transition-colors`}>
                    {icon || <TrendingUp className="w-5 h-5" />}
                </div>
                <h2 className={`text-xl font-light tracking-[-0.02em] text-gray-200 ${c.hoverText} transition-colors`}>
                    {title} <span className={`text-xs font-bold ${c.text} ml-2 ${c.badgeBg} px-2 py-0.5 rounded-full border ${c.badgeBorder}`}>{clips.length}</span>
                </h2>
                <div className="ml-auto p-1 rounded-full text-gray-400 group-hover:text-white transition-colors">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {/* Swimlane (Wrapping Grid) */}
            {!isCollapsed && (
                <div className="flex flex-wrap px-4 gap-4 pt-2 pb-4">
                    {clips.map((clip) => (
                        <div key={clip.id} className="w-[calc(50%-8px)] md:min-w-[160px] md:w-[160px]">
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
