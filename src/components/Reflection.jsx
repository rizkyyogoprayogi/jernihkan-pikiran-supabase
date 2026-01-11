import { useState } from 'react'
import { Check, X, AlertCircle, ArrowRight } from 'lucide-react'

export default function Reflection({ onDecision, isProcessing }) {
    const [step, setStep] = useState('CHOICE') // 'CHOICE' | 'EXPLAIN'
    const [decision, setDecision] = useState(null) // boolean
    const [explanation, setExplanation] = useState('')

    const handleChoice = (isImportant) => {
        setDecision(isImportant)
        setStep('EXPLAIN')
    }

    const handleSubmit = () => {
        onDecision(decision, explanation)
    }

    if (step === 'EXPLAIN') {
        return (
            <div className="w-full max-w-lg mx-auto text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    {decision ? 'Kenapa ini penting bagimu?' : 'Kenapa ini tidak perlu dipikirkan?'}
                </h2>

                <div className="mb-6">
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-4 min-h-[120px] resize-none shadow-sm transition-all"
                        placeholder="Jelaskan alasannya..."
                        required
                        autoFocus
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !explanation.trim()}
                    className={`w-full text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${decision ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-700 hover:bg-slate-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isProcessing ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>{decision ? 'Ayo Lakukan' : 'Ya udah ga usah dipikirin'}</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>

                <button
                    onClick={() => setStep('CHOICE')}
                    disabled={isProcessing}
                    className="mt-4 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                    Kembali
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-lg mx-auto text-center animate-fade-in-up">
            <div className="mb-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    Refleksi Sejenak
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                    Setelah menumpahkan pikiranmu, coba tanyakan pada dirimu sendiri...
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={() => handleChoice(true)}
                    disabled={isProcessing}
                    className="group relative overflow-hidden bg-white border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 p-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Check className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-800 text-lg">Penting</span>
                        <span className="text-sm text-slate-500">Ini berdampak besar padaku</span>
                    </div>
                </button>

                <button
                    onClick={() => handleChoice(false)}
                    disabled={isProcessing}
                    className="group relative overflow-hidden bg-white border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 p-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <X className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-800 text-lg">Tidak Penting</span>
                        <span className="text-sm text-slate-500">Aku bisa melepaskannya</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
