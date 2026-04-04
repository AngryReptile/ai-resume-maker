import { useResumeStore } from '@/store/useResumeStore';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

export default function SplitColumnMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const updateField = useResumeStore((state) => state.updateField);
    const visibleSections = useResumeStore((state) => state.visibleSections);
    const sectionOrder = useResumeStore((state) => state.sectionOrder);
    const sidebarSections = useResumeStore((state) => state.sidebarSections);
    const setSectionOrder = useResumeStore((state) => state.setSectionOrder);
    const sectionLabels = useResumeStore((state) => state.sectionLabels);
    const customSections = useResumeStore((state) => state.customSections);
    const updateCustomSection = useResumeStore((state) => state.updateCustomSection);
    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;
    const dragControls = useDragControls();
    
    // Filter section order for each column to ensure Reorder.Group only sees what it manages
    const mainSections = sectionOrder.filter(id => !sidebarSections.includes(id) && visibleSections.includes(id));
    const sideSections = sectionOrder.filter(id => sidebarSections.includes(id) && visibleSections.includes(id));

    const renderCustomSection = (id: string) => {
        const section = customSections.find(s => s.id === id);
        if (!section) return null;

        return (
            <Reorder.Item key={id} value={id} dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
                 <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                    <GripVertical className="h-4 w-4 text-sky-300" />
                </div>
                <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-4 border-b border-sky-200 pb-2">
                    {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content..."
                    multiline
                    className="text-sm leading-relaxed text-sky-700"
                />
            </Reorder.Item>
        );
    };

    const renderSummary = () => (
        <Reorder.Item key="summary" value="summary" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-4 border-b border-sky-200 pb-2">
                {sectionLabels.summary}
            </h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Professional summary..."
                multiline
                label="summary"
                className="text-sm leading-relaxed text-sky-700"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item key="experience" value="experience" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-6 border-b border-sky-200 pb-2">
                {sectionLabels.experience}
            </h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-8">
                {data.experience.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group/exp paged-block">
                        <div className="absolute -right-10 top-0 opacity-0 group-hover/exp:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeExperience(exp.id)} className="p-1 text-sky-300 hover:text-red-500 rounded border border-sky-100 bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <EditableText value={exp.position} onSave={(val) => updateField('experience', 'position', val, exp.id)} placeholder="Position" className="text-lg font-bold text-black leading-tight" />
                            <span className="text-xs font-bold text-emerald-600 ml-4 whitespace-nowrap bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                                <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                <span>–</span>
                                <EditableText value={exp.current ? 'Present' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                            </span>
                        </div>
                        <EditableText value={exp.company} onSave={(val) => updateField('experience', 'company', val, exp.id)} placeholder="Company" className="text-sm font-semibold text-sky-500 mb-3 block" />
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Description..."
                            multiline
                            label="experience"
                            className="text-sm text-sky-700 leading-relaxed"
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
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-4 border-b border-sky-200 pb-2">
                {sectionLabels.education}
            </h3>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-4">
                {data.education.map((edu) => (
                    <div key={edu.id} className="relative group/edu">
                         <div className="absolute -right-6 top-0 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeEducation(edu.id)} className="text-sky-300 hover:text-red-400"><Trash2 className="h-3 w-3" /></button>
                        </div>
                        <EditableText value={edu.degree} onSave={(val) => updateField('education', 'degree', val, edu.id)} placeholder="Degree" className="font-bold text-sky-900 text-sm block" />
                        <EditableText value={edu.school} onSave={(val) => updateField('education', 'school', val, edu.id)} placeholder="School" className="text-sky-600 text-xs mt-1 block" />
                        <div className="text-sky-400 text-xs mt-1 font-medium italic flex items-center gap-1">
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
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-4 border-b border-sky-200 pb-2">
                {sectionLabels.skills}
            </h3>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="space-y-4">
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
                            className="text-sm text-sky-600 leading-relaxed font-medium"
                        />
                        <button 
                            onClick={() => useResumeStore.getState().removeSkill(skill.id)}
                            className="opacity-0 group-hover/skill:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-3 w-3 text-sky-300 hover:text-red-500" />
                        </button>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addSkill()}
                className="mt-4 text-[10px] font-bold text-emerald-400 hover:text-emerald-600 transition-colors uppercase"
            >
                + ADD SKILL
            </button>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item key="projects" value="projects" dragListener={false} dragControls={dragControls} className="group/section relative py-4 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-6 border-b border-sky-200 pb-2">
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
                            className="text-lg font-bold text-black mb-1 block uppercase tracking-tight"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Key projects..."
                            multiline
                            className="text-sm leading-relaxed text-sky-700"
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
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-2">{sectionLabels.languages}</h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages..."
                className="text-sm text-sky-600 font-medium"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item key="interests" value="interests" dragListener={false} dragControls={dragControls} className="group/section relative py-2 paged-block">
            <h3 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-2">{sectionLabels.interests}</h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Interests..."
                className="text-sm text-sky-600 font-medium"
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

    const renderSection = (id: string, isSidebar: boolean = false) => {
        if (id.startsWith('custom-')) return renderCustomSection(id);
        return sectionRenderers[id]?.();
    };

    return (
        <div className="w-full flex min-h-full bg-slate-50 text-sky-800 font-sans shadow-inner">
            {/* Left Column (1/3) */}
            <div className="w-1/3 p-8 border-r-2 border-sky-100 flex flex-col gap-8 bg-sky-50/50">
                <header>
                    <EditableText
                        value={data.personalInfo.fullName}
                        onSave={(val) => updateField('personalInfo', 'fullName', val)}
                        placeholder="NAME"
                        className="text-4xl font-black text-black tracking-tighter leading-none mb-3 break-words uppercase"
                    />
                    <EditableText
                        value={data.personalInfo.jobTitle}
                        onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                        placeholder="Profession"
                        className="text-lg text-emerald-600 font-bold mb-6 leading-snug block"
                    />

                    <div className="space-y-4 text-sm font-medium text-sky-600">
                        <div>
                            <div className="text-xs text-sky-400 uppercase tracking-wider mb-0.5 font-bold">Email</div>
                            <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="Email" />
                        </div>
                        <div>
                            <div className="text-xs text-sky-400 uppercase tracking-wider mb-0.5 font-bold">Phone</div>
                            <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="Phone" />
                        </div>
                        <div>
                            <div className="text-xs text-sky-400 uppercase tracking-wider mb-0.5 font-bold">Location</div>
                            <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="Location" />
                        </div>
                    </div>
                </header>

                <div className="space-y-4">
                    <Reorder.Group 
                        axis="y" 
                        values={sideSections} 
                        onReorder={(newOrder) => setSectionOrder([...sectionOrder.filter(id => !sidebarSections.includes(id) || !visibleSections.includes(id)), ...newOrder])}
                        className="space-y-6"
                    >
                        {sideSections.map(id => renderSection(id, true))}
                    </Reorder.Group>
                </div>
            </div>

            {/* Right Column (2/3) */}
            <div className="w-2/3 p-8 p-12">
                <Reorder.Group 
                    axis="y" 
                    values={mainSections} 
                    onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => sidebarSections.includes(id) || !visibleSections.includes(id))])}
                    className="space-y-4"
                >
                    {mainSections.map(id => renderSection(id))}
                </Reorder.Group>
            </div>
        </div>
    );
}
