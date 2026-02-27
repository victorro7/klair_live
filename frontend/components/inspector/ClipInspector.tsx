import { useState, useEffect, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { Clip } from '@/hooks/useClipEngine';
import { clipService } from '@/app/services/clipService';
import { GlassPanel } from '../ui/GlassPanel';

// Sub-components
import { InspectorHeader } from './InspectorHeader';
import { InspectorTabs, Tab } from './InspectorTabs';
import { InspectorFooter } from './InspectorFooter';
import { AnalysisTab } from './tabs/AnalysisTab';
import { SocialTab } from './tabs/SocialTab';
import { ScriptTab } from './tabs/ScriptTab';

// Hooks
import { useTrimMode } from './hooks/useTrimMode';
import { useTranscriptEditor } from './hooks/useTranscriptEditor';

interface ClipInspectorProps {
    clip: Clip;
    onBack: () => void;
    onDelete?: (id: string) => void | Promise<void>;
    onUpdate?: (id: string, updates: {
        filename?: string;
        transcript?: string;
        description?: string;
        hashtags?: string[];
        captions?: string[];
        start_time?: string;
        end_time?: string;
    }) => Promise<void>;
    onOpenPublishPanel?: () => void;
    onRefreshClips?: () => void;
}

/**
 * ClipInspector Component
 * Detailed view and editor for a selected clip
 */
export function ClipInspector({ clip, onBack, onDelete, onUpdate, onOpenPublishPanel, onRefreshClips }: ClipInspectorProps) {
    // Tab state
    const [activeTab, setActiveTab] = useState<Tab>('social');

    // Local editable state
    const [localFilename, setLocalFilename] = useState(clip.filename || "");
    const [localTranscript, setLocalTranscript] = useState(clip.transcript || "");
    const [localDescription, setLocalDescription] = useState(clip.description || "");
    const [localHashtags, setLocalHashtags] = useState<string[]>(clip.hashtags || []);
    const [localCaptions, setLocalCaptions] = useState<string[]>(clip.captions || []);
    const [newHashtag, setNewHashtag] = useState("");

    // UI state
    const [isSaving, setIsSaving] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    // Determine if clip is partial and which tabs have failures
    const isPartial = clip.status === 'partial';
    const failedTabs = useMemo(() => {
        if (!isPartial) return undefined;
        const failed = new Set<'analysis' | 'social' | 'script'>();
        if (!clip.transcript) failed.add('script');
        if (!clip.viral_score || clip.viral_score === 0) {
            failed.add('analysis');
            failed.add('social');
        }
        return failed.size > 0 ? failed : undefined;
    }, [isPartial, clip.transcript, clip.viral_score]);

    // Sync local state when clip changes
    useEffect(() => {
        setLocalFilename(clip.filename || "");
        setLocalTranscript(clip.transcript || "");
        setLocalDescription(clip.description || "");
        setLocalHashtags(clip.hashtags || []);
        setLocalCaptions(clip.captions || []);
    }, [clip]);

    // Generic save handler
    const handleSave = useCallback(async (field: string, value: any) => {
        if (!onUpdate) return;
        setIsSaving(true);
        try {
            await onUpdate(String(clip.id), { [field]: value });
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to save", e);
        } finally {
            setIsSaving(false);
        }
    }, [onUpdate, clip.id]);

    // Trim mode hook
    const trimMode = useTrimMode({
        clipId: clip.id,
        startTimeStr: clip.start_time,
        endTimeStr: clip.end_time,
        onUpdate,
    });

    // Transcript editor hook
    const transcriptEditor = useTranscriptEditor({
        clipId: clip.id,
        transcriptJson: clip.transcript_json,
        onSave: handleSave,
    });

    // Delete handler
    const handleDelete = useCallback(async () => {
        if (onDelete) {
            setIsDeleting(true);
            try {
                await onDelete(String(clip.id));
            } catch (error) {
                if (process.env.NODE_ENV === 'development') console.error("Delete failed", error);
            } finally {
                setIsDeleting(false);
            }
        }
    }, [onDelete, clip.id]);

    // Retry handler
    const handleRetry = useCallback(async () => {
        setIsRetrying(true);
        try {
            await clipService.retryClip(String(clip.id));
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error("Retry failed", error);
        } finally {
            // Retry runs async on the backend — refetch clips after a delay
            setTimeout(() => {
                setIsRetrying(false);
                onRefreshClips?.();
            }, 5000);
        }
    }, [clip.id, onRefreshClips]);

    // Publish handler opens the publish panel
    const handlePublishTikTok = useCallback(() => {
        if (onOpenPublishPanel) onOpenPublishPanel();
    }, [onOpenPublishPanel]);

    // Hashtag handlers
    const addHashtag = useCallback(() => {
        if (!newHashtag.trim()) return;
        const tag = newHashtag.startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
        if (!localHashtags.includes(tag)) {
            const updated = [...localHashtags, tag];
            setLocalHashtags(updated);
            handleSave('hashtags', updated);
        }
        setNewHashtag("");
    }, [newHashtag, localHashtags, handleSave]);

    const removeHashtag = useCallback((tagToRemove: string) => {
        const updated = localHashtags.filter(tag => tag !== tagToRemove);
        setLocalHashtags(updated);
        handleSave('hashtags', updated);
    }, [localHashtags, handleSave]);

    // Caption handlers
    const updateCaption = useCallback((index: number, value: string) => {
        const updated = [...localCaptions];
        updated[index] = value;
        setLocalCaptions(updated);
    }, [localCaptions]);

    const saveCaptions = useCallback(() => {
        handleSave('captions', localCaptions);
    }, [handleSave, localCaptions]);

    const deleteCaption = useCallback((index: number) => {
        const updated = localCaptions.filter((_, i) => i !== index);
        setLocalCaptions(updated);
        handleSave('captions', updated);
    }, [localCaptions, handleSave]);

    const addCaption = useCallback(() => {
        const updated = [...localCaptions, "New caption..."];
        setLocalCaptions(updated);
        handleSave('captions', updated);
    }, [localCaptions, handleSave]);

    // Copy handler
    const handleCopy = useCallback((text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    }, []);

    return (
        <GlassPanel className="h-full flex flex-col relative overflow-hidden ring-1 ring-white/10" glowColor="purple">
            {/* Header */}
            <InspectorHeader
                viralityScore={clip.viral_score}
                filename={localFilename}
                isSaving={isSaving || trimMode.isSaving}
                isPartial={isPartial}
                isRetrying={isRetrying}
                postedToTikTokAt={clip.posted_to_tiktok_at}
                onFilenameChange={setLocalFilename}
                onFilenameSave={() => handleSave('filename', localFilename)}
                onClose={onBack}
                onRetry={handleRetry}
            />

            {/* Tabs */}
            <InspectorTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                failedTabs={failedTabs}
            />

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {activeTab === 'analysis' && (
                    <AnalysisTab
                        description={localDescription}
                        reason={clip.reason}
                        onDescriptionChange={setLocalDescription}
                        onDescriptionSave={() => handleSave('description', localDescription)}
                    />
                )}

                {activeTab === 'social' && (
                    <SocialTab
                        captions={localCaptions}
                        hashtags={localHashtags}
                        newHashtag={newHashtag}
                        copiedId={copiedId}
                        onCaptionChange={updateCaption}
                        onCaptionSave={saveCaptions}
                        onCaptionDelete={deleteCaption}
                        onCaptionAdd={addCaption}
                        onHashtagAdd={addHashtag}
                        onHashtagRemove={removeHashtag}
                        onNewHashtagChange={setNewHashtag}
                        onCopy={handleCopy}
                    />
                )}

                {activeTab === 'script' && (
                    <ScriptTab
                        trimMode={trimMode.trimMode}
                        setTrimMode={trimMode.setTrimMode}
                        isTrimDirty={trimMode.isTrimDirty}
                        isSaving={trimMode.isSaving}
                        onSaveTrimChanges={trimMode.handleSaveTrimChanges}
                        onResetTrim={trimMode.handleResetTrim}
                        effectiveStartTime={trimMode.effectiveStartTime}
                        effectiveEndTime={trimMode.effectiveEndTime}
                        draggingHandle={trimMode.draggingHandle}
                        setDraggingHandle={trimMode.setDraggingHandle}
                        onBracketDrag={trimMode.handleBracketDrag}
                        localTranscriptWords={transcriptEditor.localTranscriptWords}
                        localTranscript={localTranscript}
                        editingWordIndex={transcriptEditor.editingWordIndex}
                        editValue={transcriptEditor.editValue}
                        onWordClick={transcriptEditor.handleWordClick}
                        onWordDoubleClick={transcriptEditor.handleWordDoubleClick}
                        onWordSave={transcriptEditor.handleWordSave}
                        onKeyDown={transcriptEditor.handleKeyDown}
                        setEditValue={transcriptEditor.setEditValue}
                        onTranscriptChange={setLocalTranscript}
                        onTranscriptSave={() => handleSave('transcript', localTranscript)}
                    />
                )}
            </div>

            {/* Footer */}
            <InspectorFooter
                isDeleting={isDeleting}
                onDelete={handleDelete}
                canDelete={!!onDelete}
                mode={trimMode.trimMode ? 'trim' : 'default'}
                onCancel={() => {
                    trimMode.handleResetTrim();
                    trimMode.setTrimMode(false);
                }}
                onSave={trimMode.handleSaveTrimChanges}
                isSaving={trimMode.isSaving}
                onPublishTikTok={handlePublishTikTok}
            />
        </GlassPanel>
    );
}
