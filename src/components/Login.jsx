import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Sparkles, Brain } from 'lucide-react'

export default function Login() {
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            })
            if (error) throw error
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 text-center relative overflow-hidden">

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10">
                    <div className="mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mb-6 transform rotate-3">
                        <Brain className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
                        Jernihkan Pikiran
                    </h1>

                    <p className="text-slate-500 mb-8 font-medium">
                        Think Clear to Get Clarity Way
                    </p>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <Sparkles className="w-3 h-3" />
                        <span>Secure & Private Reflection</span>
                    </div>
                </div>
            </div>

            <footer className="absolute bottom-4 text-center text-slate-400 text-xs font-medium">
                created by <a href="https://upbright.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">upbright.web.id</a>
            </footer>
        </div>
    )
}
