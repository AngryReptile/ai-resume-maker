'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { ChevronRight, ChevronLeft, Bot } from 'lucide-react';

const steps = ['Personal', 'Experience', 'Education', 'Skills & Projects'];

export default function FormSection() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
    const data = useResumeStore((state) => state.data);
    const updatePersonalInfo = useResumeStore((state) => state.updatePersonalInfo);
    const updateExperience = useResumeStore((state) => state.updateExperience);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleEnhance = async (type: 'summary' | 'experience', text: string, id?: string, context?: any) => {
        if (!text.trim()) return;

        setIsEnhancing(type + (id || ''));
        try {
            const response = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, text, context })
            });

            const data = await response.json();

            if (response.ok && data.result) {
                if (type === 'summary') {
                    updatePersonalInfo({ summary: data.result });
                } else if (type === 'experience' && id) {
                    updateExperience(id, { description: data.result });
                }
            } else {
                alert('Failed to enhance text: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Network error occurred.');
        } finally {
            setIsEnhancing(null);
        }
    };


    return (
        <div className="flex h-full flex-col bg-zinc-950 border-r border-white/10">
            {/* Stepper */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                {steps.map((step, idx) => (
                    <div key={step} className="flex items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${idx === currentStep ? 'bg-indigo-500 text-white' : idx < currentStep ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-500'}`}>
                            {idx + 1}
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`h-1 w-8 sm:w-12 mx-2 rounded ${idx < currentStep ? 'bg-indigo-500/50' : 'bg-white/5'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-white mb-6">{steps[currentStep]} Information</h2>

                {currentStep === 0 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                                <input
                                    type="text"
                                    value={data.personalInfo.fullName}
                                    onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Job Title</label>
                                <input
                                    type="text"
                                    value={data.personalInfo.jobTitle}
                                    onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Software Engineer"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Email</label>
                                <input
                                    type="email"
                                    value={data.personalInfo.email}
                                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Phone</label>
                                <input
                                    type="tel"
                                    value={data.personalInfo.phone}
                                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-medium text-zinc-400">Professional Summary</label>
                                <button
                                    onClick={() => handleEnhance('summary', data.personalInfo.summary)}
                                    disabled={isEnhancing === 'summary' || !data.personalInfo.summary.trim()}
                                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Bot className={`h-3.5 w-3.5 ${isEnhancing === 'summary' ? 'animate-pulse' : ''}`} />
                                    {isEnhancing === 'summary' ? 'Enhancing...' : 'Enhance AI'}
                                </button>
                            </div>
                            <textarea
                                value={data.personalInfo.summary}
                                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                                rows={4}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                placeholder="Briefly describe your... "
                            />
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-6 text-zinc-300">
                        {data.experience.map((exp, idx) => (
                            <div key={exp.id || idx} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-white">Experience {idx + 1}</h3>
                                    <button onClick={() => useResumeStore.getState().removeExperience(exp.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Company</label>
                                        <input type="text" value={exp.company} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { company: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Google" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Position</label>
                                        <input type="text" value={exp.position} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { position: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Software Engineer" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Start Date</label>
                                        <input type="text" value={exp.startDate} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { startDate: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Jan 2020" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">End Date</label>
                                        <input type="text" value={exp.endDate} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { endDate: e.target.value })} disabled={exp.current} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50" placeholder="Present" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={exp.current} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { current: e.target.checked })} id={`current-${exp.id}`} className="rounded border-white/10 bg-black/50 text-indigo-500 focus:ring-indigo-500" />
                                    <label htmlFor={`current-${exp.id}`} className="text-sm">I currently work here</label>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-sm font-medium text-zinc-400">Description / Achievements</label>
                                        <button
                                            onClick={() => handleEnhance('experience', exp.description, exp.id, { position: exp.position, company: exp.company })}
                                            disabled={isEnhancing === 'experience' + exp.id || !exp.description.trim()}
                                            className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Bot className={`h-3 w-3 ${isEnhancing === 'experience' + exp.id ? 'animate-pulse' : ''}`} />
                                            {isEnhancing === 'experience' + exp.id ? 'Enhancing...' : 'Enhance'}
                                        </button>
                                    </div>
                                    <textarea value={exp.description} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { description: e.target.value })} rows={4} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" placeholder="- Developed key features..." />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => useResumeStore.getState().addExperience({ id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' })}
                            className="w-full py-3 border border-dashed border-white/20 rounded-lg text-indigo-400 hover:bg-white/5 transition-colors font-medium flex justify-center items-center gap-2"
                        >
                            + Add Experience
                        </button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6 text-zinc-300">
                        {data.education.map((edu, idx) => (
                            <div key={edu.id || idx} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-white">Education {idx + 1}</h3>
                                    <button onClick={() => useResumeStore.getState().removeEducation(edu.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">School / University</label>
                                        <input type="text" value={edu.school} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { school: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Stanford University" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Degree & Field</label>
                                        <input type="text" value={edu.degree} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { degree: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="BS Computer Science" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Start Date</label>
                                        <input type="text" value={edu.startDate} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { startDate: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Aug 2018" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">End Date</label>
                                        <input type="text" value={edu.endDate} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { endDate: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="May 2022" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => useResumeStore.getState().addEducation({ id: Date.now().toString(), school: '', degree: '', startDate: '', endDate: '' })}
                            className="w-full py-3 border border-dashed border-white/20 rounded-lg text-indigo-400 hover:bg-white/5 transition-colors font-medium flex justify-center items-center gap-2"
                        >
                            + Add Education
                        </button>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6 text-zinc-300">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Key Skills (comma separated)</label>
                            <textarea
                                value={data.skills}
                                onChange={(e) => useResumeStore.getState().updateSkills(e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                placeholder="JavaScript, React, Node.js, Python, AWS..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Projects</label>
                            <textarea
                                value={data.projects}
                                onChange={(e) => useResumeStore.getState().updateProjects(e.target.value)}
                                rows={6}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                placeholder="Project Name - Description of what you built and the impact it had..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-black/50">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white disabled:text-zinc-600 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white"
                >
                    Next <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
