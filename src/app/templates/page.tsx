'use client';

import { useRouter } from 'next/navigation';
import { useResumeStore, ResumeData } from '@/store/useResumeStore';
import { ArrowLeft, LayoutTemplate } from 'lucide-react';
import React from 'react';

// Import Templates for Live Thumbnails
import InternshipPlacement from '@/components/builder/templates/InternshipPlacement';
import ModernClean from '@/components/builder/templates/ModernClean';
import ExecutiveProfessional from '@/components/builder/templates/ExecutiveProfessional';
import TechMinimal from '@/components/builder/templates/TechMinimal';
import CreativeAccent from '@/components/builder/templates/CreativeAccent';
import AcademicCV from '@/components/builder/templates/AcademicCV';
import SplitColumn from '@/components/builder/templates/SplitColumn';
import BoldHeader from '@/components/builder/templates/BoldHeader';
import ElegantSerif from '@/components/builder/templates/ElegantSerif';
import StartupDynamic from '@/components/builder/templates/StartupDynamic';
import ClassicCentered from '@/components/builder/templates/ClassicCentered';
import AcademicCVMidnight from '@/components/builder/templates/AcademicCVMidnight';
import BoldHeaderMidnight from '@/components/builder/templates/BoldHeaderMidnight';
import CreativeAccentMidnight from '@/components/builder/templates/CreativeAccentMidnight';
import ElegantSerifMidnight from '@/components/builder/templates/ElegantSerifMidnight';
import ExecutiveProfessionalMidnight from '@/components/builder/templates/ExecutiveProfessionalMidnight';
import InternshipPlacementMidnight from '@/components/builder/templates/InternshipPlacementMidnight';
import ModernCleanMidnight from '@/components/builder/templates/ModernCleanMidnight';
import SplitColumnMidnight from '@/components/builder/templates/SplitColumnMidnight';
import StartupDynamicMidnight from '@/components/builder/templates/StartupDynamicMidnight';
import TechMinimalMidnight from '@/components/builder/templates/TechMinimalMidnight';

const templates = [
    { id: 'internship', name: 'Internship & Placement', description: 'Tailored for freshers/students. Prioritizes Education and Projects over Experience.' },
    { id: 'modern-clean', name: 'Modern Clean', description: 'Standard ATS-friendly layout with clean lines. Perfect for most corporate roles.' },
    { id: 'executive', name: 'Executive Professional', description: 'Bold, heavy serif headers with centered name. Ideal for senior management in India and the US.' },
    { id: 'tech-minimal', name: 'Tech Minimalist', description: 'Compact, monospace-accented layout designed for software engineers and IT professionals.' },
    { id: 'creative', name: 'Creative Accent', description: 'Vibrant left sidebar for a pop of color. Great for designers and marketers.' },
    { id: 'split-column', name: 'Split Column', description: 'Modern 2-column layout to maximize whitespace and readability.' },
    { id: 'academic', name: 'Academic CV', description: 'Classic, highly structured format designed for research and academia.' },
    { id: 'bold-header', name: 'Bold Header', description: 'High-contrast dark header block to immediately grab attention.' },
    { id: 'elegant-serif', name: 'Elegant Serif', description: 'Sophisticated traditional styling with beautiful typography spacing.' },
    { id: 'startup', name: 'Startup Dynamic', description: 'Sleek, punchy layout optimized for fast-paced tech startup applications.' },
    { id: 'classic-centered', name: 'Classic Centered', description: 'Time-tested symmetrical layout with centered section dividers.' },
    { id: 'academic-c-v-midnight', name: 'Academic CV Midnight', description: 'A themed variation of professional templates.' },
    { id: 'bold-header-midnight', name: 'Bold Header Midnight', description: 'A themed variation of professional templates.' },
    { id: 'creative-accent-midnight', name: 'Creative Accent Midnight', description: 'A themed variation of professional templates.' },
    { id: 'elegant-serif-midnight', name: 'Elegant Serif Midnight', description: 'A themed variation of professional templates.' },
    { id: 'executive-professional-midnight', name: 'Executive Professional Midnight', description: 'A themed variation of professional templates.' },
    { id: 'internship-placement-midnight', name: 'Internship Placement Midnight', description: 'A themed variation of professional templates.' },
    { id: 'modern-clean-midnight', name: 'Modern Clean Midnight', description: 'A themed variation of professional templates.' },
    { id: 'split-column-midnight', name: 'Split Column Midnight', description: 'A themed variation of professional templates.' },
    { id: 'startup-dynamic-midnight', name: 'Startup Dynamic Midnight', description: 'A themed variation of professional templates.' },
    { id: 'tech-minimal-midnight', name: 'Tech Minimal Midnight', description: 'A themed variation of professional templates.' },
] as const;

