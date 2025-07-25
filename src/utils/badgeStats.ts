import type { Quiz, Badge, BadgeStats } from '../types/quiz.types';

export const calculateBadgeStats = (badges: Badge[], quizzes: Quiz[]): BadgeStats[] => {
  return badges.map((badge) => ({
    ...badge,
    count: quizzes.filter((quiz) => quiz.badge === badge.id).length,
  }));
};