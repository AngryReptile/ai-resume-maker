import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe, GripVertical, Plus, Trash2, Sparkles, Award } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';

export default function CreativeAccentMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
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
    const sideSections = visibleSectionOrder.filter(id => ['skills', 'education'].includes(id));

    const renderCustomSection = (id: string, isSidebar: boolean = false) => {
        const section = customSections.find(s => s.id === id);
        if (!section) return null;

        if (isSidebar) {
            return (
                <Reorder.Item key={id} value={id} dragListener={false} dragControls={dragControls} className="group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 paged-block">
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1" onPointerDown={(e) => dragControls.start(e)}>
                        <GripVertical className="h-4 w-4 text-blue-300" />
                    </div>
                    <h3 className="text-[10px] font-black text-blue-950 uppercase tracking-[0.3em] mb-5 border-b border-blue-200 pb-2">
                        {sectionLabels[id] || section.title}
                    </h3>
                    <EditableText
                        value={section.content}
                        onSave={(val) => updateCustomSection(id, { content: val })}
                        placeholder="Enter content..."
                        multiline
                        className="text-sm text-blue-900/80 leading-loose font-bold"
                    />
                </Reorder.Item>
            );
        }

        return (
            <Reorder.Item 
                key={id} 
                value={id}
                dragListener={false}
                dragControls={dragControls}
                className="mb-10 group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 paged-block"
            >
                <div 
                    className="absolute -left-8 top-6 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <GripVertical className="h-4 w-4 text-blue-300" />
                </div>
                <h3 className="text-xl font-black text-blue-950 mb-3 flex items-center gap-3">
                    {sectionLabels[id] || section.title}
                    <div className="flex-1 h-px bg-blue-100"></div>
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content..."
                    multiline
                    className="text-sm leading-relaxed text-sky-700 font-medium"
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
            className="mb-10 group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-6 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-blue-300" />
            </div>
            <h3 className="text-xl font-black text-blue-950 mb-3 flex items-center gap-3">
                {sectionLabels.summary}
                <div className="flex-1 h-px bg-blue-100"></div>
            </h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Creative professional with a passion for..."
                multiline
                label="summary"
                className="text-sm leading-relaxed text-sky-700 font-medium"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item 
            key="experience" 
            value="experience"
            dragListener={false}
            dragControls={dragControls}
            className="mb-10 group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-6 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-blue-300" />
            </div>
            <h3 className="text-xl font-black text-blue-950 mb-6 flex items-center gap-3">
                {sectionLabels.experience}
                <div className="flex-1 h-px bg-blue-100"></div>
            </h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-8">
                {data.experience.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group/exp paged-block">
                        {/* Sub Drag Handle */}
                        <div className="absolute -left-6 top-1 opacity-0 group-hover/exp:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-blue-200">
                            <GripVertical className="h-3 w-3" />
                        </div>

                        <div className="absolute -right-10 top-2 opacity-0 group-hover/exp:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeExperience(exp.id)}
                                className="p-1 text-sky-400 hover:text-red-500 bg-slate-50 border border-sky-100 rounded shadow-sm"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-blue-400 ring-4 ring-blue-50"></div>
                        <div className="pl-6 border-l-2 border-blue-50 pb-2">
                             <div className="flex items-center justify-between mt-1 mb-2">
                                <EditableText
                                    value={exp.position}
                                    onSave={(val) => updateField('experience', 'position', val, exp.id)}
                                    placeholder="Position"
                                    className="text-lg font-bold text-sky-900 leading-tight"
                                />
                                <div className="flex items-center gap-1 text-[10px] font-black text-blue-400 bg-blue-50/50 px-2 py-1 rounded-full whitespace-nowrap ml-4">
                                    <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                    <span>–</span>
                                    <EditableText value={exp.current ? 'Present' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                                </div>
                            </div>
                            <EditableText
                                value={exp.company}
                                onSave={(val) => updateField('experience', 'company', val, exp.id)}
                                placeholder="Company"
                                className="text-blue-600 font-bold text-sm mb-3 block"
                            />
                            <EditableText
                                value={exp.description}
                                onSave={(val) => updateField('experience', 'description', val, exp.id)}
                                placeholder="Accomplishments..."
                                multiline
                                label="experience"
                                className="text-sm text-sky-700 leading-relaxed font-medium"
                            />
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button 
                onClick={() => useResumeStore.getState().addExperience()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-blue-100 text-xs font-black text-blue-300 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> add_experience.deploy()
            </button>
        </Reorder.Item>
    );


    const renderSkills = () => (
        <Reorder.Item key="skills" value="skills" dragListener={false} dragControls={dragControls} className="group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 paged-block">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-blue-300" />
            </div>
            <h3 className="text-[10px] font-black text-blue-950 uppercase tracking-[0.3em] mb-5 border-b border-blue-200 pb-2">
                {sectionLabels.skills}
            </h3>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="space-y-4">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill paged-block"
                    >
                        <div className="flex items-center justify-between">
                            <EditableText
                                value={skill.name}
                                onSave={(val) => updateField('skills', 'name', val, skill.id)}
                                placeholder="Skill"
                                className="text-sm text-blue-900/80 leading-loose font-bold"
                            />
                            <button 
                                onClick={() => useResumeStore.getState().removeSkill(skill.id)}
                                className="opacity-0 group-hover/skill:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-3 w-3 text-blue-300 hover:text-red-500" />
                            </button>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addSkill()}
                className="mt-4 text-[10px] font-bold text-blue-400 hover:text-blue-600 transition-colors uppercase"
            >
                + ADD SKILL
            </button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item key="education" value="education" dragListener={false} dragControls={dragControls} className="group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 paged-block">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-blue-300" />
            </div>
            <h3 className="text-[10px] font-black text-blue-950 uppercase tracking-[0.3em] mb-5 border-b border-blue-200 pb-2">
                {sectionLabels.education}
            </h3>
            <div className="space-y-6">
                {data.education.map((edu) => (
                    <div key={edu.id} className="relative group/edu">
                        <div className="absolute -left-6 top-0 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeEducation(edu.id)} className="text-sky-300 hover:text-red-400"><Trash2 className="h-3 w-3" /></button>
                        </div>
                        <EditableText value={edu.degree} onSave={(val) => updateField('education', 'degree', val, edu.id)} placeholder="Degree" className="font-bold text-blue-900 text-sm leading-tight" />
                        <EditableText value={edu.school} onSave={(val) => updateField('education', 'school', val, edu.id)} placeholder="School" className="text-blue-700 text-xs mt-1 block" />
                        <div className="text-[10px] font-bold text-blue-300 mt-1 flex items-center gap-1">
                            <EditableText value={edu.startDate} onSave={(val) => updateField('education', 'startDate', val, edu.id)} placeholder="Start" />
                            <span>–</span>
                            <EditableText value={edu.endDate} onSave={(val) => updateField('education', 'endDate', val, edu.id)} placeholder="End" />
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => useResumeStore.getState().addEducation()} className="mt-4 text-[10px] font-bold text-blue-400 hover:text-blue-600 transition-colors uppercase">+ NEW ENTRY</button>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item 
            key="projects" 
            value="projects"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 paged-block"
        >
            <div 
                className="absolute -left-8 top-6 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-blue-300" />
            </div>
            <h3 className="text-xl font-black text-blue-950 mb-6 flex items-center gap-3">
                {sectionLabels.projects}
                <div className="flex-1 h-px bg-blue-100"></div>
            </h3>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-10">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj paged-block"
                    >
                        <div className="absolute -right-10 top-1 opacity-0 group-hover/proj:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeProject(proj.id)}
                                className="p-1 text-zinc-400 hover:text-red-500 bg-white border border-zinc-100 rounded shadow-sm"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
                            <div className="flex-1">
                                <EditableText
                                    value={proj.title}
                                    onSave={(val) => updateField('projects', 'title', val, proj.id)}
                                    placeholder="Project Name"
                                    className="text-lg font-black text-zinc-900 mb-2 uppercase tracking-tight"
                                />
                                <EditableText
                                    value={proj.content}
                                    onSave={(val) => updateField('projects', 'content', val, proj.id)}
                                    placeholder="Technical details and outcomes..."
                                    multiline
                                    className="text-sm leading-relaxed text-sky-700 font-medium"
                                />
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-8 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-blue-100 text-xs font-black text-blue-300 hover:text-blue-600 hover:border-blue-300 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> add_project.push()
            </button>
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item 
            key="languages" 
            value="languages"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 text-center paged-block"
        >
             <div 
                className="absolute -left-8 top-6 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-blue-300" />
            </div>
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-[0.3em] mb-4">{sectionLabels.languages}</h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages..."
                className="text-sm text-sky-700 font-bold"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item 
            key="interests" 
            value="interests"
            dragListener={false}
            dragControls={dragControls}
            className="mb-0 group/section relative p-2 -m-2 rounded-xl hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 text-center paged-block"
        >
             <div 
                className="absolute -left-8 top-6 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-4 w-4 text-blue-300" />
            </div>
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-[0.3em] mb-4">{sectionLabels.interests}</h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Interests..."
                className="text-sm text-sky-700 font-bold"
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
        if (id.startsWith('custom-')) return renderCustomSection(id, isSidebar);
        return sectionRenderers[id]?.();
    };

    // Filter main content sections (exclude sidebar ones)
    const mainSections = visibleSectionOrder.filter(id => !['skills', 'education'].includes(id));

    return (
        <div className="w-full flex min-h-full bg-slate-50 text-sky-900 font-sans shadow-inner">
            {/* Left Sidebar */}
            <div className="w-[35%] bg-blue-50/30 p-8 sm:p-10 border-r border-blue-100/30 flex flex-col gap-12">
                <header className="relative">
                    <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
                    <EditableText
                        value={data.personalInfo.fullName}
                        onSave={(val) => updateField('personalInfo', 'fullName', val)}
                        placeholder="NAME"
                        label="personalInfo"
                        className="text-3xl font-black text-blue-950 tracking-tight leading-tight mb-2 uppercase"
                    />
                    <EditableText
                        value={data.personalInfo.jobTitle}
                        onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                        placeholder="Profession"
                        label="personalInfo"
                        className="text-lg text-blue-600 font-bold mb-8"
                    />

                    <div className="space-y-3">
                         <div className="flex items-center gap-2 text-xs font-bold text-blue-900/60">
                            <Mail className="h-3 w-3" />
                            <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="email" />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-900/60">
                            <Phone className="h-3 w-3" />
                            <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="phone" />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-900/60">
                            <MapPin className="h-3 w-3" />
                            <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="location" />
                        </div>
                    </div>
                </header>

                <Reorder.Group 
                    axis="y" 
                    values={sideSections} 
                    onReorder={(newOrder) => setSectionOrder([...sectionOrder.filter(id => !['skills', 'education'].includes(id) || !visibleSections.includes(id)), ...newOrder])}
                    className="space-y-12"
                >
                    {sideSections.map(id => renderSection(id, true))}
                </Reorder.Group>
            </div>

            {/* Main Content Right */}
            <div className="w-[65%] p-10 sm:p-14">
                <Reorder.Group 
                    axis="y" 
                    values={mainSections} 
                    onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => ['skills', 'education'].includes(id) || !visibleSections.includes(id))])}
                    className="space-y-4"
                >
                    {mainSections.map(id => renderSection(id))}
                </Reorder.Group>
            </div>
        </div>
    );
}

