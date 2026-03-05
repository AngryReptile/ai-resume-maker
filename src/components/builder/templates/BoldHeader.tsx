import { useResumeStore } from '@/store/useResumeStore';

export default function BoldHeader({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-zinc-900 font-sans min-h-full flex flex-col">
            {/* Dark Header Block */}
            <header className="bg-zinc-900 text-white p-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 text-center sm:text-left print:bg-zinc-900 print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <div>
                    <h1 className="text-5xl font-black tracking-tight mb-2">
                        {data.personalInfo.fullName || 'YOUR NAME'}
                    </h1>
                    <h2 className="text-xl text-zinc-400 font-medium">
                        {data.personalInfo.jobTitle || 'Profession'}
                    </h2>
                </div>
                <div className="flex flex-col gap-1 text-sm text-zinc-300 font-medium text-right items-center sm:items-end">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.location}</div>
                </div>
            </header>

            {/* Layout Box */}
            <div className="p-10 flex-1 space-y-8">
                {data.personalInfo.summary && (
                    <section>
                        <h3 className="text-lg font-bold text-black border-l-4 border-zinc-900 pl-3 mb-3">
                            Summary
                        </h3>
                        <p className="text-base text-zinc-700 leading-relaxed font-medium">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section>
                        <h3 className="text-lg font-bold text-black border-l-4 border-zinc-900 pl-3 mb-6">
                            Experience
                        </h3>
                        <div className="space-y-8">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-xl font-bold text-zinc-900">{exp.position}</h4>
                                        <span className="text-sm font-bold text-zinc-500 ml-4">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-base font-semibold text-indigo-600 mb-3">{exp.company}</div>
                                    <p className="text-base text-zinc-700 whitespace-pre-wrap leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-lg font-bold text-black border-l-4 border-zinc-900 pl-3 mb-6">
                            Education
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx} className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                                    <div className="font-bold text-zinc-900 mb-1">{edu.degree}</div>
                                    <div className="text-sm font-medium text-zinc-600">{edu.school}</div>
                                    <div className="text-xs font-bold text-zinc-400 mt-2">{edu.startDate} – {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {data.skills && (
                        <section>
                            <h3 className="text-lg font-bold text-black border-l-4 border-zinc-900 pl-3 mb-3">
                                Skills
                            </h3>
                            <p className="text-base text-zinc-700 leading-relaxed font-medium">
                                {data.skills}
                            </p>
                        </section>
                    )}
                    {data.projects && (
                        <section>
                            <h3 className="text-lg font-bold text-black border-l-4 border-zinc-900 pl-3 mb-3">
                                Projects
                            </h3>
                            <p className="text-base text-zinc-700 leading-relaxed font-medium whitespace-pre-wrap">
                                {data.projects}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
