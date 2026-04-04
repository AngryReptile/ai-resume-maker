'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe, GripVertical, Plus, Trash2 } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';

export default function ElegantSerifMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
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

    const renderCustomSection = (id: string, isSidebar: boolean = false) => {
        const section = customSections.find(s => s.id === id);
        if (!section) return null;

        return (
            <Reorder.Item 
                key={id} 
                value={id}
                dragListener={false}
                dragControls={dragControls}
                className={`${isSidebar ? 'mb-8' : 'mb-12'} group/section relative paged-block`}
            >
                <div 
                    className="absolute -left-12 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <GripVertical className="h-5 w-5 text-sky-300" />
                </div>
                <h3 className="text-sm font-bold text-sky-400 underline decoration-sky-200 underline-offset-8 uppercase tracking-[0.4em] mb-6">
                    {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content..."
                    multiline
                    className={`text-${isSidebar ? 'base' : 'lg'} text-sky-800 leading-relaxed ${isSidebar ? '' : 'italic border-l-4 border-sky-100 pl-8'} font-serif`}
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
            className="mb-12 group/section relative paged-block"
        >
            <div 
                className="absolute -left-12 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-400 underline decoration-sky-200 underline-offset-8 uppercase tracking-[0.4em] mb-6">
                {sectionLabels.summary}
            </h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="A sophisticated summary of your career..."
                multiline
                className="text-lg text-sky-800 leading-relaxed italic border-l-4 border-sky-100 pl-8 font-serif"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item 
            key="experience" 
            value="experience"
            dragListener={false}
            dragControls={dragControls}
            className="mb-12 group/section relative paged-block"
        >
            <div 
                className="absolute -left-12 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-400 underline decoration-sky-200 underline-offset-8 uppercase tracking-[0.4em] mb-8">
                {sectionLabels.experience}
            </h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-12">
                {data.experience.map((exp) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group/exp paged-block">
                        <div className="flex justify-between items-start mb-2">
                            <EditableText
                                value={exp.position}
                                onSave={(val) => updateField('experience', 'position', val, exp.id)}
                                placeholder="Position Title"
                                className="text-2xl font-bold text-sky-900 font-serif tracking-tight"
                            />
                            <div className="text-sm text-sky-500 font-medium tracking-widest mt-2 flex gap-1">
                                <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                <span>—</span>
                                <EditableText value={exp.current ? 'Present' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                            </div>
                        </div>
                        <EditableText
                            value={exp.company}
                            onSave={(val) => updateField('experience', 'company', val, exp.id)}
                            placeholder="Organization"
                            className="text-base text-sky-500 italic mb-4 font-serif"
                        />
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Achievements and impact..."
                            multiline
                            className="text-base text-sky-700 leading-relaxed font-serif"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            
            <button 
                onClick={() => useResumeStore.getState().addExperience()}
                className="mt-8 flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-sky-300 hover:text-sky-600 border-b border-transparent hover:border-sky-200 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> Insert Milestone
            </button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item 
            key="education" 
            value="education"
            dragListener={false}
            dragControls={dragControls}
            className="mb-12 group/section relative paged-block"
        >
            <div 
                className="absolute -left-12 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-400 underline decoration-sky-200 underline-offset-8 uppercase tracking-[0.4em] mb-6">
                {sectionLabels.education}
            </h3>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-6">
                {data.education.map((edu) => (
                    <div key={edu.id} className="relative group/edu">
                        <div className="flex justify-between items-baseline">
                            <EditableText
                                value={edu.school}
                                onSave={(val) => updateField('education', 'school', val, edu.id)}
                                placeholder="Institution"
                                className="text-xl font-bold text-sky-900 font-serif"
                            />
                            <div className="text-sm text-sky-500 font-medium">
                                <EditableText value={edu.endDate} onSave={(val) => updateField('education', 'endDate', val, edu.id)} placeholder="Year" />
                            </div>
                        </div>
                        <EditableText
                            value={edu.degree}
                            onSave={(val) => updateField('education', 'degree', val, edu.id)}
                            placeholder="Acquired Degree"
                            className="text-base text-sky-600 italic font-serif"
                        />
                    </div>
                ))}
            </Reorder.Group>
        </Reorder.Item>
    );

    const renderSkills = () => (
        <Reorder.Item key="skills" value="skills" dragListener={false} dragControls={dragControls} className="mb-10 group/section relative paged-block">
             <div className="absolute -left-10 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab p-1" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.4em] mb-4">{sectionLabels.skills}</h3>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="space-y-3">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill flex items-center justify-between paged-block"
                    >
                        <EditableText
                            value={skill.name}
                            onSave={(val) => updateField('skills', 'name', val, skill.id)}
                            placeholder="Strategic Skill"
                            className="text-base text-sky-800 leading-relaxed font-serif italic"
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
                className="mt-4 text-[10px] font-bold text-sky-300 hover:text-sky-500 transition-colors uppercase tracking-widest"
            >
                + ADD COMPETENCY
            </button>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item key="projects" value="projects" dragListener={false} dragControls={dragControls} className="mb-10 group/section relative paged-block">
             <div className="absolute -left-10 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab p-1" onPointerDown={(e) => dragControls.start(e)}>
                <GripVertical className="h-4 w-4 text-sky-300" />
            </div>
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.4em] mb-8">{sectionLabels.projects}</h3>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-10">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj paged-block"
                    >
                        <div className="absolute -right-10 top-0 opacity-0 group-hover/proj:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeProject(proj.id)}
                                className="p-1 text-sky-300 hover:text-red-500 rounded border border-sky-100 bg-white"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <EditableText
                            value={proj.title}
                            onSave={(val) => updateField('projects', 'title', val, proj.id)}
                            placeholder="Project Title"
                            className="text-xl font-bold text-sky-900 font-serif mb-2 block"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Notable projects..."
                            multiline
                            className="text-base text-sky-800 font-serif leading-relaxed"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-8 flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-sky-300 hover:text-sky-600 border-b border-transparent hover:border-sky-200 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> Insert Project
            </button>
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item key="languages" value="languages" dragListener={false} dragControls={dragControls} className="mb-8 group/section relative paged-block">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.4em] mb-4">{sectionLabels.languages}</h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages..."
                className="text-sm text-sky-700 font-serif italic"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item key="interests" value="interests" dragListener={false} dragControls={dragControls} className="group/section relative paged-block">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.4em] mb-4">{sectionLabels.interests}</h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Interests..."
                className="text-sm text-sky-700 font-serif"
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
        <div className="w-full bg-[#FCFCFA] text-sky-900 p-16 sm:p-24 font-serif shadow-inner">
            {/* Elegant Header */}
            <div className="mb-24 flex flex-col gap-8">
                <div className="max-w-2xl">
                    <EditableText
                        value={data.personalInfo.fullName}
                        onSave={(val) => updateField('personalInfo', 'fullName', val)}
                        placeholder="NAME"
                        className="text-6xl font-black text-black tracking-tighter mb-4 uppercase scale-y-110 origin-left"
                    />
                    <EditableText
                        value={data.personalInfo.jobTitle}
                        onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                        placeholder="Vocation"
                        className="text-2xl text-sky-400 italic tracking-[0.2em] font-light"
                    />
                </div>

                <div className="flex flex-wrap gap-x-12 gap-y-4 pt-10 border-t border-sky-200 text-xs font-bold uppercase tracking-[0.15em] text-sky-500">
                    <div className="flex items-center gap-3">
                        <Mail className="h-3 w-3" />
                        <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="Email" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-3 w-3" />
                        <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="Contact" />
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-3 w-3" />
                        <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="Region" />
                    </div>
                </div>
            </div>

            {/* Dynamic Content Grid */}
            <div className="flex gap-20">
                {/* Main */}
                <div className="flex-[2.5] min-w-0">
                    <Reorder.Group 
                        axis="y" 
                        values={mainSections} 
                        onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => sidebarSections.includes(id) || !visibleSections.includes(id))])}
                        className="space-y-4 relative"
                    >
                        {mainSections.map(id => renderSection(id))}
                    </Reorder.Group>
                </div>

                {/* Sidebar */}
                {sidebarSections.length > 0 && (
                    <div className="flex-1 min-w-[180px] pt-4">
                        <Reorder.Group 
                            axis="y" 
                            values={sideSections} 
                            onReorder={(newOrder) => setSectionOrder([...sectionOrder.filter(id => !sidebarSections.includes(id) || !visibleSections.includes(id)), ...newOrder])}
                            className="space-y-12"
                        >
                            {sideSections.map(id => renderSection(id, true))}
                        </Reorder.Group>
                    </div>
                )}
            </div>
        </div>
    );
}
