import { Check, X, AlertCircle } from 'lucide-react'

export default function Reflection({ onDecision, isProcessing }) {
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
                    onClick={() => onDecision(true)}
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
                    onClick={() => onDecision(false)}
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
