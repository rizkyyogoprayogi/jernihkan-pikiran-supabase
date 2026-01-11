import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client = null

if (supabaseUrl && supabaseAnonKey) {
    try {
        client = createClient(supabaseUrl, supabaseAnonKey)
    } catch (err) {
        console.error('Supabase initialization error:', err)
    }
} else {
    console.warn('Missing Supabase credentials. Check .env file.')
}

export const supabase = client
