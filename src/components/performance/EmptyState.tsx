import React from 'react';
import { BarChart3, Brain } from 'lucide-react';

export function EmptyState() {
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