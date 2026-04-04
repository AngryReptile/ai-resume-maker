import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe, GripVertical, Plus, Trash2, Terminal } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';

export default function TechMinimalMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
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
            <Reorder.Item 
                key={id} 
                value={id}
                dragListener={false}
                dragControls={dragControls}
                className="mb-8 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100 paged-block"
            >
                <div 
                    className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <GripVertical className="h-4 w-4 text-emerald-300" />
                </div>
                <h3 className="text-emerald-700 font-bold mb-2 uppercase text-xs tracking-widest">
                    ## {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content here..."
                    multiline
                    className="text-sky-800 leading-relaxed font-mono"
                />
            </Reorder.Item>
        );
    };

    const renderSummary = () => (
        <Reorder.Item 
            key="summary" 
            value="summary"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="text-emerald-700 font-bold mb-2 uppercase text-xs tracking-widest">## {sectionLabels.summary}</h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Brief summary..."
                multiline
                label="summary"
                className="text-sky-800 leading-relaxed font-mono"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item 
            key="experience" 
            value="experience"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="text-emerald-700 font-bold mb-4 uppercase text-xs tracking-widest">## {sectionLabels.experience}</h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-6">
                {data.experience.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group/exp paged-block">
                        {/* Sub Drag Handle */}
                        <div className="absolute -left-6 top-1 opacity-0 group-hover/exp:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-emerald-200">
                            <GripVertical className="h-3 w-3" />
                        </div>

                        <div className="absolute -right-10 top-0 opacity-0 group-hover/exp:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeExperience(exp.id)}
                                className="p-1 text-sky-400 hover:text-red-500 bg-slate-50 border border-sky-100"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>

                        <div className="flex justify-between items-start mb-2 border-b border-dashed border-sky-300 pb-1">
                            <div className="flex-1 flex flex-wrap items-baseline gap-2">
                                <EditableText
                                    value={exp.company}
                                    onSave={(val) => updateField('experience', 'company', val, exp.id)}
                                    placeholder="Company"
                                    className="font-bold text-sky-900"
                                />
                                <span className="text-sky-400">@</span>
                                <EditableText
                                    value={exp.position}
                                    onSave={(val) => updateField('experience', 'position', val, exp.id)}
                                    placeholder="Position"
                                    className="text-sky-600"
                                />
                            </div>
                            <div className="flex items-center gap-1 text-sky-500 whitespace-nowrap ml-4 italic">
                                <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                <span>:</span>
                                <EditableText value={exp.current ? 'HEAD' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                            </div>
                        </div>
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Impact points..."
                            multiline
                            label="experience"
                            className="text-sky-700 pl-4 border-l-2 border-emerald-500/30 font-mono"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button 
                onClick={() => useResumeStore.getState().addExperience()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-emerald-200 text-[10px] font-bold text-emerald-400 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> git push experience
            </button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item 
            key="education" 
            value="education"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="text-emerald-700 font-bold mb-4 uppercase text-xs tracking-widest">## {sectionLabels.education}</h3>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-4">
                {data.education.map((edu) => (
                    <Reorder.Item key={edu.id} value={edu} className="relative group/edu flex justify-between items-start">
                        {/* Sub Drag Handle */}
                        <div className="absolute -left-6 top-1 opacity-0 group-hover/edu:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-emerald-200">
                            <GripVertical className="h-3 w-3" />
                        </div>

                        <div className="absolute -right-10 top-0 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeEducation(edu.id)}
                                className="p-1 text-sky-400 hover:text-red-500 bg-slate-50 border border-sky-100"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <EditableText value={edu.school} onSave={(val) => updateField('education', 'school', val, edu.id)} placeholder="University" className="font-bold text-sky-900" />
                            <EditableText value={edu.degree} onSave={(val) => updateField('education', 'degree', val, edu.id)} placeholder="Degree" className="text-sky-600 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-1 text-sky-500 italic mt-1 ml-4">
                            <EditableText value={edu.startDate} onSave={(val) => updateField('education', 'startDate', val, edu.id)} placeholder="Start" />
                            <span>:</span>
                            <EditableText value={edu.endDate} onSave={(val) => updateField('education', 'endDate', val, edu.id)} placeholder="End" />
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button 
                onClick={() => useResumeStore.getState().addEducation()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-emerald-200 text-[10px] font-bold text-emerald-400 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> git push education
            </button>
        </Reorder.Item>
    );


    const renderSkills = () => (
        <Reorder.Item 
            key="skills" 
            value="skills"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="text-emerald-700 font-bold mb-2 uppercase text-xs tracking-widest">## {sectionLabels.skills}</h3>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="flex flex-wrap gap-2 text-sky-800 font-mono">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill flex items-center gap-1.5 paged-block"
                    >
                        <span className="text-emerald-500 font-bold">$</span>
                        <EditableText
                            value={skill.name}
                            onSave={(val) => updateField('skills', 'name', val, skill.id)}
                            placeholder="Skill"
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
                className="mt-4 flex items-center justify-center gap-2 w-full py-1.5 rounded border border-dashed border-emerald-100 text-[10px] font-bold text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> git add --all skills
            </button>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item 
            key="projects" 
            value="projects"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="text-emerald-700 font-bold mb-2 uppercase text-xs tracking-widest">## {sectionLabels.projects}</h3>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-6">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj paged-block"
                    >
                        <div className="absolute -right-10 top-0 opacity-0 group-hover/proj:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeProject(proj.id)}
                                className="p-1 text-sky-400 hover:text-red-500 bg-slate-50 border border-sky-100"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-emerald-500 font-bold">&gt;</span>
                            <EditableText
                                value={proj.title}
                                onSave={(val) => updateField('projects', 'title', val, proj.id)}
                                placeholder="Repo name"
                                className="font-bold text-sky-900 uppercase"
                            />
                        </div>
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="System specifications and results..."
                            multiline
                            className="text-sky-800 leading-relaxed font-mono pl-4 border-l-2 border-emerald-500/10"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-emerald-200 text-[10px] font-bold text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> git checkout -b project
            </button>
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item 
            key="languages" 
            value="languages"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="text-emerald-700 font-bold mb-2 uppercase text-xs tracking-widest">## {sectionLabels.languages}</h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages..."
                label="languages"
                className="text-sky-800 font-mono"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item 
            key="interests" 
            value="interests"
            dragListener={false}
            dragControls={dragControls}
            className="mb-0 group/section relative p-2 -m-2 rounded hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-emerald-300" />
            </div>
            <h3 className="text-emerald-700 font-bold mb-2 uppercase text-xs tracking-widest">## {sectionLabels.interests}</h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Interests..."
                label="interests"
                className="text-sky-800 font-mono"
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
        <div className="w-full bg-slate-50 text-sky-900 p-12 sm:p-16 font-mono text-sm leading-relaxed border-t-[12px] border-emerald-600">
            {/* Header */}
            <header className="mb-12 border-b-2 border-emerald-100 pb-8">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Terminal className="h-5 w-5" />
                    <span className="text-xs font-bold font-mono">./resume --init</span>
                </div>
                <EditableText
                    value={data.personalInfo.fullName}
                    onSave={(val) => updateField('personalInfo', 'fullName', val)}
                    placeholder="YOUR NAME"
                    label="personalInfo"
                    className="text-4xl font-black tracking-tighter mb-1 uppercase"
                />
                <div className="flex items-center gap-2 text-lg text-emerald-700 font-bold mb-6">
                    <span className="text-sky-400">~/role/</span>
                    <EditableText
                        value={data.personalInfo.jobTitle}
                        onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                        placeholder="developer"
                        label="personalInfo"
                        className="text-emerald-700 lowercase"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sky-600 text-[12px]">
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">mail:</span>
                        <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="null" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">phone:</span>
                        <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="null" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">loc:</span>
                        <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="remote" />
                    </div>
                    {data.personalInfo.website && (
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-500 font-bold">web:</span>
                            <EditableText value={data.personalInfo.website} onSave={(val) => updateField('personalInfo', 'website', val)} placeholder="domain.com" />
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
            
            <footer className="mt-12 text-emerald-600/30 text-[10px] font-bold tracking-[.3em] uppercase">
                End of process [0.0ms]
            </footer>
        </div>
    );
}

