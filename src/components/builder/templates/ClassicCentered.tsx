import { useResumeStore } from '@/store/useResumeStore';

export default function ClassicCentered({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-zinc-900 p-12 font-serif text-[11pt]">
            {/* Header */}
            <div className="text-center mb-10 pb-6 border-b-2 border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2 uppercase">
                    {data.personalInfo.fullName || 'First Name Last Name'}
                </h1>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10pt] text-zinc-700 mb-4">
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.location && (data.personalInfo.phone || data.personalInfo.email) && <span className="text-zinc-400">•</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.phone && data.personalInfo.email && <span className="text-zinc-400">•</span>}
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                </div>
            </div>

            {/* Core Content */}
            <div className="space-y-8">
                {/* Summary */}
                {data.personalInfo.summary && (
                    <section>
                        <h2 className="text-center text-lg font-bold uppercase tracking-widest text-zinc-900 mb-4">
                            Professional Summary
                        </h2>
                        <div className="w-16 h-px bg-zinc-800 mx-auto mb-6"></div>
                        <p className="text-center text-zinc-800 leading-relaxed max-w-2xl mx-auto">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h2 className="text-center text-lg font-bold uppercase tracking-widest text-zinc-900 mb-4 mt-12">
                            Professional Experience
                        </h2>
                        <div className="w-16 h-px bg-zinc-800 mx-auto mb-6"></div>
                        <div className="space-y-6">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="flex justify-between items-end border-b border-zinc-200 pb-1 mb-2">
                                        <div className="font-bold text-lg text-zinc-900">{exp.company}</div>
                                        <div className="font-bold text-sm text-zinc-600">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                    </div>
                                    <div className="font-bold text-zinc-700 italic mb-3">{exp.position}</div>
                                    <p className="text-zinc-800 leading-relaxed whitespace-pre-wrap">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-center text-lg font-bold uppercase tracking-widest text-zinc-900 mb-4 mt-12">
                            Education
                        </h2>
                        <div className="w-16 h-px bg-zinc-800 mx-auto mb-6"></div>
                        <div className="space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx} className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-zinc-900">{edu.school}</span>
                                        <span className="mx-2 text-zinc-400">|</span>
                                        <span className="italic text-zinc-700">{edu.degree}</span>
                                    </div>
                                    <span className="text-sm font-bold text-zinc-600">{edu.startDate} – {edu.endDate}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && (
                    <section>
                        <h2 className="text-center text-lg font-bold uppercase tracking-widest text-zinc-900 mb-4 mt-12">
                            Skills & Expertise
                        </h2>
                        <div className="w-16 h-px bg-zinc-800 mx-auto mb-6"></div>
                        <p className="text-center text-zinc-800 leading-relaxed">
                            {data.skills}
                        </p>
                    </section>
                )}

                {/* Projects */}
                {data.projects && (
                    <section>
                        <h2 className="text-center text-lg font-bold uppercase tracking-widest text-zinc-900 mb-4 mt-12">
                            Projects
                        </h2>
                        <div className="w-16 h-px bg-zinc-800 mx-auto mb-6"></div>
                        <p className="text-zinc-800 leading-relaxed whitespace-pre-wrap">
                            {data.projects}
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}
