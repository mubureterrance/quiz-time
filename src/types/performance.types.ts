import type { QuizResult } from "../hooks/useUserResults";

// types/performance.types.ts
export interface TrendData {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

export interface PerformanceMetrics {
  averageScore: number;
  bestPerformance: QuizResult | null;
  recentTrend: TrendData;
  consistencyScore: number;
  improvementAreas: string[];
  streakData: {
    current: number;
    longest: number;
    type: 'pass' | 'fail';
  };
}
