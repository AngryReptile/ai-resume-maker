'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Trash2, Sparkles, Settings } from 'lucide-react';

interface EntryToolbarProps {
    isVisible: boolean;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onDelete?: () => void;
    onAI?: () => void;
    onSettings?: () => void;
}

export default function EntryToolbar({ 
    isVisible, 
    onMoveUp, 
    onMoveDown, 
    onDelete, 
    onAI,
    onSettings
}: EntryToolbarProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-full p-1 border border-white/10 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-0.5 px-1 border-r border-white/10 mr-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
                            className="p-1 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-all"
                            title="Move Up"
                        >
                            <ChevronUp size={14} strokeWidth={2.5} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
                            className="p-1 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-all"
                            title="Move Down"
                        >
                            <ChevronDown size={14} strokeWidth={2.5} />
                        </button>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); onAI?.(); }}
                        className="p-1 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 rounded-lg transition-all flex items-center gap-1 px-2"
                    >
                        <Sparkles size={14} strokeWidth={2.5} />
                        <span className="text-[9px] font-black uppercase tracking-widest">AI Fix</span>
                    </button>

                    <div className="w-px h-5 bg-white/10 mx-1" />

                    <button 
                        onClick={(e) => { e.stopPropagation(); onSettings?.(); }}
                        className="p-1 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-all"
                    >
                        <Settings size={14} strokeWidth={2.5} />
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                        className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all"
                    >
                        <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
