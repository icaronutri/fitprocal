
import { Skinfolds, Gender } from '../types';

/**
 * Jackson & Pollock 7-site formula for Body Density
 */
export const calculateBodyDensity = (sum: number, age: number, gender: Gender): number => {
  if (gender === 'M') {
    return 1.112 - (0.00043499 * sum) + (0.00000055 * Math.pow(sum, 2)) - (0.00028826 * age);
  } else {
    return 1.097 - (0.00046971 * sum) + (0.00000056 * Math.pow(sum, 2)) - (0.00012828 * age);
  }
};

/**
 * Siri Equation for body fat percentage
 */
export const calculateBodyFatPercentage = (bodyDensity: number): number => {
  return ((4.95 / bodyDensity) - 4.50) * 100;
};

export const getAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
