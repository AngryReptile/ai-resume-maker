import { useResumeStore } from '@/store/useResumeStore';

export default function AcademicCV({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-black p-12 font-serif text-[11pt] leading-relaxed">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">
                    {data.personalInfo.fullName || 'First Name Last Name'}
                </h1>
                <div className="text-sm">
                    {data.personalInfo.location && <span>{data.personalInfo.location} • </span>}
                    {data.personalInfo.email && <span>{data.personalInfo.email} • </span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                </div>
            </div>

            <div className="space-y-6">
                {/* Education Section (Academic CVs typically prioritize Education) */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-3">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id || idx}>
                                    <div className="flex justify-between font-bold">
                                        <span>{edu.school}</span>
                                        <span>{edu.startDate} – {edu.endDate}</span>
                                    </div>
                                    <div className="font-normal italic">
                                        {edu.degree}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Academic/Professional summary */}
                {data.personalInfo.summary && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-3">
                            Research Interests / Summary
                        </h2>
                        <p className="whitespace-pre-wrap text-justify">
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-3 mt-8">
                            Academic & Professional Experience
                        </h2>
                        <div className="space-y-5">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id || idx}>
                                    <div className="flex justify-between font-bold">
                                        <span>{exp.company}</span>
                                        <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                                    </div>
                                    <div className="font-normal italic mb-1">
                                        {exp.position}
                                    </div>
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        {exp.description.split('\n').filter(d => d.trim()).map((bullet, i) => (
                                            <li key={i}>{bullet.replace(/^- /, '')}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects/Publications */}
                {data.projects && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-3 mt-8">
                            Selected Projects & Publications
                        </h2>
                        <p className="whitespace-pre-wrap">
                            {data.projects}
                        </p>
                    </section>
                )}

                {/* Skills */}
                {data.skills && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-3 mt-8">
                            Technical Skills
                        </h2>
                        <p>
                            {data.skills}
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}
