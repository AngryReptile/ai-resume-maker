'use client';

import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useResumeStore } from '@/store/useResumeStore';
import { X, Lock, GripVertical, Check, MousePointer2, MoveRight, MoveLeft, Sparkles, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RearrangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RearrangeModal({ isOpen, onClose }: RearrangeModalProps) {
    const templateId = useResumeStore((state) => state.templateId);
    const visibleSections = useResumeStore((state) => state.visibleSections);
    const sectionOrder = useResumeStore((state) => state.sectionOrder);
    const sidebarSections = useResumeStore((state) => state.sidebarSections);
    const sectionLabels = useResumeStore((state) => state.sectionLabels);
    const setSectionOrder = useResumeStore((state) => state.setSectionOrder);
    const setSidebarSections = useResumeStore((state) => state.setSidebarSections);

    const DUAL_COLUMN_TEMPLATES = [
        'modern-clean', 'executive', 'creative', 'split-column',
        'modern-clean-midnight', 'executive-midnight', 'creative-midnight', 'split-column-midnight'
    ];

    const isDualColumn = DUAL_COLUMN_TEMPLATES.includes(templateId);

    const [activeSectionOrder, setActiveSectionOrder] = useState(sectionOrder);
    const [activeSidebarSections, setActiveSidebarSections] = useState(sidebarSections);

    // Sync with store whenever modal opens to catch additions made in sidebar
    useEffect(() => {
        if (isOpen) {
            setActiveSectionOrder(sectionOrder);
            setActiveSidebarSections(sidebarSections);
        }
    }, [isOpen, sectionOrder, sidebarSections]);

    const mainSections = activeSectionOrder.filter(id => !activeSidebarSections.includes(id));
    const sideSections = activeSectionOrder.filter(id => activeSidebarSections.includes(id));

    // For the UI, we might only want to show visible ones, or show all. 
    // Showing all allows rearranging even hidden sections, which is safer.

    const moveToSidebar = (id: string) => {
        setActiveSidebarSections([...activeSidebarSections, id]);
    };

    const moveToMain = (id: string) => {
        setActiveSidebarSections(activeSidebarSections.filter(s => s !== id));
    };

    const handleDeploy = () => {
        setSectionOrder(activeSectionOrder);
        setSidebarSections(activeSidebarSections);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
                >
                    <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="liquid-glass w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/10 flex flex-col max-h-[85vh] relative"
                    >
                        {/* Header Area */}
                        <div className="p-6 text-center relative border-b border-white/5">
                            <button 
                                onClick={onClose}
                                className="absolute right-6 top-6 h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all text-zinc-400 hover:text-white border border-white/5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl mb-1">
                                    <Layers className="h-4 w-4 text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter font-display leading-tight">
                                    Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 animate-gradient">Structure</span>
                                </h2>
                                <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[8px] italic">
                                    Rearrange and organize your resume sections
                                </p>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0f]/40 custom-scrollbar">
                            <div className="max-w-3xl mx-auto bg-[#0A0A0A] rounded-[1.5rem] shadow-2xl border border-white/5 p-6 min-h-[300px] flex flex-col gap-6 relative">
                                <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none rounded-[1.5rem]" />
                                
                                {/* Fixed Header Section Rendering */}
                                <div className="w-full h-12 bg-indigo-500/5 rounded-xl flex items-center justify-center gap-3 border border-indigo-500/10 group">
                                    <div className="flex flex-col items-center gap-1">
                                        <Lock className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                        <span className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[8px] group-hover:text-white transition-colors font-display">Identity Core</span>
                                    </div>
                                </div>

                                {/* Dynamic Columns Container */}
                                <div className="flex gap-8 flex-1 relative z-10 justify-center">
                                    {/* Main Content Column */}
                                    <div className={`${isDualColumn ? 'w-2/3' : 'w-full max-w-lg'} flex flex-col gap-4`}>
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Flow Narrative</span>
                                        </div>
                                        <Reorder.Group axis="y" values={mainSections} onReorder={(newOrder) => setActiveSectionOrder([...newOrder, ...sideSections])} className="space-y-4">
                                            {mainSections.map((id) => (
                                                <Reorder.Item 
                                                    key={id} 
                                                    value={id}
                                                    className="group relative cursor-grab active:cursor-grabbing"
                                                >
                                                    <div className="w-full min-h-[70px] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 rounded-[1.2rem] flex items-center p-5 gap-5 border border-white/5 group-hover:border-indigo-500/30">
                                                        <GripVertical className="h-4 w-4 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                                                        <div className="flex flex-col flex-1">
                                                            <span className="text-white font-black uppercase tracking-widest text-[10px] group-hover:text-indigo-400 transition-colors font-display">
                                                                {sectionLabels[id] || id.replace(/([A-Z])/g, ' $1').trim()}
                                                            </span>
                                                            <span className="text-zinc-600 text-[7px] font-bold uppercase tracking-widest mt-1">Section</span>
                                                        </div>
                                                        {isDualColumn && (
                                                            <button 
                                                                onClick={() => moveToSidebar(id)}
                                                                className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-600 hover:text-white px-3 py-1.5 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                Shift Right <MoveRight className="h-3 w-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    </div>

                                    {/* Sidebar Column */}
                                    {isDualColumn && (
                                        <div className="w-[260px] flex flex-col gap-5">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Telemetry Specs</span>
                                            </div>
                                            <Reorder.Group axis="y" values={sideSections} onReorder={(newOrder) => setActiveSectionOrder([...mainSections, ...newOrder])} className="space-y-4">
                                                {sideSections.map((id) => (
                                                    <Reorder.Item 
                                                        key={id} 
                                                        value={id}
                                                        className="group relative cursor-grab active:cursor-grabbing"
                                                    >
                                                        <div className="w-full min-h-[60px] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 rounded-[1rem] flex items-center p-4 gap-4 border border-white/5 group-hover:border-emerald-500/30">
                                                            <GripVertical className="h-4 w-4 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-white font-black uppercase tracking-widest text-[9px] group-hover:text-emerald-400 transition-colors font-display">
                                                                    {sectionLabels[id] || id.replace(/([A-Z])/g, ' $1').trim()}
                                                                </span>
                                                                <span className="text-zinc-600 text-[7px] font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Lateral Module</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => moveToMain(id)}
                                                                className="flex items-center justify-center h-7 w-7 text-zinc-600 hover:text-white bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <MoveLeft className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </Reorder.Item>
                                                ))}
                                            </Reorder.Group>
                                            
                                            {/* Placeholder if empty */}
                                            {sideSections.length === 0 && (
                                                <div className="flex-1 border-2 border-dashed border-white/5 rounded-[1.2rem] flex items-center justify-center p-6">
                                                    <span className="text-[7px] font-black uppercase tracking-[0.4em] text-zinc-800 text-center leading-relaxed">
                                                        Empty Column <br /> Drag sections here
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="p-8 border-t border-white/5 flex justify-between items-center bg-[#0a0a0f] px-12">
                            <div className="flex flex-col">
                                <span className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.4em]">Status</span>
                                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Page 1 of 1 Optimized</span>
                            </div>
                            <button
                                onClick={handleDeploy}
                                className="group relative bg-white text-zinc-950 font-black uppercase tracking-[0.4em] text-[10px] px-12 py-5 rounded-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-4 shadow-[0_15px_30px_rgba(255,255,255,0.1)] font-display"
                            >
                                <Check className="h-4 w-4" />
                                Save Layout
                                <div className="absolute inset-0 rounded-2xl border border-white opacity-20 group-hover:scale-110 transition-all duration-500" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
