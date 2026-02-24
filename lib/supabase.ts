import { createClient } from '@supabase/supabase-js'

// Inicialización lazy: se ejecuta solo cuando se llama, no al importar el módulo
export function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        throw new Error('Faltan variables de entorno de Supabase')
    }

    return createClient(url, key)
}
