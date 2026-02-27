/**
 * ClipStats Component
 * Displays clip count with viral score indicator
 */

import { Video } from 'lucide-react';

interface ClipStatsProps {
    clipCount: number;
}

export function ClipStats({ clipCount }: ClipStatsProps) {
    return (
        <div className="relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Glass Panel */}
            <div className="relative backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <Video className="w-8 h-8 text-purple-400" />
                    </div>

                    <div className="text-center">
                        <span className="text-5xl font-normal text-white tracking-[-0.025em]" style={{ fontWeight: 400 }}>
                            {clipCount}
                        </span>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mt-2">
                            Clips Generated
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
