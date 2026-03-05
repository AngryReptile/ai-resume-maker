import { useResumeStore } from '@/store/useResumeStore';

export default function ExecutiveProfessional({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-black p-12 font-serif">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-zinc-900 uppercase tracking-widest mb-3">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <h2 className="text-xl text-zinc-600 uppercase tracking-widest mb-3">
                    {data.personalInfo.jobTitle || 'Executive Title'}
                </h2>
                <div className="h-0.5 w-16 bg-zinc-900 mx-auto my-4"></div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-zinc-800">
                    <span>{data.personalInfo.email || 'email@example.com'}</span>
                    <span className="text-zinc-400">|</span>
                    <span>{data.personalInfo.phone || '+1 234 567 890'}</span>
                    {data.personalInfo.location && (
                        <>
                            <span className="text-zinc-400">|</span>
                            <span>{data.personalInfo.location}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
                {/* Summary */}
                {data.personalInfo.summary && (
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em] border-b border-zinc-900 pb-2 mb-4">
                            Executive Summary
                        </h3>
                        <p className="text-base text-zinc-800 leading-relaxed whitespace-pre-wrap text-justify">
                            {data.personalInfo.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em] border-b border-zinc-900 pb-2 mb-6">
                            Professional Experience
                        </h3>
                        <div className="space-y-8">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="flex justify-between items-end mb-2">
                                        <h4 className="text-xl font-bold text-zinc-900">{exp.company}</h4>
                                        <span className="text-sm text-zinc-600 font-medium italic">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-md font-semibold text-zinc-700 italic border-l-2 border-zinc-200 pl-3 mb-3">
                                        {exp.position}
                                    </div>
                                    <p className="text-base text-zinc-800 whitespace-pre-wrap leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em] border-b border-zinc-900 pb-2 mb-6">
                            Education
                        </h3>
                        <div className="space-y-6">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx} className="flex justify-between items-baseline">
                                    <div>
                                        <h4 className="text-lg font-bold text-zinc-900">{edu.school}</h4>
                                        <div className="text-base text-zinc-700 mt-1">{edu.degree}</div>
                                    </div>
                                    <span className="text-sm text-zinc-600 italic">
                                        {edu.startDate} – {edu.endDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {data.skills && (
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em] border-b border-zinc-900 pb-2 mb-4">
                            Core Competencies
                        </h3>
                        <p className="text-base text-zinc-800 leading-relaxed">
                            {data.skills}
                        </p>
                    </div>
                )}

                {/* Projects */}
                {data.projects && (
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em] border-b border-zinc-900 pb-2 mb-4">
                            Selected Projects
                        </h3>
                        <p className="text-base text-zinc-800 leading-relaxed whitespace-pre-wrap">
                            {data.projects}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
