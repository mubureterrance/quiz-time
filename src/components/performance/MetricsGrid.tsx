import React from 'react';
import { Target, BarChart3, Award } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { PerformanceMetrics } from '../../types/performance.types';

interface MetricsGridProps {
  metrics: PerformanceMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const TrendIcon = metrics.recentTrend.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        icon={Target}
        title="Average Score"
        value={`${metrics.averageScore.toFixed(1)}%`}
        className="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600"
        textColor="text-blue-900 dark:text-blue-100"
      />

      <MetricCard
        icon={TrendIcon}
        title="Recent Trend"
        value=""
        className="bg-gray-50 dark:bg-gray-800"
        iconColor={metrics.recentTrend.color}
        textColor="text-gray-900 dark:text-gray-100"
        subtitle={metrics.recentTrend.description}
      />

      <MetricCard
        icon={BarChart3}
        title="Consistency"
        value={`${metrics.consistencyScore.toFixed(0)}%`}
        className="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600"
        textColor="text-green-900 dark:text-green-100"
      />

      <MetricCard
        icon={Award}
        title="Current Streak"
        value={`${metrics.streakData.current} ${metrics.streakData.type === 'pass' ? '✓' : '✗'}`}
        className={metrics.streakData.type === 'pass' 
          ? 'bg-purple-50 dark:bg-purple-900/20' 
          : 'bg-red-50 dark:bg-red-900/20'
        }
        iconColor={metrics.streakData.type === 'pass' ? 'text-purple-600' : 'text-red-600'}
        textColor={metrics.streakData.type === 'pass' 
          ? 'text-purple-900 dark:text-purple-100' 
          : 'text-red-900 dark:text-red-100'
        }
      />
    </div>
  );
}
