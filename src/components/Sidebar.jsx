import { useState } from 'react'
import { X, Clock, BarChart3 } from 'lucide-react'
import HistoryList from './HistoryList'
import Statistics from './Statistics'

export default function Sidebar({ isOpen, onClose, session }) {
    const [activeTab, setActiveTab] = useState('history') // 'history' | 'stats'

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
                        <h2 className="text-lg font-bold text-slate-800">
                            {activeTab === 'history' ? 'Riwayat Pikiran' : 'Statistik'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === 'history'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <Clock className="w-4 h-4" />
                            <span>Riwayat</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === 'stats'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Statistik</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeTab === 'history' ? (
                            <HistoryList session={session} />
                        ) : (
                            <Statistics session={session} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

