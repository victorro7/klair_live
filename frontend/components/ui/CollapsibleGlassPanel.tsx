import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import clsx from 'clsx';

interface CollapsibleGlassPanelProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    glowColor?: 'purple' | 'blue' | 'green' | 'none';
    headerRight?: React.ReactNode;
    id?: string;
    className?: string;
}

export function CollapsibleGlassPanel({
    title,
    icon,
    children,
    defaultOpen = true,
    glowColor = 'purple',
    headerRight,
    id,
    className
}: CollapsibleGlassPanelProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <GlassPanel glowColor={glowColor} id={id} className={clsx("group overflow-hidden scroll-mt-24 border-white/10 hover:border-white/20", className)}>
            {/* Header / Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className={clsx(
                            "p-2 rounded-xl transition-colors",
                            glowColor === 'purple' && "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20",
                            glowColor === 'blue' && "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
                            glowColor === 'green' && "bg-green-500/10 text-green-400 group-hover:bg-green-500/20",
                            glowColor === 'none' && "bg-white/10 text-gray-300 group-hover:bg-white/20"
                        )}>
                            {icon}
                        </div>
                    )}
                    <h2 className="text-xl font-light tracking-[-0.04em] text-white/90 text-left">{title}</h2>
                </div>

                <div className="flex items-center gap-4">
                    {headerRight && (
                        <div onClick={(e) => e.stopPropagation()}>
                            {headerRight}
                        </div>
                    )}
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </div>
            </button>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 pt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassPanel>
    );
}
