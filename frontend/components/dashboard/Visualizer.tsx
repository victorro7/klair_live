
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface VisualizerProps {
    isActive: boolean;
    color?: string;
}

export function Visualizer({ isActive, color = 'bg-purple-500' }: VisualizerProps) {
    const bars = 12;

    return (
        <div className="flex items-end gap-0.5 h-4 opacity-80">
            {Array.from({ length: bars }).map((_, i) => (
                <Bar key={i} index={i} isActive={isActive} color={color} />
            ))}
        </div>
    );
}

function Bar({ index, isActive, color }: { index: number; isActive: boolean; color: string }) {
    const [height, setHeight] = useState(20);

    useEffect(() => {
        if (!isActive) {
            setHeight(20);
            return;
        }

        const interval = setInterval(() => {
            setHeight(Math.random() * 80 + 20);
        }, 100 + Math.random() * 50);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div
            className={clsx("w-1 rounded-t-sm transition-all duration-300 ease-in-out", color)}
            style={{
                height: `${height}%`,
                opacity: isActive ? 1 : 0.3
            }}
        />
    );
}
