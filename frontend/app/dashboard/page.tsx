"use client";

import { useEffect, useRef, useState } from "react";
import { useClipEngine } from "@/hooks/useClipEngine";
import { Trash2 } from 'lucide-react';

// Component imports
import PlatformManagerModal from '@/components/dashboard/PlatformManagerModal';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SystemLogs } from '@/components/dashboard/SystemLogs';
import { supabase } from '@/lib/supabase';

import { ClipGallery } from '@/components/dashboard/ClipGallery';
import { ClipInspector } from '@/components/dashboard/ClipInspector';
import { InspectorVideoView } from '@/components/inspector/InspectorVideoView';
import { TikTokPublishPanel } from '@/components/inspector/TikTokPublishPanel';
import { Clip } from "@/hooks/useClipEngine";
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

// Hook imports
import { useClipSorting } from '@/hooks/useClipSorting';
import { useClipFiltering } from '@/hooks/useClipFiltering';
import { useStreamControls } from '@/hooks/useStreamControls';
import { useClipGrouping } from '@/hooks/useClipGrouping';
import { useViralGrouping } from '@/hooks/useViralGrouping';
import { ViewMode } from '@/app/types/dashboard';
import { calculateClipDuration } from '@/utils/clipHelpers';
import { demoClips } from '@/data/demoData';
import { useToast } from '@/components/ui/Toast';