const dummyResumeData: ResumeData = {
    personalInfo: {
        fullName: 'Alexander Rossi',
        jobTitle: 'Senior Product Manager',
        email: 'alex.rossi@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'linkedin.com/in/alexrossi',
        summary: 'Strategic Senior Product Manager with 8+ years of experience leading cross-functional teams to build enterprise SaaS products. Proven track record of increasing user retention by 40% and generating $5M+ in new ARR. Passionate about AI-driven product capabilities and intuitive user experiences.',
    },
    experience: [
        {
            id: '1',
            company: 'TechFlow Solutions',
            position: 'Group Product Manager',
            startDate: 'Jan 2021',
            endDate: '',
            current: true,
            description: '• Directed a team of 3 PMs and 20+ engineers to launch the flagship AI-analytics suite.\n• Increased enterprise customer adoption by 65% in the first two quarters.\n• Streamlined Agile development cycles, reducing time-to-market by 25% for core features.',
        },
        {
            id: '2',
            company: 'InnovateX',
            position: 'Product Manager',
            startDate: 'Mar 2017',
            endDate: 'Dec 2020',
            current: false,
            description: '• Owned the core mobile application product lifecycle from ideation to launch.\n• Achieved a 4.8-star rating on the App Store with over 1M active daily users.\n• Conducted extensive A/B testing leading to a 30% increase in checkout conversion rates.',
        }
    ],
    education: [
        {
            id: '1',
            school: 'Stanford University',
            degree: 'Master of Business Administration (MBA)',
            startDate: '2015',
            endDate: '2017',
        },
        {
            id: '2',
            school: 'University of California, Berkeley',
            degree: 'B.S. Computer Science',
            startDate: '2011',
            endDate: '2015',
        }
    ],
    skills: [
        { id: '1', name: 'Product Strategy' },
        { id: '2', name: 'Agile & Scrum' },
        { id: '3', name: 'Data Analytics' },
        { id: '4', name: 'Go-to-Market (GTM)' },
        { id: '5', name: 'UX/UI Design Principles' },
        { id: '6', name: 'A/B Testing' },
        { id: '7', name: 'SQL' },
        { id: '8', name: 'Python' },
        { id: '9', name: 'Jira' },
        { id: '10', name: 'Figma' },
        { id: '11', name: 'Stakeholder Management' }
    ],
    projects: [
        { 
            id: '1', 
            title: 'MetricAI', 
            content: '• Built "MetricAI", an open-source data visualization tool adapted by 500+ developers.' 
        },
        { 
            id: '2', 
            title: 'Mentorship', 
            content: '• Mentored 15 junior product managers through the Women in Tech initiative.' 
        }
    ],
    languages: 'English (Native), Italian (Fluent), Spanish (Professional)',
    interests: 'AI Ethics, Quantum Computing, Vertical Farming, Endurance Cycling',
    visibleSections: ['personalInfo', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
    sectionOrder: ['personalInfo', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
    sectionLabels: {},
    customSections: [],
    sidebarSections: []
};

// Helper to render a live, scaled-down version of the actual React template
const TemplateThumbnail = ({ id }: { id: string }) => {
    const renderTemplate = () => {
        switch (id) {
            case 'internship': return <InternshipPlacement previewData={dummyResumeData} />;
            case 'modern-clean': return <ModernClean previewData={dummyResumeData} />;
            case 'executive': return <ExecutiveProfessional previewData={dummyResumeData} />;
            case 'tech-minimal': return <TechMinimal previewData={dummyResumeData} />;
            case 'creative': return <CreativeAccent previewData={dummyResumeData} />;
            case 'academic': return <AcademicCV previewData={dummyResumeData} />;
            case 'split-column': return <SplitColumn previewData={dummyResumeData} />;
            case 'bold-header': return <BoldHeader previewData={dummyResumeData} />;
            case 'elegant-serif': return <ElegantSerif previewData={dummyResumeData} />;
            case 'startup': return <StartupDynamic previewData={dummyResumeData} />;
            case 'classic-centered': return <ClassicCentered previewData={dummyResumeData} />;
            case 'academic-c-v-midnight': return <AcademicCVMidnight previewData={dummyResumeData} />;
            case 'bold-header-midnight': return <BoldHeaderMidnight previewData={dummyResumeData} />;
            case 'creative-accent-midnight': return <CreativeAccentMidnight previewData={dummyResumeData} />;
            case 'elegant-serif-midnight': return <ElegantSerifMidnight previewData={dummyResumeData} />;
            case 'executive-professional-midnight': return <ExecutiveProfessionalMidnight previewData={dummyResumeData} />;
            case 'internship-placement-midnight': return <InternshipPlacementMidnight previewData={dummyResumeData} />;
            case 'modern-clean-midnight': return <ModernCleanMidnight previewData={dummyResumeData} />;
            case 'split-column-midnight': return <SplitColumnMidnight previewData={dummyResumeData} />;
            case 'startup-dynamic-midnight': return <StartupDynamicMidnight previewData={dummyResumeData} />;
            case 'tech-minimal-midnight': return <TechMinimalMidnight previewData={dummyResumeData} />;
            default: return <ModernClean previewData={dummyResumeData} />;
        }
    };

    return (
        <div className="absolute inset-0 overflow-hidden bg-white pointer-events-none select-none">
            {/* 
              We render the actual template at A4 proportions (800px wide).
              Then we shrink it down to fit perfectly inside the thumbnail container using CSS transform scale.
            */}
            <div className="w-[800px] h-[1131px] origin-top-left" style={{ transform: 'scale(0.315)' }}>
                {renderTemplate()}
            </div>
        </div>
    );
};

export default function TemplatesPage() {
    const router = useRouter();
    const setTemplateId = useResumeStore((state) => state.setTemplateId);

    const handleSelectTemplate = (templateId: string) => {
        setTemplateId(templateId);
        router.push('/builder');
    };

    return (
        <div className="relative min-h-screen w-full overflow-y-auto bg-[#0a0a0f] text-white pt-20 pb-10 px-6">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
            
            {/* Container with 1s fade-in */}
            <div className="relative z-10 mx-auto max-w-7xl animate-[fadeIn_1s_ease-out_forwards] opacity-0">
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="mr-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                            <LayoutTemplate className="h-6 w-6 text-indigo-400" />
                            Choose Your Template
                        </h1>
                        <p className="text-lg text-zinc-400">
                            Select from 10 professionally designed, industry-standard layouts.
                        </p>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.map((tpl: any, index: number) => (
                        <div
                            key={tpl.id}
                            onClick={() => handleSelectTemplate(tpl.id)}
                            className="group flex flex-col rounded-3xl bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer backdrop-blur-3xl overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Live Thumbnail Mockup */}
                            <div className="aspect-[1/1.414] rounded-2xl bg-[#0a0a0f] border border-white/5 mb-4 overflow-hidden relative shadow-2xl">
                                <TemplateThumbnail id={tpl.id} />

                                {/* Darken overlay for contrast against the app background */}
                                <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

                                {/* Hover overlay glow */}
                                <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-300 pointer-events-none"></div>
                            </div>

                            <div className="flex-1 flex flex-col justify-end">
                                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1 font-display group-hover:text-indigo-400 transition-colors">
                                    {tpl.name}
                                </h3>
                                <p className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors opacity-80">
                                    {tpl.description}
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                                Select Template
                                <ArrowLeft className="h-4 w-4 rotate-180" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
