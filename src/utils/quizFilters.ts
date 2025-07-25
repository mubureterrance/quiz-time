import type { Quiz, Badge } from '../types/quiz.types';

export const filterQuizzesBySearch = (quizzes: Quiz[], searchTerm: string): Quiz[] => {
  if (!searchTerm.trim()) return quizzes;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(lowercaseSearch)
  );
};

export const filterQuizzesByBadge = (quizzes: Quiz[], badgeId: string): Quiz[] => {
  if (!badgeId) return quizzes;
  return quizzes.filter((quiz) => quiz.badge === badgeId);
};

export const applyQuizFilters = (
  quizzes: Quiz[],
  searchTerm: string,
  selectedBadge: string
): Quiz[] => {
  let filtered = filterQuizzesBySearch(quizzes, searchTerm);
  filtered = filterQuizzesByBadge(filtered, selectedBadge);
  return filtered;
};