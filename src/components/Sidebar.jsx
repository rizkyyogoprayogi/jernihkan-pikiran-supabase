import { X } from 'lucide-react'
import HistoryList from './HistoryList'

export default function Sidebar({ isOpen, onClose, session }) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out border-l border-white/50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white/50 backdrop-blur-md">
                        <h2 className="text-lg font-bold text-slate-800">Riwayat Pikiran</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <HistoryList session={session} />
                    </div>
                </div>
            </div>
        </>
    )
}
