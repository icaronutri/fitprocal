
import { Assessment } from '../types';

const STORAGE_KEY = 'fit_assessments';

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'a1',
    patientId: 'test-patient-001',
    date: '2025-01-15',
    weight: 88,
    skinfolds: { triceps: 18, subscapular: 22, biceps: 12, midAxillary: 16, suprailiac: 25, abdominal: 28, thigh: 22 },
    metrics: { bodyDensity: 1.03, bodyFatPercentage: 28.5, fatMassKg: 25.0, leanMassKg: 63.0, sumSkinfolds: 143 },
    photos: { front: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' }
  },
  {
    id: 'a2',
    patientId: 'test-patient-001',
    date: '2025-06-10',
    weight: 85,
    skinfolds: { triceps: 15, subscapular: 18, biceps: 10, midAxillary: 14, suprailiac: 22, abdominal: 25, thigh: 20 },
    metrics: { bodyDensity: 1.04, bodyFatPercentage: 25.5, fatMassKg: 21.6, leanMassKg: 63.4, sumSkinfolds: 124 },
    photos: { front: 'https://images.unsplash.com/photo-1517838276537-88301ec4f4bb?w=800' }
  },
  {
    id: 'a3',
    patientId: 'test-patient-001',
    date: '2025-12-23',
    weight: 80,
    skinfolds: { triceps: 12, subscapular: 15, biceps: 8, midAxillary: 11, suprailiac: 18, abdominal: 20, thigh: 16 },
    metrics: { bodyDensity: 1.06, bodyFatPercentage: 18.2, fatMassKg: 14.5, leanMassKg: 65.5, sumSkinfolds: 100 },
    photos: { front: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800' }
  }
];

export const getAssessments = (): Assessment[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASSESSMENTS));
    return INITIAL_ASSESSMENTS;
  }
  return JSON.parse(data);
};

export const saveAssessment = (assessment: Assessment): void => {
  const assessments = getAssessments();
  assessments.push(assessment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
};

export const getAssessmentsByPatient = (patientId: string): Assessment[] => {
  return getAssessments().filter(a => a.patientId === patientId);
};
