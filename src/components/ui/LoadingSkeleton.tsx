import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = "" }) => (
  <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-3 ${className}`}>
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);