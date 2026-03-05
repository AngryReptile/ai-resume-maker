import { useResumeStore } from '@/store/useResumeStore';

export default function SplitColumn({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full flex min-h-full bg-white text-zinc-800 font-sans">
            {/* Left Column (1/3) */}
            <div className="w-1/3 p-8 border-r-2 border-zinc-100 flex flex-col gap-8 bg-zinc-50/50">
                <header>
                    <h1 className="text-4xl font-black text-black tracking-tighter leading-none mb-3 break-words">
                        {data.personalInfo.fullName || 'Full Name'}
                    </h1>
                    <h2 className="text-lg text-emerald-600 font-bold mb-6 leading-snug">
                        {data.personalInfo.jobTitle || 'Profession'}
                    </h2>

                    <div className="space-y-4 text-sm font-medium text-zinc-600">
                        {data.personalInfo.email && (
                            <div>
                                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-0.5">Email</div>
                                <div>{data.personalInfo.email}</div>
                            </div>
                        )}
                        {data.personalInfo.phone && (
                            <div>
                                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-0.5">Phone</div>
                                <div>{data.personalInfo.phone}</div>
                            </div>
                        )}
                        {data.personalInfo.location && (
                            <div>
                                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-0.5">Location</div>
                                <div>{data.personalInfo.location}</div>
                            </div>
                        )}
                    </div>
                </header>

                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">
                            Education
                        </h3>
                        <div className="space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx}>
                                    <div className="font-bold text-zinc-900 text-sm">{edu.degree}</div>
                                    <div className="text-zinc-600 text-xs mt-1">{edu.school}</div>
                                    <div className="text-zinc-400 text-xs mt-1 font-medium italic">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.skills && (
                    <section>
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">
                            Skills
                        </h3>
                        <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                            {data.skills}
                        </p>
                    </section>
                )}
            </div>

            {/* Right Column (2/3) */}
            <div className="w-2/3 p-8 flex flex-col gap-8">
                {data.personalInfo.summary && (
                    <section>
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">
                            Profile
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-2">
                            Experience
                        </h3>
                        <div className="space-y-8">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-lg font-bold text-black leading-tight">
                                            {exp.position}
                                        </h4>
                                        <span className="text-xs font-bold text-emerald-600 ml-4 whitespace-nowrap bg-emerald-50 px-2 py-1 rounded">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold text-zinc-500 mb-3">{exp.company}</div>
                                    <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.projects && (
                    <section>
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">
                            Projects
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
