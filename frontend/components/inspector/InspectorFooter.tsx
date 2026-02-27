import React from 'react';
import { Trash2, Smartphone, RefreshCw, Save } from 'lucide-react';
import clsx from 'clsx';

interface InspectorFooterProps {
    isDeleting: boolean;
    onDelete: () => void;
    canDelete: boolean;
    mode?: 'default' | 'trim';
    onCancel?: () => void;
    onSave?: () => void;
    isSaving?: boolean;
    onPublishTikTok?: () => void;
}

/**
 * InspectorFooter Component
 * Sticky footer with discard and export buttons (or Cancel/Save in trim mode)
 */
export function InspectorFooter({
    isDeleting,
    onDelete,
    canDelete,
    mode = 'default',
    onCancel,
    onSave,
    isSaving = false,
    onPublishTikTok,
}: InspectorFooterProps) {
    if (mode === 'trim') {
        return (
            <div className="p-5 border-t border-white/5 z-30">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all text-[10px] font-bold uppercase tracking-widest group backdrop-blur-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className={clsx(
                            "relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 border border-green-500/30 transition-all text-[10px] font-bold uppercase tracking-widest group overflow-hidden backdrop-blur-md hover:shadow-lg hover:shadow-green-500/10",
                            isSaving && "opacity-50 cursor-wait"
                        )}
                    >
                        {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />}
                        <span className="relative z-10">{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 border-t border-white/5 z-30">
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onDelete}
                    disabled={isDeleting || !canDelete}
                    className={clsx(
                        "flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 transition-all text-[10px] font-bold uppercase tracking-widest group backdrop-blur-md",
                        isDeleting && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    Discard
                </button>
                <button
                    onClick={onPublishTikTok}
                    className={clsx(
                        "relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-purple-500/30 transition-all text-[10px] font-bold uppercase tracking-widest group overflow-hidden backdrop-blur-md hover:shadow-lg hover:shadow-purple-500/10"
                    )}
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    <Smartphone className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Post to TikTok</span>
                </button>
            </div>
        </div>
    );
}
