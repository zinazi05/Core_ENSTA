import React, { useState } from 'react';
import { SCHOOL_DEPARTMENTS } from '../constants';
import { Student, Internship } from '../types';

interface AddEntryModalProps {
  students: Student[];
  dbStatus: 'online' | 'demo';
  onClose: () => void;
}

interface InputProps {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

const API_BASE_URL = 'http://127.0.0.1:3005';
const INTERNSHIP_TYPES = ['Stage Ouvrier', 'Stage Technicien', 'Stage PFE', 'Stage de Perfectionnement'];

const AddEntryModal: React.FC<AddEntryModalProps> = ({ students, dbStatus, onClose }) => {
  const [mode, setMode] = useState<'student' | 'internship'>('student');
  const [formData, setFormData] = useState<any>({
    internship_type: INTERNSHIP_TYPES[0]
  });
  const [loading, setLoading] = useState(false);

  const selectedDept = SCHOOL_DEPARTMENTS.find(d => d.id === formData.dept_id);
  const availableSpecs = selectedDept?.specialties || [];

  const handleSaveDemo = (payload: any) => {
    const currentStudents = [...students];
    if (mode === 'student') {
        const newStudent: Student = { ...payload, internships: [] };
        currentStudents.push(newStudent);
    } else {
        const studentIndex = currentStudents.findIndex(s => s.id === payload.student_id);
        if (studentIndex !== -1) {
            if (!currentStudents[studentIndex].internships) currentStudents[studentIndex].internships = [];
            currentStudents[studentIndex].internships.push({ ...payload });
        }
    }
    localStorage.setItem('ensta_students', JSON.stringify(currentStudents));
    alert("Donnée sauvegardée localement (Navigateur) !");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { 
        ...formData, 
        id: formData.id || `${mode.charAt(0)}${Math.floor(Math.random() * 100000)}` 
    };

    if (dbStatus === 'demo') {
        handleSaveDemo(payload);
        setLoading(false);
        return;
    }

    try {
      const endpoint = mode === 'student' ? '/api/students' : '/api/internships';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        onClose();
      } else {
        handleSaveDemo(payload);
      }
    } catch {
      handleSaveDemo(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="bg-ensta-card w-full max-w-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <h2 className="text-xl font-normal uppercase italic text-white tracking-tighter">
            {dbStatus === 'online' ? 'Mode SQL Direct' : 'Mode Local'}
          </h2>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        <div className="flex bg-black/20 border-b border-white/5">
            <button type="button" onClick={() => setMode('student')} className={`flex-1 py-5 text-[10px] uppercase tracking-widest-smooth ${mode === 'student' ? 'text-ensta-red border-b-2 border-ensta-red' : 'text-white/20'}`}>Saisie Étudiant</button>
            <button type="button" onClick={() => setMode('internship')} className={`flex-1 py-5 text-[10px] uppercase tracking-widest-smooth ${mode === 'internship' ? 'text-ensta-red border-b-2 border-ensta-red' : 'text-white/20'}`}>Saisie Stage</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {mode === 'student' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" onChange={(v: string) => setFormData({...formData, first_name: v})} required />
                <Input label="Nom" onChange={(v: string) => setFormData({...formData, last_name: v})} required />
              </div>
              <div>
                <label className="text-[9px] uppercase text-white/30 block mb-2 tracking-widest-smooth">Département</label>
                <select className="w-full bg-black border border-white/10 text-white p-4 text-xs outline-none" onChange={e => setFormData({...formData, dept_id: e.target.value})} required>
                     <option value="">Sélectionner...</option>
                     {SCHOOL_DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              {availableSpecs.length > 0 && (
                <div>
                  <label className="text-[9px] uppercase text-white/30 block mb-2 tracking-widest-smooth">Spécialité</label>
                  <select className="w-full bg-black border border-white/10 text-white p-4 text-xs outline-none" onChange={e => setFormData({...formData, specialty_id: e.target.value})} required>
                     <option value="">Sélectionner...</option>
                     {availableSpecs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              <Input label="Année d'étude (1-5)" type="number" onChange={(v: string) => setFormData({...formData, year_of_study: parseInt(v)})} required />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase text-white/30 block mb-2 tracking-widest-smooth">Étudiant concerné</label>
                <select className="w-full bg-black border border-white/10 text-white p-4 text-xs outline-none" onChange={e => setFormData({...formData, student_id: e.target.value})} required>
                     <option value="">Choisir un étudiant...</option>
                     {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.id})</option>)}
                </select>
              </div>
              <Input label="Entreprise d'accueil" onChange={(v: string) => setFormData({...formData, company_name: v})} required />
              <div>
                <label className="text-[9px] uppercase text-white/30 block mb-2 tracking-widest-smooth">Type de stage</label>
                <select className="w-full bg-black border border-white/10 text-white p-4 text-xs outline-none" onChange={e => setFormData({...formData, internship_type: e.target.value})} required>
                     {INTERNSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <Input label="Durée (Semaines)" type="number" onChange={(v: string) => setFormData({...formData, duration_weeks: parseInt(v)})} required />
                  <Input label="Année du stage" type="number" onChange={(v: string) => setFormData({...formData, year: parseInt(v)})} required />
              </div>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-5 bg-ensta-red text-white text-[10px] uppercase font-bold tracking-widest-smooth hover:bg-white hover:text-ensta-red disabled:opacity-50 transition-all">
            {loading ? 'TRAITEMENT EN COURS...' : 'VALIDER L\'ENREGISTREMENT'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input: React.FC<InputProps> = ({ label, onChange, type = "text", required = false }) => (
  <div>
    <label className="text-[9px] uppercase text-white/30 block mb-2 tracking-widest-smooth">{label}</label>
    <input 
      type={type} 
      required={required}
      className="w-full bg-black border border-white/10 text-white p-4 text-xs focus:border-ensta-red outline-none transition-all"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} 
    />
  </div>
);

export default AddEntryModal;