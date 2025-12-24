
import { Gender } from '../types';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra: 1.9
};

/**
 * Mifflin-St Jeor Equation for BMR
 */
export const calculateBMR = (weight: number, height: number, age: number, gender: Gender): number => {
  if (gender === 'M') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  }
  return (10 * weight) + (6.25 * height) - (5 * age) - 161;
};

export const calculateTDEE = (bmr: number, level: ActivityLevel): number => {
  return bmr * activityMultipliers[level];
};

export const distributeMacros = (calories: number, ratio: { p: number, c: number, f: number }) => {
  return {
    protein: Math.round((calories * (ratio.p / 100)) / 4),
    carbs: Math.round((calories * (ratio.c / 100)) / 4),
    fat: Math.round((calories * (ratio.f / 100)) / 9)
  };
};
