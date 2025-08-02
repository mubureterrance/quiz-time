import React from 'react';
import { Award } from 'lucide-react';
import type { QuizResult } from '../../hooks/useUserResults';

interface BestPerformanceCardProps {
  bestPerformance: QuizResult;
  getQuizTitle: (quizId: string) => string;
  formatDate: (date: string) => string;
}

export function BestPerformanceCard({ 
  bestPerformance, 
  getQuizTitle, 
  formatDate 
}: BestPerformanceCardProps) {
  const performanceItems = [
    {
      label: "Quiz:",
      value: getQuizTitle(bestPerformance.quizId),
      className: "text-sm font-medium text-gray-900 dark:text-gray-100"
    },
    {
      label: "Score:",
      value: `${bestPerformance.percentage}% (${bestPerformance.score}/${bestPerformance.totalQuestions})`,
      className: "text-sm font-bold text-green-600"
    },
    {
      label: "Date:",
      value: formatDate(bestPerformance.date),
      className: "text-sm text-gray-900 dark:text-gray-100"
    }
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Award className="h-4 w-4 text-yellow-500" />
        Best Performance
      </h4>
      <div className="space-y-2">
        {performanceItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </span>
            <span className={item.className}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}