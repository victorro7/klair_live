import { useState, useEffect, useCallback } from 'react';

interface TranscriptWord {
    word: string;
    punctuated_word?: string;
    start: number;
    end?: number;
}

interface UseTranscriptEditorProps {
    clipId: string | number;
    transcriptJson?: any;
    onSave: (field: string, value: any) => Promise<void>;
}

interface UseTranscriptEditorReturn {
    localTranscriptWords: TranscriptWord[];
    editingWordIndex: number | null;
    editValue: string;
    handleWordClick: (startTime: number) => void;
    handleWordDoubleClick: (index: number, word: string) => void;
    handleWordSave: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    setEditValue: (value: string) => void;
}

/**
 * Custom hook for managing interactive transcript editing
 * Handles word-level editing with JSON reconstruction
 */
export function useTranscriptEditor({
    clipId,
    transcriptJson,
    onSave,
}: UseTranscriptEditorProps): UseTranscriptEditorReturn {
    const [localTranscriptWords, setLocalTranscriptWords] = useState<TranscriptWord[]>([]);
    const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

    // Initialize local transcript words from clip
    useEffect(() => {
        if (!transcriptJson) {
            setLocalTranscriptWords([]);
            return;
        }
        try {
            const data = transcriptJson;
            const channels = data.channels || data.results?.channels;
            if (channels && channels.length > 0) {
                const alts = channels[0].alternatives;
                if (alts && alts.length > 0) {
                    setLocalTranscriptWords(alts[0].words || []);
                    return;
                }
            }
            setLocalTranscriptWords([]);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.error("Error parsing transcript json", e);
            setLocalTranscriptWords([]);
        }
    }, [transcriptJson]);

    const handleWordClick = useCallback((startTime: number) => {
        if (editingWordIndex !== null) return; // Don't seek if editing
        const event = new CustomEvent('seekTimestamp', {
            detail: { time: startTime, clipId }
        });
        window.dispatchEvent(event);
    }, [editingWordIndex, clipId]);

    const handleWordDoubleClick = useCallback((index: number, word: string) => {
        setEditingWordIndex(index);
        setEditValue(word);
    }, []);

    const handleWordSave = useCallback(() => {
        if (editingWordIndex === null) return;

        const updatedWords = [...localTranscriptWords];
        updatedWords[editingWordIndex] = {
            ...updatedWords[editingWordIndex],
            word: editValue,
            punctuated_word: editValue
        };

        setLocalTranscriptWords(updatedWords);
        setEditingWordIndex(null);

        // Reconstruct the JSON to save back
        let newJson = JSON.parse(JSON.stringify(transcriptJson || {}));

        // Helper to find where to put words
        let channels = newJson.channels || newJson.results?.channels;
        if (!channels) {
            newJson = { results: { channels: [{ alternatives: [{ words: updatedWords }] }] } };
        } else if (channels && channels.length > 0) {
            if (channels[0].alternatives && channels[0].alternatives.length > 0) {
                channels[0].alternatives[0].words = updatedWords;
                const fullText = updatedWords.map((w: TranscriptWord) => w.punctuated_word || w.word).join(" ");
                channels[0].alternatives[0].transcript = fullText;

                // Also update the plain text transcript field
                onSave('transcript', fullText);
            }
        }

        onSave('transcript_json', newJson);
    }, [editingWordIndex, editValue, localTranscriptWords, transcriptJson, onSave]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleWordSave();
        } else if (e.key === 'Escape') {
            setEditingWordIndex(null);
        }
    }, [handleWordSave]);

    return {
        localTranscriptWords,
        editingWordIndex,
        editValue,
        handleWordClick,
        handleWordDoubleClick,
        handleWordSave,
        handleKeyDown,
        setEditValue,
    };
}
