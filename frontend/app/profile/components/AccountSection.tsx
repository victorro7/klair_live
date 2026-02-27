import React from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { CollapsibleGlassPanel } from '@/components/ui/CollapsibleGlassPanel';

export function AccountSection() {
    return (
        <CollapsibleGlassPanel
            id="account-details"
            title="Account Details"
            glowColor="none"
        >
            <div className="space-y-6">
                {/* Username */}
                <div className="space-y-3">
                    <label className="text-[10px] font-light tracking-[0.2em] text-white/40 uppercase pl-1 drop-shadow-md">Username</label>
                    <div className="relative group/input">
                        <div className="absolute inset-0 bg-blue-500/0 rounded-2xl blur-xl group-focus-within/input:bg-blue-500/15 transition-colors duration-500 pointer-events-none" />
                        <div className="relative bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl py-3 pl-11 pr-4 transition-all duration-300 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] group-focus-within/input:border-blue-500/30 group-focus-within/input:shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_1px_5px_rgba(59,130,246,0.15)] group-hover/input:border-white/10 flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-blue-400 transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value="User"
                                readOnly
                                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[13px] text-gray-200 p-0 shadow-none ring-0 cursor-default font-light"
                                style={{ boxShadow: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                    <label className="text-[10px] font-light tracking-[0.2em] text-white/40 uppercase pl-1 drop-shadow-md">Email</label>
                    <div className="relative group/input">
                        <div className="absolute inset-0 bg-blue-500/0 rounded-2xl blur-xl group-focus-within/input:bg-blue-500/15 transition-colors duration-500 pointer-events-none" />
                        <div className="relative bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl py-3 pl-11 pr-4 transition-all duration-300 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] group-focus-within/input:border-blue-500/30 group-focus-within/input:shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_1px_5px_rgba(59,130,246,0.15)] group-hover/input:border-white/10 flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-blue-400 transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                value="user@example.com"
                                readOnly
                                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[13px] text-gray-200 p-0 shadow-none ring-0 cursor-default font-medium"
                                style={{ boxShadow: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="pt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-light tracking-wide bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 border border-blue-500/30 shadow-[0_2px_10px_rgba(59,130,246,0.15)] backdrop-blur-md">
                        <Shield className="w-3.5 h-3.5" />
                        Standard Plan
                    </span>
                    <span className="text-[10px] font-light text-gray-500/80 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        Read-only
                    </span>
                </div>
            </div>
        </CollapsibleGlassPanel>
    );
}
