'use client';

import FormSection from '@/components/builder/FormSection';
import PreviewSection from '@/components/builder/PreviewSection';
import { useResumeStore } from '@/store/useResumeStore';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BuilderPage() {
    const [isSaving, setIsSaving] = useState(false);
    const data = useResumeStore((state) => state.data);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                alert('Resume saved temporarily (Placeholder Mode).');
                return;
            }

            // We use a simple insert here. In a real app we'd require auth context.
            const { error } = await supabase.from('resumes').insert({
                title: `${data.personalInfo.fullName || 'Untitled'} - Resume`,
                content: data,
            });

            if (error) throw error;
            alert('Resume saved successfully!');
        } catch (error: any) {
            console.error(error);
            alert('Failed to save: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-black">
            {/* Top Header */}
            <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black px-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-lg font-semibold text-white">
                        {data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'Untitled Resume'}
                    </h1>
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
