import { useState } from 'react'
import { Send, ChevronDown } from 'lucide-react'

const EMOTIONS = [
    { id: 'marah', label: 'Marah 😠' },
    { id: 'sedih', label: 'Sedih 😢' },
    { id: 'bingung', label: 'Bingung 😕' },
    { id: 'kesal', label: 'Kesal 😤' },
    { id: 'muak', label: 'Muak 🤢' },
    { id: 'jijik', label: 'Jijik 🤮' },
    { id: 'senang', label: 'Senang 😊' },
    { id: 'gembira', label: 'Gembira 🤩' },
]

const INTENSITY_LABELS = {
    1: 'Sangat Ringan',
    2: 'Ringan',
    3: 'Agak Ringan',
    4: 'Cukup',
    5: 'Sedang',
    6: 'Agak Kuat',
    7: 'Kuat',
    8: 'Sangat Kuat',
    9: 'Intens',
    10: 'Sangat Intens'
}

export default function ThoughtForm({ onSubmit, isSubmitting }) {
    const [emotion, setEmotion] = useState('')
    const [content, setContent] = useState('')
    const [intensity, setIntensity] = useState(5)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!emotion || !content.trim()) return
        onSubmit({ emotion, content, intensity })
    }

    const getIntensityColor = (value) => {
        if (value <= 3) return 'text-emerald-500'
        if (value <= 5) return 'text-yellow-500'
        if (value <= 7) return 'text-orange-500'
        return 'text-red-500'
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Emotion Select */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Bagaimana perasaanmu?
                    </label>
                    <div className="relative">
                        <select
                            value={emotion}
                            onChange={(e) => setEmotion(e.target.value)}
                            className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 pr-8 shadow-sm transition-all hover:border-blue-300"
                            required
                        >
                            <option value="" disabled>Pilih emosi...</option>
                            {EMOTIONS.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <ChevronDown className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Intensity Slider */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Seberapa kuat perasaan ini?
                    </label>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-slate-400">Ringan</span>
                            <div className="text-center">
                                <span className={`text-3xl font-bold ${getIntensityColor(intensity)}`}>
                                    {intensity}
                                </span>
                                <span className="text-slate-400 text-lg">/10</span>
                            </div>
                            <span className="text-xs text-slate-400">Intens</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={intensity}
                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <p className={`text-center mt-2 text-sm font-medium ${getIntensityColor(intensity)}`}>
                            {INTENSITY_LABELS[intensity]}
                        </p>
                    </div>
                </div>

                {/* Thought Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Apa yang kamu pikirkan?
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 min-h-[160px] resize-none shadow-sm transition-all hover:border-blue-300"
                        placeholder="Tuliskan apa yang mengganggu pikiranmu..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={!emotion || !content.trim() || isSubmitting}
                    className="w-full bg-slate-900 hover:bg-black text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Lanjutkan</span>
                            <Send className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

