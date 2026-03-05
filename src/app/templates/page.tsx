'use client';

import { useRouter } from 'next/navigation';
import { useResumeStore, ResumeData } from '@/store/useResumeStore';
import AnimatedBackground from '@/components/AnimatedBackground';
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
    skills: 'Product Strategy, Agile & Scrum, Data Analytics, Go-to-Market (GTM), UX/UI Design Principles, A/B Testing, SQL, Python, Jira, Figma, Stakeholder Management',
    projects: '• Built "MetricAI", an open-source data visualization tool adapted by 500+ developers.\n• Mentored 15 junior product managers through the Women in Tech initiative.',
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
        <div className="relative min-h-screen w-full overflow-y-auto bg-black text-white pt-24 pb-16 px-6">
            <AnimatedBackground />

            {/* Container with 1s fade-in */}
            <div className="relative z-10 mx-auto max-w-7xl animate-[fadeIn_1s_ease-out_forwards] opacity-0">
                <div className="flex items-center mb-12">
                    <button
                        onClick={() => router.push('/')}
                        className="mr-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                            <LayoutTemplate className="h-8 w-8 text-indigo-400" />
                            Choose Your Template
                        </h1>
                        <p className="text-lg text-zinc-400">
                            Select from 10 professionally designed, industry-standard layouts.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => handleSelectTemplate(template.id)}
                            className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-indigo-500/50 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden"
                        >
                            {/* Live Template Mockup Thumbnail */}
                            <div className="w-full aspect-[1/1.414] bg-white border border-white/10 mb-6 rounded-lg overflow-hidden relative shadow-inner">
                                <TemplateThumbnail id={template.id} />

                                {/* Darken overlay for contrast against the app background */}
                                <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

                                {/* Hover overlay glow */}
                                <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-300 pointer-events-none"></div>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                {template.name}
                            </h3>
                            <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                                {template.description}
                            </p>

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
