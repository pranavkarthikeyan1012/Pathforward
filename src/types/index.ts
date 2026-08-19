export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  earnedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  semester: string;
  cgpa: string;
  skills: string[];
  careerPath?: string;
  careerFitScore?: number;
  projects: string[];
  certifications: string[];
  badges: Badge[];
}

export interface RoadmapTask {
  id: string;
  semester: number;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface CareerRecommendation {
  primaryPath: string;
  primaryScore: number;
  backupPath: string;
  backupScore: number;
  scores: Record<string, number>;
  reasoning: string;
  strengths: string[];
  improvements: string[];
  nextStep: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  year: string;
  branch: string;
  type: 'alumni' | 'senior' | 'faculty';
  skills: string[];
}
