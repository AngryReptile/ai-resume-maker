'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, FileText, MoreVertical, Edit2, Trash2, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useResumeStore, ResumeData } from '@/store/useResumeStore';

export default function Dashboard() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const resetResume = useResumeStore((state) => state.reset);
    const setResumeData = useResumeStore((state) => state.setResumeData);
    const setCurrentResumeId = useResumeStore((state) => state.setCurrentResumeId);
    const setTitle = useResumeStore((state) => state.setTitle);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setResumes(data || []);
        } catch (error) {
            console.error('Error fetching resumes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        resetResume();
        // Since we are creating a new one, we will clear localstorage so builder doesn't pick up old one
        router.push('/templates');
    };

    const handleEdit = (resume: any) => {
        resetResume();
        setCurrentResumeId(resume.id);
        setTitle(resume.title || '');

        // Ensure that missing properties are populated with defaults in case of old data
        const data: ResumeData = {
            personalInfo: resume.content.personalInfo || { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '' },
            experience: resume.content.experience || [],
            education: resume.content.education || [],
            skills: resume.content.skills || '',
            projects: resume.content.projects || ''
        };

        setResumeData(data);
        router.push('/builder');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            const { error } = await supabase.from('resumes').delete().eq('id', id);
            if (error) throw error;
            setResumes(resumes.filter((r) => r.id !== id));
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Failed to delete resume.');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="container relative z-10 mx-auto max-w-6xl px-4 py-32 md:py-40">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Your Resumes</h1>
                        <p className="text-zinc-400">Manage and create tailored resumes for your job applications.</p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-indigo-600 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Resume
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((resume) => (
                        <div key={resume.id} className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-indigo-500/50">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6" />
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-1">{resume.title || 'Untitled Resume'}</h3>
                            <p className="text-sm text-zinc-500 mb-6">Last edited {new Date(resume.updated_at).toLocaleDateString()}</p>

                            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(resume)} className="p-2 text-zinc-400 hover:text-indigo-400 rounded-md hover:bg-indigo-500/10 transition-colors" title="Edit">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 text-zinc-400 hover:text-pink-400 rounded-md hover:bg-pink-500/10 transition-colors" title="Download PDF">
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                                <button onClick={() => handleDelete(resume.id)} className="p-2 text-zinc-500 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-colors" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
