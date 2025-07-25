import { useMemo } from 'react';
import type { User } from './useUsers';
import type { Quiz, QuizResult, DashboardAnalytics } from '../types/dashboard.types';
import { calculateAverageScore } from '../utils/scoreCalculations';
import { 
  groupResultsByQuiz, 
  findMostPopularQuiz, 
  calculateQuizAverages, 
  findBestAndWorstQuizzes 
} from '../utils/quizAnalytics';
import { calculateTopActiveUsers, getRecentAttempts } from '../utils/userAnalytics';

interface UseDashboardAnalyticsProps {
  users: User[];
  quizzes: Quiz[];
  results: QuizResult[];
}

export const useDashboardAnalytics = ({
  users,
  quizzes,
  results,
}: UseDashboardAnalyticsProps): DashboardAnalytics => {
  return useMemo(() => {
    const quizAttempts = groupResultsByQuiz(results);
    const quizAverages = calculateQuizAverages(quizzes, results, quizAttempts);
    const { bestQuiz, worstQuiz } = findBestAndWorstQuizzes(quizAverages);

    return {
      totalUsers: users.length,
      totalQuizzes: quizzes.length,
      totalAttempts: results.length,
      averageScore: calculateAverageScore(results),
      mostPopularQuiz: findMostPopularQuiz(quizAttempts, quizzes),
      bestQuiz,
      worstQuiz,
      topActiveUsers: calculateTopActiveUsers(results, users),
      recentAttempts: getRecentAttempts(results),
      quizAverages,
      quizAttempts,
    };
  }, [users, quizzes, results]);
};