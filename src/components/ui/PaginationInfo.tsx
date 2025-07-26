import React from 'react';
import type { PaginationInfo as PaginationInfoType } from '../../types/pagination.types';

interface PaginationInfoProps {
  paginationInfo: PaginationInfoType;
  className?: string;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  paginationInfo,
  className = '',
}) => {
  const { displayStart, displayEnd, totalPages } = paginationInfo;
  const totalItems = paginationInfo.displayEnd; // This should come from total items count

  return (
    <div className={`text-sm text-gray-700 dark:text-gray-200 ${className}`}>
      Showing {displayStart} to {displayEnd} of {totalItems} results
      {totalPages > 1 && ` (${totalPages} pages)`}
    </div>
  );
};