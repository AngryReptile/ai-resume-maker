'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Layout, Brain, Zap, Settings2, Plus, LogOut, Sparkles, GripVertical, MousePointer2, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const tabs = [
    { id: 'structure', label: 'Architecture', icon: Layout },
    { id: 'ai', label: 'AI Assistant', icon: Brain },
    { id: 'coach', label: 'Resume Coach', icon: ShieldCheck },
];

export default function FormSection() {
    const [activeTab, setActiveTab] = useState('structure');
    const activeField = useResumeStore((state) => state.activeField);
    const [showTutorial, setShowTutorial] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const coachFeedback = useResumeStore((state) => state.coachFeedback);
    const setCoachFeedback = useResumeStore((state) => state.setCoachFeedback);
    const visibleSections = useResumeStore((state) => state.visibleSections);
    const toggleSection = useResumeStore((state) => state.toggleSection);
    const sectionOrder = useResumeStore((state) => state.sectionOrder);
    const setSectionOrder = useResumeStore((state) => state.setSectionOrder);
    const isDrawerOpen = useResumeStore((state) => state.isDrawerOpen);
    const setDrawerOpen = useResumeStore((state) => state.setDrawerOpen);
    const data = useResumeStore((state) => state.data);
    const updatePersonalInfo = useResumeStore((state) => state.updatePersonalInfo);
    const updateExperience = useResumeStore((state) => state.updateExperience);

    useEffect(() => {
        if (activeField) {
            setActiveTab('ai');
        }
    }, [activeField]);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('resume-ai-tutorial');
        if (!hasSeenTutorial) {
            setShowTutorial(true);
        }
    }, []);

    const dismissTutorial = () => {
        setShowTutorial(false);
        localStorage.setItem('resume-ai-tutorial', 'true');
    };

    const handleEnhance = async (type: 'summary' | 'experience' | 'skills' | 'projects', text: string, action: 'generate' | 'enhance', id?: string, context?: { position: string, company: string }) => {
        if (action === 'enhance' && !text.trim()) return;

        const actionKey = `${action}-${type}-${id || ''}`;
        setIsEnhancing(actionKey);
        try {
            const response = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type, 
                    text, 
                    action, 
                    context: { ...context, position: context?.position || useResumeStore.getState().data.personalInfo.jobTitle } 
                })
            });

            const resData = await response.json();

            if (response.ok && resData.result) {
                if (type === 'summary') {
                    updatePersonalInfo({ summary: resData.result });
                } else if (type === 'experience' && id) {
                    updateExperience(id, { description: resData.result });
                } else if (type === 'projects' && id) {
                    useResumeStore.getState().updateProject(id, { content: resData.result });
                } else if (type === 'skills') {
                    // If AI returns a list of skills, split and map to objects
                    if (typeof resData.result === 'string') {
                        const skillsArray = resData.result.split(',').map((s: string) => ({
                            id: Math.random().toString(36).substr(2, 9),
                            name: s.trim()
                        })).filter((s: { name: string }) => s.name);
                        useResumeStore.getState().updateSkills(skillsArray);
                    } else if (Array.isArray(resData.result)) {
                        useResumeStore.getState().updateSkills(resData.result.map((s: any) => ({
                            id: Math.random().toString(36).substr(2, 9),
                            name: typeof s === 'string' ? s : s.name
                        })));
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(null);
        }
    };

    const handleCoachAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/ai/coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: data })
            });
            const resData = await response.json();
            if (response.ok && resData.result) {
                setCoachFeedback(resData.result);
            }
        } catch (error) {
            console.error('Coach Error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleTabClick = (tabId: string) => {
        if (activeTab === tabId && isDrawerOpen) {
            setDrawerOpen(false);
        } else {
            setActiveTab(tabId);
            setDrawerOpen(true);
        }
    };

    return (
        <div className="flex h-full pointer-events-none z-50">
            {/* AI Tutorial Overlay */}
            {showTutorial && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl pointer-events-auto">
                    <div className="liquid-glass border-white/10 rounded-[3rem] p-12 max-w-sm shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                        <div className="flex justify-center mb-10">
                            <div className="h-20 w-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl">
                                <Brain className="h-10 w-10 text-indigo-400 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 text-center uppercase tracking-tighter font-display">AI Assistant</h3>
                        <p className="text-zinc-500 text-[11px] leading-relaxed mb-10 text-center font-bold uppercase tracking-widest">
                            Enhance and polish your resume content effortlessly.
                            <br /><br />
                            <span className="text-indigo-400">Contextual Refinement</span><br />
                            Select elements for AI enhancement.
                        </p>
                        <button
                            onClick={dismissTutorial}
                            className="w-full bg-white text-zinc-950 font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar Navigation Rail */}
            <div className="w-[72px] h-full bg-[#0a0a0f]/90 backdrop-blur-3xl border-r border-white/5 flex flex-col items-center py-6 gap-6 pointer-events-auto shadow-2xl z-50">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-4">
                    <Zap className="h-6 w-6 text-indigo-400 animate-pulse" />
                </div>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id && isDrawerOpen;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`p-4 rounded-[1.5rem] transition-all duration-700 relative group border
                                ${isActive ? 'bg-white text-zinc-950 border-white shadow-2xl scale-110' : 'text-zinc-600 border-transparent hover:text-white hover:bg-white/5'}`}
                            title={tab.label}
                        >
                            <Icon className="h-5 w-5" />
                        </button>
                    );
                })}
                <div className="mt-auto">
                    <button className="p-4 rounded-2xl text-zinc-700 hover:text-indigo-400 transition-colors">
                        <Settings2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Expandable Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div 
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[380px] h-full bg-[#070707]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col pointer-events-auto absolute left-[72px] top-0 shadow-[40px_0_100px_rgba(0,0,0,0.8)] z-40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
                        
                        {/* Drawer Header */}
                        <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1 italic">Current Section</span>
                                <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3 font-display">
                                    {(() => {
                                        const Icon = tabs.find(t => t.id === activeTab)?.icon || Sparkles;
                                        return <Icon className="h-4 w-4 text-indigo-400" />;
                                    })()}
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h2>
                            </div>
                            <button 
                                onClick={() => setDrawerOpen(false)}
                                className="h-8 w-8 flex items-center justify-center text-zinc-600 hover:text-white rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto relative custom-scrollbar z-10">
                            <AnimatePresence mode="wait">
                                {activeTab === 'structure' && (
                                    <motion.div
                                        key="structure"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-10 space-y-10"
                                    >
                                        <button
                                            onClick={() => useResumeStore.getState().setIsRearrangeOpen(true)}
                                            className="w-full group relative flex items-center justify-center gap-3 py-6 rounded-3xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_15px_30px_rgba(99,102,241,0.2)] transition-all hover:scale-[1.02] active:scale-95 border border-indigo-400/20"
                                        >
                                            <div className="absolute inset-0 bg-noise opacity-10" />
                                            <MousePointer2 className="h-4 w-4 relative z-10 animate-bounce" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] relative z-10 font-display">Rearrange Architecture</span>
                                        </button>

                                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                            <p className="text-[10px] text-zinc-600 leading-relaxed font-bold uppercase tracking-widest text-center">
                                                Enable or disable core modules to tailor your professional profile narrative.
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mb-6 px-2">
                                            <p className="text-[11px] text-zinc-600 leading-relaxed font-bold uppercase tracking-widest">
                                                Architecture & Structure
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="relative group/add">
                                                    <input 
                                                        type="text"
                                                        placeholder="New Module Title..."
                                                        className="w-40 bg-zinc-900/50 border border-white/5 rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500/50 transition-all opacity-0 group-hover/add:opacity-100 focus:opacity-100"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                const val = e.currentTarget.value.trim();
                                                                if (val) {
                                                                    useResumeStore.getState().addCustomSection(val);
                                                                    e.currentTarget.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none group-hover/add:opacity-0 transition-opacity">
                                                        <Plus className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Reorder.Group 
                                            axis="y" 
                                            values={sectionOrder} 
                                            onReorder={setSectionOrder}
                                            className="space-y-4"
                                        >
                                            {sectionOrder.map((id) => {
                                                const label = useResumeStore.getState().sectionLabels[id] || id;
                                                const isActive = visibleSections.includes(id);
                                                const isCustom = id.startsWith('custom-');

                                                return (
                                                    <Reorder.Item 
                                                        key={id} 
                                                        value={id}
                                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all group cursor-grab active:cursor-grabbing"
                                                    >
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <GripVertical className="h-4 w-4 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0" />
                                                            <div className={`h-2.5 w-2.5 rounded-full transition-all duration-700 shrink-0 ${isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-zinc-800'}`} />
                                                            <input 
                                                                type="text"
                                                                value={label}
                                                                onChange={(e) => useResumeStore.getState().updateSectionLabel(id, e.target.value)}
                                                                className={`bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex-1 min-w-0 ${isActive ? 'text-zinc-200 font-display' : 'text-zinc-600'}`}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-4 shrink-0">
                                                            {isCustom && (
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        useResumeStore.getState().removeCustomSection(id);
                                                                    }}
                                                                    className="text-zinc-700 hover:text-rose-500 transition-colors p-2"
                                                                >
                                                                    <LogOut className="h-3 w-3 rotate-45" />
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleSection(id);
                                                                }}
                                                                className={`h-6 w-10 rounded-full relative p-1 transition-all duration-700 ${isActive ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border border-white/10'}`}
                                                            >
                                                                <motion.div 
                                                                    animate={{ x: isActive ? 16 : 0 }}
                                                                    className={`h-4 w-4 rounded-full shadow-2xl ${isActive ? 'bg-white' : 'bg-zinc-700'}`} 
                                                                />
                                                            </button>
                                                        </div>
                                                    </Reorder.Item>
                                                );
                                            })}
                                        </Reorder.Group>
                                    </motion.div>
                                )}

                                {activeTab === 'ai' && (
                                    <motion.div
                                        key="ai"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-10 space-y-10"
                                    >
                                        <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/10 blur-[50px] rounded-full" />
                                            <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest relative z-10">
                                                Our <span className="text-indigo-400">AI Assistant</span> is ready. Select text in your resume to improve it, or use the features below.
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 px-2 italic">AI Capabilities</h3>
                                            <button
                                                onClick={() => handleEnhance('summary', data.personalInfo.jobTitle, 'generate')}
                                                disabled={isEnhancing === 'generate-summary-' || !data.personalInfo.jobTitle.trim()}
                                                className="w-full group relative flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all text-left overflow-hidden"
                                            >
                                                <div className="flex flex-col gap-2 relative z-10">
                                                    <span className="text-xs font-black uppercase tracking-widest text-white">Draft Executive Summary</span>
                                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Tailor to specific Job Title</span>
                                                </div>
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all border border-indigo-500/20 text-indigo-400">
                                                    <Sparkles className="h-5 w-5" />
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleEnhance('skills', data.personalInfo.jobTitle, 'generate')}
                                                disabled={isEnhancing === 'generate-skills-' || !data.personalInfo.jobTitle.trim()}
                                                className="w-full group relative flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all text-left overflow-hidden"
                                            >
                                                <div className="flex flex-col gap-2 relative z-10">
                                                    <span className="text-xs font-black uppercase tracking-widest text-white">Generate Core Stack</span>
                                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Industry standard formatting</span>
                                                </div>
                                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all border border-emerald-500/20 text-emerald-400">
                                                    <Zap className="h-5 w-5" />
                                                </div>
                                            </button>
                                        </div>

                                        {!activeField && (
                                            <div className="p-8 rounded-[2rem] border border-dashed border-white/5 text-center bg-white/[0.01]">
                                                <div className="h-12 w-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6">
                                                    <MousePointer2 className="h-5 w-5 text-zinc-700" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 leading-relaxed">
                                                    Select text <br /> on resume to <br /> enable AI features
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'coach' && (
                                    <motion.div
                                        key="coach"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-8 space-y-8 h-full flex flex-col"
                                    >
                                        {!coachFeedback ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 p-6">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse" />
                                                    <div className="relative h-24 w-24 rounded-[2rem] bg-[#0A0A0A] border border-indigo-500/30 flex items-center justify-center shadow-2xl">
                                                        <ShieldCheck className="h-10 w-10 text-indigo-400" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4 max-w-xs">
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-display">Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Analysis</span></h3>
                                                    <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest px-4">
                                                        Get expert feedback from our AI performance coach to optimize your resume for 2026 hiring standards.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleCoachAnalyze}
                                                    disabled={isAnalyzing}
                                                    className="w-full relative group bg-white text-zinc-950 font-black uppercase tracking-[0.4em] text-[10px] py-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] block"
                                                >
                                                    {isAnalyzing ? (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="h-1.5 w-1.5 bg-zinc-950 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                            <div className="h-1.5 w-1.5 bg-zinc-950 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                            <div className="h-1.5 w-1.5 bg-zinc-950 rounded-full animate-bounce" />
                                                        </div>
                                                    ) : (
                                                        "Analyze My Resume"
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-8 animate-fadeIn pb-12">
                                                {/* Score Card */}
                                                <div className="relative p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 overflow-hidden text-center group">
                                                    <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 blur-[60px] rounded-full -translate-y-12 translate-x-12" />
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <div className="h-20 w-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center mb-4 shadow-inner">
                                                            <span className="text-3xl font-black text-white font-display leading-none">{coachFeedback.score}</span>
                                                            <span className="text-[10px] text-zinc-500 ml-0.5 mt-2">/10</span>
                                                        </div>
                                                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-2">Expert Verdict</p>
                                                        <p className="text-xs text-white leading-relaxed font-medium italic">
                                                            "{coachFeedback.verdict}"
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6">
                                                    {/* Strengths */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 px-2">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Key Strengths</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {coachFeedback.strengths.map((s, i) => (
                                                                <div key={i} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-zinc-300 font-medium leading-relaxed">
                                                                    {s}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Critical Issues */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 px-2">
                                                            <AlertCircle className="h-3 w-3 text-rose-400" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500/80">Critical Issues</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {coachFeedback.issues.map((issue, i) => (
                                                                <div key={i} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-[10px] text-zinc-300 font-medium leading-relaxed flex gap-3">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                                                    {issue}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Bullet Point Rewrites */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 px-2">
                                                            <Zap className="h-3 w-3 text-indigo-400" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500/80">Power Rewrites (CAR Model)</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {coachFeedback.rewrites.map((r, i) => (
                                                                <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] text-zinc-300 font-medium leading-relaxed italic relative">
                                                                     <div className="absolute top-4 left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
                                                                     {r}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Missing Keywords */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 px-2">
                                                            <Sparkles className="h-3 w-3 text-violet-400" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-violet-500/80">Missing ATS Keywords</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 px-2">
                                                            {coachFeedback.keywords.map((kw, i) => (
                                                                <span key={i} className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[8px] font-black uppercase tracking-widest text-violet-300">
                                                                    {kw}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Recommendation */}
                                                    <div className="pt-6">
                                                        <div className="p-6 rounded-[2.5rem] bg-white text-zinc-950 shadow-2xl relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 h-16 w-16 bg-zinc-200 blur-2xl rounded-full translate-x-4 -translate-y-4" />
                                                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                                                <div className="h-8 w-8 rounded-full bg-zinc-950 flex items-center justify-center text-white">
                                                                    <ArrowRight size={14} />
                                                                </div>
                                                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400">Next Priority</span>
                                                            </div>
                                                            <p className="text-xs font-black uppercase tracking-tight leading-relaxed relative z-10 italic">
                                                                {coachFeedback.recommendation}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setCoachFeedback(undefined)}
                                                        className="w-full text-zinc-600 hover:text-white transition-colors text-[8px] font-black uppercase tracking-[0.5em] py-8"
                                                    >
                                                        Refresh Analysis
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
