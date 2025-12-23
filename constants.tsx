
import { Department } from './types';

export const SCHOOL_DEPARTMENTS: Department[] = [
  {
    id: 'dfst',
    code: 'DFST',
    name: 'Département de Formation de Base en Sciences et Technologies',
    hasSpecialties: false,
    hasStages: false,
    specialties: [],
    futureSpecialties: ['Automatique', 'Télécommunications', 'Électronique', 'Génie Mécanique', 'Génie Industriel', 'Mécatronique', 'Génie des Procédés', 'Électrotechnique']
  },
  {
    id: 'dfi',
    code: 'DFI',
    name: 'Département de Formation de Base en Informatique',
    hasSpecialties: false,
    hasStages: false,
    specialties: [],
    futureSpecialties: ['Intelligence Artificielle', 'Sécurité des Systèmes']
  },
  {
    id: 'di',
    code: 'DI',
    name: "Département d'Informatique",
    hasSpecialties: true,
    hasStages: true,
    specialties: [
      { id: 'di-ia', dept_id: 'di', name: 'Intelligence Artificielle et Applications' },
      { id: 'di-sec', dept_id: 'di', name: 'Sécurité des Systèmes' }
    ]
  },
  {
    id: 'geii',
    code: 'GEII',
    name: 'Département de Génie Électrique et Informatique Industrielle',
    hasSpecialties: true,
    hasStages: true,
    specialties: [
      { id: 'geii-auto', dept_id: 'geii', name: 'Automatique et Informatique Industrielle', field: 'Automatique' },
      { id: 'geii-tele', dept_id: 'geii', name: 'Systèmes de Télécommunications et Réseaux', field: 'Télécommunications' },
      { id: 'geii-emb', dept_id: 'geii', name: 'Systèmes Embarqués', field: 'Électronique' }
    ]
  },
  {
    id: 'gmp',
    code: 'GMP',
    name: 'Département de Génie Mécanique et Génie de Production',
    hasSpecialties: true,
    hasStages: true,
    specialties: [
      { id: 'gmp-gm', dept_id: 'gmp', name: 'Génie Mécanique' }
    ]
  },
  {
    id: 'gim',
    code: 'GIM',
    name: 'Département Génie Industriel et Maintenance',
    hasSpecialties: true,
    hasStages: true,
    specialties: [
      { id: 'gim-mimi', dept_id: 'gim', name: 'Management et Ingénierie de la Maintenance industrielle', field: 'Génie Industriel' },
      { id: 'gim-gi', dept_id: 'gim', name: 'Génie Industriel', field: 'Génie Industriel' },
      { id: 'gim-meca', dept_id: 'gim', name: 'Mécatronique', field: 'Electromécanique' }
    ]
  },
  {
    id: 'glt',
    code: 'GLT',
    name: 'Département de Génie Logistique et Transport',
    hasSpecialties: true,
    hasStages: true,
    specialties: [
      { id: 'glt-it', dept_id: 'glt', name: 'Ingénierie des Transports', field: 'Ingénierie des Transports' },
      { id: 'glt-icl', dept_id: 'glt', name: 'Ingénierie de la Chaîne Logistique', field: 'Ingénierie des Transports' }
    ]
  },
  {
    id: 'gp',
    code: 'GP',
    name: 'Département de Génie des Procédés',
    hasSpecialties: true,
    hasStages: true,
    specialties: [
      { id: 'gp-te', dept_id: 'gp', name: 'Traitement des Eaux', field: 'Génie des Procédés' },
      { id: 'gp-po', dept_id: 'gp', name: 'Procédés Organiques', field: 'Génie des Procédés' }
    ]
  },
  {
    id: 'elec',
    code: 'ELEC',
    name: 'Département d’Électrotechnique',
    hasSpecialties: true,
    hasStages: true,
    specialties: [
      { id: 'elec-te', dept_id: 'elec', name: 'Traction Électrique', field: 'Électrotechnique' }
    ]
  }
];