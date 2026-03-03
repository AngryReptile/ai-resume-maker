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

export type ResumeData = {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: string;
    projects: string;
};

interface ResumeStore {
    data: ResumeData;
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    addExperience: (exp: Experience) => void;
    updateExperience: (id: string, exp: Partial<Experience>) => void;
    removeExperience: (id: string) => void;
    addEducation: (edu: Education) => void;
    updateEducation: (id: string, edu: Partial<Education>) => void;
    removeEducation: (id: string) => void;
    updateSkills: (skills: string) => void;
    updateProjects: (projects: string) => void;
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
    skills: '',
    projects: '',
};

export const useResumeStore = create<ResumeStore>((set) => ({
    data: initialData,
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
                experience: [...state.data.experience, exp],
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
                education: [...state.data.education, edu],
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
    updateSkills: (skills) =>
        set((state) => ({
            data: { ...state.data, skills },
        })),
    updateProjects: (projects) =>
        set((state) => ({
            data: { ...state.data, projects },
        })),
}));
