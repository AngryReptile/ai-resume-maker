import { useResumeStore } from '@/store/useResumeStore';

export default function ElegantSerif({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-[#fdfbf7] text-black p-12 font-serif min-h-full border-[12px] border-white ring-1 ring-zinc-200" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            {/* Header */}
            <div className="text-center mb-10 pb-10 border-b border-zinc-300">
                <h1 className="text-5xl font-normal tracking-wide text-zinc-900 mb-4">
                    {data.personalInfo.fullName || 'First Last'}
                </h1>
                <h2 className="text-lg text-zinc-600 italic tracking-wider mb-6">
                    {data.personalInfo.jobTitle || 'Profession'}
                </h2>

                <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-500 uppercase tracking-widest font-medium">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-10">
                {data.personalInfo.summary && (
                    <section className="text-center">
                        <p className="text-lg text-zinc-700 leading-loose italic">
                            "{data.personalInfo.summary}"
                        </p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section>
                        <h3 className="text-xl font-medium text-zinc-900 text-center uppercase tracking-[0.3em] mb-8">
                            Experience
                        </h3>
                        <div className="space-y-10">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                                        <h4 className="text-xl font-medium text-zinc-900">{exp.company}</h4>
                                        <span className="text-sm text-zinc-500 uppercase tracking-widest mt-1 md:mt-0">
                                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-md text-zinc-600 italic mb-4">
                                        {exp.position}
                                    </div>
                                    <ul className="list-disc pl-5 text-sm leading-loose text-zinc-700 space-y-2">
                                        {exp.description.split('\n').filter(d => d.trim()).map((bullet, i) => (
                                            <li key={i}>{bullet.replace(/^- /, '')}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-xl font-medium text-zinc-900 text-center uppercase tracking-[0.3em] mb-8 mt-12">
                            Education
                        </h3>
                        <div className="space-y-6">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx} className="text-center">
                                    <div className="text-lg font-medium text-zinc-900 mb-1">{edu.school}</div>
                                    <div className="text-sm text-zinc-700 italic mb-2">{edu.degree}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.skills && (
                    <section>
                        <h3 className="text-xl font-medium text-zinc-900 text-center uppercase tracking-[0.3em] mb-6 mt-12">
                            Skills
                        </h3>
                        <p className="text-sm text-zinc-700 leading-loose text-center max-w-2xl mx-auto">
                            {data.skills.split(',').map(s => s.trim()).join('  •  ')}
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}
