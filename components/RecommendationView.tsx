
import React, { useMemo, useState } from 'react';
import { SCHOOL_DEPARTMENTS } from '../constants';
import { Student, CompanyRecommendation } from '../types';

interface RecommendationViewProps {
  students: Student[];
}

const RecommendationView: React.FC<RecommendationViewProps> = ({ students }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  const recommendations = useMemo(() => {
    const recs: CompanyRecommendation[] = [];
    
    SCHOOL_DEPARTMENTS.forEach(dept => {
      dept.specialties.forEach(spec => {
        const specStudents = students.filter(s => s.specialty_id === spec.id);
        const internships = specStudents.flatMap(s => s.internships || []);
        
        const companyData: Record<string, { count: number; totalDuration: number; types: Record<string, number> }> = {};
        
        internships.forEach(i => {
          if (!companyData[i.company_name]) {
            companyData[i.company_name] = { count: 0, totalDuration: 0, types: {} };
          }
          companyData[i.company_name].count++;
          companyData[i.company_name].totalDuration += i.duration_weeks;
          companyData[i.company_name].types[i.internship_type] = (companyData[i.company_name].types[i.internship_type] || 0) + 1;
        });

        Object.entries(companyData).forEach(([name, data]) => {
          const sortedTypes = Object.entries(data.types).sort(([, a], [, b]) => b - a);
          const mainType = sortedTypes.length > 0 ? sortedTypes[0][0] : 'Inconnu';
          
          recs.push({
            company_name: name,
            count: data.count,
            avgDuration: data.count > 0 ? Math.round(data.totalDuration / data.count) : 0,
            mainInternshipType: mainType,
            specialtyId: spec.id
          });
        });
      });
    });

    return recs.sort((a, b) => b.count - a.count);
  }, [students]);

  const filteredRecs = selectedDeptId 
    ? recommendations.filter(r => {
        const spec = SCHOOL_DEPARTMENTS.flatMap(d => d.specialties).find(s => s.id === r.specialtyId);
        return spec?.dept_id === selectedDeptId;
      })
    : recommendations;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setSelectedDeptId(null)}
          className={`px-6 py-2 rounded-full text-[10px] font-normal uppercase tracking-widest-smooth border transition-all ${!selectedDeptId ? 'bg-ensta-red text-white border-ensta-red' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
        >
          Tous les Départements
        </button>
        {SCHOOL_DEPARTMENTS.filter(d => d.hasSpecialties).map(d => (
          <button 
            key={d.id}
            onClick={() => setSelectedDeptId(d.id)}
            className={`px-6 py-2 rounded-full text-[10px] font-normal uppercase tracking-widest-smooth border transition-all ${selectedDeptId === d.id ? 'bg-ensta-red text-white border-ensta-red' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
          >
            {d.code}
          </button>
        ))}
      </div>

      {filteredRecs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecs.slice(0, 24).map((rec, idx) => {
            const spec = SCHOOL_DEPARTMENTS.flatMap(d => d.specialties).find(s => s.id === rec.specialtyId);
            const dept = SCHOOL_DEPARTMENTS.find(d => d.id === spec?.dept_id);

            return (
              <div key={`${rec.company_name}-${rec.specialtyId}-${idx}`} className="group bg-ensta-card p-8 border border-ensta-border hover:border-ensta-red/30 transition-all smooth-shadow hover:-translate-y-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-normal text-white/20 uppercase tracking-widest-smooth">{dept?.code} — {spec?.name}</p>
                    <h3 className="text-xl font-normal text-white/90 tracking-tight leading-none group-hover:text-ensta-red">{rec.company_name}</h3>
                  </div>
                  <div className="bg-black/40 w-10 h-10 flex items-center justify-center border border-white/5">
                    <span className="text-ensta-red text-xs font-normal italic">#{idx + 1}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/20 p-4 border border-white/5">
                    <p className="text-[9px] font-normal text-white/20 uppercase tracking-widest-smooth mb-1">Stagiaires</p>
                    <p className="text-2xl font-normal italic text-white/80">{rec.count}</p>
                  </div>
                  <div className="bg-black/20 p-4 border border-white/5">
                    <p className="text-[9px] font-normal text-white/20 uppercase tracking-widest-smooth mb-1">Moyenne</p>
                    <p className="text-2xl font-normal italic text-white/80">{rec.avgDuration} <span className="text-[10px] uppercase not-italic">Sems</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-[9px] font-normal uppercase tracking-widest-smooth text-white/20">Type Majoritaire</span>
                  <span className={`text-[9px] font-normal px-3 py-1 uppercase tracking-wider ${rec.mainInternshipType === 'Stage PFE' ? 'bg-ensta-red text-white' : 'bg-white/10 text-white/60'}`}>
                      {rec.mainInternshipType}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center bg-ensta-card border border-ensta-border">
          <p className="text-[10px] font-normal text-white/20 uppercase tracking-widest-smooth">Aucune recommandation disponible pour ce département</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationView;