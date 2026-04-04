import { useResumeStore } from '@/store/useResumeStore';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

export default function AcademicCV({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const updateField = useResumeStore((state) => state.updateField);
    const visibleSections = useResumeStore((state) => state.visibleSections);
    const sectionOrder = useResumeStore((state) => state.sectionOrder);
    const setSectionOrder = useResumeStore((state) => state.setSectionOrder);
    const sectionLabels = useResumeStore((state) => state.sectionLabels);
    const customSections = useResumeStore((state) => state.customSections);
    const updateCustomSection = useResumeStore((state) => state.updateCustomSection);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;
    const dragControls = useDragControls();
    
    // Filter section order to ensure Reorder.Group only sees what it manages
    const visibleSectionOrder = sectionOrder.filter(id => visibleSections.includes(id));

    const renderCustomSection = (id: string) => {
        const section = customSections.find(s => s.id === id);
        if (!section) return null;

        return (
            <Reorder.Item key={id} value={id} dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
                 <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                    <GripVertical className="h-4 w-4 text-zinc-300" />
                </div>
                <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-4">
                    {sectionLabels[id] || section.title}
                </h2>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content..."
                    multiline
                    className="text-[11pt] leading-relaxed text-justify"
                />
            </Reorder.Item>
        );
    };

    const renderSummary = () => (
        <Reorder.Item key="summary" value="summary" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-zinc-300" />
            </div>
            <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-4">
                {sectionLabels.summary}
            </h2>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Briefly describe your academic focus and research interests..."
                multiline
                label="summary"
                className="text-[11pt] leading-relaxed text-justify"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item key="experience" value="experience" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-zinc-300" />
            </div>
            <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-6">
                {sectionLabels.experience}
            </h2>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-8">
                {data.experience.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group/exp paged-block">
                        <div className="absolute -right-10 top-0 opacity-0 group-hover/exp:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeExperience(exp.id)} className="p-1 text-zinc-400 hover:text-red-500 rounded border border-zinc-100 bg-white"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex justify-between font-bold mb-1">
                            <EditableText value={exp.company} onSave={(val) => updateField('experience', 'company', val, exp.id)} placeholder="Organization" className="text-base" />
                            <div className="flex items-center gap-1 text-[11pt] font-normal">
                                <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                <span>–</span>
                                <EditableText value={exp.current ? 'Present' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                            </div>
                        </div>
                        <EditableText value={exp.position} onSave={(val) => updateField('experience', 'position', val, exp.id)} placeholder="Role Title" className="italic mb-2 block" />
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Research details, publications, or teaching responsibilities..."
                            multiline
                            label="experience"
                            className="text-[11pt] leading-relaxed"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button onClick={() => useResumeStore.getState().addExperience()} className="mt-8 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-zinc-200 text-xs font-bold text-zinc-400 hover:text-zinc-800 transition-all opacity-0 group-hover/section:opacity-100"><Plus className="h-4 w-4" /> Add Experience Entry</button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item key="education" value="education" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-zinc-300" />
            </div>
            <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-6">
                {sectionLabels.education}
            </h2>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-6">
                {data.education.map((edu) => (
                    <Reorder.Item key={edu.id} value={edu} className="relative group/edu">
                         <div className="absolute -right-10 top-0 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeEducation(edu.id)} className="p-1 text-zinc-400 hover:text-red-500 rounded border border-zinc-100 bg-white"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex justify-between font-bold mb-1">
                            <EditableText value={edu.school} onSave={(val) => updateField('education', 'school', val, edu.id)} placeholder="University" className="text-base" />
                            <div className="flex items-center gap-1 text-[11pt] font-normal">
                                <EditableText value={edu.startDate} onSave={(val) => updateField('education', 'startDate', val, edu.id)} placeholder="Start" />
                                <span>–</span>
                                <EditableText value={edu.endDate} onSave={(val) => updateField('education', 'endDate', val, edu.id)} placeholder="End" />
                            </div>
                        </div>
                        <EditableText value={edu.degree} onSave={(val) => updateField('education', 'degree', val, edu.id)} placeholder="Degree & Major" className="italic block" />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button onClick={() => useResumeStore.getState().addEducation()} className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-zinc-200 text-xs font-bold text-zinc-400 hover:text-zinc-800 transition-all opacity-0 group-hover/section:opacity-100"><Plus className="h-4 w-4" /> Add Education Entry</button>
        </Reorder.Item>
    );

    const renderSkills = () => (
        <Reorder.Item key="skills" value="skills" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-zinc-300" />
            </div>
            <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-4 text-left">
                {sectionLabels.skills}
            </h2>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="space-y-2">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill flex items-center justify-between paged-block"
                    >
                        <EditableText
                            value={skill.name}
                            onSave={(val) => updateField('skills', 'name', val, skill.id)}
                            placeholder="Skill"
                            className="text-[11pt] leading-relaxed"
                        />
                        <button 
                            onClick={() => useResumeStore.getState().removeSkill(skill.id)}
                            className="opacity-0 group-hover/skill:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4 text-zinc-300 hover:text-red-500" />
                        </button>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addSkill()}
                className="mt-4 flex items-center justify-center gap-2 w-full py-1 border border-dashed border-zinc-100 text-[10px] font-bold text-zinc-400 hover:text-zinc-800 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> Add Skill Entry
            </button>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item key="projects" value="projects" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-zinc-300" />
            </div>
            <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-6">
                {sectionLabels.projects}
            </h2>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-8">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj paged-block"
                    >
                        <div className="absolute -right-10 top-0 opacity-0 group-hover/proj:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeProject(proj.id)}
                                className="p-1 text-zinc-400 hover:text-red-500 rounded border border-zinc-100 bg-white"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <EditableText
                            value={proj.title}
                            onSave={(val) => updateField('projects', 'title', val, proj.id)}
                            placeholder="Project or Publication Title"
                            className="text-[11pt] font-bold mb-1 block"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Details of publications, conferences, or specialized projects..."
                            multiline
                            className="text-[11pt] leading-relaxed text-justify"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-8 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-zinc-200 text-xs font-bold text-zinc-400 hover:text-zinc-800 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Project/Publication Entry
            </button>
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item key="languages" value="languages" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-4">
                {sectionLabels.languages}
            </h2>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages and proficiency..."
                className="text-[11pt] leading-relaxed"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item key="interests" value="interests" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-900 pb-1 mb-4">
                {sectionLabels.interests}
            </h2>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Personal interests..."
                className="text-[11pt] leading-relaxed"
            />
        </Reorder.Item>
    );

    const sectionRenderers: Record<string, () => any> = {
        summary: renderSummary,
        experience: renderExperience,
        education: renderEducation,
        skills: renderSkills,
        projects: renderProjects,
        languages: renderLanguages,
        interests: renderInterests,
    };

    const renderSection = (id: string) => {
        if (id.startsWith('custom-')) return renderCustomSection(id);
        return sectionRenderers[id]?.();
    };

    return (
        <div className="w-full bg-white text-zinc-950 p-16 sm:p-24 font-serif leading-relaxed shadow-inner">
            {/* Header */}
            <header className="text-center mb-16">
                <EditableText
                    value={data.personalInfo.fullName}
                    onSave={(val) => updateField('personalInfo', 'fullName', val)}
                    placeholder="FULL NAME"
                    label="personalInfo"
                    className="text-3xl font-bold uppercase tracking-widest mb-4"
                />
                
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11pt] font-medium text-zinc-700">
                    <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="Location" />
                    <span className="text-zinc-300">•</span>
                    <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="Email" />
                    <span className="text-zinc-300">•</span>
                    <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="Phone" />
                    {data.personalInfo.website && (
                        <>
                            <span className="text-zinc-300">•</span>
                            <EditableText value={data.personalInfo.website} onSave={(val) => updateField('personalInfo', 'website', val)} placeholder="Website" />
                        </>
                    )}
                </div>
            </header>

            <Reorder.Group 
                axis="y" 
                values={visibleSectionOrder} 
                onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => !visibleSections.includes(id))])}
                className="space-y-2"
            >
                {visibleSectionOrder.map(id => renderSection(id))}
            </Reorder.Group>
        </div>
    );
}
