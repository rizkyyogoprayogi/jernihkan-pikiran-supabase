import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function HistoryList({ session }) {
    const [thoughts, setThoughts] = useState([])
    const [loading, setLoading] = useState(true)

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
        <div className="space-y-3 pb-20">
            {thoughts.map((thought) => (
                <div
                    key={thought.id}
                    className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
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
                            <span className="text-xs text-slate-400 font-mono">
                                {formatDate(thought.created_at)}
                            </span>
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
    )
}
