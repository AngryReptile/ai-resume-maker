import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ModernClean({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;

    return (
        <div className="w-full bg-white text-black p-10 sm:p-14 font-sans">
            {/* Header */}
            <div className="border-b-4 border-zinc-800 pb-6 mb-6">
                <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight uppercase">
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <h2 className="text-xl text-indigo-700 font-semibold mt-2 tracking-wide">
                    {data.personalInfo.jobTitle || 'Job Title'}
                </h2>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-zinc-700 font-medium">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-zinc-400" />
                        <span>{data.personalInfo.email || 'email@example.com'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-zinc-400" />
                        <span>{data.personalInfo.phone || '+1 234 567 890'}</span>
                    </div>
                    {data.personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-zinc-400" />
                            <span>{data.personalInfo.location}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            {data.personalInfo.summary && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2 mb-3 uppercase tracking-widest">
                        Professional Summary
                    </h3>
                    <p className="text-base leading-relaxed text-zinc-800 whitespace-pre-wrap">
                        {data.personalInfo.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2 mb-4 uppercase tracking-widest">
                        Experience
                    </h3>
                    <div className="space-y-6">
                        {data.experience.map((exp, idx) => (
                            <div key={exp.id || idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="text-lg font-bold text-zinc-900">{exp.position}</h4>
                                    <span className="text-sm text-zinc-600 font-bold whitespace-nowrap ml-4">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-base text-indigo-700 font-semibold mb-2">{exp.company}</div>
                                <p className="text-base text-zinc-800 whitespace-pre-wrap pl-4 border-l-2 border-zinc-300 leading-relaxed">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2 mb-4 uppercase tracking-widest">
                        Education
                    </h3>
                    <div className="space-y-5">
                        {data.education.map((edu, idx) => (
                            <div key={edu.id || idx} className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900">{edu.school}</h4>
                                    <div className="text-base text-zinc-700 font-medium mt-0.5">{edu.degree}</div>
                                </div>
                                <span className="text-sm text-zinc-600 font-bold whitespace-nowrap ml-4 mt-1">
                                    {edu.startDate} - {edu.endDate}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2 mb-3 uppercase tracking-widest">
                        Skills
                    </h3>
                    <p className="text-base text-zinc-800 leading-relaxed font-medium">
                        {data.skills}
                    </p>
                </div>
            )}

            {/* Projects */}
            {data.projects && (
                <div className="mb-0">
                    <h3 className="text-lg font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2 mb-3 uppercase tracking-widest">
                        Projects
                    </h3>
                    <p className="text-base text-zinc-800 leading-relaxed whitespace-pre-wrap">
                        {data.projects}
                    </p>
                </div>
            )}
        </div>
    );
}
