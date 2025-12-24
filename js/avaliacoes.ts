
import { Assessment } from '../types';

const STORAGE_KEY = 'fit_assessments';

export const getAssessments = (): Assessment[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAssessment = (assessment: Assessment): void => {
  const assessments = getAssessments();
  assessments.push(assessment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
};

export const getAssessmentsByPatient = (patientId: string): Assessment[] => {
  return getAssessments().filter(a => a.patientId === patientId);
};
