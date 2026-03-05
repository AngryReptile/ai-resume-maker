import { useResumeStore } from '@/store/useResumeStore';

export default function TechMinimal({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-zinc-900 p-10 font-mono text-sm">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-black tracking-tighter mb-1">
                    {'>'} {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <h2 className="text-lg text-emerald-700 font-bold mb-4">
                    ~/role/{data.personalInfo.jobTitle?.replace(/\s+/g, '-').toLowerCase() || 'developer'}
                </h2>

                <div className="flex flex-col gap-1 text-zinc-600">
                    <div><span className="text-zinc-400">email:</span> {data.personalInfo.email || 'null'}</div>
                    <div><span className="text-zinc-400">phone:</span> {data.personalInfo.phone || 'null'}</div>
                    {data.personalInfo.location && <div><span className="text-zinc-400">loc:</span> {data.personalInfo.location}</div>}
                </div>
            </header>

            <div className="space-y-8">
                {/* Summary */}
                {data.personalInfo.summary && (
                    <section>
                        <h3 className="text-emerald-700 font-bold mb-2 uppercase">## About_Me</h3>
                        <p className="text-zinc-800 whitespace-pre-wrap leading-relaxed">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h3 className="text-emerald-700 font-bold mb-4 uppercase">## Experience</h3>
                        <div className="space-y-6">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="flex justify-between items-start mb-2 border-b border-dashed border-zinc-300 pb-1">
                                        <div>
                                            <span className="font-bold text-zinc-900">[{exp.company}]</span>
                                            <span className="text-zinc-600 ml-2">as {exp.position}</span>
                                        </div>
                                        <span className="text-zinc-500 whitespace-nowrap ml-4">
                                            {exp.startDate} : {exp.current ? 'HEAD' : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="text-zinc-700 whitespace-pre-wrap pl-4 border-l-2 border-emerald-500/30">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects && (
                    <section>
                        <h3 className="text-emerald-700 font-bold mb-2 uppercase">## Projects</h3>
                        <p className="text-zinc-800 whitespace-pre-wrap leading-relaxed">
                            {data.projects}
                        </p>
                    </section>
                )}

                {/* Skills */}
                {data.skills && (
                    <section>
                        <h3 className="text-emerald-700 font-bold mb-2 uppercase">## Tech_Stack</h3>
                        <p className="text-zinc-800 leading-relaxed">
                            {data.skills}
                        </p>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-emerald-700 font-bold mb-4 uppercase">## Education</h3>
                        <div className="space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx} className="flex justify-between">
                                    <div>
                                        <div className="font-bold text-zinc-900">{edu.school}</div>
                                        <div className="text-zinc-600">{edu.degree}</div>
                                    </div>
                                    <span className="text-zinc-500">
                                        {edu.startDate} : {edu.endDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
