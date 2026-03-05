'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { ChevronRight, ChevronLeft, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { countryCodes } from '@/lib/countryCodes';
import { jobTitles } from '@/lib/jobTitles';

const steps = ['Personal', 'Experience', 'Education', 'Skills & Projects'];

export default function FormSection() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
    const [showJobSuggestions, setShowJobSuggestions] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

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

    const data = useResumeStore((state) => state.data);
    const updatePersonalInfo = useResumeStore((state) => state.updatePersonalInfo);
    const updateExperience = useResumeStore((state) => state.updateExperience);

    const validateStep = (step: number) => {
        if (step === 0) {
            const { fullName, email, phone } = data.personalInfo;
            if (!fullName.trim() || !email.trim() || !phone.trim()) {
                setValidationError('Please fill in your Full Name, Email, and Phone number to proceed.');
                return false;
            }
        } else if (step === 2) {
            const hasValidEducation = data.education.some(e => e.school.trim() && e.degree.trim());
            if (data.education.length === 0 || !hasValidEducation) {
                setValidationError('Please add at least one valid Education entry to proceed.');
                return false;
            }
        } else if (step === 3) {
            if (!data.skills.trim()) {
                setValidationError('Please enter your Core Skills to generate a strong resume.');
                return false;
            }
        }
        setValidationError(null);
        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };
    const prevStep = () => {
        setValidationError(null);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleEnhance = async (type: 'summary' | 'experience', text: string, action: 'generate' | 'enhance', id?: string, context?: { position: string, company: string }) => {
        if (action === 'enhance' && !text.trim()) return;

        const actionKey = `${action}-${type}-${id || ''}`;
        setIsEnhancing(actionKey);
        try {
            const response = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, text, action, context })
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

    const filteredJobTitles = jobTitles.filter(
        (job) =>
            data.personalInfo.jobTitle.length >= 2 &&
            job.toLowerCase().includes(data.personalInfo.jobTitle.toLowerCase()) &&
            job.toLowerCase() !== data.personalInfo.jobTitle.toLowerCase()
    ).slice(0, 5);


    return (
        <div className="flex h-full flex-col bg-transparent border-r border-white/10 relative">

            {/* AI Tutorial Overlay */}
            {showTutorial && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-zinc-900 border border-indigo-500/30 rounded-2xl p-8 max-w-sm shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)] transform animate-[fadeIn_0.5s_ease-out]">
                        <div className="flex justify-center mb-6 relative">
                            <div className="absolute -top-12 animate-bounce">
                                <Sparkles className="h-10 w-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 text-center">Meet Your AI Assistant</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed mb-6 text-center">
                            Watch out for the <strong className="text-emerald-400 font-bold">AI</strong> and <strong className="text-indigo-400 font-bold">Enhance AI</strong> buttons on the form.
                            <br /><br />
                            <strong className="text-emerald-400">AI (Sparkles)</strong> completely generates your sections from scratch based on just your Job Title.
                            <br /><br />
                            <strong className="text-indigo-400">Enhance AI (Robot)</strong> proofreads and upgrades the text you&apos;ve already handwritten.
                        </p>
                        <button
                            onClick={dismissTutorial}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(99,102,241,0.6)]"
                        >
                            Got it, let&apos;s build!
                        </button>
                    </div>
                </div>
            )}

            {/* Stepper */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-4">
                {steps.map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isActive = idx === currentStep;
                    return (
                        <div key={step} className="flex items-center w-full justify-between">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 
                                ${isActive ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-110'
                                    : isCompleted ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                        : 'bg-white/5 text-zinc-500'}`}
                            >
                                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`h-1 w-full mx-2 sm:mx-4 rounded transition-all duration-500 
                                    ${isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                        : 'bg-white/5'}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
                <h2 className="text-2xl font-bold text-white mb-6 animate-[fadeIn_0.3s_ease-out]">{steps[currentStep]} Information</h2>

                {validationError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold animate-[fadeIn_0.3s]">
                        {validationError}
                    </div>
                )}

                {currentStep === 0 && (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.personalInfo.fullName}
                                    onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium text-zinc-400">Job Title</label>
                                <input
                                    type="text"
                                    value={data.personalInfo.jobTitle}
                                    onChange={(e) => {
                                        updatePersonalInfo({ jobTitle: e.target.value });
                                        setShowJobSuggestions(true);
                                    }}
                                    onFocus={() => setShowJobSuggestions(true)}
                                    onBlur={() => {
                                        // Small delay to allow clicking a suggestion
                                        setTimeout(() => setShowJobSuggestions(false), 200);
                                    }}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Your Job Title"
                                />
                                {showJobSuggestions && filteredJobTitles.length > 0 && (
                                    <ul className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl">
                                        {filteredJobTitles.map((job) => (
                                            <li
                                                key={job}
                                                className="cursor-pointer px-4 py-2 text-sm text-zinc-300 hover:bg-indigo-500/20 hover:text-white"
                                                onClick={() => {
                                                    updatePersonalInfo({ jobTitle: job });
                                                    setShowJobSuggestions(false);
                                                }}
                                            >
                                                {job}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={data.personalInfo.email}
                                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Phone <span className="text-red-500">*</span></label>
                                <div className="flex bg-white/5 border border-white/10 rounded-lg focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                                    <select
                                        className="bg-transparent text-white px-2 py-2.5 border-r border-white/10 focus:outline-none cursor-pointer text-sm w-[100px]"
                                        onChange={(e) => {
                                            const currentPhone = (data.personalInfo.phone || '').replace(/^\+\d+\s*/, '');
                                            updatePersonalInfo({ phone: `${e.target.value} ${currentPhone}`.trim() });
                                        }}
                                        value={(data.personalInfo.phone || '').match(/^\+\d+/)?.[0] || '+91'}
                                    >
                                        {countryCodes.map((c) => (
                                            <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                                                {c.flag} {c.code} ({c.country})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        value={(data.personalInfo.phone || '').replace(/^\+\d+\s*/, '')}
                                        onChange={(e) => {
                                            const currentCode = (data.personalInfo.phone || '').match(/^\+\d+/)?.[0] || '+91';
                                            updatePersonalInfo({ phone: `${currentCode} ${e.target.value}`.trim() });
                                        }}
                                        className="w-full bg-transparent px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none"
                                        placeholder="12345 67890"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-medium text-zinc-400">Professional Summary</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEnhance('summary', data.personalInfo.jobTitle, 'generate')}
                                        disabled={isEnhancing === 'generate-summary-' || !data.personalInfo.jobTitle.trim()}
                                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles className={`h-3.5 w-3.5 ${isEnhancing === 'generate-summary-' ? 'animate-pulse' : ''}`} />
                                        {isEnhancing === 'generate-summary-' ? 'Generating...' : 'AI'}
                                    </button>
                                    <button
                                        onClick={() => handleEnhance('summary', data.personalInfo.summary, 'enhance')}
                                        disabled={isEnhancing === 'enhance-summary-' || !data.personalInfo.summary.trim()}
                                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Bot className={`h-3.5 w-3.5 ${isEnhancing === 'enhance-summary-' ? 'animate-pulse' : ''}`} />
                                        {isEnhancing === 'enhance-summary-' ? 'Enhancing...' : 'Enhance AI'}
                                    </button>
                                </div>
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
                                        <input type="text" value={exp.company} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { company: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Company Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Position</label>
                                        <input type="text" value={exp.position} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { position: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Position Title" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Start Date</label>
                                        <input type="text" value={exp.startDate} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { startDate: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Month YYYY" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">End Date</label>
                                        <input type="text" value={exp.endDate} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { endDate: e.target.value })} disabled={exp.current} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50" placeholder="Month YYYY or Present" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={exp.current} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { current: e.target.checked })} id={`current-${exp.id}`} className="rounded border-white/10 bg-black/50 text-indigo-500 focus:ring-indigo-500" />
                                    <label htmlFor={`current-${exp.id}`} className="text-sm">I currently work here</label>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-sm font-medium text-zinc-400">Description / Achievements</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEnhance('experience', '', 'generate', exp.id, { position: exp.position, company: exp.company })}
                                                disabled={isEnhancing === 'generate-experience-' + exp.id || !exp.position.trim()}
                                                className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Sparkles className={`h-3.5 w-3.5 ${isEnhancing === 'generate-experience-' + exp.id ? 'animate-pulse' : ''}`} />
                                                {isEnhancing === 'generate-experience-' + exp.id ? 'Generating...' : 'AI'}
                                            </button>
                                            <button
                                                onClick={() => handleEnhance('experience', exp.description, 'enhance', exp.id, { position: exp.position, company: exp.company })}
                                                disabled={isEnhancing === 'enhance-experience-' + exp.id || !exp.description.trim()}
                                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Bot className={`h-3.5 w-3.5 ${isEnhancing === 'enhance-experience-' + exp.id ? 'animate-pulse' : ''}`} />
                                                {isEnhancing === 'enhance-experience-' + exp.id ? 'Enhancing...' : 'Enhance AI'}
                                            </button>
                                        </div>
                                    </div>
                                    <textarea value={exp.description} onChange={(e) => useResumeStore.getState().updateExperience(exp.id, { description: e.target.value })} rows={4} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" placeholder="Describe your achievements and responsibilities..." />
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
                                        <label className="text-sm font-medium text-zinc-400">School / University <span className="text-red-500">*</span></label>
                                        <input type="text" value={edu.school} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { school: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="University or College Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Degree & Field <span className="text-red-500">*</span></label>
                                        <input type="text" value={edu.degree} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { degree: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Your Degree" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Start Date</label>
                                        <input type="text" value={edu.startDate} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { startDate: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Month YYYY" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">End Date</label>
                                        <input type="text" value={edu.endDate} onChange={(e) => useResumeStore.getState().updateEducation(edu.id, { endDate: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Month YYYY" />
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
                            <label className="text-sm font-medium text-zinc-400">Key Skills (comma separated) <span className="text-red-500">*</span></label>
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
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-transparent z-10 w-full mb-16 lg:mb-0">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white disabled:text-zinc-600 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Back
                </button>
                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-500 hover:scale-[1.02] shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] active:scale-95"
                    >
                        Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="text-xs font-medium text-emerald-400 animate-pulse hidden sm:block mr-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">All steps completed!</div>
                    </div>
                )}
            </div>
        </div>
    );
}
