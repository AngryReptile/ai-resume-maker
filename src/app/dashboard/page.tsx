'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, FileText, Edit2, Trash2, Download, Loader2, Sparkles, LayoutGrid, Clock, LogOut, UserCircle, ArrowUpRight, Zap, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useResumeStore, ResumeData } from '@/store/useResumeStore';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToDocx } from '@/lib/exportUtils';

export default function Dashboard() {
    const { user, profile, loading: authLoading } = useAuth();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    const resetResume = useResumeStore((state) => state.reset);
    const setResumeData = useResumeStore((state) => state.setResumeData);
    const setCurrentResumeId = useResumeStore((state) => state.setCurrentResumeId);
    const setTitle = useResumeStore((state) => state.setTitle);

    const fetchResumes = async () => {
        if (loading && resumes.length > 0) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResumes(data || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchResumes();
        }
    }, [user, authLoading]);

    const handleCreateNew = () => {
        resetResume();
        router.push('/templates');
    };

    const handleEdit = (resume: any) => {
        resetResume();
        setCurrentResumeId(resume.id);
        setTitle(resume.title || '');

        const data: ResumeData = {
            personalInfo: resume.content.personalInfo || { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '' },
            experience: resume.content.experience || [],
            education: resume.content.education || [],
            skills: Array.isArray(resume.content.skills) ? resume.content.skills : [],
            projects: Array.isArray(resume.content.projects) ? resume.content.projects : [],
            languages: typeof resume.content.languages === 'string' ? resume.content.languages : '',
            interests: typeof resume.content.interests === 'string' ? resume.content.interests : '',
            visibleSections: resume.content.visibleSections || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
            sectionOrder: resume.content.sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
            sectionLabels: resume.content.sectionLabels || {},
            customSections: resume.content.customSections || [],
            sidebarSections: resume.content.sidebarSections || []
        };

        setResumeData(data);
        router.push('/builder');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Abort data blueprint? This action is irreversible.')) return;

        try {
            const { error } = await supabase.from('resumes').delete().eq('id', id);
            if (error) throw error;
            setResumes(resumes.filter((r) => r.id !== id));
        } catch (error) {
            console.error('Error deleting resume:', error);
        }
    };

    const handleDownload = (resume: any) => {
        const data: ResumeData = {
            ...resume.content,
            // Ensure all fields are present for export
            personalInfo: resume.content.personalInfo || { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '' },
            experience: resume.content.experience || [],
            education: resume.content.education || [],
            skills: resume.content.skills || [],
            projects: resume.content.projects || [],
            languages: resume.content.languages || '',
            interests: resume.content.interests || '',
            visibleSections: resume.content.visibleSections || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
            sectionOrder: resume.content.sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
            sectionLabels: resume.content.sectionLabels || {},
            customSections: resume.content.customSections || [],
            sidebarSections: resume.content.sidebarSections || []
        };
        exportToDocx(data, resume.title || 'Resume');
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
                <div className="relative flex flex-col items-center gap-6">
                    <div className="absolute inset-0 blur-3xl bg-indigo-500/20 rounded-full animate-pulse" />
                    <Loader2 className="relative h-12 w-12 animate-spin text-indigo-500" />
                    <p className="relative text-[10px] font-black uppercase tracking-[0.6em] text-indigo-400">Syncing Intelligence</p>
                </div>
            </div>
        );
    }

    const lastEdited = resumes.length > 0 ? new Date(resumes[0].updated_at).toLocaleDateString() : 'None';

    return (
        <div className="relative min-h-screen bg-[#0a0a0f] pt-24 pb-20 overflow-hidden selection:bg-indigo-500/30">
            {/* High-Fidelity Background Architecture */}
            <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />
            <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none animate-warp" />
            <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none animate-warp-reverse" />
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />

            <div className="container relative z-10 mx-auto max-w-7xl px-6">
                <header className="mb-14">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px w-8 bg-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Personal Dashboard</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.8] font-display">
                                Welcome, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">{profile?.full_name?.split(' ')[0] || 'User'}</span>
                            </h1>
                            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[9px] ml-1">
                                Manage and track your resumes
                            </p>
                        </div>
                        
                        <button
                            onClick={handleCreateNew}
                            className="group relative flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.05] active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-white/30 font-display"
                        >
                            <Plus className="h-4 w-4" />
                            Create New Resume
                        </button>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <StatCard 
                        label="Total Resumes" 
                        value={resumes.length.toString()} 
                        icon={<Layers size={18} />} 
                        delay={0.1}
                    />
                    <StatCard 
                        label="Last Updated" 
                        value={lastEdited} 
                        icon={<Clock size={18} />} 
                        delay={0.2}
                    />
                    <StatCard 
                        label="Identity Rank" 
                        value={profile?.role?.toUpperCase() || 'USER'} 
                        icon={<Sparkles size={22} />} 
                        delay={0.3}
                    />
                </div>

                <div className="space-y-16">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-indigo-400">
                                <FileText size={16} />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter font-display">Your Resumes</h2>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/5 via-white/5 to-transparent mx-8 hidden sm:block" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 hidden sm:block">Archive Optimized</span>
                    </div>

                    {resumes.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="liquid-glass rounded-3xl p-12 text-center border-white/5"
                        >
                            <div className="h-16 w-16 mx-auto rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center mb-6">
                                <FileText className="h-6 w-6 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-8">No resumes developed yet.</p>
                            <button onClick={handleCreateNew} className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-colors group">
                                Create your first resume <ArrowUpRight className="inline-block h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {resumes.map((resume, i) => (
                                <ResumeCard 
                                    key={resume.id} 
                                    resume={resume} 
                                    delay={i * 0.1}
                                    onEdit={() => handleEdit(resume)}
                                    onDelete={() => handleDelete(resume.id)}
                                    onDownload={() => handleDownload(resume)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, delay }: { label: string, value: string, icon: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative flex flex-col p-6 rounded-2xl liquid-glass border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-white/5 text-indigo-400 group-hover:bg-indigo-500/10 transition-all border border-white/5">
                        {icon}
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="h-1 w-1 rounded-full bg-white/10 group-hover:bg-indigo-500/40 transition-colors" />)}
                    </div>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-1 group-hover:text-zinc-300 transition-colors italic">{label}</p>
                    <p className="text-2xl font-black text-white tracking-tighter uppercase leading-none font-display">{value}</p>
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
        </motion.div>
    );
}

