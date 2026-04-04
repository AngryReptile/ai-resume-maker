import { create } from 'zustand';

export type PersonalInfo = {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
};

export type Experience = {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
};

export type Education = {
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
};

export type Project = {
    id: string;
    title: string;
    content: string;
};

export type Skill = {
    id: string;
    name: string;
};

export type ResumeData = {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    languages: string;
    interests: string;
    visibleSections: string[];
    sectionOrder: string[];
    sectionLabels: Record<string, string>;
    customSections: { id: string, title: string, content: string }[];
    sidebarSections: string[];
    coachFeedback?: {
        score: number;
        verdict: string;
        strengths: string[];
        issues: string[];
        rewrites: string[];
        keywords: string[];
        recommendation: string;
    };
};

interface ResumeStore {
    currentResumeId: string | null;
    templateId: string;
    title: string;
    data: ResumeData;
    visibleSections: string[];
    sectionOrder: string[];
    sectionLabels: Record<string, string>;
    customSections: { id: string, title: string, content: string }[];
    sidebarSections: string[];
    isDrawerOpen: boolean;
    setDrawerOpen: (isOpen: boolean) => void;
    isRearrangeOpen: boolean;
    setCurrentResumeId: (id: string | null) => void;

    setTemplateId: (id: string) => void;
    setTitle: (title: string) => void;
    setResumeData: (data: ResumeData) => void;
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    addExperience: (exp?: Partial<Experience>) => void;
    updateExperience: (id: string, exp: Partial<Experience>) => void;
    removeExperience: (id: string) => void;
    addEducation: (edu?: Partial<Education>) => void;
    updateEducation: (id: string, edu: Partial<Education>) => void;
    removeEducation: (id: string) => void;
    addProject: (proj?: Partial<Project>) => void;
    updateProject: (id: string, proj: Partial<Project>) => void;
    removeProject: (id: string) => void;
    addSkill: (skill?: Partial<Skill>) => void;
    updateSkill: (id: string, name: string) => void;
    removeSkill: (id: string) => void;
    updateSkills: (skills: Skill[]) => void;
    updateProjects: (projects: Project[]) => void;
    updateLanguages: (languages: string) => void;
    updateInterests: (interests: string) => void;
    setActiveField: (field: { section: string, id?: string, field: string } | null) => void;
    updateField: (section: string, field: string, value: any, id?: string) => void;
    toggleSection: (sectionId: string) => void;
    setIsRearrangeOpen: (isOpen: boolean) => void;
    setSectionOrder: (order: string[]) => void;
    updateSectionLabel: (id: string, label: string) => void;
    addCustomSection: (title: string) => void;
    removeCustomSection: (id: string) => void;
    updateCustomSection: (id: string, updates: Partial<{ title: string, content: string }>) => void;

    setSidebarSections: (sections: string[]) => void;
    setExperienceOrder: (experience: Experience[]) => void;
    setEducationOrder: (education: Education[]) => void;
    setProjectOrder: (projects: Project[]) => void;
    setSkillOrder: (skills: Skill[]) => void;
    activeField: { section: string, id?: string, field: string } | null;
    coachFeedback?: ResumeData['coachFeedback'];
    setCoachFeedback: (feedback: ResumeData['coachFeedback']) => void;
    reset: () => void;
}

const initialData: ResumeData = {
    personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: '',
    interests: '',
    visibleSections: ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
    sectionLabels: {
        summary: 'Professional Summary',
        experience: 'Work History',
        education: 'Education',
        skills: 'Core Competencies',
        projects: 'Projects',
        languages: 'Languages',
        interests: 'Interests'
    },
    customSections: [],
    sidebarSections: ['skills', 'languages', 'interests'],
    coachFeedback: undefined,
};

