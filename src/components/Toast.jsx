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
        <div className="fixed top-4 sm:top-6 inset-x-0 mx-auto z-[100] animate-fade-in-down w-[90%] max-w-md px-2 sm:px-4">
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
