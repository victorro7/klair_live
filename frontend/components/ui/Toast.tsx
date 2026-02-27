import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ToastProps {
    show: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose?: () => void;
}

export function Toast({ show, message, type = 'info', onClose }: ToastProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50"
                >
                    {type === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-blue-400" />
                    )}

                    <span className="text-sm font-medium text-white/90">
                        {message}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Helper hook for managing toast state
import { useState, useCallback, useRef } from 'react';

export function useToast() {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'info'>('info');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = useCallback((msg: string, toastType: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setMessage(msg);
        setType(toastType);
        setShow(true);

        timerRef.current = setTimeout(() => {
            setShow(false);
        }, duration);
    }, []);

    const hideToast = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShow(false);
    }, []);

    return {
        show,
        message,
        type,
        showToast,
        hideToast,
        ToastComponent: (
            <Toast
                show={show}
                message={message}
                type={type}
                onClose={hideToast}
            />
        )
    };
}
