import { FileText } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black py-8">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-zinc-500" />
                    <span className="text-sm font-bold text-zinc-400">
                        ResumeAI
                    </span>
                </div>
                <p className="text-sm text-zinc-500">
                    © {new Date().getFullYear()} ResumeAI. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
