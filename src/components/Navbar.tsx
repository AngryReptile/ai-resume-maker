'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, UserCircle, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <nav className="absolute top-0 w-full z-50 py-6">
            <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black shrink-0">
                        <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                        ResumeAI
                    </span>
                </Link>

                {/* Center Links (HOME, BUILDER, MY RESUMES) */}
                <div className="hidden md:flex items-center gap-12 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Link href="/" className={`${pathname === '/' ? 'text-white border-b-2 border-white pb-1' : 'hover:text-white'} transition-colors`}>
                        HOME
                    </Link>
                    <Link href="/builder" className={`${pathname === '/builder' ? 'text-white border-b-2 border-white pb-1' : 'hover:text-white'} transition-colors`}>
                        BUILDER
                    </Link>
                    <Link href="/dashboard" className={`${pathname === '/dashboard' ? 'text-white border-b-2 border-white pb-1' : 'hover:text-white'} transition-colors`}>
                        MY RESUMES
                    </Link>
                </div>

                {/* Right side authentication placeholder */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <button
                            onClick={handleSignOut}
                            className="hidden sm:flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white border border-white/10"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white border border-white/10"
                        >
                            <UserCircle className="h-4 w-4" />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
