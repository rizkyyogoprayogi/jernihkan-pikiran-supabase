import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Clock, AlertCircle, CheckCircle2, Trash2, X } from 'lucide-react'

export default function HistoryList({ session }) {
    const [thoughts, setThoughts] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({ open: false, thought: null })
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchHistory()
    }, [session])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('thoughts')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setThoughts(data || [])
        } catch (error) {
            console.error('Error fetching history:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteModal.thought) return

        try {
            setDeleting(true)
            const { error } = await supabase
                .from('thoughts')
                .delete()
                .eq('id', deleteModal.thought.id)

            if (error) throw error

            // Remove from local state
            setThoughts(prev => prev.filter(t => t.id !== deleteModal.thought.id))
            setDeleteModal({ open: false, thought: null })
        } catch (error) {
            console.error('Error deleting thought:', error)
            alert('Gagal menghapus: ' + error.message)
        } finally {
            setDeleting(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getEmotionEmoji = (emotionId) => {
        const emojis = {
            marah: '😠', sedih: '😢', bingung: '😕', kesal: '😤',
            muak: '🤢', jijik: '🤮', senang: '😊', gembira: '🤩'
        }
        return emojis[emotionId] || '😐'
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (thoughts.length === 0) {
        return (
            <div className="text-center py-10 px-4 text-slate-400">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Belum ada riwayat pikiran.</p>
            </div>
        )
    }

    return (
        <>
            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Hapus Pikiran?</h3>
                            <button
                                onClick={() => setDeleteModal({ open: false, thought: null })}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-slate-600 text-sm mb-4">
                            Apakah kamu yakin ingin menghapus pikiran ini? Tindakan ini tidak bisa dibatalkan.
                        </p>

                        {deleteModal.thought && (
                            <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{getEmotionEmoji(deleteModal.thought.emotion)}</span>
                                    <span className="text-sm font-medium text-slate-700 capitalize">{deleteModal.thought.emotion}</span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{deleteModal.thought.content}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ open: false, thought: null })}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {deleting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Hapus</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Thoughts List */}
            <div className="space-y-3 pb-20">
                {thoughts.map((thought) => (
                    <div
                        key={thought.id}
                        className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        {/* Status Indicator Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${thought.is_important === true ? 'bg-orange-400' :
                            thought.is_important === false ? 'bg-emerald-400' : 'bg-slate-200'
                            }`} />

                        <div className="pl-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${thought.emotion === 'marah' ? 'bg-red-100 text-red-700' :
                                    thought.emotion === 'sedih' ? 'bg-blue-100 text-blue-700' :
                                        thought.emotion === 'bingung' ? 'bg-purple-100 text-purple-700' :
                                            thought.emotion === 'kesal' ? 'bg-orange-100 text-orange-700' :
                                                thought.emotion === 'muak' ? 'bg-green-100 text-green-700' :
                                                    thought.emotion === 'jijik' ? 'bg-teal-100 text-teal-700' :
                                                        thought.emotion === 'senang' ? 'bg-yellow-100 text-yellow-700' :
                                                            thought.emotion === 'gembira' ? 'bg-pink-100 text-pink-700' :
                                                                'bg-slate-100 text-slate-700'
                                    }`}>
                                    <span className="text-lg" role="img" aria-label={thought.emotion}>
                                        {getEmotionEmoji(thought.emotion)}
                                    </span>
                                    <span className="text-xs font-semibold capitalize">
                                        {thought.emotion}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-mono">
                                        {formatDate(thought.created_at)}
                                    </span>
                                    <button
                                        onClick={() => setDeleteModal({ open: true, thought })}
                                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-slate-700 text-sm line-clamp-3 mb-3">
                                {thought.content}
                            </p>

                            {thought.explanation && (
                                <div className="mb-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 font-medium mb-1">
                                        {thought.is_important ? 'Alasan Penting:' : 'Alasan Melepaskan:'}
                                    </p>
                                    <p className="text-slate-600 text-xs italic">
                                        "{thought.explanation}"
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end">
                                {thought.is_important === true && (
                                    <div className="flex items-center gap-1 text-xs text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded-full">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>Penting</span>
                                    </div>
                                )}
                                {thought.is_important === false && (
                                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Selesai</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

