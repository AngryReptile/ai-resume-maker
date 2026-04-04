import { useResumeStore } from '@/store/useResumeStore';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';

export default function StartupDynamicMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
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
    
    // Filter section order for each column to ensure Reorder.Group only sees what it manages
    const mainSections = sectionOrder.filter(id => !['summary', 'skills', 'education', 'languages', 'interests'].includes(id) && visibleSections.includes(id));
    const sideSections = sectionOrder.filter(id => ['skills', 'education', 'languages', 'interests'].includes(id) && visibleSections.includes(id));

    const renderCustomSection = (id: string, isSidebar: boolean = false) => {
        const section = customSections.find(s => s.id === id);
        if (!section) return null;

        return (
            <Reorder.Item key={id} value={id} dragListener={false} dragControls={dragControls} className={`group/section relative paged-block ${isSidebar ? 'py-4' : ''}`}>
                 <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                    <GripVertical className="h-4 w-4 text-sky-300" />
                </div>
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                    {!isSidebar && <span className="bg-blue-600 text-white px-3 py-1 mr-3 rounded-md">{section.title.slice(0, 3).toUpperCase()}</span>}
                    {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content..."
                    multiline
                    className={`text-sm font-medium text-sky-700 leading-relaxed ${isSidebar && id.includes('skill') ? 'border border-blue-100 bg-blue-50/30 p-3 rounded-lg block w-full' : ''}`}
                />
            </Reorder.Item>
        );
    };

    const renderSummary = () => (
        <Reorder.Item key="summary" value="summary" dragListener={false} dragControls={dragControls} className="group/section relative bg-sky-50 p-6 rounded-xl border border-sky-100 paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Professional summary..."
                multiline
                label="summary"
                className="text-base font-medium text-sky-800 leading-relaxed"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item key="experience" value="experience" dragListener={false} dragControls={dragControls} className="group/section relative paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                <span className="bg-blue-600 text-white px-3 py-1 mr-3 rounded-md">Exp</span>
                {sectionLabels.experience}
            </h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-6">
                {data.experience.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group/exp pl-6 border-l-2 border-blue-100 pb-2 paged-block">
                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                        <div className="absolute -right-10 top-0 opacity-0 group-hover/exp:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeExperience(exp.id)} className="p-1 text-sky-300 hover:text-red-500 rounded border border-sky-100 bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <EditableText value={exp.position} onSave={(val) => updateField('experience', 'position', val, exp.id)} placeholder="Position" className="text-lg font-bold text-sky-900" />
                            <div className="flex items-center gap-1 text-xs font-bold text-sky-500 bg-sky-100 px-2 py-1 rounded-md ml-4">
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
                            className="text-sm font-medium text-sky-700 leading-relaxed"
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
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">
                {sectionLabels.education}
            </h3>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-6">
                {data.education.map((edu) => (
                    <div key={edu.id} className="relative group/edu paged-block">
                         <div className="absolute -right-6 top-0 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button onClick={() => useResumeStore.getState().removeEducation(edu.id)} className="text-sky-300 hover:text-red-400"><Trash2 className="h-3 w-3" /></button>
                        </div>
                        <EditableText value={edu.degree} onSave={(val) => updateField('education', 'degree', val, edu.id)} placeholder="Degree" className="font-bold text-sky-900 border-b border-sky-200 pb-1 mb-2 block" />
                        <EditableText value={edu.school} onSave={(val) => updateField('education', 'school', val, edu.id)} placeholder="School" className="text-sm font-semibold text-sky-600 block" />
                        <div className="flex items-center gap-1 text-xs font-bold text-sky-400 mt-1">
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
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">
                {sectionLabels.skills}
            </h3>
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill flex items-center gap-2 border border-blue-100 bg-blue-50/30 px-3 py-1.5 rounded-lg paged-block cursor-default"
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
                            <Trash2 className="h-3 w-3 text-sky-300 hover:text-red-500" />
                        </button>
                    </Reorder.Item>
                ))}
                <button 
                    onClick={() => useResumeStore.getState().addSkill()}
                    className="flex items-center justify-center h-8 w-8 rounded-lg border-2 border-dashed border-blue-100 text-sky-300 hover:text-sky-600 hover:border-sky-300 transition-all ml-1"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </Reorder.Group>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item key="projects" value="projects" dragListener={false} dragControls={dragControls} className="group/section relative paged-block">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center mt-8">
                <span className="bg-blue-600 text-white px-3 py-1 mr-3 rounded-md">Prj</span>
                {sectionLabels.projects}
            </h3>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-6">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj pl-6 border-l-2 border-blue-100 pb-2 paged-block"
                    >
                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
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
                            className="text-lg font-bold text-sky-900 mb-2 block"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Key projects..."
                            multiline
                            className="text-sm font-medium text-sky-700 leading-relaxed"
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
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">{sectionLabels.languages}</h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages..."
                className="text-sm text-sky-700 font-bold"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item key="interests" value="interests" dragListener={false} dragControls={dragControls} className="group/section relative py-2 paged-block">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">{sectionLabels.interests}</h3>
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

    return (
        <div className="w-full bg-slate-50 text-sky-900 font-sans p-10 min-h-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b-[6px] border-blue-600">
                <div className="flex-1 w-full sm:w-auto">
                    <EditableText
                        value={data.personalInfo.fullName}
                        onSave={(val) => updateField('personalInfo', 'fullName', val)}
                        placeholder="NAME"
                        className="text-5xl font-black text-black tracking-tighter mb-1 uppercase block"
                    />
                    <EditableText
                        value={data.personalInfo.jobTitle}
                        onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                        placeholder="Role"
                        className="text-xl font-bold text-blue-600 tracking-wider uppercase block"
                    />
                </div>
                <div className="flex flex-col gap-1 text-sm font-semibold text-sky-600 mt-4 md:mt-0 md:text-right w-full sm:w-auto">
                    <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="Email" />
                    <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="Phone" />
                    <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="Location" />
                </div>
            </header>

            <div className="space-y-8">
                {/* Summary (if exists, normally rendered at top) */}
                {visibleSections.includes('summary') && (
                    <Reorder.Group axis="y" values={['summary']} onReorder={() => {}}>
                         {renderSummary()}
                    </Reorder.Group>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column (2/3) - Experience & Projects */}
                    <div className="lg:col-span-2 space-y-8">
                        <Reorder.Group 
                            axis="y" 
                            values={mainSections} 
                            onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => ['summary', 'skills', 'education', 'languages', 'interests'].includes(id) || !visibleSections.includes(id))])}
                            className="space-y-8"
                        >
                            {mainSections.map(id => renderSection(id))}
                        </Reorder.Group>
                    </div>

                    {/* Right Column (1/3) - Skills & Education */}
                    <div className="space-y-8">
                        <Reorder.Group 
                            axis="y" 
                            values={sideSections} 
                            onReorder={(newOrder) => setSectionOrder([...sectionOrder.filter(id => !['skills', 'education', 'languages', 'interests'].includes(id) || !visibleSections.includes(id)), ...newOrder])}
                            className="space-y-8"
                        >
                            {sideSections.map(id => renderSection(id, true))}
                        </Reorder.Group>
                    </div>
                </div>
            </div>
        </div>
    );
}
