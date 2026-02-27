import React from 'react';
import { X, RefreshCw } from 'lucide-react';
import { getScoreColor } from '../../utils/scoreHelpers';
import clsx from 'clsx';

interface InspectorHeaderProps {
    viralityScore?: number | null;
    filename: string;
    isSaving: boolean;
    isPartial?: boolean;
    isRetrying?: boolean;
    postedToTikTokAt?: string;
    onFilenameChange: (value: string) => void;
    onFilenameSave: () => void;
    onClose: () => void;
    onRetry?: () => void;
}

/**
 * InspectorHeader Component
 * Displays close button, retry/posted indicators, score box, and filename input
 */
export function InspectorHeader({
    viralityScore,
    filename,
    isSaving,
    isPartial = false,
    isRetrying = false,
    postedToTikTokAt,
    onFilenameChange,
    onFilenameSave,
    onClose,
    onRetry,
}: InspectorHeaderProps) {
    const scoreColor = getScoreColor(viralityScore);

    return (
        <div className="p-2 border-b border-white/5 flex flex-col gap-3 relative z-20 bg-black/20">
            <div className="flex items-center justify-between">
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold group"
                >
                    <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                        <X className="w-3.5 h-3.5" />
                    </div>
                    Close
                </button>
                <div className="flex items-center gap-3">
                    {isSaving && (
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider animate-pulse">
                            Saving...
                        </span>
                    )}
                    {isPartial && (
                        <button
                            onClick={onRetry}
                            disabled={isRetrying}
                            className={clsx(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all",
                                isRetrying
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 cursor-wait"
                                    : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30"
                            )}
                        >
                            <RefreshCw className={clsx("w-3 h-3", isRetrying && "animate-spin")} />
                            {!isRetrying && (
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    Retry
                                </span>
                            )}
                        </button>
                    )}
                    {postedToTikTokAt && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Posted · {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(postedToTikTokAt))}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Big Score Box */}
                <div className="relative group shrink-0">
                    <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative w-20 h-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg ring-1 ring-white/5">
                        <span className={`text-4xl font-black ${scoreColor} leading-none drop-shadow-lg`}>
                            {viralityScore || '-'}
                        </span>
                    </div>
                </div>

                {/* Title Input */}
                <div className="min-w-0 flex-1 space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest pl-1">Filename</label>
                    <div className="relative group/input">
                        <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-500" />
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => onFilenameChange(e.target.value)}
                            onBlur={onFilenameSave}
                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                            className="relative w-full bg-white/5 hover:bg-white/10 focus:bg-black/50 border border-transparent focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-base font-bold text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all shadow-inner truncate"
                            placeholder="Untitled Clip"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
