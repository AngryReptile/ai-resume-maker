'use client';

import dynamic from 'next/dynamic';
import { useResumeStore } from '@/store/useResumeStore';
import { Download, FileDown, Printer, Layout } from 'lucide-react';
import { exportToDocx } from '@/lib/exportUtils';
import { motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import RearrangeModal from './RearrangeModal';

// Import Templates Dynamically
const InternshipPlacement = dynamic(() => import('./templates/InternshipPlacement'));
const ModernClean = dynamic(() => import('./templates/ModernClean'));
const ExecutiveProfessional = dynamic(() => import('./templates/ExecutiveProfessional'));
const TechMinimal = dynamic(() => import('./templates/TechMinimal'));
const CreativeAccent = dynamic(() => import('./templates/CreativeAccent'));
const AcademicCV = dynamic(() => import('./templates/AcademicCV'));
const SplitColumn = dynamic(() => import('./templates/SplitColumn'));
const BoldHeader = dynamic(() => import('./templates/BoldHeader'));
const ElegantSerif = dynamic(() => import('./templates/ElegantSerif'));
const StartupDynamic = dynamic(() => import('./templates/StartupDynamic'));

const InternshipPlacementMidnight = dynamic(() => import('./templates/InternshipPlacementMidnight'));
const ModernCleanMidnight = dynamic(() => import('./templates/ModernCleanMidnight'));
const ExecutiveProfessionalMidnight = dynamic(() => import('./templates/ExecutiveProfessionalMidnight'));
const TechMinimalMidnight = dynamic(() => import('./templates/TechMinimalMidnight'));
const CreativeAccentMidnight = dynamic(() => import('./templates/CreativeAccentMidnight'));
const AcademicCVMidnight = dynamic(() => import('./templates/AcademicCVMidnight'));
const SplitColumnMidnight = dynamic(() => import('./templates/SplitColumnMidnight'));
const BoldHeaderMidnight = dynamic(() => import('./templates/BoldHeaderMidnight'));
const ElegantSerifMidnight = dynamic(() => import('./templates/ElegantSerifMidnight'));
const StartupDynamicMidnight = dynamic(() => import('./templates/StartupDynamicMidnight'));

export default function PreviewSection() {
    const templateId = useResumeStore((state) => state.templateId);
    const data = useResumeStore((state) => state.data);
    const title = useResumeStore((state) => state.title);
    const setIsRearrangeOpen = useResumeStore((state) => state.setIsRearrangeOpen);
    const paperRef = useRef<HTMLDivElement>(null);
    const [pageCount, setPageCount] = useState(1);

    // True A4 Paging Engine (WYSIWYG Print Fidelity with Physical Gaps)
    useLayoutEffect(() => {
        if (!paperRef.current) return;
        
        // Exact A4 height at 96 DPI
        const PAGE_HEIGHT = 1122.5; 
        const GAP = 32; // 32px physical gap on screen
        const EFFECTIVE_PAGE = PAGE_HEIGHT + GAP;

        const blocks = paperRef.current.querySelectorAll('.paged-block');
        const paperRect = paperRef.current.getBoundingClientRect();
        const SCALE = 0.8; // Transform scale applied on parent
        
        blocks.forEach((block: any) => {
            // Reset previous margin calculation
            block.style.marginTop = '0px';

            const blockRect = block.getBoundingClientRect();
            // Get unscaled relative position
            const blockTop = (blockRect.top - paperRect.top) / SCALE;
            const blockHeight = blockRect.height / SCALE;
            
            const pageIndex = Math.floor(blockTop / EFFECTIVE_PAGE);
            const nextBoundary = (pageIndex) * EFFECTIVE_PAGE + PAGE_HEIGHT;

            // Checking if any part of the block crosses the boundary
            if (blockTop < nextBoundary && (blockTop + blockHeight) > nextBoundary) {
                // Push the block precisely past the boundary AND the gap to start of next page
                const pushAmount = nextBoundary - blockTop + GAP; 
                block.style.marginTop = `${pushAmount}px`;
            }
        });

        // Recalculate total visual pages cleanly
        setTimeout(() => {
            if (paperRef.current) {
                const totalHeight = paperRef.current.scrollHeight;
                setPageCount(Math.max(1, Math.ceil(totalHeight / EFFECTIVE_PAGE)));
            }
        }, 50);

    }, [data, templateId]);

    const handlePrint = () => {
        window.print();
    };

    const handleDocxExport = () => {
        exportToDocx(data, title);
    };

    const renderTemplate = () => {
        switch (templateId) {
            case 'internship': return <InternshipPlacement />;
            case 'modern-clean': return <ModernClean />;
            case 'executive': return <ExecutiveProfessional />;
            case 'tech-minimal': return <TechMinimal />;
            case 'creative': return <CreativeAccent />;
            case 'academic': return <AcademicCV />;
            case 'split-column': return <SplitColumn />;
            case 'bold-header': return <BoldHeader />;
            case 'elegant-serif': return <ElegantSerif />;
            case 'startup': return <StartupDynamic />;
            case 'internship-placement-midnight': return <InternshipPlacementMidnight />;
            case 'modern-clean-midnight': return <ModernCleanMidnight />;
            case 'executive-professional-midnight': return <ExecutiveProfessionalMidnight />;
            case 'tech-minimal-midnight': return <TechMinimalMidnight />;
            case 'creative-accent-midnight': return <CreativeAccentMidnight />;
            case 'academic-c-v-midnight': return <AcademicCVMidnight />;
            case 'split-column-midnight': return <SplitColumnMidnight />;
            case 'bold-header-midnight': return <BoldHeaderMidnight />;
            case 'elegant-serif-midnight': return <ElegantSerifMidnight />;
            case 'startup-dynamic-midnight': return <StartupDynamicMidnight />;
            default: return <ModernClean />;
        }
    };

    return (
        <div className="flex h-full flex-col bg-transparent p-4 relative overflow-hidden print:p-0 print:overflow-visible">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            {/* Premium Floating Controls */}
            <div className="fixed top-[100px] right-8 z-[100] flex items-center gap-3 print:hidden">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 liquid-glass p-1.5 rounded-2xl border border-white/5 shadow-2xl"
                >
                    <button
                        onClick={handleDocxExport}
                        className="group flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white border border-white/5 transition-all hover:scale-105 active:scale-95"
                    >
                        <FileDown className="h-3 w-3 text-indigo-400" />
                        DOCX
                    </button>
                    <button
                        onClick={handlePrint}
                        className="group flex items-center gap-2 rounded-xl bg-white text-zinc-950 px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95 font-display"
                    >
                        <Printer className="h-3 w-3" />
                        PDF Export
                    </button>
                </motion.div>
                
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setIsRearrangeOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-600 hover:scale-110 group border border-indigo-400/30"
                >
                    <Layout className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto w-full flex justify-center py-4 print:py-0 print:overflow-visible my-print-container custom-scrollbar">
                {/* Downscaled wrapper for viewing comfort */}
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center', marginBottom: '-25%' }} className="print:transform-none print:m-0 w-full flex justify-center">
                    
                    <div className="relative isolate w-[794px]">
                        
                        {/* Physical Pages Backdrop (Prints are hidden, screen only) */}
                        <div className="absolute inset-0 z-0 flex flex-col pointer-events-none print:hidden" style={{ gap: '32px' }}>
                            {Array.from({ length: pageCount }).map((_, i) => (
                                <div key={i} className="w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-sm" style={{ height: '1122.5px', flexShrink: 0 }} />
                            ))}
                        </div>

                        {/* Actual Resume Layer - Transparent on screen, masked to simulate gaps */}
                        <div
                            ref={paperRef}
                            className="relative z-10 w-full print:shadow-none print:m-0 print:p-0 print:bg-white bg-transparent outline-none"
                            style={{ 
                                minHeight: `${(pageCount * 1154.5) - 32}px`,
                                WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0px, black 1122.5px, transparent 1122.5px, transparent 1154.5px)',
                                maskImage: 'repeating-linear-gradient(to bottom, black 0px, black 1122.5px, transparent 1122.5px, transparent 1154.5px)'
                            }}
                        >
                            {renderTemplate()}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
