import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Globe, GripVertical, Plus, Trash2 } from 'lucide-react';
import EditableText from '@/components/builder/EditableText';
import { Reorder, useDragControls } from 'framer-motion';
import EntryToolbar from '../EntryToolbar';
import { useState } from 'react';

export default function ModernCleanMidnight({ previewData }: { previewData?: import("@/store/useResumeStore").ResumeData }) {
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
                className="mb-8 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
            >
                <div 
                    className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <GripVertical className="h-5 w-5 text-sky-300" />
                </div>
                <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-2 mb-3 uppercase tracking-widest">
                    {sectionLabels[id] || section.title}
                </h3>
                <EditableText
                    value={section.content}
                    onSave={(val) => updateCustomSection(id, { content: val })}
                    placeholder="Enter content here..."
                    multiline
                    className="text-base text-sky-800 leading-relaxed"
                />
            </Reorder.Item>
        );
    };

    const renderExperience = () => (
        <Reorder.Item 
            key="experience" 
            value="experience"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-2 mb-4 uppercase tracking-widest">
                {sectionLabels.experience}
            </h3>
            
            <Reorder.Group axis="y" values={data.experience} onReorder={useResumeStore.getState().setExperienceOrder} className="space-y-6">
                {data.experience.map((exp) => (
                    <Reorder.Item 
                        key={exp.id} 
                        value={exp} 
                        className="relative group/exp p-2 -mx-2 rounded hover:bg-slate-50 border border-transparent hover:border-sky-100 hover:shadow-sm transition-all paged-block"
                        onMouseEnter={() => setHoveredEntry(exp.id)}
                        onMouseLeave={() => setHoveredEntry(null)}
                    >
                        <EntryToolbar 
                            isVisible={hoveredEntry === exp.id}
                            onDelete={() => useResumeStore.getState().removeExperience(exp.id)}
                            onMoveUp={() => { /* reorder logic in store */ }}
                            onMoveDown={() => { /* reorder logic in store */ }}
                            onAI={() => { /* trigger AI on the description */ }}
                        />
                        
                        <div className="flex justify-between items-baseline mb-1">
                            <EditableText
                                value={exp.position}
                                onSave={(val) => updateField('experience', 'position', val, exp.id)}
                                placeholder="Position Title"
                                label="experience"
                                className="text-lg font-bold text-sky-900 flex-1"
                            />
                            <div className="flex items-center gap-1 text-sm text-sky-600 font-bold whitespace-nowrap ml-4">
                                <EditableText
                                    value={exp.startDate}
                                    onSave={(val) => updateField('experience', 'startDate', val, exp.id)}
                                    placeholder="Start Date"
                                />
                                <span>-</span>
                                <EditableText
                                    value={exp.current ? 'Present' : exp.endDate}
                                    onSave={(val) => updateField('experience', 'endDate', val, exp.id)}
                                    placeholder="End Date"
                                />
                            </div>
                        </div>
                        <EditableText
                            value={exp.company}
                            onSave={(val) => updateField('experience', 'company', val, exp.id)}
                            placeholder="Company Name"
                            label="experience"
                            className="text-base text-blue-700 font-semibold mb-2"
                        />
                        <EditableText
                            value={exp.description}
                            onSave={(val) => updateField('experience', 'description', val, exp.id)}
                            placeholder="Describe your duties and impact..."
                            multiline
                            label="experience"
                            className="text-base text-sky-800 pl-4 border-l-2 border-sky-300 leading-relaxed"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            
            {/* Add Experience Button */}
            <button 
                onClick={() => useResumeStore.getState().addExperience()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-dashed border-sky-200 text-sm font-bold text-sky-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Experience
            </button>
        </Reorder.Item>
    );

    const renderEducation = () => (
        <Reorder.Item 
            key="education" 
            value="education"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-2 mb-4 uppercase tracking-widest">
                {sectionLabels.education}
            </h3>
            
            <Reorder.Group axis="y" values={data.education} onReorder={useResumeStore.getState().setEducationOrder} className="space-y-5">
                {data.education.map((edu) => (
                    <Reorder.Item 
                        key={edu.id} 
                        value={edu} 
                        className="relative group/edu flex justify-between items-start p-2 -mx-2 rounded hover:bg-slate-50 border border-transparent hover:border-sky-100 hover:shadow-sm transition-all paged-block"
                        onMouseEnter={() => setHoveredEntry(edu.id)}
                        onMouseLeave={() => setHoveredEntry(null)}
                    >
                        <EntryToolbar 
                            isVisible={hoveredEntry === edu.id}
                            onDelete={() => useResumeStore.getState().removeEducation(edu.id)}
                        />

                        <div className="flex-1">
                            <EditableText
                                value={edu.school}
                                onSave={(val) => updateField('education', 'school', val, edu.id)}
                                placeholder="School Name"
                                label="education"
                                className="text-lg font-bold text-sky-900"
                            />
                            <EditableText
                                value={edu.degree}
                                onSave={(val) => updateField('education', 'degree', val, edu.id)}
                                placeholder="Degree / Program"
                                label="education"
                                className="text-base text-sky-700 font-medium mt-0.5"
                            />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-sky-600 font-bold whitespace-nowrap ml-4 mt-1">
                            <EditableText
                                value={edu.startDate}
                                onSave={(val) => updateField('education', 'startDate', val, edu.id)}
                                placeholder="Start Date"
                            />
                            <span>-</span>
                            <EditableText
                                value={edu.endDate}
                                onSave={(val) => updateField('education', 'endDate', val, edu.id)}
                                placeholder="End Date"
                            />
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {/* Add Education Button */}
            <button 
                onClick={() => useResumeStore.getState().addEducation()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-dashed border-sky-200 text-sm font-bold text-sky-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Education
            </button>
        </Reorder.Item>
    );

    const renderSkills = () => (
        <Reorder.Item 
            key="skills" 
            value="skills"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <div className="absolute -right-2 -top-2 opacity-0 group-hover/section:opacity-100 transition-opacity bg-sky-900 text-white text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-xl pointer-events-none z-10">
                Structure: Skills
            </div>
            <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-2 mb-3 uppercase tracking-widest">
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
                            className="text-base text-sky-800 leading-relaxed font-medium"
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
                className="mt-4 flex items-center justify-center gap-2 w-full py-1.5 rounded border border-dashed border-sky-200 text-[10px] font-bold text-sky-300 hover:text-blue-500 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-3 w-3" /> ADD SKILL
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
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <div className="absolute -right-2 -top-2 opacity-0 group-hover/section:opacity-100 transition-opacity bg-sky-900 text-white text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-xl pointer-events-none z-10">
                Structure: Projects
            </div>
            <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-2 mb-3 uppercase tracking-widest">
                {sectionLabels.projects}
            </h3>
            
            <Reorder.Group axis="y" values={data.projects} onReorder={useResumeStore.getState().setProjectOrder} className="space-y-6">
                {data.projects.map((proj) => (
                    <Reorder.Item 
                        key={proj.id} 
                        value={proj} 
                        className="relative group/proj p-2 -mx-2 rounded hover:bg-slate-50 border border-transparent hover:border-sky-100 hover:shadow-sm transition-all paged-block"
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
                            className="text-lg font-bold text-sky-900 mb-2 block"
                        />
                        <EditableText
                            value={proj.content}
                            onSave={(val) => updateField('projects', 'content', val, proj.id)}
                            placeholder="Highlight your most impressive projects..."
                            multiline
                            className="text-base text-sky-800 leading-relaxed"
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button 
                onClick={() => useResumeStore.getState().addProject()}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-dashed border-sky-200 text-sm font-bold text-sky-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all opacity-0 group-hover/section:opacity-100"
            >
                <Plus className="h-4 w-4" /> Add Project
            </button>
        </Reorder.Item>
    );

    const renderSummary = () => (
        <Reorder.Item 
            key="summary" 
            value="summary"
            dragListener={false}
            dragControls={dragControls}
            className="mb-8 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-2 mb-3 uppercase tracking-widest">
                {sectionLabels.summary}
            </h3>
            <EditableText
                value={data.personalInfo.summary}
                onSave={(val) => updateField('personalInfo', 'summary', val)}
                placeholder="Briefly describe your professional background and key achievements..."
                multiline
                label="summary"
                className="text-base leading-relaxed text-sky-800"
            />
        </Reorder.Item>
    );

    const renderLanguages = () => (
        <Reorder.Item 
            key="languages" 
            value="languages"
            dragListener={false}
            dragControls={dragControls}
            className="mb-6 group/section relative p-2 -m-2 rounded-lg hover:bg-sky-50 transition-all border border-transparent hover:border-sky-200 paged-block"
        >
            <div 
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-1 mb-2 uppercase tracking-widest">
                {sectionLabels.languages}
            </h3>
            <EditableText
                value={data.languages}
                onSave={(val) => updateField('languages', 'content', val)}
                placeholder="Languages you speak..."
                className="text-sm text-sky-700 font-medium"
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
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-sky-900 border-b-2 border-sky-200 pb-1 mb-2 uppercase tracking-widest">
                {sectionLabels.interests}
            </h3>
            <EditableText
                value={data.interests}
                onSave={(val) => updateField('interests', 'content', val)}
                placeholder="Your hobbies..."
                className="text-sm text-sky-700"
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
        <div className="w-full bg-slate-50 text-black p-10 sm:p-14 font-sans">
            {/* Header */}
            <div className="border-b-4 border-sky-900 pb-6 mb-6">
                <EditableText
                    value={data.personalInfo.fullName}
                    onSave={(val) => updateField('personalInfo', 'fullName', val)}
                    placeholder="Your Full Name"
                    label="personalInfo"
                    className="text-4xl font-extrabold text-sky-900 tracking-tight uppercase mb-2"
                />
                
                <EditableText
                    value={data.personalInfo.jobTitle}
                    onSave={(val) => updateField('personalInfo', 'jobTitle', val)}
                    placeholder="Target Job Title"
                    label="personalInfo"
                    className="text-xl text-blue-700 font-semibold mt-2 tracking-wide"
                />

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-sky-700 font-medium">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-sky-400" />
                        <EditableText
                            value={data.personalInfo.email}
                            onSave={(val) => updateField('personalInfo', 'email', val)}
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-sky-400" />
                        <EditableText
                            value={data.personalInfo.phone}
                            onSave={(val) => updateField('personalInfo', 'phone', val)}
                            placeholder="+1 234 567 890"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-sky-400" />
                        <EditableText
                            value={data.personalInfo.location}
                            onSave={(val) => updateField('personalInfo', 'location', val)}
                            placeholder="City, Country"
                        />
                    </div>
                    {data.personalInfo.website && (
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-sky-400" />
                            <EditableText
                                value={data.personalInfo.website}
                                onSave={(val) => updateField('personalInfo', 'website', val)}
                                placeholder="portfolio.com"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Sections with Column Support */}
            <div className="flex gap-10">
                {/* Main Column */}
                <div className="flex-1 min-w-0">
                    <Reorder.Group 
                        axis="y" 
                        values={mainSections} 
                        onReorder={(newOrder) => setSectionOrder([...newOrder, ...sectionOrder.filter(id => sidebarSections.includes(id) || !visibleSections.includes(id))])}
                        className="space-y-4 relative"
                    >
                        {mainSections.map(id => renderSection(id))}
                    </Reorder.Group>
                </div>

                {/* Sidebar Column */}
                {sidebarSections.length > 0 && (
                    <div className="w-1/3 min-w-[200px] border-l border-sky-100 pl-10">
                        <Reorder.Group 
                            axis="y" 
                            values={sideSections} 
                            onReorder={(newOrder) => setSectionOrder([...sectionOrder.filter(id => !sidebarSections.includes(id) || !visibleSections.includes(id)), ...newOrder])}
                            className="space-y-6 relative"
                        >
                            {sideSections.map(id => renderSection(id))}
                        </Reorder.Group>
                    </div>
                )}
            </div>
        </div>
    );
}

