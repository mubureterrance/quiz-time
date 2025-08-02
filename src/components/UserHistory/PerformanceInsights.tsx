import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { QuizResult } from "../../hooks/useUserResults";
import type { Quiz } from "../../types/quiz.types";
import { usePerformanceMetrics } from '../../hooks/usePerformanceMetrics';
import { formatDate } from '../../utils/formatters';
import { EmptyState } from './EmptyState';
import { MetricsGrid } from '../../components/performance/MetricsGrid';
import { BestPerformanceCard } from '../../components/performance/BestPerformanceCard';
import { ImprovementAreasCard } from '../../components/performance/ImprovementAreasCard';
import { PerformanceStats } from '../../components/performance/PerformanceStats';

interface PerformanceInsightsProps {
  results: QuizResult[];
  quizzes: Quiz[];
}

export function PerformanceInsights({ results, quizzes }: PerformanceInsightsProps) {
  const metrics = usePerformanceMetrics(results, quizzes);

  const getQuizTitle = (quizId: string): string => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.title || "Unknown Quiz";
  };

  if (results.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Insights
        </h3>
      </div>

      <MetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.bestPerformance && (
          <BestPerformanceCard
            bestPerformance={metrics.bestPerformance}
            getQuizTitle={getQuizTitle}
            formatDate={formatDate}
          />
        )}
        <ImprovementAreasCard improvementAreas={metrics.improvementAreas} />
      </div>

      <PerformanceStats results={results} metrics={metrics} />
    </div>
  );
}