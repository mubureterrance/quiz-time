import { useState, useMemo, useCallback } from 'react';
import type { PaginationConfig, PaginationInfo } from '../types/pagination.types';
import { calculatePaginationInfo, paginateArray } from '../utils/paginationUtils';
import { PAGINATION_CONSTANTS } from '../constants/pagination.constants';

interface UsePaginationProps<T> {
  data: T[];
  initialPageSize?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  itemsPerPage: number;
  paginatedData: T[];
  paginationInfo: PaginationInfo;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  changePageSize: (size: number) => void;
}

export const usePagination = <T>({
  data,
  initialPageSize = PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE,
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialPageSize);

  const paginationConfig: PaginationConfig = {
    currentPage,
    itemsPerPage,
    totalItems: data.length,
  };

  const paginationInfo = useMemo(
    () => calculatePaginationInfo(paginationConfig),
    [currentPage, itemsPerPage, data.length]
  );

  const paginatedData = useMemo(
    () => paginateArray(data, currentPage, itemsPerPage),
    [data, currentPage, itemsPerPage]
  );

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, paginationInfo.totalPages));
    setCurrentPage(validPage);
  }, [paginationInfo.totalPages]);

  const goToNextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationInfo.hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (paginationInfo.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationInfo.hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages);
  }, [paginationInfo.totalPages]);

  const changePageSize = useCallback((size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Reset to first page if current page is out of bounds
  useMemo(() => {
    if (currentPage > paginationInfo.totalPages && paginationInfo.totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, paginationInfo.totalPages]);

  return {
    currentPage,
    itemsPerPage,
    paginatedData,
    paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
  };
};