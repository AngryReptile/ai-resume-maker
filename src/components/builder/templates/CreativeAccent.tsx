import { useResumeStore } from '@/store/useResumeStore';

export default function CreativeAccent({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full flex min-h-full bg-white text-zinc-900 font-sans">
            {/* Left Sidebar */}
            <div className="w-[35%] bg-indigo-50/50 p-8 border-r border-indigo-100/50 flex flex-col gap-10">
                <header>
                    <h1 className="text-3xl font-black text-indigo-950 tracking-tight leading-none mb-2 break-words">
                        {data.personalInfo.fullName || 'YOUR NAME'}
                    </h1>
                    <h2 className="text-lg text-indigo-600 font-semibold mb-6">
                        {data.personalInfo.jobTitle || 'Job Title'}
                    </h2>

                    <div className="space-y-3 text-sm text-indigo-900/80 font-medium">
                        <div>{data.personalInfo.email || 'email@example.com'}</div>
                        <div>{data.personalInfo.phone || '+1 234 567 890'}</div>
                        {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                    </div>
                </header>

                {data.skills && (
                    <section>
                        <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-widest mb-4 border-b-2 border-indigo-200 pb-1">
                            Expertise
                        </h3>
                        <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">
                            {data.skills}
                        </p>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-widest mb-4 border-b-2 border-indigo-200 pb-1">
                            Education
                        </h3>
                        <div className="space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx}>
                                    <div className="font-bold text-indigo-900 text-sm leading-tight">{edu.degree}</div>
                                    <div className="text-indigo-700 text-xs mt-1">{edu.school}</div>
                                    <div className="text-indigo-400/80 text-xs mt-0.5 font-medium">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Main Content Right */}
            <div className="w-[65%] p-10 flex flex-col gap-10">
                {data.personalInfo.summary && (
                    <section>
                        <h3 className="text-xl font-black text-indigo-950 mb-3 flex items-center gap-3">
                            Profile
                            <div className="flex-1 h-px bg-indigo-100"></div>
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section>
                        <h3 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-3">
                            Experience
                            <div className="flex-1 h-px bg-indigo-100"></div>
                        </h3>
                        <div className="space-y-8">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx} className="relative">
                                    <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-indigo-400"></div>
                                    <div className="pl-6 border-l-2 border-indigo-50 pb-2">
                                        <h4 className="text-lg font-bold text-zinc-900 leading-tight block">
                                            {exp.position}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1 mb-3">
                                            <span className="text-indigo-600 font-semibold text-sm">{exp.company}</span>
                                            <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.projects && (
                    <section>
                        <h3 className="text-xl font-black text-indigo-950 mb-4 flex items-center gap-3">
                            Projects
                            <div className="flex-1 h-px bg-indigo-100"></div>
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                            {data.projects}
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}
