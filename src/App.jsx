import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './components/Login'
import ThoughtForm from './components/ThoughtForm'
import Reflection from './components/Reflection'
import { Sparkles, Brain, LogOut } from 'lucide-react'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('INPUT') // 'INPUT' | 'REFLECTION'
  const [currentThoughtId, setCurrentThoughtId] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Configuration Error</h2>
          <p className="text-slate-600 mb-6">
            Supabase credentials are missing. Please create a <code className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-900">.env</code> file with your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </p>
          <div className="text-sm text-slate-400">
            Check the terminal for more details.
          </div>
        </div>
      </div>
    )
  }

  const handleThoughtSubmit = async ({ emotion, content }) => {
    setProcessing(true)
    try {
      const { data, error } = await supabase
        .from('thoughts')
        .insert([
          {
            user_id: session.user.id,
            content,
            emotion,
          },
        ])
        .select()

      if (error) throw error

      if (data && data.length > 0) {
        setCurrentThoughtId(data[0].id)
        setView('REFLECTION')
      }
    } catch (error) {
      alert('Error saving thought: ' + (error.message || error.error_description))
    } finally {
      setProcessing(false)
    }
  }

  const handleDecision = async (isImportant) => {
    setProcessing(true)
    try {
      if (!currentThoughtId) return

      const { error } = await supabase
        .from('thoughts')
        .update({ is_important: isImportant })
        .eq('id', currentThoughtId)

      if (error) throw error

      // Reset flow
      setView('INPUT')
      setCurrentThoughtId(null)
      alert(isImportant ? 'Disimpan sebagai hal penting.' : 'Dilepaskan. Pikiranmu sekarang lebih jernih.')
    } catch (error) {
      alert('Error updating thought: ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight hidden sm:block">Jernihkan Pikiran</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">{session.user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {view === 'INPUT' ? 'Renungkan Harimu' : 'Ambil Keputusan'}
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Think Clear to Get Clarity Way
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 sm:p-10 relative overflow-hidden">
          {/* Decorative background blob */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          <div className="relative z-10 transition-all duration-500 ease-in-out">
            {view === 'INPUT' ? (
              <ThoughtForm onSubmit={handleThoughtSubmit} isSubmitting={processing} />
            ) : (
              <Reflection onDecision={handleDecision} isProcessing={processing} />
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full text-slate-400 text-sm">
            <Sparkles className="w-3 h-3" />
            <span>Semua catatan tersimpan aman</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
