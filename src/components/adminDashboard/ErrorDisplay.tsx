import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 dark:text-gray-100">
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
        <div className="text-red-600 dark:text-red-300 mb-2">
          <XCircle className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-red-700 dark:text-red-300 font-medium">
          {message}
        </p>
      </div>
    </div>
  </div>
);