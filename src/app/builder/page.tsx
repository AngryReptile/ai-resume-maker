'use client';

import FormSection from '@/components/builder/FormSection';
import PreviewSection from '@/components/builder/PreviewSection';
import { useResumeStore } from '@/store/useResumeStore';
import { Save, Loader2, ArrowLeft, Edit2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function BuilderPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const data = useResumeStore((state) => state.data);
    const currentResumeId = useResumeStore((state) => state.currentResumeId);
    const setCurrentResumeId = useResumeStore((state) => state.setCurrentResumeId);

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
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) {
                alert('You must be logged in to save!');
                return;
            }

            const activeTitle = title.trim() || displayTitle;

            if (currentResumeId) {
                // Update existing resume
                const { error } = await supabase
                    .from('resumes')
                    .update({
                        title: activeTitle,
                        content: data,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', currentResumeId);

                if (error) throw error;
                alert('Resume updated successfully!');
            } else {
                // Insert new resume
                const { data: newResume, error } = await supabase
                    .from('resumes')
                    .insert({
                        title: activeTitle,
                        content: data,
                        user_id: sessionData.session.user.id
                    })
                    .select()
                    .single();

                if (error) throw error;
                setCurrentResumeId(newResume.id);
                alert('Resume saved successfully!');
            }
        } catch (error: any) {
            console.error(error);
            alert('Failed to save: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-transparent font-sans text-white overflow-hidden relative pt-[88px]">

            {/* Top Header */}
            <header className="flex h-16 items-center justify-between border-b border-white/10 bg-transparent px-6 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="bg-white/10 text-white px-3 py-1 rounded text-base font-semibold outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-64"
                                autoFocus
                                onBlur={handleTitleSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleTitleSubmit();
                                    if (e.key === 'Escape') {
                                        setTempTitle(title);
                                        setIsEditingTitle(false);
                                    }
                                }}
                            />
                            <button onMouseDown={(e) => { e.preventDefault(); handleTitleSubmit(); }} className="text-zinc-400 hover:text-green-400 p-1">
                                <Check className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="flex items-center gap-2 group cursor-pointer"
                            onClick={() => {
                                setTempTitle(displayTitle);
                                setIsEditingTitle(true);
                            }}
                        >
                            <h1 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                {displayTitle}
                            </h1>
                            <Edit2 className="h-4 w-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
            </header>

            {/* Editor Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Form */}
                <div className="w-full lg:w-1/2 xl:w-[45%] h-full z-10">
                    <FormSection />
                </div>

                {/* Right Panel: Live Preview */}
                <div className="hidden lg:block lg:w-1/2 xl:w-[55%] h-full border-l border-white/10 relative">
                    <PreviewSection />
                </div>
            </div>
        </div>
    );
}
