'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
// removed broken AnimatedBackground import

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/dashboard');
            }
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                router.push('/dashboard');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);


    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'An error occurred during Google authentication');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* removed redundant background component */}

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight text-white">
                        Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
                    </span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-8 text-center">
                    <p className="text-zinc-400 mb-6 text-sm font-medium">
                        Welcome to the future of career building. <br />
                        Please sign in with your Google account to continue.
                    </p>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-white/20 rounded-xl shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] text-base font-bold text-white bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 group"
                    >
                        <svg className="h-6 w-6 transition-transform group-hover:rotate-12" viewBox="0 0 24 24">
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
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {error && (
                        <div className="mt-6 text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20 animate-[fadeIn_0.3s]">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">
                            Secure Enterprise Authentication
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
