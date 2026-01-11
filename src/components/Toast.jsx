import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const styles = {
        success: 'bg-slate-900 border-slate-800 text-white',
        error: 'bg-red-500 border-red-600 text-white',
    }

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-white" />,
    }

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-down w-full max-w-sm px-4">
            <div className={`${styles[type]} shadow-2xl rounded-2xl p-4 border flex items-center gap-3 relative overflow-hidden backdrop-blur-xl bg-opacity-95`}>
                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />

                <div className="flex-shrink-0">
                    {icons[type]}
                </div>

                <p className="flex-1 font-medium text-sm leading-snug">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-4 h-4 opacity-70" />
                </button>
            </div>
        </div>
    )
}
