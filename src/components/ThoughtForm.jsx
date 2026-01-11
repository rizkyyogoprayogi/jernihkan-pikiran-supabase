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

export default function ThoughtForm({ onSubmit, isSubmitting }) {
    const [emotion, setEmotion] = useState('')
    const [content, setContent] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!emotion || !content.trim()) return
        onSubmit({ emotion, content })
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
