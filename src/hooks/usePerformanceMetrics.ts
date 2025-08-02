import { useMemo } from 'react';
import type { QuizResult } from '../hooks/useUserResults';
import type { Quiz } from '../types/quiz.types';
import type { PerformanceMetrics, TrendData } from '../types/performance.types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function usePerformanceMetrics(results: QuizResult[], quizzes: Quiz[]): PerformanceMetrics {
  return useMemo(() => {
    if (results.length === 0) {
      return {
        averageScore: 0,
        bestPerformance: null,
        recentTrend: {
          direction: 'stable',
          percentage: 0,
          icon: Minus,
          color: 'text-gray-500',
          description: 'No data available'
        },
        consistencyScore: 0,
        improvementAreas: [],
        streakData: { current: 0, longest: 0, type: 'pass' }
      };
    }

    const sortedResults = [...results].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const averageScore = results.reduce((sum, result) => sum + result.percentage, 0) / results.length;

    const bestPerformance = results.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    );

    const recentTrend = calculateTrend(sortedResults);

    const variance = results.reduce((sum, result) => 
      sum + Math.pow(result.percentage - averageScore, 2), 0
    ) / results.length;
    const consistencyScore = Math.max(0, 100 - Math.sqrt(variance));

    const improvementAreas = identifyImprovementAreas(results, quizzes);
    const streakData = calculateStreaks(sortedResults);

    return {
      averageScore,
      bestPerformance,
      recentTrend,
      consistencyScore,
      improvementAreas,
      streakData
    };
  }, [results, quizzes]);
}

function calculateTrend(sortedResults: QuizResult[]): TrendData {
  if (sortedResults.length < 2) {
    return {
      direction: 'stable',
      percentage: 0,
      icon: Minus,
      color: 'text-gray-500',
      description: 'Need more attempts for trend analysis'
    };
  }

  const recentCount = Math.min(5, Math.floor(sortedResults.length / 2));
  const recent = sortedResults.slice(0, recentCount);
  const previous = sortedResults.slice(recentCount, recentCount * 2);

  if (previous.length === 0) {
    return {
      direction: 'stable',
      percentage: 0,
      icon: Minus,
      color: 'text-gray-500',
      description: 'Need more attempts for comparison'
    };
  }

  const recentAvg = recent.reduce((sum, r) => sum + r.percentage, 0) / recent.length;
  const previousAvg = previous.reduce((sum, r) => sum + r.percentage, 0) / previous.length;
  
  const change = recentAvg - previousAvg;
  const changePercentage = Math.abs(change);

  if (Math.abs(change) < 2) {
    return {
      direction: 'stable',
      percentage: changePercentage,
      icon: Minus,
      color: 'text-gray-500',
      description: 'Performance is stable'
    };
  }

  if (change > 0) {
    return {
      direction: 'up',
      percentage: changePercentage,
      icon: TrendingUp,
      color: 'text-green-600',
      description: `Improving by ${changePercentage.toFixed(1)}%`
    };
  }

  return {
    direction: 'down',
    percentage: changePercentage,
    icon: TrendingDown,
    color: 'text-red-600',
    description: `Declining by ${changePercentage.toFixed(1)}%`
  };
}

function identifyImprovementAreas(results: QuizResult[], quizzes: Quiz[]): string[] {
  const quizPerformance = new Map<string, number[]>();
  
  results.forEach(result => {
    if (!quizPerformance.has(result.quizId)) {
      quizPerformance.set(result.quizId, []);
    }
    quizPerformance.get(result.quizId)!.push(result.percentage);
  });

  const areas: string[] = [];
  
  quizPerformance.forEach((scores, quizId) => {
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (avgScore < 70) {
      const quiz = quizzes.find(q => q.id === quizId);
      if (quiz) {
        areas.push(quiz.title);
      }
    }
  });

  return areas.slice(0, 3);
}

function calculateStreaks(sortedResults: QuizResult[]): PerformanceMetrics['streakData'] {
  if (sortedResults.length === 0) {
    return { current: 0, longest: 0, type: 'pass' };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakType: 'pass' | 'fail' = sortedResults[0].percentage >= 70 ? 'pass' : 'fail';
  let tempStreak = 1;
  let tempType = currentStreakType;

  for (let i = 1; i < sortedResults.length; i++) {
    const currentType = sortedResults[i].percentage >= 70 ? 'pass' : 'fail';
    
    if (currentType === tempType) {
      tempStreak++;
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 1;
      tempType = currentType;
    }
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  currentStreak = 1;
  for (let i = 1; i < sortedResults.length; i++) {
    const currentType = sortedResults[i].percentage >= 70 ? 'pass' : 'fail';
    if (currentType === currentStreakType) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    current: currentStreak,
    longest: longestStreak,
    type: currentStreakType
  };
}