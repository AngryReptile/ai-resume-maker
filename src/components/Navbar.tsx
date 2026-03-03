import Link from 'next/link';
import { FileText, Sparkles, UserCircle } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                        Dashboard
                    </Link>
                    <button className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20">
                        <UserCircle className="h-4 w-4" />
                        <span>Sign In</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
