export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface Quiz {
  id: string;
  title: string;
  badge: string;
  questions: Question[];
}

export interface QuizForm {
  title: string;
  badge: string;
  questions: Question[];
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface BadgeStats extends Badge {
  count: number;
}

export interface QuizResult {
  quizId: string;
  percentage: number;
  date: string;
}

export interface PerformanceData {
  percentage: number;
}

export interface UserHistory {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  recentActivity: QuizResult[];
  performanceByQuiz: Record<string, PerformanceData>;
}
