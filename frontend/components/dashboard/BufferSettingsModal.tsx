import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Settings, X, RefreshCw } from 'lucide-react';
import { BufferConfig } from '@/app/types/clip';
import { supabase } from '@/lib/supabase';

interface BufferSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfigSaved?: () => void;
    configButtonRef?: React.RefObject<HTMLButtonElement | null>;
    onModalHover?: (isHovered: boolean) => void;
}

const BufferSettingsModal: React.FC<BufferSettingsModalProps> = ({ isOpen, onClose, onConfigSaved, configButtonRef, onModalHover }) => {
    const [config, setConfig] = useState<BufferConfig>({ pre_buffer: 90, post_buffer: 30, enable_realtime_voice: true, clip_cooldown: 60 });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Calculate position based on button location
    const updatePosition = () => {
        if (isOpen && configButtonRef?.current) {
            const rect = configButtonRef.current.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;
            const gap = 12; // gap between button and modal

            // Check if we're on mobile/tablet (screen width < 1280px to match DashboardHeader breakpoint)
            const isMobile = window.innerWidth < 1280;

            if (isMobile) {
                // Position centrally above the bottom bar
                setModalStyle({
                    position: 'fixed',
                    bottom: '100px', // Above the floating bar
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: 'auto',
                    zIndex: 9999,
                });
            } else {
                // Position directly under the button on desktop, centered relative to the button
                // Modal width is w-64 (16rem = 256px)
                const modalWidth = 256;
                const centeredLeft = rect.left + (rect.width / 2) - (modalWidth / 2);

                setModalStyle({
                    position: 'absolute',
                    top: `${rect.bottom + scrollY + gap}px`,
                    left: `${centeredLeft + scrollX}px`,
                    zIndex: 9999,
                });
            }
        }
    };

    React.useLayoutEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen, configButtonRef]);

    // Fetch config when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchConfig();
        }
    }, [isOpen]);



    // ... (imports remain)

    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${baseUrl}/config`, { headers });

            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            } else if (res.status === 401) {
                if (process.env.NODE_ENV === 'development') console.warn("Unauthorized: Please log in.");
                // Optionally redirect or show login prompt
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to fetch config:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${baseUrl}/config/buffer`, {
                method: 'POST',
                headers,
                body: JSON.stringify(config),
            });
            if (res.ok) {
                if (onConfigSaved) onConfigSaved();
                onClose(); // Close on success
            } else if (res.status === 401) {
                alert("You must be logged in to save settings.");
                // window.location.href = '/login'; 
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to save config:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return mounted ? createPortal(
        <div
            className="fixed z-[9999] w-64 backdrop-blur-lg border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 p-3 animate-in fade-in"
            style={modalStyle}
            onMouseEnter={() => onModalHover?.(true)}
            onMouseLeave={() => onModalHover?.(false)}
        >
            {/* Ambient Glows */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Settings className="text-purple-500" size={12} />
                    Capture Settings
                </h2>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X size={12} />
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-4">
                    <RefreshCw className="animate-spin text-purple-500 w-4 h-4" />
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="block text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Pre-Buffer (s)
                        </label>
                        <input
                            type="number"
                            value={config.pre_buffer}
                            onChange={(e) => setConfig({ ...config, pre_buffer: parseInt(e.target.value) || 0 })}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Post-Delay (s)
                        </label>
                        <input
                            type="number"
                            value={config.post_buffer}
                            onChange={(e) => setConfig({ ...config, post_buffer: parseInt(e.target.value) || 0 })}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Clip Cooldown (s)
                        </label>
                        <input
                            type="number"
                            value={config.clip_cooldown || 60}
                            onChange={(e) => setConfig({ ...config, clip_cooldown: parseInt(e.target.value) || 0 })}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                            <span>Realtime Voice</span>
                            <span className={`text-[8px] ${config.enable_realtime_voice ? 'text-green-400' : 'text-gray-500'}`}>
                                {config.enable_realtime_voice ? 'ENABLED' : 'DISABLED'}
                            </span>
                        </label>

                        <button
                            onClick={() => setConfig({ ...config, enable_realtime_voice: !config.enable_realtime_voice })}
                            className={`relative w-full h-8 rounded-lg border transition-all duration-300 flex items-center px-1 ${config.enable_realtime_voice
                                ? 'bg-purple-900/40 border-purple-500/50'
                                : 'bg-black/40 border-white/10'
                                }`}
                        >
                            <div className={`w-full flex justify-between px-2 text-[9px] font-bold z-10 ${config.enable_realtime_voice ? 'text-white' : 'text-gray-500'}`}>
                                <span>OFF</span>
                                <span>ON</span>
                            </div>
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded bg-purple-500 shadow-lg transition-all duration-300 ${config.enable_realtime_voice ? 'left-[calc(50%+2px)]' : 'left-1 bg-gray-600'
                                    }`}
                            />
                        </button>
                        <p className="text-[8px] text-gray-500 mt-1.5 leading-tight">
                            Enables "Clip That" voice commands.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 mt-2"
                    >
                        {isSaving ? <RefreshCw className="animate-spin w-3 h-3" /> : "Save"}
                    </button>
                </div>
            )}
        </div>,
        document.body
    ) : null;
};

export default BufferSettingsModal;
