/**
 * ClipGallery Component
 * Main gallery displaying all clips organized by platform and creator
 */

import {
    Clock, Flame, MessageCircle, Play, Share2, AlertCircle, ArrowUpDown, Trash2,
    X, Plus, RefreshCw, Layers, CheckCircle2, ChevronDown, Download, MonitorPlay, Zap, AlertTriangle
} from 'lucide-react';
import { PlatformSection } from './PlatformSection';
import { SortOption } from '@/app/types/dashboard';
import { Clip } from '@/hooks/useClipEngine';
import { Dropdown, DropdownOption } from '../ui/Dropdown';
import { PlatformIcon } from './PlatformIcon';
import clsx from 'clsx';

import { SearchingState } from './SearchingState';
import { EmptyState } from './EmptyState';
import { GroupedPlatform, ViewMode, GroupedViralClips } from '@/app/types/dashboard';
import { ViralHitsSection } from './ViralHitsSection';
import { TrendingSwimlane } from './TrendingSwimlane';



interface ClipGalleryProps {
    clipCount: number;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    groupedData: GroupedPlatform[];
    groupedViralData?: GroupedViralClips;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    hiddenCreators: Set<string>;
    collapsedCreators: Set<string>;
    onToggleCreatorCollapse: (creator: string) => void;
    onManagePlatform: (platform: string) => void;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => void;
    onClipSelect: (clip: Clip) => void;
    selectedClipId?: string;
    isLoading?: boolean;

    // Batch Props
    isSelectionMode?: boolean;
    selectedClipIds?: Set<string>;
    onToggleSelectionMode?: () => void;
    onBatchDelete?: () => void;
}

