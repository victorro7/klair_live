import React, { useState } from 'react';
import { RefreshCw, Plus, Trash2, Youtube, Twitch, AlertCircle, Smartphone } from 'lucide-react';
import { CollapsibleGlassPanel } from '@/components/ui/CollapsibleGlassPanel';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface PlatformHandlesSectionProps {
    handles: Record<string, string[]>;
    onAddHandle: (platform: string, handle: string) => Promise<void>;
    onRemoveHandle: (platform: string, handle: string) => Promise<void>;
}

export function PlatformHandlesSection({ handles, onAddHandle, onRemoveHandle }: PlatformHandlesSectionProps) {
    const [activePlatform, setActivePlatform] = useState<'twitch' | 'youtube' | 'tiktok'>('twitch');
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTikTokConnect = async () => {
        setIsSubmitting(true);
        try {
            const { clipService } = await import('@/app/services/clipService');
            const data = await clipService.getTikTokAuthUrl();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to start TikTok connection", error);
            alert("Failed to connect to TikTok. Please ensure the backend is running and configured.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        setIsSubmitting(true);
        try {
            await onAddHandle(activePlatform, inputValue);
            setInputValue("");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <CollapsibleGlassPanel
            id="platform-handles"
            title="Platform Handles"
            glowColor="none"
            headerRight={
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                    <span className="text-[10px] font-light text-gray-400 pb-2 uppercase tracking-widest">Bot Access</span>
                </div>
            }
        >
            {/* Platform Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-black/20 rounded-xl border border-white/20 shadow-inner">
                <button
                    onClick={() => setActivePlatform('twitch')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-light transition-all duration-300",
                        activePlatform === 'twitch'
                            ? "bg-[#9146FF] text-white shadow-lg shadow-purple-900/40"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Twitch className="w-4 h-4" />
                    Twitch
                </button>
                <button
                    onClick={() => setActivePlatform('youtube')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-light transition-all duration-300",
                        activePlatform === 'youtube'
                            ? "bg-[#FF0000] text-white shadow-lg shadow-red-900/40"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Youtube className="w-4 h-4" />
                    YouTube
                </button>
                <button
                    onClick={() => setActivePlatform('tiktok')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                        activePlatform === 'tiktok'
                            ? "bg-[#000000] text-white shadow-lg shadow-gray-900/40 border border-white/20"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Smartphone className="w-4 h-4" />
                    TikTok
                </button>
            </div>

            {/* Input Area */}
            {activePlatform === 'tiktok' ? (
                <div className="flex flex-col items-center justify-center mb-6 p-8 bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl text-center shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group/tt">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#25F4EE]/0 to-[#FE2C55]/0 blur-3xl transition-colors duration-700 pointer-events-none" />
                    <Smartphone className="w-10 h-10 text-white mb-4 opacity-80 relative z-10 drop-shadow-[0_0_15px_rgba(37,244,238,0.8)]" />
                    <p className="text-gray-300 mb-6 text-sm max-w-sm relative z-10">Connect your TikTok account to easily publish generated clips securely.</p>
                    <button
                        onClick={handleTikTokConnect}
                        disabled={isSubmitting}
                        className={clsx(
                            "px-6 py-3 rounded-2xl font-light text-[12px] tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-2 relative overflow-hidden border",
                            isSubmitting
                                ? "bg-white/5 border-white/5 text-gray-500 cursor-wait"
                                : "bg-gradient-to-r from-[#25F4EE]/80 to-[#FE2C55]/80 hover:from-[#25F4EE] hover:to-[#FE2C55] text-white border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(37,244,238,0.3)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] hover:-translate-y-0.5"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-150%] hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                        <Smartphone className={clsx("w-4 h-4 relative z-10", isSubmitting && "animate-pulse", !isSubmitting && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]")} />
                        <span className={clsx("relative z-10", !isSubmitting && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]")}>{isSubmitting ? "Connecting..." : "Connect TikTok Account"}</span>
                    </button>
                </div>
            ) : (
                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1 group/input">
                        <div className="absolute inset-0 bg-white/0 rounded-2xl blur-xl transition-colors duration-500 pointer-events-none group-focus-within/input:bg-white/5" />
                        <div className="relative bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl py-3 px-4 transition-all duration-300 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] group-hover/input:border-white/10 group-focus-within/input:border-white/20 group-focus-within/input:shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_1px_5px_rgba(255,255,255,0.05)]">
                            <input
                                type="text"
                                placeholder={activePlatform === 'twitch' ? "Twitch Username..." : "YouTube Channel Handle (@...)"}
                                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[13px] text-gray-200 placeholder-white/20 p-0 shadow-none ring-0 font-medium"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isSubmitting}
                                style={{ boxShadow: 'none' }}
                            />
                        </div>
                    </div>
                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!inputValue.trim() || isSubmitting}
                        className={clsx(
                            "p-3 rounded-2xl transition-all duration-300 flex items-center justify-center shrink-0 border relative overflow-hidden group/btn",
                            !inputValue.trim() || isSubmitting
                                ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]"
                                : activePlatform === 'twitch'
                                    ? "bg-gradient-to-br from-[#9146FF]/80 to-[#6029B3]/80 hover:from-[#9146FF] hover:to-[#6029B3] text-white border-[#9146FF]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(145,70,255,0.3)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_0_30px_rgba(145,70,255,0.6)] hover:-translate-y-0.5"
                                    : "bg-gradient-to-br from-[#FF0000]/80 to-[#B30000]/80 hover:from-[#FF0000] hover:to-[#B30000] text-white border-[#FF0000]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_0_30px_rgba(255,0,0,0.6)] hover:-translate-y-0.5"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                        <Plus className={clsx("w-5 h-5 relative z-10", isSubmitting && "animate-spin")} />
                    </button>
                </div>
            )}

            {/* List */}
            <div className="space-y-3 min-h-[120px]">
                <AnimatePresence mode="popLayout">
                    {handles[activePlatform]?.length > 0 ? (
                        handles[activePlatform].map((handle) => (
                            <motion.div
                                key={`${activePlatform}-${handle}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5 group/item hover:border-white/10 transition-colors shadow-lg backdrop-blur-md"
                            >
                                <span className="text-[13px] font-light tracking-wide text-gray-200">{handle}</span>
                                <button
                                    onClick={() => onRemoveHandle(activePlatform, handle)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-100 lg:opacity-0 group-hover/item:opacity-100 transition-all border border-transparent hover:border-red-500/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-[120px] text-gray-600 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]"
                        >
                            <AlertCircle className="w-6 h-6 mb-2 opacity-30" />
                            <span className="text-[11px] font-light tracking-widest uppercase">No accounts connected</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </CollapsibleGlassPanel>
    );
}
