import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, ExternalLink, GripVertical, Plus, Trash2 } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';
import EntryToolbar from '../EntryToolbar';
import { useState } from 'react';

export default function InternshipPlacementMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const updateField = useResumeStore((state) => state.updateField);
    const visibleSections = useResumeStore((state) => state.visibleSections);
    const sectionOrder = useResumeStore((state) => state.sectionOrder);
    const sectionLabels = useResumeStore((state) => state.sectionLabels);
    const customSections = useResumeStore((state) => state.customSections);
    const updateCustomSection = useResumeStore((state) => state.updateCustomSection);
    const setSectionOrder = useResumeStore((state) => state.setSectionOrder);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;
    const dragControls = useDragControls();
    const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

    // Filter section order to ensure Reorder.Group only sees what it manages
    const visibleSectionOrder = sectionOrder.filter(id => visibleSections.includes(id));

    const renderCustomSection = (id: string) => {
        const section = customSections.find(s => s.id === id);
        if (!section) return null;

        return (
            <Reorder.Item key={id} value={id} dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
                 <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                    <GripVertical className="h-4 w-4 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                    <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content here..."
                    multiline
                    className="text-sm text-slate-800 leading-relaxed font-medium"
                />
            </Reorder.Item>
        );
    };

    const renderSummary = () => (
        <Reorder.Item key="summary" value="summary" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> {sectionLabels.summary}
            </h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Your career objective..."
                multiline
                label="summary"
                className="text-sm text-slate-800 leading-relaxed italic border-l-4 border-slate-900 pl-4 py-1 bg-slate-50"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item key="experience" value="experience" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> {sectionLabels.experience}
            </h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-6">
                {data.experience.map((exp) => (
                    <Reorder.Item 
                        key={exp.id} 
                        value={exp} 
                        className="relative group/exp paged-block hover:bg-slate-50 p-2 -m-2 rounded transition-all"
                        onMouseEnter={() => setHoveredEntry(exp.id)}
                        onMouseLeave={() => setHoveredEntry(null)}
                    >
                        <EntryToolbar 
                            isVisible={hoveredEntry === exp.id}
                            onDelete={() => useResumeStore.getState().removeExperience(exp.id)}
                        />
                        <div className="grid grid-cols-[1fr_auto] items-baseline mb-1">
                            <EditableText value={exp.position} onSave={(val) => updateField('experience', 'position', val, exp.id)} placeholder="Position Title" className="font-bold text-slate-900 text-base" />
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded whitespace-nowrap ml-4">
                                <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                <span>–</span>
                                <EditableText value={exp.current ? 'Present' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                            </div>
                        </div>
                        <EditableText value={exp.company} onSave={(val) => updateField('experience', 'company', val, exp.id)} placeholder="Organization" className="text-sm font-bold text-slate-700 mb-2 block" />
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Describe your role and impact..."
                            multiline
                            label="experience"
                            className="text-sm text-slate-700 leading-relaxed font-medium"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button onClick={() => useResumeStore.getState().addExperience()} className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-slate-200 text-xs font-bold text-slate-400 hover:text-slate-800 transition-all opacity-0 group-hover/section:opacity-100"><Plus className="h-4 w-4" /> Add Experience</button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item key="education" value="education" dragListener={false} dragControls={dragControls} className="group/section relative py-4">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> {sectionLabels.education}
            </h3>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-4">
                {data.education.map((edu) => (
                    <Reorder.Item key={edu.id} value={edu} className="relative group/edu">
                         <div className="absolute -right-10 top-0 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeEducation(edu.id)} className="p-1 text-slate-300 hover:text-red-500 rounded border border-slate-100 bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] items-start">
                            <div>
                                <EditableText value={edu.school} onSave={(val) => updateField('education', 'school', val, edu.id)} placeholder="University" className="font-bold text-slate-900 text-base" />
                                <EditableText value={edu.degree} onSave={(val) => updateField('education', 'degree', val, edu.id)} placeholder="Degree & Branch" className="text-slate-700 italic text-sm block" />
                            </div>
                            <div className="flex items-center gap-1 text-right text-sm font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded ml-4 whitespace-nowrap">
                                <EditableText value={edu.startDate} onSave={(val) => updateField('education', 'startDate', val, edu.id)} placeholder="Start" />
                                <span>–</span>
                                <EditableText value={edu.endDate} onSave={(val) => updateField('education', 'endDate', val, edu.id)} placeholder="End" />
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button onClick={() => useResumeStore.getState().addEducation()} className="mt-4 text-[10px] font-bold text-slate-400 hover:text-slate-800 transition-colors">+ NEW ENTRY</button>
        </Reorder.Item>
    );

    const renderSkills = () => (
        <Reorder.Item key="skills" value="skills" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> {sectionLabels.skills}
            </h3>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill px-3 py-1 bg-slate-50 border border-slate-200 rounded flex items-center gap-2 hover:bg-slate-100 transition-all paged-block"
                    >
                        <EditableText
                            value={skill.name}
                            onSave={(val) => updateField('skills', 'name', val, skill.id)}
                            placeholder="Skill"
                            className="text-sm font-bold text-slate-800 font-mono"
                        />
                        <button 
                            onClick={() => useResumeStore.getState().removeSkill(skill.id)}
                            className="opacity-0 group-hover/skill:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-3 w-3 text-slate-400 hover:text-red-500" />
                        </button>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addSkill()}
                className="mt-4 flex items-center justify-center gap-2 w-full py-1.5 rounded-md border border-dashed border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> Add Skill
            </button>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item key="projects" value="projects" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-4 flex items-center">
                <span className="bg-slate-900 w-2 h-2 rounded-full mr-2"></span> {sectionLabels.projects}
            </h3>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-6">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj paged-block hover:bg-slate-50 p-2 -m-2 rounded transition-all"
                        onMouseEnter={() => setHoveredEntry(proj.id)}
                        onMouseLeave={() => setHoveredEntry(null)}
                    >
                        <EntryToolbar 
                            isVisible={hoveredEntry === proj.id}
                            onDelete={() => useResumeStore.getState().removeProject(proj.id)}
                        />
                        <EditableText
                            value={proj.title}
                            onSave={(val) => updateField('projects', 'title', val, proj.id)}
                            placeholder="Project Title"
                            className="text-base font-bold text-slate-900 mb-1"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Describe your project and results..."
                            multiline
                            className="text-sm text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-200"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-slate-200 text-xs font-bold text-slate-400 hover:text-slate-800 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Project
            </button>
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item key="languages" value="languages" dragListener={false} dragControls={dragControls} className="group/section relative py-2 paged-block">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{sectionLabels.languages}</h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages spoken..."
                className="text-sm text-slate-700 font-medium"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item key="interests" value="interests" dragListener={false} dragControls={dragControls} className="group/section relative py-2 paged-block">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{sectionLabels.interests}</h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Hobbies and interests..."
                className="text-sm text-slate-700 font-medium"
            />
        </Reorder.Item>
    );

    const sectionRenderers: Record<string, () => any> = {
        summary: renderSummary,
        education: renderEducation,
        skills: renderSkills,
        projects: renderProjects,
        experience: renderExperience,
        languages: renderLanguages,
        interests: renderInterests,
    };

    const renderSection = (id: string) => {
        if (id.startsWith('custom-')) return renderCustomSection(id);
        return sectionRenderers[id]?.();
    };

    return (
        <div className="w-full bg-slate-50 text-sky-900 font-sans p-10 sm:p-16 min-h-full">
            {/* Header */}
            <header className="mb-12 border-b-2 border-slate-900 pb-8 text-center">
                <EditableText
                    value={data.personalInfo.fullName}
                    onSave={(val) => updateField('personalInfo', 'fullName', val)}
                    placeholder="STUDENT NAME"
                    label="personalInfo"
                    className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2"
                />
                <EditableText
                    value={data.personalInfo.jobTitle}
                    onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                    placeholder="Current Major / Role"
                    label="personalInfo"
                    className="text-lg font-semibold text-slate-700 uppercase tracking-widest mb-6 block"
                />

                <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                        <Mail className="w-3.5 h-3.5" />
                        <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="Email" />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                        <Phone className="w-3.5 h-3.5" />
                        <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="Phone" />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                        <MapPin className="w-3.5 h-3.5" />
                        <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="Location" />
                    </div>
                    {data.personalInfo.website && (
                         <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                            <ExternalLink className="w-3.5 h-3.5" />
                            <EditableText value={data.personalInfo.website} onSave={(val) => updateField('personalInfo', 'website', val)} placeholder="Website" />
                        </div>
                    )}
                </div>
            </header>

            <Reorder.Group 
                axis="y" 
                values={visibleSectionOrder} 
                onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => !visibleSections.includes(id))])}
                className="space-y-4"
            >
                {visibleSectionOrder.map(id => renderSection(id))}
            </Reorder.Group>
        </div>
    );
}
