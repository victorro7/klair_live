import { useState, useMemo } from 'react';
import { X, Search, Check, Filter } from 'lucide-react';
import clsx from 'clsx';

interface PlatformManagerModalProps {
    isOpen: boolean;
    platform: string;
    allCreators: string[];
    hiddenCreators: Set<string>;
    onToggleCreator: (creator: string) => void;
    onClose: () => void;
}

export default function PlatformManagerModal({
    isOpen,
    platform,
    allCreators,
    hiddenCreators,
    onToggleCreator,
    onClose
}: PlatformManagerModalProps) {
    const [search, setSearch] = useState('');

    const filteredCreators = useMemo(() => {
        return allCreators.filter(c => c.toLowerCase().includes(search.toLowerCase()));
    }, [allCreators, search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Darkener with blur */}
            <div
                className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Liquid Glass Modal */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300 ring-1 ring-white/5">

                {/* Glow Effects */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-purple-400">
                            <Filter className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white drop-shadow-sm">
                                {platform}
                            </h2>
                            <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                                {allCreators.length} Creator(s) Found
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="group p-2 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/5"
                    >
                        <X className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Search Input - Pill Style */}
                <div className="px-6 pb-2">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter creators..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Creator List */}
                <div className="p-4 max-h-[300px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {filteredCreators.length === 0 && (
                        <div className="py-8 text-center">
                            <p className="text-gray-500 text-xs font-medium">No results found</p>
                        </div>
                    )}

                    {filteredCreators.map(creator => {
                        const isHidden = hiddenCreators.has(creator);
                        const isVisible = !isHidden;

                        return (
                            <button
                                key={creator}
                                onClick={() => onToggleCreator(creator)}
                                className={clsx(
                                    "relative w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group overflow-hidden",
                                    isVisible
                                        ? "bg-gradient-to-r from-purple-500/10 to-blue-500/5 border-purple-500/20 hover:border-purple-500/40"
                                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] opacity-60 hover:opacity-100"
                                )}
                            >
                                {/* Hover Gradient */}
                                <div className={clsx(
                                    "absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
                                    isHidden && "hidden"
                                )} />

                                <div className="flex items-center gap-3 relative z-10">
                                    {/* Initials Avatar */}
                                    <div className={clsx(
                                        "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold shadow-inner transition-colors",
                                        isVisible ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-900/50" : "bg-white/5 text-gray-500"
                                    )}>
                                        {creator.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className={clsx(
                                        "text-xs font-bold tracking-wide transition-colors",
                                        isVisible ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                                    )}>
                                        {creator.toUpperCase()}
                                    </span>
                                </div>

                                {/* Toggle Checkbox visuals */}
                                <div className="relative z-10 pr-1">
                                    <div className={clsx(
                                        "w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300",
                                        isVisible
                                            ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                                            : "border-white/20 bg-transparent text-transparent group-hover:border-white/40"
                                    )}>
                                        <Check className="w-3 h-3 stroke-[3px]" />
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
                    <button
                        onClick={() => {
                            // Hide All
                            filteredCreators.forEach(c => {
                                if (!hiddenCreators.has(c)) onToggleCreator(c);
                            });
                        }}
                        className="flex-1 py-3 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest"
                    >
                        Hide All
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button
                        onClick={() => {
                            // Show All
                            filteredCreators.forEach(c => {
                                if (hiddenCreators.has(c)) onToggleCreator(c);
                            });
                        }}
                        className="flex-1 py-3 rounded-xl text-[10px] font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors uppercase tracking-widest"
                    >
                        Show All
                    </button>
                </div>

            </div>
        </div>
    );
}
