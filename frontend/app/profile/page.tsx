"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, RefreshCw, Menu, X } from 'lucide-react';
import { clipService } from '../services/clipService';
import { AccountSection } from './components/AccountSection';
import { PlatformHandlesSection } from './components/PlatformHandlesSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useToast } from '@/components/ui/Toast';

function ProfilePageContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [handles, setHandles] = useState<Record<string, string[]>>({ twitch: [], youtube: [] });
    const [activeSection, setActiveSection] = useState('account-details');
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        const init = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            if (error) {
                if (process.env.NODE_ENV === 'development') console.error("OAuth Error:", error);
                showToast(`Failed to connect account: ${error}`, 'error');
                router.replace('/profile');
            } else if (code && state) {
                try {
                    setIsLoading(true);
                    if (process.env.NODE_ENV === 'development') console.log("Exchanging TikTok code...", { code, state });
                    const result = await clipService.exchangeTikTokCode(code, state);
                    if (process.env.NODE_ENV === 'development') console.log("TikTok connected successfully:", result.username);
                    showToast(`TikTok connected successfully: ${result.username}`, 'success');
                } catch (err) {
                    if (process.env.NODE_ENV === 'development') console.error("Failed to exchange TikTok code:", err);
                    showToast(`Failed to connect TikTok account: ${(err as Error).message}`, 'error');
                } finally {
                    router.replace('/profile');
                }
            }

            await loadProfile();
        };
        init();
    }, [searchParams, router]);

    useEffect(() => {
        // Initial check
        const accountEl = document.getElementById('account-details');
        const platformEl = document.getElementById('platform-handles');

        if (accountEl && platformEl) {
            const platformRect = platformEl.getBoundingClientRect();
            if (platformRect.top <= 250) {
                setActiveSection('platform-handles');
            } else {
                setActiveSection('account-details');
            }
        }
    }, [handles]);

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const data = await clipService.getProfile();
            const normalized: Record<string, string[]> = { twitch: [], youtube: [] };

            Object.entries(data.platform_handles || {}).forEach(([key, val]) => {
                if (Array.isArray(val)) normalized[key] = val;
                else if (typeof val === 'string') normalized[key] = [val];
            });

            setHandles(normalized);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error("Failed to load profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddHandle = async (platform: string, handle: string) => {
        let handleToAdd = handle.trim();
        if (platform === 'youtube' && !handleToAdd.startsWith('@')) {
            handleToAdd = '@' + handleToAdd;
        }

        const updated = { ...handles };
        if (!updated[platform]) updated[platform] = [];

        if (!updated[platform].includes(handleToAdd)) {
            updated[platform].push(handleToAdd);
            setHandles(updated);
            await clipService.updateProfile(updated);
        }
    };

    const handleRemoveHandle = async (platform: string, handle: string) => {
        const updated = { ...handles };
        if (updated[platform]) {
            updated[platform] = updated[platform].filter(h => h !== handle);
            setHandles(updated);
            await clipService.updateProfile(updated);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                stiffness: 100,
                damping: 15
            }
        }
    };

    const navItems = [
        { id: 'account-details', label: 'Account Details', icon: User, indicatorClass: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]', iconColor: 'text-blue-400' },
        { id: 'platform-handles', label: 'Platform Handles', icon: RefreshCw, indicatorClass: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]', iconColor: 'text-purple-400' }
    ];

    return (
        <div className="h-screen bg-black text-white px-4 lg:px-6 pb-6 pt-0 font-sans overflow-hidden relative flex flex-col">
            {/* Background Ambient Glows (Subtler for sleek look) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />
            </div>

            <motion.div
                className="max-w-6xl mx-auto w-full relative z-10 flex flex-col h-full overflow-hidden shrink-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Main 2-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 relative items-stretch flex-1 min-h-0 overflow-hidden">
                    {/* Header & Sidebar Container */}
                    <motion.div variants={itemVariants} className="w-full flex-none lg:w-64 lg:shrink-0 lg:h-full lg:overflow-y-auto">
                        <div className="flex flex-col lg:flex-col gap-4 lg:gap-6 pl-0 lg:pl-4 pt-4 lg:pt-14 pb-2 lg:pb-4 relative">
                            {/* Nav Header */}
                            <div className="flex items-center justify-between px-2 lg:px-0">
                                <div className="flex items-center gap-4 lg:mb-4">
                                    <button onClick={() => router.back()} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/20 group">
                                        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                    </button>
                                    <h1 className="text-2xl lg:text-3xl font-light tracking-[-0.04em] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                                        Settings
                                    </h1>
                                </div>
                                {/* Mobile Nav Toggle */}
                                <button
                                    onClick={() => setIsMobileNavOpen(true)}
                                    className="lg:hidden p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/20 group"
                                >
                                    <Menu className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                </button>
                            </div>

                            {/* Ambient vertical line - Desktop Only */}
                            <div className="hidden lg:block absolute left-0 top-[128px] bottom-0 w-px bg-white/5" />

                            {/* Nav Items - Desktop Only */}
                            <div className="hidden lg:flex flex-col gap-6">

                                {navItems.map((item) => {
                                    const isActive = activeSection === item.id;
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={clsx(
                                                "flex items-center gap-4 text-[13px] font-light tracking-wide transition-all duration-300 relative group py-1",
                                                isActive ? "text-white" : "text-gray-500 hover:text-white"
                                            )}
                                        >
                                            {/* Desktop Active Indicator */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNavIndicator"
                                                    className={clsx("absolute -left-[17px] top-0 bottom-0 w-[3px] rounded-r-full", item.indicatorClass)}
                                                />
                                            )}
                                            <div className={clsx(
                                                "transition-colors duration-300",
                                                isActive ? item.iconColor : "text-gray-600 group-hover:text-gray-400"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            {item.label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Sections */}
                    <div
                        className="flex-1 flex flex-col gap-6 min-w-0 w-full lg:h-full overflow-y-auto pb-[50vh] pr-2 lg:pr-4 hide-scrollbar lg:custom-scrollbar scroll-smooth pt-2 lg:pt-14"
                        onScroll={(e) => {
                            const target = e.currentTarget;
                            const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;

                            const accountEl = document.getElementById('account-details');
                            const platformEl = document.getElementById('platform-handles');

                            if (isAtBottom) {
                                setActiveSection('platform-handles');
                            } else if (accountEl && platformEl) {
                                const platformRect = platformEl.getBoundingClientRect();
                                if (platformRect.top <= 250) {
                                    setActiveSection('platform-handles');
                                } else {
                                    setActiveSection('account-details');
                                }
                            }
                        }}
                    >
                        {/* Top - Account Info */}
                        <motion.div variants={itemVariants}>
                            <AccountSection />
                        </motion.div>

                        {/* Bottom - Integrations */}
                        <motion.div variants={itemVariants}>
                            <PlatformHandlesSection
                                handles={handles}
                                onAddHandle={handleAddHandle}
                                onRemoveHandle={handleRemoveHandle}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Nav Bottom Sheet */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileNavOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 rounded-t-3xl p-6 z-50 lg:hidden flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                        >
                            <div className="pt-2" />

                            {navItems.map((item) => {
                                const isActive = activeSection === item.id;
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                            setIsMobileNavOpen(false);
                                        }}
                                        className={clsx(
                                            "flex items-center gap-4 text-[15px] font-light tracking-wide transition-all duration-300 p-4 rounded-xl",
                                            isActive ? "border border-white/10 text-white bg-white/5" : "text-gray-400 hover:text-white bg-transparent border border-transparent"
                                        )}
                                    >
                                        <div className={clsx(
                                            "transition-colors duration-300",
                                            isActive ? item.iconColor : "text-gray-500 group-hover:text-gray-400"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {item.label}
                                    </a>
                                );
                            })}
                            <div className="pb-8" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {ToastComponent}
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] text-white p-6 flex justify-center items-center">Loading...</div>}>
            <ProfilePageContent />
        </Suspense>
    );
}

