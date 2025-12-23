import { Student, Internship } from '../types';
import { SCHOOL_DEPARTMENTS } from '../constants';

const FIRST_NAMES = ['Amine', 'Yacine', 'Zaki', 'Omar', 'Karim', 'Sami', 'Inès', 'Lina', 'Meriem', 'Nour', 'Yasmine', 'Rayan'];
const LAST_NAMES = ['Boudiaf', 'Mansouri', 'Haddad', 'Kaci', 'Zidani', 'Belkacem', 'Hamidi', 'Said', 'Berrada'];

const PARTNERS = [
  'Air Algérie', 'Tassili Airlines', 'SNTF',
  'Saidal', 'Biopharm', 'Sanofi Algérie', 'Frater-Razes',
  'Tosyali Algérie', 'AQS', 'Sider El Hadjar',
  'Yassir', 'Heetch Algérie', 'TemTem',
  'Iris', 'Brandt Algérie', 'BOMARE COMPANY',
  'DP World Djazair', 'Port d’Alger', 'Port de Bejaia',
  'SNTA', 'STAEM'
];

const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMockData = (): Student[] => {
  const students: Student[] = [];
  const currentYear = 2025;

  SCHOOL_DEPARTMENTS.forEach(dept => {
    if (!dept.hasSpecialties) {
      // DFI et DFST (Prépa) : Entre 100 et 350 étudiants pour les deux années cumulées
      const count = Math.floor(Math.random() * 251) + 100; // 100 + [0-250] = 100-350
      for (let i = 0; i < count; i++) {
        students.push({
          id: `${dept.id}-s-${i}`,
          dept_id: dept.id,
          specialty_id: null,
          first_name: getRandom(FIRST_NAMES),
          last_name: getRandom(LAST_NAMES),
          year_of_study: Math.random() > 0.5 ? 1 : 2,
          internships: [],
          wished_specialty: dept.futureSpecialties ? getRandom(dept.futureSpecialties) : undefined
        });
      }
    } else {
      // Départements avec Spécialités (Années 3, 4, 5)
      dept.specialties.forEach(spec => {
        // Chaque spécialité : entre 5 et 60 étudiants
        const count = Math.floor(Math.random() * 56) + 5; // 5 + [0-55] = 5-60
        for (let i = 0; i < count; i++) {
          const studentId = `${spec.id}-s-${i}`;
          const years = [3, 4, 5];
          const year = years[Math.floor(Math.random() * years.length)];
          
          const internships: Internship[] = [];
          if (dept.hasStages) {
            // Stage Ouvrier (Année 3)
            if (year >= 3) {
                internships.push({
                  id: `${studentId}-i-3`,
                  student_id: studentId,
                  company_name: getRandom(PARTNERS),
                  internship_type: 'Stage Ouvrier',
                  duration_weeks: 4,
                  year: currentYear - (year - 3)
                });
            }
            // Stage Technicien (Année 4)
            if (year >= 4) {
                internships.push({
                  id: `${studentId}-i-4`,
                  student_id: studentId,
                  company_name: getRandom(PARTNERS),
                  internship_type: 'Stage Technicien',
                  duration_weeks: 6,
                  year: currentYear - (year - 4)
                });
            }
            // Stage PFE (Année 5)
            if (year === 5) {
                internships.push({
                  id: `${studentId}-i-5`,
                  student_id: studentId,
                  company_name: getRandom(PARTNERS),
                  internship_type: 'Stage PFE',
                  duration_weeks: 16,
                  year: currentYear
                });
            }
          }

          students.push({
            id: studentId,
            dept_id: dept.id,
            specialty_id: spec.id,
            first_name: getRandom(FIRST_NAMES),
            last_name: getRandom(LAST_NAMES),
            year_of_study: year,
            internships
          });
        }
      });
    }
  });

  return students;
};