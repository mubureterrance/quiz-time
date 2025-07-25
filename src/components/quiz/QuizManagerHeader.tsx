import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface QuizManagerHeaderProps {
  onCreateClick: () => void;
}

export const QuizManagerHeader: React.FC<QuizManagerHeaderProps> = ({ onCreateClick }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <div className="flex items-center gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Quiz Management
      </h1>
      <Link
        to="/admin"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
      >
        ← Back to Admin Dashboard
      </Link>
    </div>
    <Button
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
      onClick={onCreateClick}
    >
      + Create New Quiz
    </Button>
  </div>
);