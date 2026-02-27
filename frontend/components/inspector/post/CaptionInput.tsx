import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CaptionInputProps {
    customCaption: string;
    setCustomCaption: (caption: string) => void;
    defaultCaptions: string[];
}

export function CaptionInput({ customCaption, setCustomCaption, defaultCaptions }: CaptionInputProps) {
    return (
        <>
            {/* Custom Caption Input */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase pl-1 drop-shadow-md">
                    Caption
                </label>
                <div className="relative group/caption">
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-purple-500/0 rounded-2xl blur-xl group-focus-within/caption:bg-purple-500/15 transition-colors duration-500" />
                    {/* Glass Container */}
                    <div className="relative bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl p-4 transition-all duration-300 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] group-focus-within/caption:border-purple-500/40 group-focus-within/caption:shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(168,85,247,0.15)] group-hover/caption:border-white/10">
                        <textarea
                            value={customCaption}
                            onChange={(e) => setCustomCaption(e.target.value)}
                            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[13px] text-gray-200 placeholder-white/20 resize-none p-0 min-h-[100px] font-medium leading-relaxed custom-scrollbar shadow-none ring-0"
                            placeholder="Write your caption here..."
                            maxLength={2200}
                            style={{ boxShadow: 'none' }}
                        />
                        {/* Character Count Pill */}
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5 text-[9px] font-bold tracking-wider text-gray-400 shadow-xl flex items-center gap-1 group-focus-within/caption:text-purple-300 group-focus-within/caption:border-purple-500/30 transition-all">
                            <span>{customCaption.length}</span>
                            <span className="opacity-40">/2200</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Suggestions Quick Fill */}
            {defaultCaptions.length > 0 && (
                <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase pl-1 drop-shadow-md flex items-center gap-1.5 mt-2">
                        <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                        AI Suggestions
                        <span className="text-gray-600 text-[8px] tracking-normal ml-1">(Click to fill)</span>
                    </label>
                    <div className="grid gap-2">
                        {defaultCaptions.map((cap, idx) => (
                            <motion.button
                                whileHover={{ scale: 1.01, x: 2 }}
                                whileTap={{ scale: 0.99 }}
                                key={idx}
                                onClick={() => setCustomCaption(cap)}
                                className="text-left w-full relative group overflow-hidden rounded-xl border border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent hover:from-purple-500/10 hover:to-transparent transition-all shadow-md"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-500/0 group-hover:bg-purple-500/50 transition-colors" />
                                <div className="p-3.5 text-[13px] text-gray-400 group-hover:text-gray-200 leading-relaxed font-medium">
                                    {cap}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
