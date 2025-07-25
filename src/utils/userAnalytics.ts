import type { QuizResult, ActiveUser, UserScoreData } from '../types/dashboard.types';
import type { User } from '../hooks/useUsers';
import { LIMITS } from '../constants/dashboard.constants';

export const calculateTopActiveUsers = (
  results: QuizResult[],
  users: User[]
): ActiveUser[] => {
  const userAttempts: Record<string, number> = {};
  const userScores: UserScoreData = {};

  results.forEach((result) => {
    userAttempts[result.userId] = (userAttempts[result.userId] || 0) + 1;
    
    if (!userScores[result.userId]) {
      userScores[result.userId] = { total: 0, count: 0 };
    }
    userScores[result.userId].total += result.percentage;
    userScores[result.userId].count += 1;
  });

  return Object.entries(userAttempts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, LIMITS.TOP_USERS)
    .map(([userId, attempts]) => {
      const user = users.find((u) => u.uid === userId);
      const avgScore = userScores[userId]
        ? Math.round(userScores[userId].total / userScores[userId].count)
        : 0;
        
      return {
        displayName: user?.displayName || userId,
        attempts,
        avgScore,
      };
    });
};

export const getRecentAttempts = (results: QuizResult[]): QuizResult[] => {
  return [...results]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, LIMITS.RECENT_ATTEMPTS);
};