function ResumeCard({ resume, delay, onEdit, onDelete, onDownload }: { resume: any, delay: number, onEdit: () => void, onDelete: () => void, onDownload: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="group relative flex flex-col rounded-2xl bg-white/[0.01] border border-white/5 p-5 backdrop-blur-3xl transition-all duration-700 hover:bg-white/[0.03] hover:border-white/10 overflow-hidden"
        >
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
            
            <div className="aspect-[3/4] rounded-xl bg-[#0a0a0a] border border-white/5 mb-5 overflow-hidden relative shadow-2xl group-hover:translate-z-10 transition-all duration-1000">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-all duration-1000 group-hover:scale-110">
                    <FileText className="h-12 w-12 text-white" />
                </div>
                
                {/* AI Presence Indicator */}
                {resume.ai_summary && (
                    <div className="absolute top-6 right-6 flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl">
                        <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400">Neural Sync</span>
                    </div>
                )}

                {/* Tactical Actions */}
                <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center gap-6 p-10">
                    <button
                        onClick={onEdit}
                        className="w-full py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-white/20 font-display"
                    >
                        Modify Blueprint
                    </button>
                    <div className="flex gap-4 w-full">
                        <button 
                            onClick={onDownload}
                            className="flex-1 p-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center group/btn"
                        >
                            <Download className="h-4 w-4 group-hover/btn:translate-y-1 transition-transform" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex-1 p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-2 space-y-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-xl font-black text-zinc-100 uppercase tracking-tighter truncate group-hover:text-white transition-colors font-display">
                        {resume.title || 'Untitled Archive'}
                    </h3>
                    <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,1)] group-hover:scale-125 transition-transform" />
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic group-hover:text-zinc-400 transition-colors">
                    <span>Pulse: {new Date(resume.updated_at).toLocaleDateString()}</span>
                    <div className="h-px flex-1 bg-white/5" />
                </div>
            </div>

            <div className="absolute -top-24 -right-24 h-48 w-48 bg-indigo-500/[0.03] blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/5 transition-all duration-1000" />
        </motion.div>
    );
}