export default function Dashboard() {
  // Engine hooks
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsDemoMode(!session);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsDemoMode(!session);
      });

      return () => subscription.unsubscribe();
    };
    checkUser();
  }, []);

  const { logs, status, clips: engineClips, config, isLoadingClips: engineIsLoading, startEngine, stopEngine, manualTrigger, fetchClips, fetchConfig, deleteClip, deleteClipsBatch, renameClip, updateClip } = useClipEngine();

  const clips = isDemoMode ? demoClips : engineClips;
  const isLoadingClips = isDemoMode ? false : engineIsLoading;

  // Local state
  const prevLogLengthRef = useRef(0);
  const [managingPlatform, setManagingPlatform] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('streamer');
  const [showPublishPanel, setShowPublishPanel] = useState(false);

  // Load viewMode from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('klair_dashboard_viewMode') as ViewMode | null;
      if (savedMode === 'streamer' || savedMode === 'viral') {
        setViewMode(savedMode);
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error("Failed to read viewMode from localStorage", e);
    }
  }, []);

  // Save viewMode to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('klair_dashboard_viewMode', viewMode);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error("Failed to save viewMode to localStorage", e);
    }
  }, [viewMode]);

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedClipIds, setSelectedClipIds] = useState<Set<string>>(new Set());

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom hooks
  const { sortedClips, sortOption, setSortOption } = useClipSorting(clips);
  const {
    hiddenCreators,
    collapsedCreators,
    setHiddenCreators,
    setCollapsedCreators,
    toggleCreatorCollapse
  } = useClipFiltering();

  const { showToast, ToastComponent } = useToast();

  const {
    inputMode,
    setInputMode,
    streamUrl,
    setStreamUrl,
    selectedPlatform,
    setSelectedPlatform,
    targetUsername,
    setTargetUsername,
    getStreamConfig
  } = useStreamControls();

  // Derived state
  const durationLabel = calculateClipDuration(config?.pre_buffer || 90, config?.post_buffer || 30);
  const groupedData = useClipGrouping(sortedClips);
  const groupedViralData = useViralGrouping(sortedClips);

  // Sync stream URL with status
  useEffect(() => {
    if (status?.stream_url && status.running) {
      setStreamUrl(status.stream_url);
    }
  }, [status, setStreamUrl]);

  // Auto-fetch clips when new ones are saved
  useEffect(() => {
    if (logs.length > prevLogLengthRef.current) {
      if (!isDemoMode) {
        const newLogs = logs.slice(prevLogLengthRef.current);
        // Wait for Supabase confirmation effectively ensuring clip is queryable
        // Supports both old "Saved metadata to Supabase" and new "Saved Clip X ... to Supabase"
        if (newLogs.some(log => log.message.includes("Saved") && log.message.includes("to Supabase"))) {
          fetchClips();
        }
      }
    }
    prevLogLengthRef.current = logs.length;
  }, [logs, fetchClips]);

  // Auto-select clip from localStorage if it exists in current clips
  useEffect(() => {
    if (!selectedClip) {
      try {
        const savedClipId = localStorage.getItem('klair_dashboard_selectedClipId');
        if (savedClipId) {
          const clipToSelect = clips.find(c => String(c.id) === savedClipId);
          if (clipToSelect) {
            setSelectedClip(clipToSelect);
          }
        }
      } catch (e) {
        console.error("Failed to read selectedClipId from localStorage", e);
      }
    }
  }, [clips, selectedClip]);

  // Clear selection when mode changes
  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedClipIds(new Set());
    }
  }, [isSelectionMode]);

  // Keep selectedClip in sync with clips array (for updates after save)
  useEffect(() => {
    if (selectedClip) {
      const updatedClip = clips.find(c => String(c.id) === String(selectedClip.id));
      if (updatedClip && JSON.stringify(updatedClip) !== JSON.stringify(selectedClip)) {
        setSelectedClip(updatedClip);
      } else if (!updatedClip) {
        // Clip was deleted
        setSelectedClip(null);
        try { localStorage.removeItem('klair_dashboard_selectedClipId'); } catch (e) { }
      }
    }
  }, [clips, selectedClip]);

  // Event handlers
  const handleStart = () => {
    if (isDemoMode) {
      showToast("For this demo, live processing is disabled to save API costs. Feel free to explore the sample analysis below!", "info", 5000);
      return;
    }
    const config = getStreamConfig();
    if (config.mode === 'url') {
      startEngine({ url: config.url });
    } else {
      startEngine({ platform: config.platform, username: config.username });
    }
  };

  const handleManagePlatform = (platformName: string) => {
    setManagingPlatform(platformName);
  };

  const handleClipSelect = (clip: Clip) => {
    if (isSelectionMode) {
      // Toggle selection in batch mode
      const newSet = new Set(selectedClipIds);
      const idStr = String(clip.id);
      if (newSet.has(idStr)) {
        newSet.delete(idStr);
      } else {
        newSet.add(idStr);
      }
      setSelectedClipIds(newSet);
    } else {
      setSelectedClip(clip);
      try { localStorage.setItem('klair_dashboard_selectedClipId', String(clip.id)); } catch (e) { }
      setShowPublishPanel(false); // Close panel if selecting a new clip
    }
  };

  const handleBackToLogs = () => {
    setSelectedClip(null);
    try { localStorage.removeItem('klair_dashboard_selectedClipId'); } catch (e) { }
    setShowPublishPanel(false);
  };

  const handleDeleteClip = async (id: string) => {
    if (isDemoMode) {
      showToast("Delete is disabled in demo mode.", "error");
      return;
    }
    await deleteClip(id);
    if (selectedClip && String(selectedClip.id) === id) {
      setSelectedClip(null);
      try { localStorage.removeItem('klair_dashboard_selectedClipId'); } catch (e) { }
    }
  };

  const handleBatchDelete = () => {
    if (selectedClipIds.size === 0) return;
    setShowDeleteModal(true);
  };

  const confirmBatchDelete = async () => {
    try {
      setIsDeleting(true);
      if (isDemoMode) {
        showToast("Batch delete is disabled in demo mode.", "error");
        setIsDeleting(false);
        setShowDeleteModal(false);
        return;
      }
      await deleteClipsBatch(Array.from(selectedClipIds));
      setShowDeleteModal(false);
      setIsSelectionMode(false);
      setSelectedClipIds(new Set());
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error("Failed to delete clips", e);
      // Optional: Show error toast here
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => !prev);
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-black via-[#0a0015] to-black text-white overflow-hidden font-[family-name:var(--font-inter)]" style={{ fontFamily: 'var(--font-inter)' }}>
      <BackgroundBeams />

      {/* Header */}
      <DashboardHeader
        isLive={status?.running || false}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        inputMode={inputMode}
        onInputModeChange={setInputMode}
        streamUrl={streamUrl}
        onStreamUrlChange={setStreamUrl}
        platform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        username={targetUsername}
        onUsernameChange={setTargetUsername}
        onStart={handleStart}
        onStop={() => isDemoMode ? showToast("Engine is not running in demo mode.", "info") : stopEngine()}
        onManualTrigger={() => isDemoMode ? showToast("Trigger is disabled in demo mode.", "info") : manualTrigger()}
        config={config}
        onConfigSaved={fetchConfig}
      />

      {/* Main Layout */}
      <div className="relative z-10 pt-24 pb-12 max-w-[1920px] mx-auto">
        <div className={`px-3 md:px-3 grid grid-cols-1 gap-6 h-[calc(100vh-144px)] transition-all duration-500 ease-in-out ${selectedClip
          ? "xl:grid-cols-[320px_auto_1fr]"
          : "xl:grid-cols-[320px_1fr]"
          }`}>

          <div className="hidden xl:flex flex-col gap-6 min-h-0 h-full">
            {selectedClip ? (
              <ClipInspector
                clip={selectedClip}
                onBack={handleBackToLogs}
                onDelete={handleDeleteClip}
                onUpdate={updateClip}
                onOpenPublishPanel={() => setShowPublishPanel(true)}
                onRefreshClips={fetchClips}
              />
            ) : (
              <SystemLogs logs={logs} />
            )}
          </div>

          {/* Middle - Video View (Only when clip selected) */}
          {selectedClip && (
            <div className="min-h-0 h-full aspect-[9/16] mx-auto">
              <InspectorVideoView
                clip={selectedClip}
                onClose={handleBackToLogs}
                onNext={() => {
                  const currentIndex = sortedClips.findIndex(c => c.id === selectedClip.id);
                  if (currentIndex < sortedClips.length - 1) {
                    handleClipSelect(sortedClips[currentIndex + 1]);
                  }
                }}
                onPrevious={() => {
                  const currentIndex = sortedClips.findIndex(c => c.id === selectedClip.id);
                  if (currentIndex > 0) {
                    handleClipSelect(sortedClips[currentIndex - 1]);
                  }
                }}
                hasNext={sortedClips.findIndex(c => c.id === selectedClip.id) < sortedClips.length - 1}
                hasPrevious={sortedClips.findIndex(c => c.id === selectedClip.id) > 0}
              />
            </div>
          )}

          {/* Right Side - Conditional Views */}
          <div className="h-full min-h-0 flex flex-col">
            {showPublishPanel && selectedClip ? (
              <TikTokPublishPanel
                clip={selectedClip}
                onClose={() => setShowPublishPanel(false)}
                onSuccess={() => { }}
              />
            ) : (
              <ClipGallery
                clipCount={clips.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                groupedData={groupedData}
                groupedViralData={groupedViralData}
                sortOption={sortOption}
                onSortChange={setSortOption}
                hiddenCreators={hiddenCreators}
                collapsedCreators={collapsedCreators}
                onToggleCreatorCollapse={toggleCreatorCollapse}
                onManagePlatform={handleManagePlatform}
                onDelete={handleDeleteClip}
                onRename={renameClip}
                onClipSelect={handleClipSelect}
                selectedClipId={selectedClip ? (selectedClip.id as string) : undefined}
                isLoading={isLoadingClips}

                // Batch Props
                isSelectionMode={isSelectionMode}
                selectedClipIds={selectedClipIds}
                onToggleSelectionMode={toggleSelectionMode}
                onBatchDelete={handleBatchDelete}
              />
            )}
          </div>
        </div>
      </div>

      {/* Platform Manager Modal */}
      <PlatformManagerModal
        isOpen={managingPlatform !== null}
        onClose={() => setManagingPlatform(null)}
        platform={managingPlatform || ''}
        allCreators={
          groupedData.find((g) => g.platformName === managingPlatform)?.allCreators || []
        }
        hiddenCreators={hiddenCreators}
        onToggleCreator={(creator) => {
          setHiddenCreators((prev) => {
            const next = new Set(prev);
            if (next.has(creator)) {
              next.delete(creator);
            } else {
              next.add(creator);
            }
            return next;
          });
        }}
      />

      {/* Batch Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Clips?"
        message={`Are you sure you want to delete ${selectedClipIds.size} selected clips? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedClipIds.size} Clips`}
        onConfirm={confirmBatchDelete}
        onCancel={() => !isDeleting && setShowDeleteModal(false)}
        isDestructive={true}
        isLoading={isDeleting}
      />
      {/* Toast Notification */}
      {ToastComponent}

    </div>
  );
}
