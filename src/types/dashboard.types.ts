export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  percentage: number;
  date: string;
}

export interface Quiz {
  id: string;
  title: string;
  [key: string]: any;
}

export interface QuizAverage {
  id: string;
  title: string;
  avg: number;
  attempts: number;
}

export interface ActiveUser {
  displayName: string;
  attempts: number;
  avgScore: number;
}

export interface QuizAttemptCount {
  [quizId: string]: number;
}

export interface UserScoreData {
  [userId: string]: {
    total: number;
    count: number;
  };
}

export interface DashboardAnalytics {
  totalUsers: number;
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  mostPopularQuiz: Quiz | null;
  bestQuiz: QuizAverage | null;
  worstQuiz: QuizAverage | null;
  topActiveUsers: ActiveUser[];
  recentAttempts: QuizResult[];
  quizAverages: QuizAverage[];
  quizAttempts: QuizAttemptCount;
}