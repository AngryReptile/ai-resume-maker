'use client';

import { useRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Download } from 'lucide-react';

// Import Templates
import InternshipPlacement from './templates/InternshipPlacement';
import ModernClean from './templates/ModernClean';
import ExecutiveProfessional from './templates/ExecutiveProfessional';
import TechMinimal from './templates/TechMinimal';
import CreativeAccent from './templates/CreativeAccent';
import AcademicCV from './templates/AcademicCV';
import SplitColumn from './templates/SplitColumn';
import BoldHeader from './templates/BoldHeader';
import ElegantSerif from './templates/ElegantSerif';
import StartupDynamic from './templates/StartupDynamic';
import ClassicCentered from './templates/ClassicCentered';

export default function PreviewSection() {
    const templateId = useResumeStore((state) => state.templateId);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex h-full flex-col bg-transparent p-8 relative">
            <button
                onClick={handlePrint}
                className="absolute top-4 right-8 z-20 flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-indigo-600 print:hidden"
            >
                <Download className="h-4 w-4" />
                Download PDF
            </button>

            <div className="flex-1 overflow-y-auto w-full max-w-[800px] mx-auto print:overflow-visible my-print-container">
                {/* A4 Document Container */}
                <div
                    ref={printRef}
                    className="aspect-[1/1.414] w-full shadow-2xl mb-8 print:shadow-none print:m-0 print:p-0 print:w-full print:aspect-auto overflow-hidden bg-white"
                >
                    {/* Render Selected Template Dynamically */}
                    {templateId === 'internship' && <InternshipPlacement />}
                    {templateId === 'modern-clean' && <ModernClean />}
                    {templateId === 'executive' && <ExecutiveProfessional />}
                    {templateId === 'tech-minimal' && <TechMinimal />}
                    {templateId === 'creative' && <CreativeAccent />}
                    {templateId === 'academic' && <AcademicCV />}
                    {templateId === 'split-column' && <SplitColumn />}
                    {templateId === 'bold-header' && <BoldHeader />}
                    {templateId === 'elegant-serif' && <ElegantSerif />}
                    {templateId === 'startup' && <StartupDynamic />}
                    {templateId === 'classic-centered' && <ClassicCentered />}

                    {/* Fallback */}
                    {!['internship', 'modern-clean', 'executive', 'tech-minimal', 'creative', 'academic', 'split-column', 'bold-header', 'elegant-serif', 'startup', 'classic-centered'].includes(templateId) && (
                        <ModernClean />
                    )}
                </div>
            </div>
        </div>
    );
}
