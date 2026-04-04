'use client';

import FormSection from '@/components/builder/FormSection';
import PreviewSection from '@/components/builder/PreviewSection';
import { useResumeStore } from '@/store/useResumeStore';
import { Save, Loader2, ArrowLeft, Edit2, Check, Layout, Settings, Wand2, Type, LayoutTemplate, Layers, MousePointer2, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import RearrangeModal from '@/components/builder/RearrangeModal';

export default function BuilderPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const data = useResumeStore((state) => state.data);
    const currentResumeId = useResumeStore((state) => state.currentResumeId);
    const setCurrentResumeId = useResumeStore((state) => state.setCurrentResumeId);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const title = useResumeStore((state) => state.title);
    const setTitle = useResumeStore((state) => state.setTitle);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);

    useEffect(() => {
        setTempTitle(title);
    }, [title]);

    const displayTitle = title || (data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'Untitled Resume');

    const handleTitleSubmit = () => {
        setTitle(tempTitle.trim());
        setIsEditingTitle(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('saving');
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) {
                setSaveStatus('error');
                return;
            }

            const activeTitle = title.trim() || displayTitle;
            const fullData = {
                ...data,
                visibleSections: useResumeStore.getState().visibleSections,
                sectionOrder: useResumeStore.getState().sectionOrder,
                sectionLabels: useResumeStore.getState().sectionLabels,
                customSections: useResumeStore.getState().customSections,
                sidebarSections: useResumeStore.getState().sidebarSections,
                templateId: useResumeStore.getState().templateId
            };

            if (currentResumeId) {
                const { error } = await supabase
                    .from('resumes')
                    .update({
                        title: activeTitle,
                        content: fullData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', currentResumeId);

                if (error) throw error;
            } else {
                const { data: newResume, error } = await supabase
                    .from('resumes')
                    .insert({
                        title: activeTitle,
                        content: fullData,
                        user_id: sessionData.session.user.id
                    })
                    .select()
                    .single();

                if (error) throw error;
                setCurrentResumeId(newResume.id);
            }
            
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error: any) {
            console.error(error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const { isAdmin } = useAuth();

    return (
        <div className="flex h-screen w-full flex-col bg-[#0a0a0f] font-sans text-white overflow-hidden relative pt-[80px] selection:bg-indigo-500/30 print:pt-0 print:bg-white print:overflow-visible print:h-auto">
            {/* High-Fidelity Background Architecture */}
            <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none print-hidden" />
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none animate-warp print-hidden" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none animate-warp-reverse print-hidden" />
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-0 print-hidden" />

            {/* Floating Liquid Glass Header */}
            <div className="fixed top-4 left-6 right-6 z-[100] print-hidden">
                <header className="flex h-16 items-center justify-between liquid-glass rounded-[2rem] px-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5 mx-auto max-w-7xl">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => router.back()} 
                            className="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all hover:scale-110 border border-white/5"
                        >
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        
                        <div className="h-8 w-[1px] bg-white/10" />

                        {isEditingTitle ? (
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    className="bg-white/5 text-white px-6 py-2.5 rounded-[1.2rem] text-lg font-black uppercase tracking-tight outline-none focus:ring-1 focus:ring-indigo-500/50 w-72 border border-white/10 font-display"
                                    autoFocus
                                    onBlur={handleTitleSubmit}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleTitleSubmit();
                                        if (e.key === 'Escape') setIsEditingTitle(false);
                                    }}
                                />
                            </div>
                        ) : (
                            <div 
                                className="group flex items-center gap-4 cursor-pointer"
                                onClick={() => {
                                    setTempTitle(title || displayTitle);
                                    setIsEditingTitle(true);
                                }}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-1">Active Core Blueprint</span>
                                    <h1 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors font-display leading-none">
                                        {title || displayTitle}
                                    </h1>
                                </div>
                                <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all border border-white/10">
                                    <Edit2 className="h-3.5 w-3.5 text-indigo-400" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-8 mr-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                             <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-2">
                                <Layers size={14} /> Dashboard
                             </Link>
                             {isAdmin && (
                                <Link href="/admin" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                                    <ShieldCheck size={14} /> Command
                                </Link>
                             )}
                        </div>

                        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

                        <div className="hidden md:flex flex-col items-end px-4">
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">Neural Sync</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                Optimal
                            </span>
                        </div>
                        
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`group relative flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:scale-[1.05] active:scale-95 shadow-lg disabled:opacity-50 font-display
                                ${saveStatus === 'success' ? 'bg-emerald-500 text-white' : 
                                  saveStatus === 'error' ? 'bg-rose-500 text-white' : 
                                  'bg-white text-zinc-950'}`}
                        >
                            {saveStatus === 'saving' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : saveStatus === 'success' ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                            )}
                            {saveStatus === 'saving' ? 'Syncing...' : 
                             saveStatus === 'success' ? 'Synced' : 
                             saveStatus === 'error' ? 'Failed' : 'Deploy Core'}
                        </button>
                    </div>
                </header>
            </div>

            {/* Editor Content */}
            <div className="flex flex-1 overflow-hidden relative z-10 print:block print:overflow-visible">
                {/* Left Panel: Collapsed Rail & Drawer */}
                <div className="absolute left-0 top-0 bottom-0 z-[60] flex h-full print-hidden">
                    <FormSection />
                </div>

                {/* Center Canvas: Live Preview */}
                <div 
                    className={`flex-1 h-full w-full overflow-hidden bg-[#0A0A0A] relative transition-all duration-700 ease-[0.22, 1, 0.36, 1] print:bg-white print:p-0 print:m-0 print:overflow-visible
                        ${useResumeStore((state) => state.isDrawerOpen) ? 'pl-[525px]' : 'pl-[85px]'} print:pl-0`}
                > 
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none print-hidden" />
                    {/* Perspective Glows for Depth */}
                    <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none print-hidden" />
                    <PreviewSection />
                </div>
            </div>

            {/* Rearrange Modal */}
            <RearrangeModal 
                isOpen={useResumeStore((state) => state.isRearrangeOpen)} 
                onClose={() => useResumeStore.getState().setIsRearrangeOpen(false)} 
            />
        </div>
    );
}
