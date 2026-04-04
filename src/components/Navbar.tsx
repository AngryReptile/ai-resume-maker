'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FileText, UserCircle, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, profile, isAdmin, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (pathname === '/builder') return null;

    return (
        <nav className="fixed top-0 w-full z-50 py-4">
            <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
                <div className="flex h-14 w-full items-center justify-between liquid-glass glass-stroke rounded-2xl px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 transition-all hover:scale-105 group">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black shadow-xl group-hover:rotate-6 transition-transform">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-white font-display hidden sm:block">
                            Resume<span className="text-indigo-400">AI</span>
                        </span>
                    </Link>

                    {/* Center Links */}
                    {!loading && (
                        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Builder', path: '/builder' },
                                { name: 'Dashboard', path: '/dashboard', auth: true },
                                { name: 'Command', path: '/admin', admin: true },
                            ].map((link) => {
                                if (link.auth && !user) return null;
                                if (link.admin && !isAdmin) return null;
                                
                                const isActive = pathname === link.path;
                                return (
                                    <Link 
                                        key={link.path} 
                                        href={link.path} 
                                        className={`relative transition-colors duration-300 ${isActive ? 'text-white' : 'hover:text-white'}`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="nav-underline"
                                                className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 rounded-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Right side auth */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                                    <div className="h-6 w-6 rounded-full overflow-hidden border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center relative">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserCircle className="h-3.5 w-3.5 text-indigo-400" />
                                        )}
                                        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none" />
                                    </div>
                                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest hidden lg:block">
                                        {profile?.full_name?.split(' ')[0] || 'User'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20 px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                                >
                                    <LogOut className="h-3 w-3" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="group relative flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                            >
                                <span>Log In</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

