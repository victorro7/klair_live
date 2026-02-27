import React from 'react';
import { Download, Trash2, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { getScorePillClasses } from '../../utils/scoreHelpers';

interface ClipMetadataProps {
    viralityScore?: number | null;
    createdTimestamp?: number;
    videoSrc: string;
    isDeleting: boolean;
    isSelectionMode?: boolean;
    onDelete: () => void;
    controls?: React.ReactNode;
    isHovered?: boolean;
}

/**
 * ClipMetadata Component
 * Displays score, date (swaps for controls on hover), and action buttons
 */
export function ClipMetadata({
    viralityScore,
    createdTimestamp,
    videoSrc,
    isDeleting,
    isSelectionMode = false,
    onDelete,
    controls,
    isHovered,
}: ClipMetadataProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div
            className="p-3 flex flex-col flex-1 relative z-10 bg-transparent min-h-[85px] justify-between"
        >
            {/* Header: Score & (Date or Controls) */}
            <div className="flex items-center h-8 relative w-full">
                {/* Mini Score Pill */}
                <div className={clsx(
                    "flex items-center gap-2 transition-all duration-300 absolute left-0 z-20",
                    isHovered && controls ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
                )}>
                    <div className={clsx(
                        "flex items-center gap-1 px-2 py-0.5 rounded-lg border bg-black/40 backdrop-blur-sm",
                        getScorePillClasses(viralityScore)
                    )}>
                        <span className="text-sm font-black tracking-tight">{viralityScore || '-'}</span>
                    </div>
                </div>

                {/* Right Side: Toggle between Date and Controls */}
                <div className={clsx(
                    "flex items-center transition-all duration-300 absolute inset-0 z-10",
                    isHovered && controls ? "justify-center w-full" : "justify-end w-full"
                )}>
                    {isHovered && controls ? (
                        <div className="animate-in fade-in zoom-in-95 duration-200 flex items-center justify-center gap-1">
                            {controls}
                        </div>
                    ) : (
                        createdTimestamp && (
                            <span className="hidden md:block text-[9px] font-bold uppercase tracking-wider text-gray-500 animate-in fade-in duration-300 whitespace-nowrap">
                                {new Date(createdTimestamp > 10000000000 ? createdTimestamp : createdTimestamp * 1000).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className={clsx(
                "mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-white/5",
                isSelectionMode ? "opacity-20 pointer-events-none blur-[1px]" : ""
            )}>
                <a
                    href={videoSrc}
                    download
                    target="_blank"
                    className="relative flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white p-2.5 rounded-xl transition-all hover:shadow-lg group/btn overflow-hidden"
                    title="Save clip"
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <Download size={14} />
                </a>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={clsx(
                        "relative flex items-center justify-center gap-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 p-2.5 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]",
                        isDeleting && "opacity-50 cursor-not-allowed"
                    )}
                    title="Delete clip"
                >
                    {isDeleting ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
                </button>
            </div>
        </div>
    );
}
