import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface HashtagInputProps {
    localHashtags: string[];
    removeHashtag: (tag: string) => void;
    newHashtag: string;
    setNewHashtag: (tag: string) => void;
    handleAddHashtag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function HashtagInput({
    localHashtags,
    removeHashtag,
    newHashtag,
    setNewHashtag,
    handleAddHashtag
}: HashtagInputProps) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase pl-1 drop-shadow-md mt-2">
                Hashtags
            </label>
            <div className="relative group/hashtags">
                <div className="absolute inset-0 bg-cyan-500/0 rounded-2xl blur-xl group-focus-within/hashtags:bg-cyan-500/10 transition-colors duration-500 pointer-events-none" />
                <div className="relative bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl p-4 transition-all duration-300 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] group-focus-within/hashtags:border-cyan-500/30 group-focus-within/hashtags:shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_1px_5px_rgba(6,182,212,0.15)] group-hover/hashtags:border-white/10">
                    <div className="flex flex-wrap gap-2 mb-3 empty:hidden">
                        <AnimatePresence>
                            {localHashtags.map((tag) => (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-100 text-[11px] font-bold tracking-wide shadow-[0_2px_10px_rgba(6,182,212,0.15)] group/tag backdrop-blur-md"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeHashtag(tag)}
                                        className="p-0.5 rounded-full bg-black/20 hover:bg-black/50 text-cyan-200/50 group-hover/tag:text-cyan-200 transition-all opacity-50 group-hover/tag:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                    <input
                        type="text"
                        value={newHashtag}
                        onChange={(e) => setNewHashtag(e.target.value)}
                        onKeyDown={handleAddHashtag}
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-cyan-200 text-[13px] p-0 placeholder-white/20 font-medium transition-all group-focus-within/hashtags:placeholder-white/40 shadow-none ring-0"
                        placeholder="Add hashtag and press Enter..."
                        style={{ boxShadow: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
}
