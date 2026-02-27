import { motion } from 'framer-motion';

export function SearchingState() {
    return (
        <div className="h-full flex flex-col items-center justify-center py-20">
            {/* Scanner Visual */}
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Pulsing Core */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
                />

                {/* Orbiting Lens */}
                <motion.div
                    className="absolute w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 rounded-full blur-sm" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400/30 rounded-full blur-sm" />
                </motion.div>

                {/* Circular Track */}
                <div className="absolute w-48 h-48 border border-white/5 rounded-full" />
                <div className="absolute w-64 h-64 border border-white/5 rounded-full border-dashed opacity-30" />

                {/* Horizontal Scan Line */}
                <motion.div
                    animate={{
                        top: ["10%", "90%", "10%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent blur-[1px]"
                />

                {/* Inner Glitch/Waveform (Simulated with simple bars) */}
                <div className="flex gap-1 items-end h-8 overflow-hidden opacity-50">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: ["20%", "100%", "20%"] }}
                            transition={{
                                duration: 0.5 + Math.random() * 0.5,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: i * 0.1
                            }}
                            className="w-1 bg-white/20 rounded-t-sm"
                        />
                    ))}
                </div>
            </div>

            {/* Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 space-y-2"
            >
                <h3 className="text-lg font-medium text-white/80 tracking-wide">
                    loading...
                </h3>
            </motion.div>
        </div>
    );
}
