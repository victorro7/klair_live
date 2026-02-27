/**
 * SystemLogs Component
 * Terminal-style log display with auto-scroll and visualizer
 */

import { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import clsx from 'clsx';
import { Visualizer } from './Visualizer';

interface Log {
    timestamp: Date;
    message: string;
}

interface SystemLogsProps {
    logs: Log[];
    isLive?: boolean;
}

export function SystemLogs({ logs, isLive = false }: SystemLogsProps) {
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new logs appear
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col flex-1 shadow-2xl relative min-h-0 group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        System Logs
                        {isLive && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
                    </span>
                </div>

                {/* Visualizer */}
                <div className="flex items-center gap-4">
                    <Visualizer isActive={isLive} color="bg-purple-400" />
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                </div>
            </div>

            {/* Log Content */}
            <div
                ref={logContainerRef}
                className="flex-1 p-4 overflow-y-auto font-mono text-[10px] leading-relaxed space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}
            >
                {logs.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-600 italic">
                        Awaiting signals...
                    </div>
                )}
                <div className="h-4" /> {/* Spacer for mask */}
                {logs.map((log, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "break-words transition-all duration-500 border-l-2 pl-3",
                            // Fade out older logs
                            i < logs.length - 5 ? "opacity-30 blur-[0.5px]" : "opacity-80 hover:opacity-100",
                            // Dynamic border colors based on content
                            log.message.includes('VIRAL') ? "border-yellow-500 bg-yellow-500/5" :
                                log.message.includes('TRIGGERED') ? "border-purple-500 bg-purple-500/5" :
                                    log.message.includes('SCREAM') ? "border-red-500 bg-red-500/5" :
                                        "border-transparent hover:border-white/10"
                        )}
                    >
                        <span className="text-gray-600 mr-2 select-none inline-block w-[60px]">
                            [{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                        </span>
                        <span
                            className={clsx(
                                log.message.includes('VIRAL GOLD')
                                    ? 'text-yellow-300 font-bold drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                                    : log.message.includes('TRIGGERED')
                                        ? 'text-purple-300 font-bold'
                                        : log.message.includes('SCREAM')
                                            ? 'text-red-400 font-bold'
                                            : log.message.includes('🧠')
                                                ? 'text-pink-300'
                                                : log.message.includes('BUFFER')
                                                    ? 'text-indigo-300'
                                                    : 'text-gray-300'
                            )}
                        >
                            {log.message}
                        </span>
                    </div>
                ))}
                <div className="h-4" /> {/* Spacer for mask */}
            </div>
        </div>
    );
}
