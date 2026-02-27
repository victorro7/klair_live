
import { Radio } from 'lucide-react';

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-0 animate-in fade-in duration-1000 slide-in-from-bottom-4">
            <div className="relative mb-6 group">
                {/* Pulsing Radar Effect */}
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-ping opacity-75" />
                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />

                <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-full border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform duration-500">
                    <Radio className="w-12 h-12 text-purple-400 opacity-80" />
                </div>
            </div>

            <h3 className="text-xl font-medium text-white mb-2 tracking-tight">
                Listening for Signals...
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Connect a stream or paste a URL to start detecting viral moments.
            </p>
        </div>
    );
}
