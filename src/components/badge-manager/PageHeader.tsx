import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description: string;
  backLink?: {
    to: string;
    label: string;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  backLink 
}) => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h1>
      <p className="text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
    {backLink && (
      <Link
        to={backLink.to}
        className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {backLink.label}
      </Link>
    )}
  </div>
);
