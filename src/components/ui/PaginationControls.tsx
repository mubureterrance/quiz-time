import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationInfo } from '../../types/pagination.types';
import { generatePageNumbers } from '../../utils/paginationUtils';
import { PAGINATION_CONSTANTS } from '../../constants/pagination.constants';

interface PaginationControlsProps {
  paginationInfo: PaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  paginationInfo,
  currentPage,
  onPageChange,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage,
  className = '',
}) => {
  const { totalPages, hasNextPage, hasPreviousPage } = paginationInfo;
  
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = generatePageNumbers(
    currentPage,
    totalPages,
    PAGINATION_CONSTANTS.MAX_VISIBLE_PAGES
  );

  const buttonBaseClass = "px-3 py-2 text-sm font-medium rounded-md transition-colors";
  const buttonActiveClass = "bg-blue-600 text-white";
  const buttonInactiveClass = "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700";
  const buttonDisabledClass = "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed";

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* First Page */}
      <button
        onClick={onFirstPage}
        disabled={!hasPreviousPage}
        className={`${buttonBaseClass} ${
          !hasPreviousPage ? buttonDisabledClass : buttonInactiveClass
        }`}
        aria-label="Go to first page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous Page */}
      <button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className={`${buttonBaseClass} ${
          !hasPreviousPage ? buttonDisabledClass : buttonInactiveClass
        }`}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`${buttonBaseClass} ${
            pageNum === currentPage ? buttonActiveClass : buttonInactiveClass
          }`}
          aria-label={`Go to page ${pageNum}`}
          aria-current={pageNum === currentPage ? 'page' : undefined}
        >
          {pageNum}
        </button>
      ))}

      {/* Next Page */}
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`${buttonBaseClass} ${
          !hasNextPage ? buttonDisabledClass : buttonInactiveClass
        }`}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last Page */}
      <button
        onClick={onLastPage}
        disabled={!hasNextPage}
        className={`${buttonBaseClass} ${
          !hasNextPage ? buttonDisabledClass : buttonInactiveClass
        }`}
        aria-label="Go to last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};