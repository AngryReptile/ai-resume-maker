import { useResumeStore } from '@/store/useResumeStore';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';

export default function BoldHeaderMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
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
                    <GripVertical className="h-4 w-4 text-sky-300" />
                </div>
                <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-3">
                    {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content..."
                    multiline
                    className="text-base text-sky-700 leading-relaxed font-medium"
                />
            </Reorder.Item>
        );
    };

    const renderSummary = () => (
        <Reorder.Item key="summary" value="summary" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-3">
                {sectionLabels.summary}
            </h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Professional summary..."
                multiline
                label="summary"
                className="text-base text-sky-700 leading-relaxed font-medium"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item key="experience" value="experience" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-6">
                {sectionLabels.experience}
            </h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-8">
                {data.experience.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group/exp paged-block">
                        <div className="absolute -right-10 top-0 opacity-0 group-hover/exp:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeExperience(exp.id)} className="p-1 text-sky-300 hover:text-red-500 rounded border border-sky-100 bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <EditableText value={exp.position} onSave={(val) => updateField('experience', 'position', val, exp.id)} placeholder="Position" className="text-xl font-bold text-sky-900" />
                            <div className="flex items-center gap-1 text-sm font-bold text-sky-500 ml-4 whitespace-nowrap">
                                <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                <span>–</span>
                                <EditableText value={exp.current ? 'Present' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                            </div>
                        </div>
                        <EditableText value={exp.company} onSave={(val) => updateField('experience', 'company', val, exp.id)} placeholder="Company" className="text-base font-semibold text-blue-600 mb-3 block" />
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Description..."
                            multiline
                            label="experience"
                            className="text-base text-sky-700 leading-relaxed"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button onClick={() => useResumeStore.getState().addExperience()} className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-sky-200 text-xs font-bold text-sky-400 hover:text-sky-800 transition-all opacity-0 group-hover/section:opacity-100"><Plus className="h-4 w-4" /> Add Experience</button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item key="education" value="education" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-6">
                {sectionLabels.education}
            </h3>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.education.map((edu) => (
                    <div key={edu.id} className="relative group/edu bg-sky-50 p-4 rounded-lg border border-sky-100">
                         <div className="absolute -right-2 -top-2 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeEducation(edu.id)} className="p-1 text-sky-400 hover:text-red-500 rounded-full border border-sky-100 bg-slate-50"><Trash2 className="h-3 w-3" /></button>
                        </div>
                        <EditableText value={edu.degree} onSave={(val) => updateField('education', 'degree', val, edu.id)} placeholder="Degree" className="font-bold text-sky-900 mb-1 block" />
                        <EditableText value={edu.school} onSave={(val) => updateField('education', 'school', val, edu.id)} placeholder="School" className="text-sm font-medium text-sky-600 block" />
                        <div className="flex items-center gap-1 text-xs font-bold text-sky-400 mt-2">
                            <EditableText value={edu.startDate} onSave={(val) => updateField('education', 'startDate', val, edu.id)} placeholder="Start" />
                            <span>–</span>
                            <EditableText value={edu.endDate} onSave={(val) => updateField('education', 'endDate', val, edu.id)} placeholder="End" />
                        </div>
                    </div>
                ))}
            </Reorder.Group>
            <button onClick={() => useResumeStore.getState().addEducation()} className="mt-4 text-[10px] font-bold text-sky-400 hover:text-sky-600 transition-colors uppercase">+ NEW ENTRY</button>
        </Reorder.Item>
    );

    const renderSkills = () => (
        <Reorder.Item key="skills" value="skills" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-6">
                {sectionLabels.skills}
            </h3>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill flex items-center gap-2 bg-sky-100 px-3 py-1 rounded-full paged-block cursor-default"
                    >
                        <EditableText
                            value={skill.name}
                            onSave={(val) => updateField('skills', 'name', val, skill.id)}
                            placeholder="Skill"
                            className="text-sm font-bold text-sky-800"
                        />
                        <button 
                            onClick={() => useResumeStore.getState().removeSkill(skill.id)}
                            className="opacity-0 group-hover/skill:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-3 w-3 text-sky-400 hover:text-red-500" />
                        </button>
                    </Reorder.Item>
                ))}
                <button 
                    onClick={() => useResumeStore.getState().addSkill()}
                    className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-dashed border-sky-200 text-sky-400 hover:text-sky-600 hover:border-sky-400 transition-all ml-1"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </Reorder.Group>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item key="projects" value="projects" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-6">
                {sectionLabels.projects}
            </h3>
            
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
                                className="p-1 text-sky-300 hover:text-red-500 rounded border border-sky-100 bg-slate-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <EditableText
                            value={proj.title}
                            onSave={(val) => updateField('projects', 'title', val, proj.id)}
                            placeholder="Project Title"
                            className="text-xl font-bold text-sky-900 mb-1 block tracking-tight"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Projects..."
                            multiline
                            className="text-base text-sky-700 leading-relaxed"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-sky-200 text-xs font-bold text-sky-400 hover:text-sky-800 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Project
            </button>
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item key="languages" value="languages" dragListener={false} dragControls={dragControls} className="group/section relative py-2 paged-block">
            <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-2">{sectionLabels.languages}</h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages..."
                className="text-base text-sky-700 font-medium"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item key="interests" value="interests" dragListener={false} dragControls={dragControls} className="group/section relative py-2 paged-block">
            <h3 className="text-lg font-bold text-black border-l-4 border-sky-900 pl-3 mb-2">{sectionLabels.interests}</h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Interests..."
                className="text-base text-sky-700 font-medium"
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
        <div className="w-full bg-slate-50 text-sky-900 font-sans min-h-full flex flex-col">
            {/* Dark Header Block */}
            <header className="bg-sky-900 text-white p-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 text-center sm:text-left print:bg-sky-900 print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <div className="flex-1 w-full sm:w-auto">
                    <EditableText
                        value={data.personalInfo.fullName}
                        onSave={(val) => updateField('personalInfo', 'fullName', val)}
                        placeholder="YOUR NAME"
                        className="text-5xl font-black tracking-tight mb-2 text-white block"
                    />
                    <EditableText
                        value={data.personalInfo.jobTitle}
                        onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                        placeholder="Profession"
                        className="text-xl text-sky-400 font-medium block"
                    />
                </div>
                <div className="flex flex-col gap-1 text-sm text-sky-300 font-medium text-right items-center sm:items-end w-full sm:w-auto">
                    <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="Email" className="text-sky-300" />
                    <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="Phone" className="text-sky-300" />
                    <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="Location" className="text-sky-300" />
                </div>
            </header>

            {/* Layout Box */}
            <div className="p-10 flex-1">
                <Reorder.Group 
                    axis="y" 
                    values={visibleSectionOrder} 
                    onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => !visibleSections.includes(id))])}
                    className="space-y-4"
                >
                    {visibleSectionOrder.map(id => renderSection(id))}
                </Reorder.Group>
            </div>
        </div>
    );
}
