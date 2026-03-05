import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function InternshipPlacement({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-zinc-900 font-sans p-10 min-h-full">
            {/* Header optimized for freshers/students */}
            <header className="mb-8 border-b-2 border-slate-900 pb-5 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
                    {data.personalInfo.fullName || 'Student Name'}
                </h1>
                <h2 className="text-lg font-semibold text-slate-700 uppercase tracking-widest mb-4">
                    {data.personalInfo.jobTitle || 'Computer Science Student'}
                </h2>

                <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-slate-600">
                    {data.personalInfo.email && (
                        <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><Mail className="w-3.5 h-3.5" /> {data.personalInfo.email}</span>
                    )}
                    {data.personalInfo.phone && (
                        <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><Phone className="w-3.5 h-3.5" /> {data.personalInfo.phone}</span>
                    )}
                    {data.personalInfo.location && (
                        <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><MapPin className="w-3.5 h-3.5" /> {data.personalInfo.location}</span>
                    )}
                    {data.personalInfo.website && (
                        <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><ExternalLink className="w-3.5 h-3.5" /> {data.personalInfo.website}</span>
                    )}
                </div>
            </header>

            <div className="space-y-6">

                {/* EDUCATION - Pulled to the top for students/internships */}
                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                            <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> Education
                        </h3>
                        <div className="space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx} className="grid grid-cols-[1fr_auto] items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base">{edu.school}</h4>
                                        <div className="text-slate-700 italic text-sm">{edu.degree}</div>
                                    </div>
                                    <div className="text-right text-sm font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SKILLS - Second most important for placements */}
                {data.skills && (
                    <section>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                            <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> Technical Skills
                        </h3>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-md">
                            <p className="text-sm font-semibold text-slate-800 leading-relaxed font-mono">
                                {data.skills}
                            </p>
                        </div>
                    </section>
                )}

                {/* PROJECTS - Huge focus for internships */}
                {data.projects && (
                    <section>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                            <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> Academic & Personal Projects
                        </h3>
                        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-slate-200">
                            {data.projects}
                        </div>
                    </section>
                )}

                {/* EXPERIENCE - Pushed to bottom since freshers have less of it */}
                {data.experience.length > 0 && (
                    <section>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                            <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> Internships & Experience
                        </h3>
                        <div className="space-y-6">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="grid grid-cols-[1fr_auto] items-baseline mb-1">
                                        <h4 className="font-bold text-slate-900 text-base">{exp.position}</h4>
                                        <span className="text-sm font-bold text-slate-500 whitespace-nowrap ml-4">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 mb-2">{exp.company}</div>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SUMMARY - Kept brief at bottom like an objective */}
                {data.personalInfo.summary && (
                    <section>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                            <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> Objective
                        </h3>
                        <p className="text-sm text-slate-800 leading-relaxed italic border-l-4 border-slate-900 pl-4 py-1 bg-slate-50">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

            </div>
        </div>
    );
}
