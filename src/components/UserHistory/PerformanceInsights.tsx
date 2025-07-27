import React from 'react';
import type { QuizResult } from "../../hooks/useUserResults";
import type { Quiz } from "../../types/quiz.types";
import { getPerformanceLevel } from "../../utils/performanceUtils";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Calendar,
  Award,
  BarChart3,
  Brain
} from 'lucide-react';

interface PerformanceInsightsProps {
  results: QuizResult[];
  quizzes: Quiz[];
}

interface TrendData {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface PerformanceMetrics {
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

export function PerformanceInsights({ results, quizzes }: PerformanceInsightsProps) {
  const calculateMetrics = (): PerformanceMetrics => {
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

    // Sort results by date (most recent first)
    const sortedResults = [...results].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate average score
    const averageScore = results.reduce((sum, result) => sum + result.percentage, 0) / results.length;

    // Find best performance
    const bestPerformance = results.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    );

    // Calculate recent trend (last 5 vs previous 5)
    const recentTrend = calculateTrend(sortedResults);

    // Calculate consistency (lower standard deviation = higher consistency)
    const variance = results.reduce((sum, result) => 
      sum + Math.pow(result.percentage - averageScore, 2), 0
    ) / results.length;
    const consistencyScore = Math.max(0, 100 - Math.sqrt(variance));

    // Identify improvement areas
    const improvementAreas = identifyImprovementAreas(results, quizzes);

    // Calculate streak data
    const streakData = calculateStreaks(sortedResults);

    return {
      averageScore,
      bestPerformance,
      recentTrend,
      consistencyScore,
      improvementAreas,
      streakData
    };
  };

  const calculateTrend = (sortedResults: QuizResult[]): TrendData => {
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
  };

  const identifyImprovementAreas = (results: QuizResult[], quizzes: Quiz[]): string[] => {
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

    return areas.slice(0, 3); // Return top 3 areas needing improvement
  };

  const calculateStreaks = (sortedResults: QuizResult[]): PerformanceMetrics['streakData'] => {
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

    // Check final streak
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    // Current streak from most recent
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
  };

  const getQuizTitle = (quizId: string): string => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.title || "Unknown Quiz";
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const metrics = calculateMetrics();
  const TrendIcon = metrics.recentTrend.icon;

  if (results.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Insights
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Complete some quizzes to see your performance insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Average Score */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Average Score
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {metrics.averageScore.toFixed(1)}%
          </div>
        </div>

        {/* Recent Trend */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendIcon className={`h-4 w-4 ${metrics.recentTrend.color}`} />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Recent Trend
            </span>
          </div>
          <div className={`text-sm ${metrics.recentTrend.color} font-medium`}>
            {metrics.recentTrend.description}
          </div>
        </div>

        {/* Consistency Score */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Consistency
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {metrics.consistencyScore.toFixed(0)}%
          </div>
        </div>

        {/* Current Streak */}
        <div className={`${
          metrics.streakData.type === 'pass' 
            ? 'bg-purple-50 dark:bg-purple-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'
        } rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Award className={`h-4 w-4 ${
              metrics.streakData.type === 'pass' ? 'text-purple-600' : 'text-red-600'
            }`} />
            <span className={`text-sm font-medium ${
              metrics.streakData.type === 'pass' 
                ? 'text-purple-900 dark:text-purple-100' 
                : 'text-red-900 dark:text-red-100'
            }`}>
              Current Streak
            </span>
          </div>
          <div className={`text-2xl font-bold ${
            metrics.streakData.type === 'pass' 
              ? 'text-purple-900 dark:text-purple-100' 
              : 'text-red-900 dark:text-red-100'
          }`}>
            {metrics.streakData.current} {metrics.streakData.type === 'pass' ? '✓' : '✗'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performance */}
        {metrics.bestPerformance && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Best Performance
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Quiz:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {getQuizTitle(metrics.bestPerformance.quizId)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
                <span className="text-sm font-bold text-green-600">
                  {metrics.bestPerformance.percentage}% 
                  ({metrics.bestPerformance.score}/{metrics.bestPerformance.totalQuestions})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(metrics.bestPerformance.date)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Improvement Areas */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-orange-500" />
            Areas for Improvement
          </h4>
          {metrics.improvementAreas.length > 0 ? (
            <div className="space-y-2">
              {metrics.improvementAreas.map((area, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  {area}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-green-600 dark:text-green-400">
              Great job! No specific areas need immediate attention.
            </p>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{results.length} total attempts</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>Longest streak: {metrics.streakData.longest}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>
              Pass rate: {((results.filter(r => r.percentage >= 70).length / results.length) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}