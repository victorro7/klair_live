import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Inbox, AlertTriangle, Loader2 } from 'lucide-react';
import { Clip } from '@/app/types/clip';
import clsx from 'clsx';
import { GlassPanel } from '../ui/GlassPanel';
import { clipService } from '@/app/services/clipService';
import { useToast } from '../ui/Toast';

import { CaptionInput } from './post/CaptionInput';
import { HashtagInput } from './post/HashtagInput';
import { PublishSettings } from './post/PublishSettings';
import { PollingOverlay } from './post/PollingOverlay';

interface TikTokPublishPanelProps {
    clip: Clip;
    onClose: () => void;
    onSuccess?: () => void;
}

export function TikTokPublishPanel({ clip, onClose, onSuccess }: TikTokPublishPanelProps) {
    const defaultCaptions = clip.captions && clip.captions.length > 0 ? clip.captions : [];
    const [customCaption, setCustomCaption] = useState(defaultCaptions[0] || '');
    const [localHashtags, setLocalHashtags] = useState<string[]>((clip.hashtags || []).map(h => h.startsWith('#') ? h : `#${h}`));
    const [newHashtag, setNewHashtag] = useState('');
    const [isPublishing, setIsPublishing] = useState<'direct' | 'inbox' | false>(false);
    const [publishStatus, setPublishStatus] = useState<string | null>(null);
    const [publishFailReason, setPublishFailReason] = useState<string | null>(null);

    // Creator Info State
    const [creatorInfo, setCreatorInfo] = useState<any>(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState(true);

    // Privacy and Interaction State
    const [privacyLevel, setPrivacyLevel] = useState('SELF_ONLY');
    const [disableComment, setDisableComment] = useState(false);
    const [disableDuet, setDisableDuet] = useState(false);
    const [disableStitch, setDisableStitch] = useState(false);

    const { showToast, ToastComponent } = useToast();

    // Reset state when clip changes
    useEffect(() => {
        const initialCaptions = clip.captions && clip.captions.length > 0 ? clip.captions : [];
        setCustomCaption(initialCaptions[0] || '');
        setLocalHashtags((clip.hashtags || []).map(h => h.startsWith('#') ? h : `#${h}`));

        const fetchCreatorInfo = async () => {
            setIsLoadingInfo(true);
            const info = await clipService.getTikTokCreatorInfo();
            setCreatorInfo(info);
            if (info?.privacy_level_options?.length > 0) {
                // Initialize default to SELF_ONLY if available (safest for unaudited)
                setPrivacyLevel(info.privacy_level_options.includes('SELF_ONLY') ? 'SELF_ONLY' : info.privacy_level_options[0]);
            }
            if (info?.comment_disabled) setDisableComment(true);
            if (info?.duet_disabled) setDisableDuet(true);
            if (info?.stitch_disabled) setDisableStitch(true);
            setIsLoadingInfo(false);
        };
        fetchCreatorInfo();
    }, [clip]);

    const getDurationSec = () => {
        const start = parseFloat(clip.start_time || "0");
        const end = parseFloat(clip.end_time || "0");
        return end - start > 0 ? end - start : 0;
    };

    const exceedsDuration = creatorInfo?.max_video_post_duration_sec
        && getDurationSec() > creatorInfo.max_video_post_duration_sec;

    const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = newHashtag.trim();
            if (!tag) return;
            const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
            if (!localHashtags.includes(formattedTag)) {
                setLocalHashtags([...localHashtags, formattedTag]);
            }
            setNewHashtag('');
        }
    };

    const removeHashtag = (tagToRemove: string) => {
        setLocalHashtags(localHashtags.filter(tag => tag !== tagToRemove));
    };

    const pollStatus = async (publishId: string, target: 'direct' | 'inbox') => {
        let attempts = 0;
        const maxAttempts = 60; // 3 minutes total

        const check = async () => {
            if (attempts >= maxAttempts) {
                setPublishStatus('TIMEOUT');
                return;
            }
            try {
                const res = await clipService.getTikTokPublishStatus(publishId);
                const status = res.data?.status;
                if (status) setPublishStatus(status);

                if (status === 'PUBLISH_COMPLETE' || status === 'SEND_TO_USER_INBOX') {
                    showToast(`Successfully published to TikTok!`, 'success');
                    if (onSuccess) onSuccess();
                    setTimeout(() => {
                        onClose();
                    }, 3000);
                    return;
                } else if (status === 'FAILED') {
                    setPublishFailReason(res.data?.fail_reason || 'Unknown error');
                    setIsPublishing(false); // Enable buttons again if they dismiss error
                    return;
                }

                attempts++;
                setTimeout(check, 3000);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.error("Polling error:", err);
                attempts++;
                setTimeout(check, 3000);
            }
        };

        check();
    };

    const handlePublish = async (target: 'direct' | 'inbox') => {
        setIsPublishing(target);
        // Clean up hashtags for backend
        const parsedHashtags = localHashtags.map(t => t.replace(/^#/, ''));

        // Max caption length on TikTok is strictly checked, let's just make sure we send customCaption
        const finalCaption = customCaption.trim();

        try {
            const res = await clipService.publishToTikTok(String(clip.id), target, finalCaption, parsedHashtags, {
                privacy_level: privacyLevel,
                disable_comment: disableComment,
                disable_duet: disableDuet,
                disable_stitch: disableStitch
            });

            if (res.data?.publish_id) {
                setPublishStatus('PROCESSING_UPLOAD');
                pollStatus(res.data.publish_id, target);
            } else {
                showToast(`Successfully sent to TikTok ${target === 'inbox' ? 'Drafts' : 'Feed'}!`, 'success');
                if (onSuccess) onSuccess();
                // Automatically close panel after thin delay so user sees success toast
                setTimeout(() => {
                    onClose();
                }, 2000);
                setIsPublishing(false);
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error("TikTok publish failed:", error);
            showToast("Failed to publish to TikTok: " + (error as Error).message, 'error');
            setIsPublishing(false);
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="publish-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
            >
                <GlassPanel
                    className="w-full h-full flex flex-col relative overflow-hidden"
                >
                    {/* Status Polling Overlay */}
                    <PollingOverlay
                        publishStatus={publishStatus}
                        publishFailReason={publishFailReason}
                        setPublishStatus={setPublishStatus}
                        onClose={onClose}
                    />

                    {/* Header bg glow */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold tracking-wider text-white">Post to TikTok</h2>
                            {!isLoadingInfo && creatorInfo?.creator_nickname ? (
                                <div className="flex items-center gap-2 mt-2">
                                    {creatorInfo.creator_avatar_url && (
                                        <img src={creatorInfo.creator_avatar_url} alt="Avatar" className="w-5 h-5 rounded-full ring-1 ring-white/20" />
                                    )}
                                    <p className="text-xs text-gray-300">
                                        Posting as <span className="text-white font-medium">{creatorInfo.creator_nickname}</span>
                                        {creatorInfo.creator_username && <span className="text-gray-500 ml-1">(@{creatorInfo.creator_username})</span>}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 mt-1">Configure your data for posting.</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isPublishing !== false}
                            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-colors group"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
                        <CaptionInput
                            customCaption={customCaption}
                            setCustomCaption={setCustomCaption}
                            defaultCaptions={defaultCaptions}
                        />

                        <HashtagInput
                            localHashtags={localHashtags}
                            removeHashtag={removeHashtag}
                            newHashtag={newHashtag}
                            setNewHashtag={setNewHashtag}
                            handleAddHashtag={handleAddHashtag}
                        />

                        <PublishSettings
                            creatorInfo={creatorInfo}
                            privacyLevel={privacyLevel}
                            setPrivacyLevel={setPrivacyLevel}
                            disableComment={disableComment}
                            setDisableComment={setDisableComment}
                            disableDuet={disableDuet}
                            setDisableDuet={setDisableDuet}
                            disableStitch={disableStitch}
                            setDisableStitch={setDisableStitch}
                        />
                    </div>

                    {/* Warning Messages */}
                    {isLoadingInfo ? (
                        <div className="px-6 py-4 flex items-center justify-center gap-2 text-gray-400 text-xs border-t border-white/5 bg-black/20">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                            Checking account limits...
                        </div>
                    ) : exceedsDuration ? (
                        <div className="mx-6 mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 relative z-10 shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <div>
                                <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider">Duration Limit Exceeded</h4>
                                <p className="text-red-300/80 text-[11px] mt-0.5">
                                    This clip is {Math.round(getDurationSec())}s, but your TikTok account only allows up to {creatorInfo.max_video_post_duration_sec}s for direct API posts. You must trim it or send to Inbox.
                                </p>
                            </div>
                        </div>
                    ) : null}

                    <div className="p-6 border-t border-white/5 grid grid-cols-2 gap-4 bg-black/20 relative z-10 shrink-0">
                        {/* Inbox/Draft Button */}
                        <div className="relative group/tooltip w-full">
                            <button
                                onClick={() => handlePublish('inbox')}
                                disabled={isPublishing !== false}
                                className={clsx(
                                    "flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all text-[10px] font-bold uppercase tracking-widest w-full group backdrop-blur-md",
                                    isPublishing === 'inbox' && "opacity-50 cursor-wait"
                                )}
                            >
                                {isPublishing === 'inbox' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Inbox className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span>To Inbox</span>
                                    </>
                                )}
                            </button>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2 rounded-lg bg-black/90 border border-white/10 text-[10px] text-gray-400 text-center opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl">
                                Sends to your TikTok Inbox. Captions/hashtags must be pasted manually.
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
                            </div>
                        </div>

                        {/* Direct Post Button */}
                        <button
                            onClick={() => handlePublish('direct')}
                            disabled={isPublishing !== false || exceedsDuration || isLoadingInfo}
                            className={clsx(
                                "flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 border border-purple-500/10 hover:border-purple-500/30 transition-all text-[10px] font-bold uppercase tracking-widest w-full group overflow-hidden backdrop-blur-md",
                                isPublishing === 'direct' && "opacity-50 cursor-wait",
                                (exceedsDuration || isLoadingInfo) && "opacity-50 cursor-not-allowed hover:bg-purple-500/5 hover:border-purple-500/10 bg-purple-500/5"
                            )}
                        >
                            {isPublishing === 'direct' ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Post Directly</span>
                                </>
                            )}
                        </button>
                    </div>
                </GlassPanel>
                {ToastComponent}
            </motion.div>
        </AnimatePresence>
    );
}
