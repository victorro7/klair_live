"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ArrowRight, CheckCircle2, Play, Zap, Brain, FileText, Rocket, Github, Terminal } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

export default function LandingPageClient({ initialUser }: { initialUser: any }) {
    const [user, setUser] = useState<any>(initialUser);

    useEffect(() => {
        // Listen for auth changes (in case they log in/out in another tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Helper to get environment-agnostic URLs
    // In production, app.klair.live routes to our dashboard
    // In local development, we use relative paths to avoid localhost cookie sharing restrictions
    const getAppUrl = (path: string = '/dashboard') => {
        const isLocal = process.env.NODE_ENV === 'development';
        if (isLocal) {
            return path === '/demo' ? '/demo' : '/dashboard';
        }
        const base = process.env.NEXT_PUBLIC_APP_URL || `https://app.klair.live`;
        return `${base}${path}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-inter)] overflow-x-hidden selection:bg-purple-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <BackgroundBeams />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-6 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <span className="text-2xl tracking-[-0.03em] font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                KLAIR
                            </span>
                        </Link>
                    </div>

                    <div className="pointer-events-auto bg-black/50 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
                        {!user && (
                            <Link href="/login" className="px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                Log in
                            </Link>
                        )}
                        <Link
                            href={user ? getAppUrl() : "/login"}
                            className="px-6 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            {user ? "Dashboard" : "Get Started"}
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative pt-48 pb-16 px-6 z-10">

                {/* --- HERO SECTION --- */}
                <div className="max-w-7xl mx-auto text-center mb-32">
                    <h1 className="text-6xl md:text-8xl font-light tracking-[-0.04em] mb-8 leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        Turn Live Hours into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">Viral Revenue.</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        The AI-native co-pilot that watches your stream, detects viral moments, and edits them for TikTok & Shorts instantly.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-8 mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        <Link
                            href={user ? getAppUrl() : getAppUrl('/demo')}
                            className="group relative px-8 py-4 rounded-full bg-white text-black font-medium tracking-wide hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            {user ? "Launch Dashboard" : "Try Live Demo"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <WaitlistForm />
                    </div>

                    {/* HERO VIDEO CONTAINER */}
                    <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-[0_0_100px_-20px_rgba(120,50,255,0.15)] bg-black/40 backdrop-blur-xl group animate-in fade-in zoom-in-95 duration-1000 delay-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none"></div>

                        {/* UPDATE THIS SRC WITH YOUR 'HERO' CLIP URL */}
                        <video
                            src="/klair_demos/demo.mp4"
                            autoPlay muted loop playsInline
                            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        />

                        {/* Overlay Badge */}
                        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/5">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-gray-300">Processing Live Feed...</span>
                        </div>
                    </div>
                </div>

                {/* --- TRUST BAR --- */}
                <div className="max-w-7xl mx-auto mb-40 border-y border-white/5 py-12 bg-white/[0.02]">
                    <p className="text-center text-[10px] font-medium text-gray-600 mb-8 uppercase tracking-[0.3em]">Works Seamlessly With</p>
                    <div className="flex justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {/* Twitch */}
                        <svg className="h-8 w-auto hover:text-[#9146FF] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" /></svg>
                        {/* YouTube */}
                        <svg className="h-8 w-auto hover:text-[#FF0000] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                        {/* TikTok */}
                        <svg className="h-8 w-auto hover:text-white transition-colors hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                    </div>
                </div>

                {/* --- FEATURES (The Zig-Zag) --- */}
                <div className="max-w-7xl mx-auto mb-40 space-y-32">

                    {/* Feature 1: AI Scoring */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                            {/* UPDATE SRC: ANALYSIS TAB VIDEO */}
                            <video src="/klair_demos/AI_analysis.mp4" autoPlay muted loop playsInline className="w-full" />
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="inline-flex items-center gap-2 text-purple-400 mb-6">
                                <Brain className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-widest">Context-Aware Intelligence</span>
                            </div>
                            <h3 className="text-4xl font-light mb-6">Stop Guessing.<br />Start Growing.</h3>
                            <p className="text-gray-400 leading-relaxed text-lg mb-8">
                                Klair's multi-modal AI doesn't just watch; it understands. It analyzes chat velocity, audio tonality, and visual context to assign a <strong>Viral Score (0-100)</strong>, so you only publish winners.
                            </p>
                            <ul className="space-y-3">
                                {['Multimodal Analysis (Video + Audio)', 'Instant Virality Scoring', 'Auto-Generated Captions'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-purple-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2: Transcript Editing */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-1">
                            <div className="inline-flex items-center gap-2 text-blue-400 mb-6">
                                <FileText className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-widest">Text-Based Editing</span>
                            </div>
                            <h3 className="text-4xl font-light mb-6">Edit Video Like<br />a Word Doc.</h3>
                            <p className="text-gray-400 leading-relaxed text-lg mb-8">
                                Scrubbing timelines is the past. Search the transcript, click the word where the joke started, and Klair handles the cut. Refine clips 10x faster.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
                                    Click "Hello" &rarr; Jump to 00:12
                                </div>
                            </div>
                        </div>
                        <div className="order-2 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                            {/* UPDATE SRC: TRANSCRIPT VIDEO */}
                            <video src="/klair_demos/Script_edit.mp4" autoPlay muted loop playsInline className="w-full" />
                        </div>
                    </div>

                    {/* Feature 3: Architecture */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 w-3/4 mx-auto">
                            {/* UPDATE SRC: LOGS/SETTINGS VIDEO */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                            <img src="/klair_demos/Capture_Settings.JPG" className="w-full object-cover opacity-80" alt="Settings" />
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="inline-flex items-center gap-2 text-green-400 mb-6">
                                <Terminal className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-widest">Latency-Free Capture</span>
                            </div>
                            <h3 className="text-4xl font-light mb-6">Built for<br />Real-Time.</h3>
                            <p className="text-gray-400 leading-relaxed text-lg mb-8">
                                Powered by a custom FFmpeg ring buffer and Async IO, Klair captures the 90 seconds <em>before</em> a trigger happens without dropping a single frame of your live feed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- PRICING --- */}
                <div className="max-w-7xl mx-auto mb-40" id="pricing">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-light mb-6 tracking-tight">Simple Pricing.</h2>
                        <p className="text-xl text-gray-400 font-light">Start for free, upgrade when you go viral.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                        {/* Free Tier */}
                        <div className="p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md flex flex-col hover:border-white/20 transition-all duration-300">
                            <h3 className="text-lg font-normal text-gray-400 mb-2 uppercase tracking-wider">Hobbyist</h3>
                            <div className="text-4xl font-normal mb-8">$0<span className="text-sm font-normal text-gray-500">/mo</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {["Manual Triggers", "720p Export", "Community Support", "5 Hours/mo Analysis"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                        <CheckCircle2 className="w-4 h-4 text-gray-600" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href={user ? getAppUrl() : "/login"} className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-center font-normal text-sm tracking-wide">
                                {user ? "Go to Dashboard" : "Get Started"}
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="relative p-10 rounded-3xl border border-purple-500/30 bg-black/60 backdrop-blur-2xl flex flex-col scale-110 shadow-[0_0_60px_-10px_rgba(168,85,247,0.2)] z-10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] font-normal uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.5)]">Most Popular</div>
                            <h3 className="text-lg font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 uppercase tracking-wider">Creator</h3>
                            <div className="text-5xl font-normal mb-8">$29<span className="text-sm font-normal text-gray-500">/mo</span></div>
                            <ul className="space-y-4 mb-10 flex-1">
                                {["AI Auto-Detection", "1080p Export", "Unlimited Cloud Storage", "Priority Support", "Unlimited Analysis"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <CheckCircle2 className="w-4 h-4 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={user ? getAppUrl() : "/login"}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity text-center font-normal text-sm tracking-wide shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                            >
                                {user ? "Upgrade Plan" : "Start Free Trial"}
                            </Link>
                        </div>

                        {/* Agency Tier */}
                        <div className="p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md flex flex-col hover:border-white/20 transition-all duration-300">
                            <h3 className="text-lg font-normal text-gray-400 mb-2 uppercase tracking-wider">Agency</h3>
                            <div className="text-4xl font-normal mb-8">Custom</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {["Multi-seat Management", "API Access", "Dedicated Account Manager", "Custom Integrations"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                        <CheckCircle2 className="w-4 h-4 text-gray-600" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-center font-normal text-sm tracking-wide">Contact Sales</button>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <footer className="border-t border-white/5 py-12 text-gray-500 relative">
                    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-6 text-center">
                        <span className="text-xl tracking-tight text-white font-light">KLAIR</span>
                        <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                            The AI-native video editor built for the next generation of creators.
                        </p>
                        <div className="flex gap-6 text-xs mt-2">
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        </div>
                        <span className="text-xs mt-2">© 2026 Klair Inc. Open Source under CC-BY-NC 4.0.</span>
                    </div>
                </footer>
            </main>
        </div>
    );
}
