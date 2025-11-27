export interface Education {
  institution?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
}

export interface WorkExperience {
  id?: string;
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Language {
  language?: string;
  level?: string;
}

export interface ResumeData {
  title?: string;
  name: string;
  profession?: string;
  email: string;
  phone: string;
  location?: string;
  address?: string;
  github?: string;
  linkedin?: string;
  behance?: string;
  telegram?: string;
  dribbble?: string;
  adobePortfolio?: string;
  photo?: string | File;
  skills?: string[];
  educations?: Education[];
  education?: Education[];
  workExperiences?: WorkExperience[];
  languages?: Language[];
  summary?: string;
  template?: string;
}

export interface IResume extends ResumeData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}
