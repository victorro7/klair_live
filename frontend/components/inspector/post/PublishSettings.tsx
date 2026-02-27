import React from 'react';
import clsx from 'clsx';
import { Dropdown } from '../../ui/Dropdown';

interface PublishSettingsProps {
    creatorInfo: any;
    privacyLevel: string;
    setPrivacyLevel: (level: string) => void;
    disableComment: boolean;
    setDisableComment: (disabled: boolean) => void;
    disableDuet: boolean;
    setDisableDuet: (disabled: boolean) => void;
    disableStitch: boolean;
    setDisableStitch: (disabled: boolean) => void;
}

export function PublishSettings({
    creatorInfo,
    privacyLevel,
    setPrivacyLevel,
    disableComment,
    setDisableComment,
    disableDuet,
    setDisableDuet,
    disableStitch,
    setDisableStitch
}: PublishSettingsProps) {
    if (!creatorInfo) return null;

    return (
        <div className="space-y-3 pb-8">
            <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase pl-1 drop-shadow-md mt-2">
                Settings
            </label>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-lg backdrop-blur-md relative overflow-hidden group/settings">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover/settings:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 space-y-5">
                    {/* Privacy */}
                    {creatorInfo.privacy_level_options && creatorInfo.privacy_level_options.length > 0 && (
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] font-medium text-gray-300">Privacy</span>
                            <div className="w-36">
                                <Dropdown
                                    options={creatorInfo.privacy_level_options.map((opt: string) => {
                                        const labels: Record<string, string> = {
                                            'SELF_ONLY': 'Private',
                                            'FOLLOWER_OF_CREATOR': 'Followers',
                                            'MUTUAL_FOLLOW_FRIENDS': 'Friends',
                                            'PUBLIC_TO_EVERYONE': 'Everyone'
                                        };
                                        return { value: opt, label: labels[opt] || opt.replace(/_/g, ' ') };
                                    })}
                                    value={privacyLevel}
                                    onChange={(val) => setPrivacyLevel(val)}
                                    className="!bg-black/40 !backdrop-blur-md !border-white/10 !rounded-xl !py-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] !text-[12px] group-hover/settings:!border-white/20 transition-all hover:!border-purple-500/50"
                                    menuClassName="!bg-[#0f0f13]/90 !backdrop-blur-2xl !border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

                    {/* Interactions */}
                    <div className="flex flex-col gap-4">
                        {[
                            { label: 'Allow Comments', state: disableComment, setter: setDisableComment, disabled: creatorInfo.comment_disabled },
                            { label: 'Allow Duet', state: disableDuet, setter: setDisableDuet, disabled: creatorInfo.duet_disabled },
                            { label: 'Allow Stitch', state: disableStitch, setter: setDisableStitch, disabled: creatorInfo.stitch_disabled },
                        ].map(({ label, state, setter, disabled }) => (
                            <label key={label} className={clsx(
                                "flex items-center justify-between cursor-pointer group/toggle",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}>
                                <span className="text-[13px] font-medium text-gray-300 group-hover/toggle:text-white transition-colors">
                                    {label}
                                </span>
                                <div className="relative inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={!state}
                                        onChange={(e) => setter(!e.target.checked)}
                                        disabled={disabled}
                                    />
                                    <div className="w-10 h-5 bg-black/40 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-md peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500 peer-checked:after:bg-white peer-checked:shadow-[0_0_15px_rgba(168,85,247,0.4)] peer-checked:border-transparent backdrop-blur-sm"></div>
                                </div>
                            </label>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
