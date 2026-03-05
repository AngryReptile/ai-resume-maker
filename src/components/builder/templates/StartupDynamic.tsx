import { useResumeStore } from '@/store/useResumeStore';

export default function StartupDynamic({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-zinc-900 font-sans p-10 min-h-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b-[6px] border-indigo-600">
                <div>
                    <h1 className="text-5xl font-black text-black tracking-tighter mb-1 uppercase">
                        {data.personalInfo.fullName || 'First Last'}
                    </h1>
                    <h2 className="text-xl font-bold text-indigo-600 tracking-wider uppercase">
                        {data.personalInfo.jobTitle || 'Role'}
                    </h2>
                </div>
                <div className="flex flex-col gap-1 text-sm font-semibold text-zinc-600 mt-4 md:mt-0 md:text-right">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.location}</span>
                </div>
            </header>

            <div className="space-y-8">
                {/* Summary */}
                {data.personalInfo.summary && (
                    <section className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                        <p className="text-base font-medium text-zinc-800 leading-relaxed whitespace-pre-wrap">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column (2/3) - Experience & Projects */}
                    <div className="lg:col-span-2 space-y-8">
                        {data.experience.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center">
                                    <span className="bg-indigo-600 text-white px-3 py-1 mr-3 rounded-md">Exp</span>
                                    Work History
                                </h3>
                                <div className="space-y-6">
                                    {data.experience.map((exp, idx) => (
                                        <div key={exp.id || idx} className="relative pl-6 border-l-2 border-indigo-100 pb-2">
                                            <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="text-lg font-bold text-zinc-900">{exp.position}</h4>
                                                <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md ml-4">
                                                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                                </span>
                                            </div>
                                            <div className="text-base font-semibold text-indigo-600 mb-3">{exp.company}</div>
                                            <p className="text-sm font-medium text-zinc-700 whitespace-pre-wrap leading-relaxed">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.projects && (
                            <section>
                                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center mt-8">
                                    <span className="bg-indigo-600 text-white px-3 py-1 mr-3 rounded-md">Prj</span>
                                    Key Projects
                                </h3>
                                <p className="text-sm font-medium text-zinc-700 leading-relaxed whitespace-pre-wrap">
                                    {data.projects}
                                </p>
                            </section>
                        )}
                    </div>

                    {/* Right Column (1/3) - Skills & Education */}
                    <div className="space-y-8">
                        {data.skills && (
                            <section>
                                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">
                                    Capabilities
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.split(',').map((skill, idx) => (
                                        <span key={idx} className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-md border border-indigo-100">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.education.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 mt-8">
                                    Education
                                </h3>
                                <div className="space-y-6">
                                    {data.education.map((edu, idx) => (
                                        <div key={edu.id || idx}>
                                            <div className="font-bold text-zinc-900 border-b border-zinc-200 pb-1 mb-2">{edu.degree}</div>
                                            <div className="text-sm font-semibold text-zinc-600">{edu.school}</div>
                                            <div className="text-xs font-bold text-zinc-400 mt-1">{edu.startDate} – {edu.endDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