export function ClipGallery({
    clipCount,
    viewMode,
    onViewModeChange,
    groupedData,
    groupedViralData,
    sortOption,
    onSortChange,
    hiddenCreators,
    collapsedCreators,
    onToggleCreatorCollapse,
    onManagePlatform,
    onDelete,
    onRename,
    onClipSelect,
    selectedClipId,
    isLoading,
    isSelectionMode,
    selectedClipIds,
    onToggleSelectionMode,
    onBatchDelete,
}: ClipGalleryProps) {
    const sortOptions: DropdownOption<SortOption>[] = [
        { value: 'viral-desc', label: 'Viral Score ↓' },
        { value: 'viral-asc', label: 'Viral Score ↑' },
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
    ];

    if (isLoading && clipCount === 0) {
        return <SearchingState />;
    }

    // When a clip is selected, go compact (icon-only) so everything fits on one line
    const isCompact = !!selectedClipId;

    return (
        <div className="h-full flex flex-col">
            {/* Gallery Header with Clip Count - Sticky */}
            <div className="sticky top-0 z-30 shadow-sm -mx-6 px-6 pb-2 transition-all">
                <div className="flex items-center gap-3 pb-2">
                    <span className={clsx("font-normal text-white tracking-[-0.025em] transition-all", isCompact ? "text-3xl" : "text-5xl")} style={{ fontWeight: 400 }}>
                        {clipCount}
                    </span>

                    {/* View Mode Segmented Control */}
                    <div className="hidden xl:flex bg-white/5 p-1 rounded-full items-center border border-white/5">
                        <button
                            onClick={() => onViewModeChange('streamer')}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                                viewMode === 'streamer'
                                    ? "bg-white text-black shadow-lg"
                                    : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {isCompact ? <MonitorPlay className="w-3.5 h-3.5" /> : "Streamer"}
                        </button>
                        <button
                            onClick={() => onViewModeChange('viral')}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                                viewMode === 'viral'
                                    ? "bg-white text-black shadow-lg"
                                    : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {isCompact ? <Zap className="w-3.5 h-3.5" /> : "Viral"}
                        </button>
                    </div>

                    {/* Batch Selection Controls */}
                    {onToggleSelectionMode && (
                        <div className="flex items-center gap-2">
                            {isSelectionMode ? (
                                <>
                                    <button
                                        onClick={onBatchDelete}
                                        disabled={!selectedClipIds || selectedClipIds.size === 0}
                                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 backdrop-blur-md border border-red-500/20 hover:border-red-500/40 text-red-500 rounded-full px-4 py-1.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_-5px_var(--shadow-color)] hover:shadow-[0_0_20px_-5px_var(--shadow-color)]"
                                        style={{ '--shadow-color': 'rgba(239,68,68,0.4)' } as React.CSSProperties}
                                        title="Delete Selected"
                                    >
                                        <Trash2 size={14} />
                                        <span className="font-medium text-xs font-mono">{selectedClipIds?.size || 0}</span>
                                    </button>
                                    <button
                                        onClick={onToggleSelectionMode}
                                        className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 hover:border-white/20 rounded-full text-white/50 hover:text-white transition-all duration-300"
                                        title="Cancel Selection"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onToggleSelectionMode}
                                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/10 active:bg-red-500/20 backdrop-blur-md border border-white/5 hover:border-red-500/30 rounded-full text-white/50 hover:text-red-500 transition-all duration-300 group"
                                    title="Select Clips to Delete"
                                >
                                    <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="w-px h-8 bg-white/10" />

                    {/* Sort Dropdown */}
                    <div className={isCompact ? "w-auto" : "w-auto md:w-48"}>
                        <Dropdown
                            options={sortOptions}
                            value={sortOption}
                            onChange={onSortChange}
                            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
                            hideValueOnMobile={isCompact ? true : true}
                            hideValue={isCompact}
                            menuClassName={isCompact ? "min-w-[140px]" : ""}
                        />
                    </div>

                    {/* Quick Navigation Links — icon-only when compact */}
                    {viewMode === 'viral' && (groupedViralData?.viral?.length || groupedViralData?.trending?.length || groupedViralData?.inbox?.length || groupedViralData?.needsRetry?.length) ? (
                        <>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex items-center gap-2">
                                {groupedViralData?.viral && groupedViralData.viral.length > 0 && (
                                    <button onClick={() => document.getElementById('viral-hits')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors whitespace-nowrap border border-red-500/20 group">
                                        <Flame className="w-4 h-4" />
                                        {!isCompact && <span className="text-[11px] uppercase tracking-widest font-bold">Viral</span>}
                                    </button>
                                )}
                                {groupedViralData?.trending && groupedViralData.trending.length > 0 && (
                                    <button onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition-colors whitespace-nowrap border border-orange-500/20 group">
                                        <Zap className="w-4 h-4" />
                                        {!isCompact && <span className="text-[11px] uppercase tracking-widest font-bold">Trending</span>}
                                    </button>
                                )}
                                {groupedViralData?.inbox.map((p) => (
                                    <button key={`nav-${p.platformName}`} onClick={() => document.getElementById(p.platformName)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors whitespace-nowrap border border-white/10 group">
                                        {isCompact ? (
                                            <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">{p.platformName.charAt(0)}</span>
                                        ) : (
                                            <span className="text-[11px] uppercase tracking-widest font-bold">{p.platformName}</span>
                                        )}
                                    </button>
                                ))}
                                {groupedViralData?.needsRetry && groupedViralData.needsRetry.length > 0 && (
                                    <button onClick={() => document.getElementById('needs-retry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors whitespace-nowrap border border-amber-500/20 group">
                                        <AlertTriangle className="w-4 h-4" />
                                        {!isCompact && <span className="text-[11px] uppercase tracking-widest font-bold">Retry</span>}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto pt-2 pb-32 scrollbar-hide">

                {/* Platform Sections / Viral Sections */}

                {viewMode === 'streamer' ? (
                    // --- STREAMER VIEW ---
                    <>
                        {groupedData.map(({ platformName, creators, allCreators }) => (
                            <PlatformSection
                                key={platformName}
                                platformName={platformName}
                                creators={creators}
                                allCreators={allCreators}
                                hiddenCreators={hiddenCreators}
                                collapsedCreators={collapsedCreators}
                                onToggleCreatorCollapse={onToggleCreatorCollapse}
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
                        {groupedData.length === 0 && (
                            <EmptyState />
                        )}
                    </>
                ) : (
                    // --- VIRAL VIEW ---
                    <>
                        {groupedViralData?.viral && (
                            <ViralHitsSection
                                clips={groupedViralData.viral}
                                onDelete={onDelete}
                                onRename={onRename}
                                onClipSelect={onClipSelect}
                                selectedClipId={selectedClipId}
                                isSelectionMode={isSelectionMode}
                                selectedClipIds={selectedClipIds}
                            />
                        )}

                        {groupedViralData?.trending && (
                            <TrendingSwimlane
                                clips={groupedViralData.trending}
                                onDelete={onDelete}
                                onRename={onRename}
                                onClipSelect={onClipSelect}
                                selectedClipId={selectedClipId}
                                isSelectionMode={isSelectionMode}
                                selectedClipIds={selectedClipIds}
                            />
                        )}

                        {/* Inbox (Grouped by Platform) */}
                        {groupedViralData?.inbox.map(({ platformName, creators, allCreators }) => (
                            <PlatformSection
                                key={`inbox-${platformName}`}
                                platformName={platformName}
                                creators={creators}
                                allCreators={allCreators}
                                hiddenCreators={hiddenCreators}
                                collapsedCreators={collapsedCreators}
                                onToggleCreatorCollapse={onToggleCreatorCollapse}
                                onDelete={onDelete}
                                onRename={onRename}
                                onClipSelect={onClipSelect}
                                selectedClipId={selectedClipId}
                                onManagePlatform={onManagePlatform}
                                isSelectionMode={isSelectionMode}
                                selectedClipIds={selectedClipIds}
                            />
                        ))}

                        {/* Needs Retry Section (Partial Clips) */}
                        {groupedViralData?.needsRetry && groupedViralData.needsRetry.length > 0 && (
                            <TrendingSwimlane
                                clips={groupedViralData.needsRetry}
                                onDelete={onDelete}
                                onRename={onRename}
                                onClipSelect={onClipSelect}
                                selectedClipId={selectedClipId}
                                isSelectionMode={isSelectionMode}
                                selectedClipIds={selectedClipIds}
                                title="Needs Retry"
                                icon={<AlertTriangle className="w-5 h-5" />}
                                color="amber"
                                id="needs-retry"
                            />
                        )}

                        {/* Empty State for Viral View */}
                        {(!groupedViralData || (groupedViralData.viral.length === 0 && groupedViralData.trending.length === 0 && groupedViralData.inbox.length === 0 && groupedViralData.needsRetry.length === 0)) && (
                            <EmptyState />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
