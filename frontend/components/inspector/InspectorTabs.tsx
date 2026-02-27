import React from 'react';
import { Sparkles, Hash, FileText } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'analysis' | 'social' | 'script';

interface InspectorTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    /** Set of tab IDs that have failures (missing data) */
    failedTabs?: Set<Tab>;
}

/**
 * InspectorTabs Component
 * Tab navigation bar with liquid island styling and failure indicators
 */
export function InspectorTabs({ activeTab, onTabChange, failedTabs }: InspectorTabsProps) {
    const tabs: { id: Tab; label: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
        {
            id: 'analysis',
            label: 'Analysis',
            icon: <Sparkles className="w-4 h-4" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10 border-purple-500/20'
        },
        {
            id: 'social',
            label: 'Social',
            icon: <Hash className="w-4 h-4" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            id: 'script',
            label: 'Script',
            icon: <FileText className="w-4 h-4" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10 border-green-500/20'
        },
    ];

    return (
        <div className="px-5 pt-5 pb-2">
            <div className="flex gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl">
                {tabs.map((tab) => {
                    const hasFailed = failedTabs?.has(tab.id);
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={clsx(
                                "flex items-center justify-center gap-2.5 px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-all rounded-lg flex-1 relative overflow-hidden",
                                activeTab === tab.id
                                    ? `${tab.color} shadow-lg`
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            {activeTab === tab.id && (
                                <div className={`absolute inset-0 ${tab.bgColor} border rounded-lg backdrop-blur-md`} />
                            )}
                            {/* Failure dot */}
                            {hasFailed && (
                                <span className="absolute top-1.5 right-1.5 z-20 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab.icon} {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export type { Tab };
