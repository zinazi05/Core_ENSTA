
import React, { useState, useEffect } from 'react';
import { SCHOOL_DEPARTMENTS } from '../constants';
import { Student } from '../types';

interface DataExplorerProps {
  students: Student[];
  initialDeptId?: string | null;
  initialSpecId?: string | null;
  initialCompany?: string | null;
}

const DataExplorer: React.FC<DataExplorerProps> = ({ students, initialDeptId, initialSpecId, initialCompany }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(initialDeptId || null);
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(initialSpecId || null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(initialCompany || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDeptId(initialDeptId || null);
    setSelectedSpecId(initialSpecId || null);
    setSelectedCompany(initialCompany || null);
  }, [initialDeptId, initialSpecId, initialCompany]);

  const selectedDept = SCHOOL_DEPARTMENTS.find(d => d.id === selectedDeptId) || null;
  const isPrepDept = selectedDeptId === 'dfi' || selectedDeptId === 'dfst';

  const filteredStudents = students.filter(s => {
    const deptMatch = selectedDeptId ? s.dept_id === selectedDeptId : true;
    const specMatch = selectedSpecId ? s.specialty_id === selectedSpecId : true;
    const companyMatch = selectedCompany ? s.internships.some(i => i.company_name === selectedCompany) : true;
    const searchMatch = searchQuery 
      ? `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return deptMatch && specMatch && companyMatch && searchMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-ensta-card border border-ensta-border p-6 flex items-center gap-6">
        <div className="w-10 h-10 bg-ensta-red/10 flex items-center justify-center border border-ensta-red/20">
            <svg className="w-5 h-5 text-ensta-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input 
          type="text"
          placeholder="RECHERCHER UN ÉTUDIANT..."
          className="flex-1 bg-transparent border-none text-white focus:ring-0 text-sm tracking-widest-smooth uppercase placeholder:text-white/10"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-ensta-border border border-ensta-border">
        <div className="bg-ensta-card p-6">
          <label className="block text-[9px] font-normal uppercase tracking-widest-smooth text-white/30 mb-3">Département</label>
          <select 
            className="w-full text-sm bg-transparent border-none focus:ring-0 cursor-pointer p-0 text-white/80 appearance-none"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedDeptId(e.target.value || null);
              setSelectedSpecId(null);
            }}
            value={selectedDeptId || ''}
          >
            <option value="" className="bg-ensta-card">Tous les départements</option>
            {SCHOOL_DEPARTMENTS.map(d => <option key={d.id} value={d.id} className="bg-ensta-card">{d.name}</option>)}
          </select>
        </div>

        <div className="bg-ensta-card p-6">
          <label className="block text-[9px] font-normal uppercase tracking-widest-smooth text-white/30 mb-3">Spécialité</label>
          <select 
            className="w-full text-sm bg-transparent border-none focus:ring-0 disabled:opacity-20 cursor-pointer p-0 text-white/80 appearance-none"
            disabled={!selectedDept?.hasSpecialties}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSpecId(e.target.value || null)}
            value={selectedSpecId || ''}
          >
            <option value="" className="bg-ensta-card">Toutes les spécialités</option>
            {selectedDept?.specialties.map(s => <option key={s.id} value={s.id} className="bg-ensta-card">{s.name}</option>)}
          </select>
        </div>

        <div className="bg-ensta-card p-6 flex flex-col justify-between">
          <label className="block text-[9px] font-normal uppercase tracking-widest-smooth text-white/30 mb-3">Entreprise</label>
          <div className="flex items-center justify-between">
             <span className="text-sm font-normal truncate max-w-[150px] text-white/80">{selectedCompany || "Aucun filtre"}</span>
             {selectedCompany && (
                 <button onClick={() => setSelectedCompany(null)} className="text-[9px] px-3 py-1 bg-ensta-red text-white uppercase hover:bg-white hover:text-ensta-red">Reset</button>
             )}
          </div>
        </div>
      </div>

      <div className="bg-ensta-card border border-ensta-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-black/40 text-white/40 border-b border-ensta-border">
              <tr>
                <th className="px-8 py-6 text-[10px] font-normal uppercase tracking-widest-smooth">Identité</th>
                <th className="px-6 py-6 text-[10px] font-normal uppercase tracking-widest-smooth">Promotion</th>
                {!isPrepDept && <th className="px-6 py-6 text-[10px] font-normal uppercase tracking-widest-smooth">Dept.</th>}
                <th className="px-8 py-6 text-[10px] font-normal uppercase tracking-widest-smooth text-right">Stages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.length > 0 ? filteredStudents.map(s => (
                  <React.Fragment key={s.id}>
                    <tr className="hover:bg-white/5 cursor-pointer" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                      <td className="px-8 py-5 text-sm text-white/90">{s.first_name} {s.last_name}</td>
                      <td className="px-6 py-5 text-white/30">{s.year_of_study}{s.year_of_study === 1 ? 'ère' : 'ème'} Année</td>
                      {!isPrepDept && <td className="px-6 py-5 font-mono text-[10px] text-ensta-red/50">{SCHOOL_DEPARTMENTS.find(d => d.id === s.dept_id)?.code}</td>}
                      <td className="px-8 py-5 text-right">
                        <span className={`inline-block px-3 py-1 text-[10px] ${s.internships.length > 0 ? 'bg-ensta-red text-white' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                            {s.internships.length} Stages
                        </span>
                      </td>
                    </tr>
                    {expandedId === s.id && (
                        <tr className="bg-black/20">
                            <td colSpan={isPrepDept ? 3 : 4} className="px-8 py-8 border-t border-ensta-red/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {s.internships.map((i, idx) => (
                                        <div key={idx} className="p-4 border border-white/5 bg-ensta-card">
                                            <p className="text-white text-xs mb-1 uppercase font-bold">{i.company_name}</p>
                                            <p className="text-[10px] text-white/40">{i.internship_type} — {i.duration_weeks} sem.</p>
                                        </div>
                                    ))}
                                    {s.internships.length === 0 && <p className="text-[10px] uppercase text-white/20">Aucun stage enregistré</p>}
                                </div>
                            </td>
                        </tr>
                    )}
                  </React.Fragment>
              )) : (
                <tr><td colSpan={isPrepDept ? 3 : 4} className="py-20 text-center text-white/20 uppercase text-[10px]">Aucun résultat</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
