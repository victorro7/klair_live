/**
 * Dropdown Component
 */

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';

export interface DropdownOption<T = string> {
    value: T;
    label: string;
}

interface DropdownProps<T = string> {
    options: DropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
    icon?: React.ReactNode;
    placeholder?: string;
    className?: string;
    hideValueOnMobile?: boolean; // New prop to hide text on mobile
    hideValue?: boolean; // Always hide value text (compact/icon-only mode)
}

export function Dropdown<T extends string = string>({
    options,
    value,
    onChange,
    icon,
    placeholder = 'Select...',
    className = '',
    menuClassName = '',
    hideValueOnMobile = false,
    hideValue = false,
}: DropdownProps<T> & { menuClassName?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find((opt) => opt.value === value);

    // Update dropdown position
    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8, // 8px gap
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    // Update position when opened and on scroll/resize
    useLayoutEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                const target = event.target as HTMLElement;
                // Don't close if clicking inside the dropdown menu
                if (!target.closest('.dropdown-menu-content')) {
                    setIsOpen(false);
                }
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <>
            {/* Trigger Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-white transition-all w-full justify-between ${className}`}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className={hideValue ? "hidden" : hideValueOnMobile ? "hidden md:inline group-hover:inline" : ""}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu Portal */}
            {isOpen && createPortal(
                <div
                    className={`dropdown-menu-content fixed bg-[#0F0F0F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 p-2 z-[9998] ${menuClassName}`}
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                    }}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {/* Ambient Glows */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Options List */}
                    <div className="relative space-y-1 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {options.map((option) => (
                            <button
                                key={String(option.value)}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${value === option.value
                                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
