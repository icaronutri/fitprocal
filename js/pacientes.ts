
import { Patient } from '../types';

const STORAGE_KEY = 'fit_patients';

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'test-patient-001',
    name: 'Paciente Teste (Demo)',
    email: 'teste@fittracker.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15',
    gender: 'M',
    height: 180,
    observations: 'Paciente de teste para validação de fluxos.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PATIENTS));
    return INITIAL_PATIENTS;
  }
  return JSON.parse(data);
};

export const savePatient = (patient: Patient): void => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  if (index >= 0) {
    patients[index] = patient;
  } else {
    patients.push(patient);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

export const deletePatient = (id: string): void => {
  const patients = getPatients();
  const filtered = patients.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
