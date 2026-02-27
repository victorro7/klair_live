import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Loader2 } from 'lucide-react';

interface PollingOverlayProps {
    publishStatus: string | null;
    publishFailReason: string | null;
    setPublishStatus: (status: string | null) => void;
    onClose: () => void;
}

export function PollingOverlay({
    publishStatus,
    publishFailReason,
    setPublishStatus,
    onClose
}: PollingOverlayProps) {
    return (
        <AnimatePresence>
            {publishStatus && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                >
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {publishStatus === 'FAILED' ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center border border-red-500/20">
                                    <X className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg">Publishing Blocked</h3>

                                {publishFailReason === 'spam_risk_too_many_posts' ? (
                                    <p className="text-gray-400 text-sm px-4">You have reached the API posting limits for today. Try posting directly from the TikTok mobile app, or wait 24 hours.</p>
                                ) : publishFailReason === 'spam_risk_user_banned_from_posting' ? (
                                    <p className="text-gray-400 text-sm px-4">TikTok has restricted this account from making new posts.</p>
                                ) : (
                                    <p className="text-gray-400 text-sm truncate px-4">{publishFailReason || 'An error occurred during publishing.'}</p>
                                )}

                                <button onClick={() => setPublishStatus(null)} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors font-medium">
                                    Dismiss
                                </button>
                            </>
                        ) : publishStatus === 'PUBLISH_COMPLETE' || publishStatus === 'SEND_TO_USER_INBOX' ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center border border-green-500/20">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg">Success!</h3>
                                <p className="text-gray-400 text-sm">Your video has been formally delivered to TikTok.</p>
                            </>
                        ) : publishStatus === 'TIMEOUT' ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center border border-orange-500/20">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg leading-tight">Processing is taking<br />longer than expected...</h3>
                                <p className="text-gray-400 text-sm">TikTok is still validating your video. You can safely close this panel and check your TikTok app later.</p>
                                <button onClick={onClose} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors font-medium">
                                    Close Panel
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="relative w-16 h-16 mx-auto">
                                    <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-purple-400 animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-white font-bold text-lg animate-pulse">Processing Upload</h3>
                                <p className="text-purple-400/80 text-[10px] font-mono mt-2 uppercase tracking-widest">{publishStatus.replace(/_/g, ' ')}</p>
                                <p className="text-gray-500 text-xs mt-4">Please leave this window open.</p>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
