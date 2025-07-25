import type { Quiz, QuizResult, QuizAttemptCount, QuizAverage } from '../types/dashboard.types';

export const groupResultsByQuiz = (results: QuizResult[]): QuizAttemptCount => {
  return results.reduce((acc, result) => {
    acc[result.quizId] = (acc[result.quizId] || 0) + 1;
    return acc;
  }, {} as QuizAttemptCount);
};

export const findMostPopularQuiz = (
  quizAttempts: QuizAttemptCount,
  quizzes: Quiz[]
): Quiz | null => {
  const mostPopularQuizId = Object.entries(quizAttempts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];
    
  return quizzes.find((quiz) => quiz.id === mostPopularQuizId) || null;
};

export const calculateQuizAverages = (
  quizzes: Quiz[],
  results: QuizResult[],
  quizAttempts: QuizAttemptCount
): QuizAverage[] => {
  const quizScores = results.reduce((acc, result) => {
    if (!acc[result.quizId]) {
      acc[result.quizId] = { total: 0, count: 0 };
    }
    acc[result.quizId].total += result.percentage;
    acc[result.quizId].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    avg: quizScores[quiz.id] 
      ? Math.round(quizScores[quiz.id].total / quizScores[quiz.id].count)
      : 0,
    attempts: quizAttempts[quiz.id] || 0,
  }));
};

export const findBestAndWorstQuizzes = (quizAverages: QuizAverage[]) => {
  const quizzesWithAttempts = quizAverages.filter((quiz) => quiz.attempts > 0);
  
  const bestQuiz = quizzesWithAttempts
    .sort((a, b) => b.avg - a.avg)[0] || null;
    
  const worstQuiz = quizzesWithAttempts
    .sort((a, b) => a.avg - b.avg)[0] || null;
    
  return { bestQuiz, worstQuiz };
};
