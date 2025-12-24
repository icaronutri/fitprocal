
export type Gender = 'M' | 'F';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  cref?: string;
  avatar?: string;
  settings?: {
    theme: Theme;
  };
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  height: number;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skinfolds {
  triceps: number;
  subscapular: number;
  biceps: number;
  midAxillary: number;
  suprailiac: number;
  abdominal: number;
  thigh: number;
}

export interface AssessmentPhotos {
  front?: string;
  back?: string;
  sideRight?: string;
  sideLeft?: string;
}

export interface Assessment {
  id: string;
  patientId: string;
  date: string;
  weight: number;
  skinfolds: Skinfolds;
  metrics: {
    bodyDensity: number;
    bodyFatPercentage: number;
    fatMassKg: number;
    leanMassKg: number;
    sumSkinfolds: number;
  };
  photos?: AssessmentPhotos;
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: FoodItem[];
}

export interface MealPlan {
  id: string;
  patientId: string;
  date: string;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    activityLevel: string;
  };
  meals: Meal[];
  active: boolean;
}
