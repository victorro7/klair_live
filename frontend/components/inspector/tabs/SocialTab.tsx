import React, { useRef, useEffect } from 'react';
import { Type, Hash, Plus, Copy, Check, X } from 'lucide-react';

// Auto-resizing caption input
interface CaptionInputProps {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}

function CaptionInput({ value, onChange, onBlur }: CaptionInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className="flex-1 bg-transparent border-none text-xs text-gray-300 italic leading-relaxed focus:outline-none focus:text-white resize-none active:outline-none overflow-hidden"
            style={{ minHeight: '1.5em' }}
        />
    );
}

interface SocialTabProps {
    captions: string[];
    hashtags: string[];
    newHashtag: string;
    copiedId: string | null;
    onCaptionChange: (index: number, value: string) => void;
    onCaptionSave: () => void;
    onCaptionDelete: (index: number) => void;
    onCaptionAdd: () => void;
    onHashtagAdd: () => void;
    onHashtagRemove: (tag: string) => void;
    onNewHashtagChange: (value: string) => void;
    onCopy: (text: string, id: string) => void;
}

/**
 * SocialTab Component
 * Contains editable captions and hashtags management
 */
export function SocialTab({
    captions,
    hashtags,
    newHashtag,
    copiedId,
    onCaptionChange,
    onCaptionSave,
    onCaptionDelete,
    onCaptionAdd,
    onHashtagAdd,
    onHashtagRemove,
    onNewHashtagChange,
    onCopy,
}: SocialTabProps) {
    return (
        <div className="space-y-5 animate-in fade-in duration-300 slide-in-from-bottom-2">
            {/* Editable Captions Block */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-500 tracking-wider pl-1">
                    <div className="flex items-center gap-2">
                        <Type className="w-3.5 h-3.5" />
                        <span>Captions</span>
                    </div>
                    <button
                        onClick={onCaptionAdd}
                        className="hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg group/add"
                        title="Add Caption"
                    >
                        <Plus className="w-4 h-4 text-gray-500 group-hover/add:text-white transition-colors" />
                    </button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {(captions && captions.length > 0) ? (
                        captions.map((cap, i) => (
                            <div key={i} className="flex items-start gap-2 group/item">
                                <button
                                    onClick={() => onCopy(cap, `cap-${i}`)}
                                    className="mt-1 opacity-0 group-hover/item:opacity-100 text-gray-500 hover:text-purple-400 transition-all"
                                    title="Copy caption"
                                >
                                    {copiedId === `cap-${i}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <CaptionInput
                                    value={cap}
                                    onChange={(val) => onCaptionChange(i, val)}
                                    onBlur={onCaptionSave}
                                />
                                <button
                                    onClick={() => onCaptionDelete(i)}
                                    className="mt-1 opacity-0 group-hover/item:opacity-100 text-red-500/50 hover:text-red-500 transition-all"
                                    title="Delete caption"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500 italic">No captions generated yet.</div>
                    )}
                </div>
            </div>

            {/* Hashtags Input */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider pl-1">Hashtags</label>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[60px] flex flex-wrap gap-2 transition-colors hover:bg-white/[0.07]">
                    {hashtags.map(tag => (
                        <div key={tag} className="group/tag flex items-center gap-1.5 text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all cursor-default shadow-sm">
                            <button
                                onClick={() => onCopy(tag, `tag-${tag}`)}
                                className="opacity-0 group-hover/tag:opacity-100 hover:text-white transition-all w-0 group-hover/tag:w-auto"
                                title="Copy hashtag"
                            >
                                {copiedId === `tag-${tag}` ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                            <span>{tag}</span>
                            <button
                                onClick={() => onHashtagRemove(tag)}
                                className="opacity-0 group-hover/tag:opacity-100 hover:text-red-400 transition-opacity"
                                title="Remove hashtag"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 focus-within:border-white/20 focus-within:bg-white/10 transition-all">
                        <Hash className="w-3 h-3 text-gray-500" />
                        <input
                            type="text"
                            value={newHashtag}
                            onChange={(e) => onNewHashtagChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onHashtagAdd();
                                }
                            }}
                            placeholder="Add tag..."
                            className="bg-transparent border-none text-[10px] text-white focus:outline-none w-[60px] placeholder-gray-600 uppercase font-bold"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
