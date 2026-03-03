'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Download } from 'lucide-react';
import { useRef } from 'react';

export default function PreviewSection() {
    const data = useResumeStore((state) => state.data);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex h-full flex-col bg-zinc-900 p-8 relative">
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
                    className="aspect-[1/1.414] w-full bg-white text-black shadow-2xl p-10 sm:p-14 mb-8 print:shadow-none print:m-0 print:p-0 print:w-full print:aspect-auto"
                >

                    {/* Header */}
                    <div className="border-b-2 border-zinc-200 pb-4 mb-4">
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight uppercase">
                            {data.personalInfo.fullName || 'Your Name'}
                        </h1>
                        <h2 className="text-lg text-indigo-600 font-medium mt-1">
                            {data.personalInfo.jobTitle || 'Job Title'}
                        </h2>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-zinc-600">
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-3 w-3" />
                                <span>{data.personalInfo.email || 'email@example.com'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Phone className="h-3 w-3" />
                                <span>{data.personalInfo.phone || '+1 234 567 890'}</span>
                            </div>
                            {data.personalInfo.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-3 w-3" />
                                    <span>{data.personalInfo.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {data.personalInfo.summary && (
                        <div className="mb-5">
                            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-1 mb-2 uppercase tracking-wide">
                                Professional Summary
                            </h3>
                            <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                                {data.personalInfo.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <div className="mb-5">
                            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-1 mb-3 uppercase tracking-wide">
                                Experience
                            </h3>
                            <div className="space-y-4">
                                {data.experience.map((exp, idx) => (
                                    <div key={exp.id || idx}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-semibold text-zinc-900">{exp.position}</h4>
                                            <span className="text-xs text-zinc-500 font-medium">
                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-sm text-indigo-600 font-medium mb-1">{exp.company}</div>
                                        <p className="text-sm text-zinc-700 whitespace-pre-wrap pl-4 border-l-2 border-zinc-100">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {data.education.length > 0 && (
                        <div className="mb-5">
                            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-1 mb-3 uppercase tracking-wide">
                                Education
                            </h3>
                            <div className="space-y-3">
                                {data.education.map((edu, idx) => (
                                    <div key={edu.id || idx} className="flex justify-between items-baseline">
                                        <div>
                                            <h4 className="font-semibold text-zinc-900">{edu.school}</h4>
                                            <div className="text-sm text-zinc-700">{edu.degree}</div>
                                        </div>
                                        <span className="text-xs text-zinc-500 font-medium">
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {data.skills && (
                        <div className="mb-5">
                            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-1 mb-2 uppercase tracking-wide">
                                Skills
                            </h3>
                            <p className="text-sm text-zinc-700 leading-relaxed">
                                {data.skills}
                            </p>
                        </div>
                    )}

                    {/* Projects */}
                    {data.projects && (
                        <div className="mb-5">
                            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-1 mb-2 uppercase tracking-wide">
                                Projects
                            </h3>
                            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                                {data.projects}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
