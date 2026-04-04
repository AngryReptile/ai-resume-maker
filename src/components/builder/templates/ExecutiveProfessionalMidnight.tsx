import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe, GripVertical, Plus, Trash2 } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';
import EntryToolbar from '../EntryToolbar';
import { useState } from 'react';

export default function ExecutiveProfessionalMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
    const storeData = useResumeStore((state) => state.data);
    const updateField = useResumeStore((state) => state.updateField);
    const visibleSections = useResumeStore((state) => state.visibleSections);
    const sectionOrder = useResumeStore((state) => state.sectionOrder);
    const setSectionOrder = useResumeStore((state) => state.setSectionOrder);
    const sidebarSections = useResumeStore((state) => state.sidebarSections);
    const sectionLabels = useResumeStore((state) => state.sectionLabels);
    const customSections = useResumeStore((state) => state.customSections);
    const updateCustomSection = useResumeStore((state) => state.updateCustomSection);
    
    // Filter section order for each column to ensure Reorder.Group only sees what it manages
    const mainSections = sectionOrder.filter(id => !sidebarSections.includes(id) && visibleSections.includes(id));
    const sideSections = sectionOrder.filter(id => sidebarSections.includes(id) && visibleSections.includes(id));

    const data: import("@/store/useResumeStore").ResumeData = previewData || storeData;
    const dragControls = useDragControls();
    const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

    const renderCustomSection = (id: string) => {
        const section = customSections.find(s => s.id === id);
        if (!section) return null;

        return (
            <Reorder.Item 
                key={id} 
                value={id}
                dragListener={false}
                dragControls={dragControls}
                className="mb-10 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
            >
                <div 
                    className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <GripVertical className="h-5 w-5 text-sky-300" />
                </div>
                <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-4">
                    {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content here..."
                    multiline
                    className="text-base text-sky-900 leading-relaxed text-justify serif"
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
            className="mb-10 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-4">
                {sectionLabels.summary}
            </h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Briefly describe your professional background and key achievements..."
                multiline
                label="summary"
                className="text-base text-sky-900 leading-relaxed text-justify serif italic"
            />
        </Reorder.Item>
    );

    const renderExperience = () => (
        <Reorder.Item 
            key="experience" 
            value="experience"
            dragListener={false}
            dragControls={dragControls}
            className="mb-10 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-6">
                {sectionLabels.experience}
            </h3>
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-10">
                {data.experience.map((exp) => (
                    <Reorder.Item 
                        key={exp.id} 
                        value={exp} 
                        className="relative group/exp paged-block"
                        onMouseEnter={() => setHoveredEntry(exp.id)}
                        onMouseLeave={() => setHoveredEntry(null)}
                    >
                        <EntryToolbar 
                            isVisible={hoveredEntry === exp.id}
                            onDelete={() => useResumeStore.getState().removeExperience(exp.id)}
                        />

                        <div className="flex justify-between items-end mb-3">
                            <EditableText
                                value={exp.company}
                                onSave={(val) => updateField('experience', 'company', val, exp.id)}
                                placeholder="Company Name"
                                label="experience"
                                className="text-2xl font-bold text-sky-900 uppercase tracking-tight"
                            />
                            <div className="flex items-center gap-1 text-sm text-sky-600 font-bold italic mb-1">
                                <EditableText value={exp.startDate} onSave={(val) => updateField('experience', 'startDate', val, exp.id)} placeholder="Start" />
                                <span>-</span>
                                <EditableText value={exp.current ? 'Present' : exp.endDate} onSave={(val) => updateField('experience', 'endDate', val, exp.id)} placeholder="End" />
                            </div>
                        </div>
                        <EditableText
                            value={exp.position}
                            onSave={(val) => updateField('experience', 'position', val, exp.id)}
                            placeholder="Executive Role Title"
                            label="experience"
                            className="text-lg font-semibold text-sky-700 italic border-l-4 border-sky-200 pl-4 mb-4"
                        />
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Highlight your impact and leadership..."
                            multiline
                            label="experience"
                            className="text-base text-sky-800 leading-bold leading-relaxed whitespace-pre-wrap"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            
            <button 
                onClick={() => useResumeStore.getState().addExperience()}
                className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded border-2 border-dashed border-sky-200 text-sm font-bold text-sky-400 hover:text-sky-900 hover:border-sky-400 hover:bg-sky-100 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Leadership Experience
            </button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item 
            key="education" 
            value="education"
            dragListener={false}
            dragControls={dragControls}
            className="mb-10 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200"
        >
            <div 
                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-6">
                {sectionLabels.education}
            </h3>
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-6">
                {data.education.map((edu) => (
                    <Reorder.Item key={edu.id} value={edu} className="relative group/edu flex justify-between items-start pt-2">
                        {/* Sub Drag Handle */}
                        <div className="absolute -left-6 top-2 opacity-0 group-hover/edu:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-sky-200">
                            <GripVertical className="h-3 w-3" />
                        </div>

                        {/* Delete Button */}
                        <div className="absolute -right-10 top-2 opacity-0 group-hover/edu:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => useResumeStore.getState().removeEducation(edu.id)}
                                className="p-1.5 text-sky-400 hover:text-red-500 hover:bg-red-50 rounded shadow-sm bg-slate-50 border border-sky-100"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1">
                            <EditableText
                                value={edu.school}
                                onSave={(val) => updateField('education', 'school', val, edu.id)}
                                placeholder="University"
                                className="text-xl font-bold text-sky-900 underline decoration-sky-300 underline-offset-4"
                            />
                            <EditableText
                                value={edu.degree}
                                onSave={(val) => updateField('education', 'degree', val, edu.id)}
                                placeholder="Degree Field"
                                className="text-base text-sky-700 italic mt-2"
                            />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-sky-600 font-bold italic mt-1">
                            <EditableText value={edu.startDate} onSave={(val) => updateField('education', 'startDate', val, edu.id)} placeholder="Start" />
                            <span>-</span>
                            <EditableText value={edu.endDate} onSave={(val) => updateField('education', 'endDate', val, edu.id)} placeholder="End" />
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            
            <button 
                onClick={() => useResumeStore.getState().addEducation()}
                className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded border-2 border-dashed border-sky-200 text-sm font-bold text-sky-400 hover:text-sky-900 hover:border-sky-400 hover:bg-sky-100 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Academic Credential
            </button>
        </Reorder.Item>
    );

    const renderSkills = () => (
        <Reorder.Item 
            key="skills" 
            value="skills"
            dragListener={false}
            dragControls={dragControls}
            className="mb-10 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-4">
                {sectionLabels.skills}
            </h3>
            
            <Reorder.Group axis="y" values={data.skills} onReorder={useResumeStore.getState().setSkillOrder} className="flex flex-wrap gap-x-6 gap-y-2">
                {data.skills.map((skill) => (
                    <Reorder.Item 
                        key={skill.id} 
                        value={skill} 
                        className="relative group/skill flex items-center gap-2 paged-block"
                    >
                        <EditableText
                            value={skill.name}
                            onSave={(val) => updateField('skills', 'name', val, skill.id)}
                            placeholder="Skill"
                            className="text-base text-sky-900 serif italic underline decoration-sky-300 underline-offset-4"
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
                className="mt-4 flex items-center justify-center gap-2 w-full py-1.5 rounded border border-dashed border-sky-200 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 hover:text-sky-900 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> Add Skill
            </button>
        </Reorder.Item>
    );

    const renderProjects = () => (
        <Reorder.Item 
            key="projects" 
            value="projects"
            dragListener={false}
            dragControls={dragControls}
            className="mb-0 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-4">
                {sectionLabels.projects}
            </h3>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-8">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj paged-block"
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
                            placeholder="Executive Initiative"
                            className="text-lg font-bold text-sky-900 mb-2 uppercase tracking-wide"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Explain the strategic impact and quantitative results..."
                            multiline
                            className="text-base text-sky-900 leading-normal serif border-l-2 border-sky-100 pl-4"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded border-2 border-dashed border-sky-200 text-sm font-bold text-sky-400 hover:text-sky-900 hover:border-sky-400 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Strategic Project
            </button>
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item 
            key="languages" 
            value="languages"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-4">
                {sectionLabels.languages}
            </h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages..."
                className="text-base text-sky-900 serif italic"
            />
        </Reorder.Item>
    );

    const renderInterests = () => (
        <Reorder.Item 
            key="interests" 
            value="interests"
            dragListener={false}
            dragControls={dragControls}
            className="mb-0 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-[0.3em] border-b-2 border-sky-900 pb-2 mb-4">
                {sectionLabels.interests}
            </h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Interests..."
                className="text-base text-sky-900 serif"
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
        <div className="w-full bg-slate-50 text-sky-900 p-14 sm:p-20 font-serif leading-relaxed">
            {/* Header */}
            <div className="text-center mb-16 border-b-8 border-double border-sky-900 pb-8">
                <EditableText
                    value={data.personalInfo.fullName}
                    onSave={(val) => updateField('personalInfo', 'fullName', val)}
                    placeholder="Your Full Name"
                    label="personalInfo"
                    className="text-5xl font-extrabold text-sky-950 tracking-[0.15em] uppercase mb-4"
                />
                <EditableText
                    value={data.personalInfo.jobTitle}
                    onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                    placeholder="Executive Position"
                    label="personalInfo"
                    className="text-xl text-sky-600 font-bold uppercase tracking-[0.25em] italic"
                />
                
                <div className="h-0.5 w-24 bg-sky-400 mx-auto my-8"></div>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-bold text-sky-800 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-sky-400" />
                        <EditableText value={data.personalInfo.email} onSave={(val) => updateField('personalInfo', 'email', val)} placeholder="email@domain.com" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-sky-400" />
                        <EditableText value={data.personalInfo.phone} onSave={(val) => updateField('personalInfo', 'phone', val)} placeholder="+00 000 000" />
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-sky-400" />
                        <EditableText value={data.personalInfo.location} onSave={(val) => updateField('personalInfo', 'location', val)} placeholder="City, Country" />
                    </div>
                    {data.personalInfo.website && (
                        <div className="flex items-center gap-2 text-blue-900">
                            <Globe className="h-3.5 w-3.5" />
                            <EditableText value={data.personalInfo.website} onSave={(val) => updateField('personalInfo', 'website', val)} placeholder="Website" />
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Content with Dual Columns */}
            <div className="flex gap-16">
                {/* Primary Column */}
                <div className="flex-[2] min-w-0">
                    <Reorder.Group 
                        axis="y" 
                        values={mainSections} 
                        onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => sidebarSections.includes(id) || !visibleSections.includes(id))])}
                        className="space-y-6"
                    >
                        {mainSections.map(id => renderSection(id))}
                    </Reorder.Group>
                </div>

                {/* Secondary Column */}
                {sideSections.length > 0 && (
                    <div className="flex-1 min-w-[220px]">
                        <Reorder.Group 
                            axis="y" 
                            values={sideSections} 
                            onReorder={(newOrder) => setSectionOrder([...sectionOrder.filter(id => !sidebarSections.includes(id) || !visibleSections.includes(id)), ...newOrder])}
                            className="space-y-10"
                        >
                            {sideSections.map(id => renderSection(id))}
                        </Reorder.Group>
                    </div>
                )}
            </div>
        </div>
    );
}


