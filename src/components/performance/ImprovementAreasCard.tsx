import React from 'react';
import { Brain } from 'lucide-react';

interface ImprovementAreasCardProps {
  improvementAreas: string[];
}

export function ImprovementAreasCard({ improvementAreas }: ImprovementAreasCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Brain className="h-4 w-4 text-orange-500" />
        Areas for Improvement
      </h4>
      {improvementAreas.length > 0 ? (
        <div className="space-y-2">
          {improvementAreas.map((area, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-green-600 dark:text-green-400">
          Great job! No specific areas need immediate attention.
        </p>
      )}
    </div>
  );
}