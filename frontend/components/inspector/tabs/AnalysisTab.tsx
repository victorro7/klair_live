import React from 'react';
import { TrendingUp } from 'lucide-react';

interface AnalysisTabProps {
    description: string;
    reason?: string;
    onDescriptionChange: (value: string) => void;
    onDescriptionSave: () => void;
}

/**
 * AnalysisTab Component
 * Contains description textarea and viral reason block
 */
export function AnalysisTab({
    description,
    reason,
    onDescriptionChange,
    onDescriptionSave,
}: AnalysisTabProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2">
            {/* Description Input */}
            <div className="space-y-2 group/input">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider pl-1 group-focus-within/input:text-purple-400 transition-colors">
                    Description
                </label>
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/5 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500" />
                    <textarea
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        onBlur={onDescriptionSave}
                        placeholder="Write a description for your clip..."
                        className="relative w-full h-32 bg-white/5 hover:bg-white/10 focus:bg-black/50 border border-white/10 focus:border-purple-500/30 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600 resize-none shadow-inner leading-relaxed"
                    />
                </div>
            </div>

            {/* Viral Reason Block */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400 pl-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Why it's Viral</span>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <p className="text-sm text-purple-100/90 leading-relaxed font-medium relative z-10">
                        {reason || "No viral analysis available."}
                    </p>
                </div>
            </div>
        </div>
    );
}
