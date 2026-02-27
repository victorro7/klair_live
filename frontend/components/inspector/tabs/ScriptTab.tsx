import React, { Fragment } from 'react';
import { Save, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { formatTimestamp } from '../../../utils/timeHelpers';

interface TranscriptWord {
    word: string;
    punctuated_word?: string;
    start: number;
    end?: number;
}

interface ScriptTabProps {
    // Trim mode
    trimMode: boolean;
    setTrimMode: (value: boolean) => void;
    isTrimDirty: boolean;
    isSaving: boolean;
    onSaveTrimChanges: () => void;
    onResetTrim: () => void;

    // Effective times for boundary checking
    effectiveStartTime: number;
    effectiveEndTime: number | null;

    // Drag handle
    draggingHandle: 'start' | 'end' | null;
    setDraggingHandle: (value: 'start' | 'end' | null) => void;
    onBracketDrag: (wordTime: number, handle: 'start' | 'end') => void;

    // Transcript
    localTranscriptWords: TranscriptWord[];
    localTranscript: string;
    editingWordIndex: number | null;
    editValue: string;
    onWordClick: (startTime: number) => void;
    onWordDoubleClick: (index: number, word: string) => void;
    onWordSave: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    setEditValue: (value: string) => void;

    // Fallback textarea
    onTranscriptChange: (value: string) => void;
    onTranscriptSave: () => void;
}

/**
 * ScriptTab Component
 * Contains trim mode controls and interactive transcript view
 */
export function ScriptTab({
    trimMode,
    setTrimMode,
    isTrimDirty,
    isSaving,
    onSaveTrimChanges,
    onResetTrim,
    effectiveStartTime,
    effectiveEndTime,
    draggingHandle,
    setDraggingHandle,
    onBracketDrag,
    localTranscriptWords,
    localTranscript,
    editingWordIndex,
    editValue,
    onWordClick,
    onWordDoubleClick,
    onWordSave,
    onKeyDown,
    setEditValue,
    onTranscriptChange,
    onTranscriptSave,
}: ScriptTabProps) {
    return (
        <div className="h-full flex flex-col animate-in fade-in duration-300 slide-in-from-bottom-2">
            {/* Trim Mode Controls */}
            <div className="flex items-center gap-2 mb-3">
                {!trimMode ? (
                    <button
                        onClick={() => setTrimMode(true)}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Full Transcript
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                ) : isTrimDirty ? (
                    <>
                        <button
                            onClick={() => {
                                onResetTrim();
                                setTrimMode(false);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSaveTrimChanges}
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30 transition-all disabled:opacity-50"
                        >
                            <Save className="w-3 h-3" />
                            {isSaving ? "Saving..." : "Save & Exit"}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setTrimMode(false)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all"
                    >
                        Exit Trim Mode
                    </button>
                )}
            </div>

            <div className="relative flex-1 group/input">
                <div className="absolute inset-0 bg-green-500/5 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500" />

                {/* Interactive Transcript View if JSON exists */}
                {localTranscriptWords.length > 0 ? (
                    <div className="relative w-full h-full bg-black/20 hover:bg-black/30 border border-white/5 focus-within:border-green-500/30 rounded-2xl p-5 overflow-y-auto font-mono text-xs text-gray-400 leading-relaxed shadow-inner">
                        <div className="mb-3 text-[10px] text-gray-600 italic border-b border-white/5 pb-2">
                            {trimMode
                                ? "* Drag START/END brackets to adjust clip boundaries • Video scrubs as you drag"
                                : "* Click words to jump • Double-click to edit"}
                        </div>
                        <div className="flex flex-wrap gap-x-1 gap-y-1 items-baseline">
                            {localTranscriptWords.map((w, i) => {
                                const wordStart = w.start;
                                const isInBounds = wordStart >= effectiveStartTime &&
                                    (effectiveEndTime === null || wordStart < effectiveEndTime);

                                // Find first and last in-bounds words for bracket placement
                                const isFirstInBounds = isInBounds && (i === 0 ||
                                    localTranscriptWords[i - 1].start < effectiveStartTime);
                                const isLastInBounds = isInBounds && (
                                    i === localTranscriptWords.length - 1 ||
                                    (effectiveEndTime !== null && localTranscriptWords[i + 1]?.start >= effectiveEndTime)
                                );

                                // Timestamp Logic
                                const prevWord = i > 0 ? localTranscriptWords[i - 1] : null;
                                const showTimestamp = i === 0 || (prevWord && Math.floor(w.start / 5) > Math.floor(prevWord.start / 5));

                                const timestampElem = showTimestamp ? (
                                    <span key={`ts-${i}`} className={clsx(
                                        "w-full block mt-2 mb-1 text-[10px] font-bold select-none",
                                        isInBounds || trimMode ? "text-green-500/50" : "text-gray-600/30"
                                    )}>
                                        {formatTimestamp(w.start)}
                                    </span>
                                ) : null;

                                // Don't show out-of-bounds words unless in trim mode
                                if (!trimMode && !isInBounds) {
                                    return null;
                                }

                                return (
                                    <Fragment key={i}>
                                        {timestampElem}

                                        {/* Start Bracket Handle */}
                                        {trimMode && isFirstInBounds && (
                                            <span
                                                className="inline-flex items-center cursor-ew-resize select-none mr-1"
                                                draggable
                                                onDragStart={(e) => {
                                                    setDraggingHandle('start');
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                onDragEnd={() => setDraggingHandle(null)}
                                                title="Drag to adjust start time"
                                            >
                                                <span className="px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded-l text-[10px] font-bold border border-purple-500/50 hover:bg-purple-500/40 transition-colors">
                                                    ◂ START
                                                </span>
                                            </span>
                                        )}

                                        {editingWordIndex === i ? (
                                            <input
                                                key={i}
                                                autoFocus
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={onWordSave}
                                                onKeyDown={onKeyDown}
                                                className="bg-black/50 text-white rounded px-1 outline-none border border-green-500/50 min-w-[20px]"
                                                style={{ width: `${Math.max(editValue.length, 2)}ch` }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                onClick={() => {
                                                    if (trimMode && draggingHandle) {
                                                        const timeToUse = draggingHandle === 'end'
                                                            ? (w.end || w.start + 0.5)
                                                            : w.start;
                                                        onBracketDrag(timeToUse, draggingHandle);
                                                    } else {
                                                        onWordClick(w.start);
                                                    }
                                                }}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    if (draggingHandle) {
                                                        const timeToUse = draggingHandle === 'end'
                                                            ? (w.end || w.start + 0.5)
                                                            : w.start;
                                                        onBracketDrag(timeToUse, draggingHandle);
                                                    }
                                                }}
                                                onDoubleClick={() => onWordDoubleClick(i, w.punctuated_word || w.word)}
                                                className={clsx(
                                                    "rounded px-1 cursor-pointer transition-colors duration-150 select-none",
                                                    isInBounds
                                                        ? "text-gray-200 hover:text-green-400 hover:bg-white/10"
                                                        : "text-gray-500/50 hover:text-gray-400 hover:bg-white/5"
                                                )}
                                                title={trimMode && !isInBounds
                                                    ? `Drag bracket here to include (${w.start}s)`
                                                    : `Jump to ${w.start}s (Double-click to edit)`}
                                            >
                                                {w.punctuated_word || w.word}
                                            </span>
                                        )}

                                        {/* End Bracket Handle */}
                                        {trimMode && isLastInBounds && (
                                            <span
                                                className="inline-flex items-center cursor-ew-resize select-none ml-1"
                                                draggable
                                                onDragStart={(e) => {
                                                    setDraggingHandle('end');
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                onDragEnd={() => setDraggingHandle(null)}
                                                title="Drag to adjust end time"
                                            >
                                                <span className="px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded-r text-[10px] font-bold border border-purple-500/50 hover:bg-purple-500/40 transition-colors">
                                                    END ▸
                                                </span>
                                            </span>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Fallback Editable Textarea
                    <textarea
                        value={localTranscript}
                        onChange={(e) => onTranscriptChange(e.target.value)}
                        onBlur={onTranscriptSave}
                        placeholder="Transcript not available or empty..."
                        className="relative w-full h-full bg-black/20 hover:bg-black/30 focus:bg-black/40 border border-white/5 focus:border-green-500/30 rounded-2xl p-5 overflow-y-auto font-mono text-xs text-gray-400 leading-relaxed whitespace-pre-wrap resize-none focus:outline-none focus:ring-1 focus:ring-green-500/20 transition-all shadow-inner"
                    />
                )}
            </div>
        </div>
    );
}
