
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("creator");
    const [platform, setPlatform] = useState("twitch");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "conflict">("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        const { error } = await supabase
            .from("waitlist")
            .insert([{ email, user_type: role, platform }]);

        if (error) {
            // Check for unique violation (duplicate email)
            if (error.code === '23505') {
                setStatus("conflict");
            } else {
                if (process.env.NODE_ENV === 'development') console.error(error);
                setStatus("error");
            }
        } else {
            setStatus("success");
            setEmail("");
        }
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500 py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div className="space-y-1 mb-4">
                    <h3 className="text-xl font-medium text-white">You're on the list!</h3>
                    <p className="text-sm text-gray-400">We'll notify you when your spot opens up.</p>
                </div>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium flex items-center gap-2 group"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-purple-400 transition-colors" />
                    Register another email
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-200">Join the Waitlist</h3>
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">v1.0 BETA</span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Input & Button */}
                <div className="relative">
                    <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pr-36 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="absolute right-2 top-2 bottom-2 bg-white !bg-white hover:bg-gray-200 text-black !text-black px-6 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 z-20 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Join <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </div>

                {/* Error Message */}
                {(status === "error" || status === "conflict") && (
                    <div className="flex items-center gap-2 text-red-400 text-xs px-1 -mt-4 animate-in fade-in slide-in-from-top-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {status === "conflict" ? "You're already on the waitlist!" : "Something went wrong. Please try again."}
                    </div>
                )}

                {/* Selection Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">I am a</label>
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                            <button
                                type="button"
                                onClick={() => setRole("creator")}
                                className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${role === 'creator' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Creator
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("agency")}
                                className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${role === 'agency' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Agency
                            </button>
                        </div>
                    </div>

                    {/* Platform Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Platform</label>
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 gap-1">
                            {[
                                { id: 'twitch', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" /></svg> },
                                { id: 'youtube', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
                                { id: 'tiktok', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg> },
                                {
                                    id: 'kick', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                        <path d="M3 3h4.5v7.8h.15l5.85-7.8h5.4L11.85 11.4l7.65 9.6h-5.55l-6.15-8.1h-.15v8.1H3V3z" />
                                    </svg>
                                }
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPlatform(p.id)}
                                    className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${platform === p.id ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {p.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
