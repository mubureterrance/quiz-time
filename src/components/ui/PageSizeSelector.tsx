import React from 'react';
import { PAGINATION_CONSTANTS } from '../../constants/pagination.constants';

interface PageSizeSelectorProps {
  currentPageSize: number;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  currentPageSize,
  onPageSizeChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label 
        htmlFor="page-size-select" 
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Show:
      </label>
      <select
        id="page-size-select"
        value={currentPageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700 dark:text-gray-200">per page</span>
    </div>
  );
};