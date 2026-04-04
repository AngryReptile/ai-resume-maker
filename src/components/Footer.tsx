import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-[#0a0a0f] py-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3 group cursor-default">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-500 transition-colors group-hover:text-white">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-black text-white uppercase tracking-tighter font-display">
                                Resume<span className="text-indigo-500">AI</span>
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] max-w-xs text-center md:text-left leading-relaxed">
                            Building professional resumes powered by AI.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6 text-right">
                        <div className="flex gap-10">
                            {['Privacy', 'Terms', 'Security'].map((item) => (
                                <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </div>
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                            © {new Date().getFullYear()} ResumeAI. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

