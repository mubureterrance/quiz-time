import type { QuizResult } from '../types/dashboard.types';

export const calculateAverageScore = (results: QuizResult[]): number => {
  if (results.length === 0) return 0;
  
  const totalScore = results.reduce((sum, result) => sum + result.percentage, 0);
  return Math.round(totalScore / results.length);
};