import { useRef, useEffect } from "react";
import { GlassPanel } from "./GlassPanel";
import { AlertCircle, Trash2, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    isDestructive = false,
    isLoading = false
}: ConfirmationModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onCancel();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onCancel, isLoading]);

    // Trap focus/click outside logic can be added here if needed
    // For now, simpler implementation

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop - Lighter & Less Blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
                onClick={!isLoading ? onCancel : undefined}
            />

            {/* Modal - More Transparent */}
            <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                <GlassPanel
                    glowColor={isDestructive ? "none" : "purple"}
                    className="!rounded-2xl !bg-[#0a0015]/60 border-white/5 ring-1 ring-white/10"
                >
                    <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className={`p-2.5 rounded-xl backdrop-blur-md border ${isDestructive ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                                {isDestructive ? <Trash2 size={20} /> : <AlertCircle size={20} />}
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="text-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 ${isDestructive
                                    ? 'bg-red-500 hover:bg-red-600 border-red-400/20 text-white shadow-red-500/20'
                                    : 'bg-white text-black hover:bg-gray-100 border-transparent'
                                    }`}
                            >
                                {isLoading && (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                )}
                                {confirmLabel}
                            </button>
                        </div>
                    </div>

                    {/* Decorative bottom gradient if destructive */}
                    {isDestructive && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />
                    )}
                </GlassPanel>
            </div>
        </div>
    );
}
