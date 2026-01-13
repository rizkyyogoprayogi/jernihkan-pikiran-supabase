import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { TrendingUp, Target, Lightbulb, BarChart3 } from 'lucide-react'

const EMOTION_COLORS = {
    marah: '#ef4444',
    sedih: '#3b82f6',
    bingung: '#a855f7',
    kesal: '#f97316',
    muak: '#22c55e',
    jijik: '#14b8a6',
    senang: '#facc15',
    gembira: '#ec4899'
}

const EMOTION_EMOJIS = {
    marah: '😠', sedih: '😢', bingung: '😕', kesal: '😤',
    muak: '🤢', jijik: '🤮', senang: '😊', gembira: '🤩'
}

export default function Statistics({ session }) {
    const [thoughts, setThoughts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllThoughts()
    }, [session])

    const fetchAllThoughts = async () => {
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
            console.error('Error fetching thoughts:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calculate statistics
    const stats = useMemo(() => {
        if (thoughts.length === 0) return null

        // Emotion breakdown
        const emotionCounts = {}
        thoughts.forEach(t => {
            emotionCounts[t.emotion] = (emotionCounts[t.emotion] || 0) + 1
        })
        const emotionData = Object.entries(emotionCounts).map(([name, value]) => ({
            name,
            value,
            emoji: EMOTION_EMOJIS[name] || '😐'
        })).sort((a, b) => b.value - a.value)

        // Decision summary
        const important = thoughts.filter(t => t.is_important === true).length
        const released = thoughts.filter(t => t.is_important === false).length

        // Weekly data (last 7 days)
        const today = new Date()
        const weeklyData = []
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            const count = thoughts.filter(t =>
                t.created_at.startsWith(dateStr)
            ).length
            weeklyData.push({
                day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                count
            })
        }

        // Top emotion insight
        const topEmotion = emotionData[0]

        return {
            emotionData,
            important,
            released,
            total: thoughts.length,
            weeklyData,
            topEmotion
        }
    }, [thoughts])

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="text-center py-10 px-4 text-slate-400">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Belum ada data untuk dianalisis.</p>
                <p className="text-xs mt-1">Mulai catat pikiranmu!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Top Insight Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-semibold text-sm">Insight Utama</span>
                </div>
                <p className="text-lg">
                    Emosi paling sering: <span className="font-bold">{stats.topEmotion.emoji} {stats.topEmotion.name}</span>
                    <span className="text-blue-100 text-sm ml-2">({stats.topEmotion.value}x)</span>
                </p>
            </div>

            {/* Decision Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-slate-600" />
                    <span className="font-semibold text-slate-800">Ringkasan Keputusan</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                        <div className="text-xs text-slate-500">Total</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-600">{stats.important}</div>
                        <div className="text-xs text-orange-500">Penting</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-emerald-600">{stats.released}</div>
                        <div className="text-xs text-emerald-500">Dilepas</div>
                    </div>
                </div>
            </div>

            {/* Emotion Pie Chart */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-semibold text-slate-800">Distribusi Emosi</span>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.emotionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {stats.emotionData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={EMOTION_COLORS[entry.name] || '#94a3b8'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => [`${value}x`, `${EMOTION_EMOJIS[name] || ''} ${name}`]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {stats.emotionData.slice(0, 4).map((e) => (
                        <div key={e.name} className="flex items-center gap-1 text-xs">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: EMOTION_COLORS[e.name] }}
                            />
                            <span className="text-slate-600">{e.emoji} {e.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                    <span className="font-semibold text-slate-800">Aktivitas 7 Hari Terakhir</span>
                </div>
                <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.weeklyData}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                            />
                            <YAxis hide />
                            <Tooltip
                                formatter={(value) => [`${value} pikiran`]}
                                labelFormatter={(label) => `Hari ${label}`}
                            />
                            <Bar
                                dataKey="count"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