export const useResumeStore = create<ResumeStore>((set) => ({
    currentResumeId: null,
    templateId: 'modern-clean', // Default template
    title: '',
    data: initialData,
    isDrawerOpen: false,
    setDrawerOpen: (isOpen: boolean) => set({ isDrawerOpen: isOpen }),
    isRearrangeOpen: false,
    visibleSections: initialData.visibleSections,
    sectionOrder: initialData.sectionOrder,
    sectionLabels: initialData.sectionLabels,
    customSections: initialData.customSections,
    sidebarSections: initialData.sidebarSections,
    coachFeedback: undefined,


    setCurrentResumeId: (id) => set({ currentResumeId: id }),
    setTemplateId: (id) => set({ templateId: id }),
    setTitle: (title) => set({ title }),
    setResumeData: (newData) => set((state) => ({
        data: newData,
        visibleSections: newData.visibleSections || state.visibleSections,
        sectionOrder: newData.sectionOrder || state.sectionOrder,
        sectionLabels: newData.sectionLabels || state.sectionLabels,
        customSections: newData.customSections || state.customSections,
        sidebarSections: newData.sidebarSections || state.sidebarSections,
        coachFeedback: newData.coachFeedback || state.coachFeedback,
    })),
    setCoachFeedback: (feedback) => set((state) => ({ 
        data: { ...state.data, coachFeedback: feedback },
        coachFeedback: feedback 
    })),
    updatePersonalInfo: (info) =>
        set((state) => ({
            data: {
                ...state.data,
                personalInfo: { ...state.data.personalInfo, ...info },
            },
        })),
    addExperience: (exp) =>
        set((state) => ({
            data: {
                ...state.data,
                experience: [
                    ...state.data.experience,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        company: '',
                        position: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        description: '',
                        ...exp,
                    } as Experience,
                ],
            },
        })),
    updateExperience: (id, exp) =>
        set((state) => ({
            data: {
                ...state.data,
                experience: state.data.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
            },
        })),
    removeExperience: (id) =>
        set((state) => ({
            data: {
                ...state.data,
                experience: state.data.experience.filter((e) => e.id !== id),
            },
        })),
    addEducation: (edu) =>
        set((state) => ({
            data: {
                ...state.data,
                education: [
                    ...state.data.education,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        school: '',
                        degree: '',
                        startDate: '',
                        endDate: '',
                        ...edu,
                    } as Education,
                ],
            },
        })),
    updateEducation: (id, edu) =>
        set((state) => ({
            data: {
                ...state.data,
                education: state.data.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
            },
        })),
    removeEducation: (id) =>
        set((state) => ({
            data: {
                ...state.data,
                education: state.data.education.filter((e) => e.id !== id),
            },
        })),
    addProject: (proj) =>
        set((state) => ({
            data: {
                ...state.data,
                projects: [
                    ...state.data.projects,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        title: '',
                        content: '',
                        ...proj,
                    } as Project,
                ],
            },
        })),
    updateProject: (id, proj) =>
        set((state) => ({
            data: {
                ...state.data,
                projects: state.data.projects.map((p) => (p.id === id ? { ...p, ...proj } : p)),
            },
        })),
    removeProject: (id) =>
        set((state) => ({
            data: {
                ...state.data,
                projects: state.data.projects.filter((p) => p.id !== id),
            },
        })),
    addSkill: (skill) =>
        set((state) => ({
            data: {
                ...state.data,
                skills: [
                    ...state.data.skills,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        name: '',
                        ...skill,
                    } as Skill,
                ],
            },
        })),
    updateSkill: (id, name) =>
        set((state) => ({
            data: {
                ...state.data,
                skills: state.data.skills.map((s) => (s.id === id ? { ...s, name } : s)),
            },
        })),
    removeSkill: (id) =>
        set((state) => ({
            data: {
                ...state.data,
                skills: state.data.skills.filter((s) => s.id !== id),
            },
        })),
    updateSkills: (skills) =>
        set((state) => ({
            data: { ...state.data, skills },
        })),
    updateProjects: (projects) =>
        set((state) => ({
            data: { ...state.data, projects },
        })),
    updateLanguages: (languages) =>
        set((state) => ({
            data: { ...state.data, languages },
        })),
    updateInterests: (interests) =>
        set((state) => ({
            data: { ...state.data, interests },
        })),
    activeField: null,
    setActiveField: (field) => set({ activeField: field }),
    updateField: (section, field, value, id) =>
        set((state) => {
            const newData = { ...state.data };
            if (section === 'personalInfo' && field in newData.personalInfo) {
                (newData.personalInfo as any)[field] = value;
            } else if (section === 'experience' && id) {
                newData.experience = newData.experience.map((e) =>
                    e.id === id ? { ...e, [field]: value } : e
                );
            } else if (section === 'education' && id) {
                newData.education = newData.education.map((e) =>
                    e.id === id ? { ...e, [field]: value } : e
                );
            } else if (section === 'projects' && id) {
                newData.projects = newData.projects.map((p) =>
                    p.id === id ? { ...p, [field]: value } : p
                );
            } else if (section === 'skills' && id) {
                newData.skills = newData.skills.map((s) =>
                    s.id === id ? { ...s, [field]: value } : s
                );
            } else if (field === 'languages' || section === 'languages') {
                newData.languages = value;
            } else if (field === 'interests' || section === 'interests') {
                newData.interests = value;
            }
            return { data: newData };
        }),
    toggleSection: (sectionId) =>
        set((state) => ({
            visibleSections: state.visibleSections.includes(sectionId)
                ? state.visibleSections.filter((s) => s !== sectionId)
                : [...state.visibleSections, sectionId],
        })),
    setIsRearrangeOpen: (isOpen) => set({ isRearrangeOpen: isOpen }),
    setSectionOrder: (order) => set({ sectionOrder: order }),
    updateSectionLabel: (id, label) =>
        set((state) => ({
            sectionLabels: { ...state.sectionLabels, [id]: label },
        })),
    addCustomSection: (title) =>
        set((state) => {
            const id = `custom-${Math.random().toString(36).substr(2, 9)}`;
            return {
                customSections: [...state.customSections, { id, title, content: '' }],
                sectionOrder: [...state.sectionOrder, id],
                visibleSections: [...state.visibleSections, id],
                sectionLabels: { ...state.sectionLabels, [id]: title },
            };
        }),
    removeCustomSection: (id) =>
        set((state) => ({
            customSections: state.customSections.filter((s) => s.id !== id),
            sectionOrder: state.sectionOrder.filter((s) => s !== id),
            visibleSections: state.visibleSections.filter((s) => s !== id),
        })),
    updateCustomSection: (id, updates) =>
        set((state) => ({
            customSections: state.customSections.map((s) =>
                s.id === id ? { ...s, ...updates } : s
            ),
            sectionLabels: updates.title
                ? { ...state.sectionLabels, [id]: updates.title }
                : state.sectionLabels,
        })),

    setSidebarSections: (sections) => set({ sidebarSections: sections }),

    setExperienceOrder: (experience) => set((state) => ({ data: { ...state.data, experience } })),
    setEducationOrder: (education) => set((state) => ({ data: { ...state.data, education } })),
    setProjectOrder: (projects) => set((state) => ({ data: { ...state.data, projects } })),
    setSkillOrder: (skills) => set((state) => ({ data: { ...state.data, skills } })),
    reset: () => set({ 
        currentResumeId: null, 
        title: '', 
        templateId: 'modern-clean', 
        data: initialData, 
        activeField: null, 
        visibleSections: ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'interests'],
        sectionLabels: {
            summary: 'Professional Summary',
            experience: 'Work History',
            education: 'Education',
            skills: 'Core Competencies',
            projects: 'Projects',
            languages: 'Languages',
            interests: 'Interests'
        },
        customSections: [],
        sidebarSections: ['skills', 'languages', 'interests'],
        isRearrangeOpen: false
    }),
}));
