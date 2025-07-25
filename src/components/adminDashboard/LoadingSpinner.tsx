import React from 'react';
import { LOADING_MESSAGES } from '../../constants/dashboard.constants';

export const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-300">
        {LOADING_MESSAGES.ANALYTICS}
      </p>
    </div>
  </div>
);