import React from 'react';
import { Calendar, Award, Target } from 'lucide-react';
import type { QuizResult } from '../../hooks/useUserResults';
import type { PerformanceMetrics } from '../../types/performance.types';

interface PerformanceStatsProps {
  results: QuizResult[];
  metrics: PerformanceMetrics;
}

export function PerformanceStats({ results, metrics }: PerformanceStatsProps) {
  const passRate = ((results.filter(r => r.percentage >= 70).length / results.length) * 100).toFixed(0);

  const stats = [
    {
      icon: Calendar,
      text: `${results.length} total attempts`
    },
    {
      icon: Award,
      text: `Longest streak: ${metrics.streakData.longest}`
    },
    {
      icon: Target,
      text: `Pass rate: ${passRate}%`
    }
  ];

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-1">
            <stat.icon className="h-4 w-4" />
            <span>{stat.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}