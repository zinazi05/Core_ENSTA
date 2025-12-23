
import React, { useState, useEffect, useMemo } from 'react';
import { SCHOOL_DEPARTMENTS } from './constants';
import { ViewType, Student } from './types';
import DataExplorer from './components/DataExplorer';
import RecommendationView from './components/RecommendationView';
import AddEntryModal from './components/AddEntryModal';
import { generateMockData } from './data/mockGenerator';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'demo'>('demo');
  
  const [filterState, setFilterState] = useState<{ deptId: string | null; specId: string | null; company: string | null }>({
    deptId: null, specId: null, company: null
  });

  const loadData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3005/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setDbStatus('online');
      } else {
        throw new Error("Local mode");
      }
    } catch {
      setDbStatus('demo');
      const saved = localStorage.getItem('ensta_students');
      if (saved) {
        setStudents(JSON.parse(saved));
      } else {
        const mocks = generateMockData();
        setStudents(mocks);
        localStorage.setItem('ensta_students', JSON.stringify(mocks));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
        if (dbStatus === 'demo') loadData();
    }, 10000);
    return () => clearInterval(interval);
  }, [dbStatus]);

  const stats = useMemo(() => {
    const total = students.length;
    const internships = students.flatMap(s => s.internships || []);
    const companyCounts = internships.reduce((acc, i) => {
      acc[i.company_name] = (acc[i.company_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const top = Object.entries(companyCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
    return { total, count: internships.length, top };
  }, [students]);

  return (
    <div className="min-h-screen bg-ensta-black flex flex-col md:flex-row antialiased">
      <nav className="w-full md:w-72 bg-black text-white md:h-screen sticky top-0 flex flex-col z-30 border-r border-white/5">
        <div className="p-10 pt-14 border-b border-white/5">
          <h2 className="font-normal text-2xl uppercase italic text-ensta-red tracking-tight">Core-ENSTA</h2>
          <span className="text-[10px] mt-2 text-white/40 tracking-widest-smooth uppercase">Gestionnaire de Données</span>
        </div>
        
        <div className="flex-1 py-8">
          <NavItem active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} label="TABLEAU DE BORD" />
          <NavItem active={activeView === 'explorer'} onClick={() => setActiveView('explorer')} label="EXPLORATEUR" />
          <NavItem active={activeView === 'recommendations'} onClick={() => setActiveView('recommendations')} label="PARTENAIRES" />
        </div>

        <div className="p-8 border-t border-white/5">
             <button onClick={() => setIsModalOpen(true)} className="w-full py-4 bg-ensta-red text-white text-[10px] uppercase font-bold tracking-widest-smooth hover:bg-white hover:text-ensta-red transition-all shadow-lg shadow-ensta-red/10">
                + AJOUTER DONNÉE
             </button>
        </div>

        <div className="p-8 border-t border-white/5 bg-black">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
            <p className={`text-[10px] uppercase font-bold ${dbStatus === 'online' ? 'text-green-500' : 'text-orange-500'}`}>
                {dbStatus === 'online' ? 'SQL CONNECTÉ' : 'MODE LOCAL ACTIF'}
            </p>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto h-screen p-8 md:p-12 max-w-7xl mx-auto w-full no-scrollbar">
        <header className="mb-12 border-b border-white/5 pb-8">
            <h1 className="text-4xl font-normal text-white uppercase italic tracking-tighter">
                {activeView === 'dashboard' ? 'Analyse Globale' : activeView === 'explorer' ? 'Registre Étudiant' : 'Statistiques Entreprises'}
            </h1>
        </header>

        {loading ? (
          <div className="h-96 flex items-center justify-center text-ensta-red animate-pulse uppercase text-[10px] tracking-widest">Chargement...</div>
        ) : activeView === 'dashboard' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-ensta-card p-10 border border-ensta-border hover:border-white/10 transition-all">
                  <span className="text-[10px] text-white/30 uppercase block mb-4 tracking-widest-smooth">Étudiants Enregistrés</span>
                  <span className="text-6xl italic text-white">{stats.total}</span>
                </div>
                <div className="bg-ensta-card p-10 border border-ensta-border hover:border-white/10 transition-all">
                  <span className="text-[10px] text-white/30 uppercase block mb-4 tracking-widest-smooth">Stages Validés</span>
                  <span className="text-6xl italic text-ensta-red">{stats.count}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-[10px] uppercase text-white/20 tracking-widest-smooth border-b border-white/5 pb-2">Départements</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {SCHOOL_DEPARTMENTS.map(d => (
                            <div key={d.id} className="p-5 border border-white/5 bg-ensta-card hover:bg-white/5 cursor-pointer flex justify-between items-center" onClick={() => {setFilterState({deptId: d.id, specId: null, company: null}); setActiveView('explorer')}}>
                                <div>
                                    <p className="text-[9px] text-ensta-red/50 mb-1 font-mono">{d.code}</p>
                                    <h4 className="text-white text-xs uppercase tracking-tight">{d.name}</h4>
                                </div>
                                <svg className="w-4 h-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-[10px] uppercase text-white/20 tracking-widest-smooth border-b border-white/5 pb-2">Top Partenaires</h3>
                    {stats.top.map(([name, count]) => (
                        <div key={name} className="flex justify-between p-4 bg-ensta-card border border-white/5 hover:border-ensta-red/30 transition-all">
                            <span className="text-[10px] text-white/70 uppercase tracking-tight">{name}</span>
                            <span className="text-xs text-ensta-red font-bold italic">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : activeView === 'explorer' ? (
          <DataExplorer 
            students={students} 
            initialDeptId={filterState.deptId} 
            initialSpecId={filterState.specId}
            initialCompany={filterState.company}
          />
        ) : (
          <RecommendationView students={students} />
        )}

        {isModalOpen && <AddEntryModal students={students} dbStatus={dbStatus} onClose={() => {setIsModalOpen(false); loadData();}} />}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`w-full flex items-center px-10 py-5 relative group overflow-hidden transition-colors`}>
    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-ensta-red transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}></div>
    <span className={`relative text-[10px] uppercase tracking-widest-smooth ${active ? 'text-white' : 'text-white/30 hover:text-white'}`}>{label}</span>
  </button>
);

export default App;