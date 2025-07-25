import { useState, useCallback, useMemo } from 'react';
import type { Quiz } from '../types/quiz.types';
import { applyQuizFilters } from '../utils/quizFilters';

interface UseQuizFiltersReturn {
  searchTerm: string;
  selectedBadgeFilter: string;
  filteredQuizzes: Quiz[];
  setSearchTerm: (term: string) => void;
  setSelectedBadgeFilter: (badge: string) => void;
  clearFilters: () => void;
}

export const useQuizFilters = (quizzes: Quiz[]): UseQuizFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState("");

  const filteredQuizzes = useMemo(() => {
    return applyQuizFilters(quizzes, searchTerm, selectedBadgeFilter);
  }, [quizzes, searchTerm, selectedBadgeFilter]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedBadgeFilter("");
  }, []);

  return {
    searchTerm,
    selectedBadgeFilter,
    filteredQuizzes,
    setSearchTerm,
    setSelectedBadgeFilter,
    clearFilters,
  };
};