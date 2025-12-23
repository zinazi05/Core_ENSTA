
export interface Internship {
  id: string;
  student_id: string;
  company_name: string;
  internship_type: string;
  duration_weeks: number;
  year: number;
}

export interface Student {
  id: string;
  specialty_id: string | null;
  dept_id: string;
  first_name: string;
  last_name: string;
  year_of_study: number;
  internships: Internship[];
  wished_specialty?: string;
}

export interface Specialty {
  id: string;
  dept_id: string;
  name: string;
  field?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hasSpecialties: boolean;
  hasStages: boolean;
  specialties: Specialty[];
  futureSpecialties?: string[];
}

export interface CompanyRecommendation {
  company_name: string;
  count: number;
  avgDuration: number;
  mainInternshipType: string;
  specialtyId: string;
}

export type ViewType = 'dashboard' | 'explorer' | 'recommendations';
