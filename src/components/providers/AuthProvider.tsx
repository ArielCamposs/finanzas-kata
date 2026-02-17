'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithEmail: (email: string) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithEmail: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithEmail = async (email: string) => {
        return supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-purple-50 dark:bg-[#2a2740]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-purple-600 animate-spin" />
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, signInWithEmail, signOut }}>
            {!user ? (
                <LoginPage onLogin={signInWithEmail} />
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

// Simple Login Component inline for now
function LoginPage({ onLogin }: { onLogin: (email: string) => Promise<any> }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await onLogin(email);
            if (error) throw error;
            setSent(true);
        } catch (error: any) {
            alert(error.message || 'Error al enviar el enlace');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-purple-50 dark:bg-[#2a2740] p-4">
                <div className="max-w-md w-full bg-white dark:bg-[#363259] p-8 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">¡Revisa tu correo!</h1>
                    <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                        Hemos enviado un enlace mágico a <strong>{email}</strong>. Haz click en él para iniciar sesión.
                    </p>
                    <button onClick={() => setSent(false)} className="text-purple-600 hover:underline">
                        Intentar con otro correo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-purple-50 dark:bg-[#2a2740] p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#363259] p-8 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                        Finanzas<span className="text-purple-600">Kata</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Tu dinero, bajo control.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none dark:text-white"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Ingresar'}
                    </button>
                </form>
                <p className="text-center text-xs text-zinc-400 mt-6">
                    Te enviaremos un "Magic Link" para entrar sin contraseña.
                </p>
            </div>
        </div>
    );
}
