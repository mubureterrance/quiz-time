import React from 'react';
import type { Quiz, Badge } from '../../types/quiz.types';
import QuizTable from './QuizTable';
import FilterControls from './FilterControls';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { ErrorMessage } from './ErrorMessage';

interface QuizManagerContentProps {
  quizzes: Quiz[];
  filteredQuizzes: Quiz[];
  badges: Badge[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedBadgeFilter: string;
  deletingId: string | null;
  onSearchChange: (term: string) => void;
  onBadgeFilterChange: (badge: string) => void;
  onClearFilters: () => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quiz: Quiz) => void;
}

export const QuizManagerContent: React.FC<QuizManagerContentProps> = ({
  quizzes,
  filteredQuizzes,
  badges,
  loading,
  error,
  searchTerm,
  selectedBadgeFilter,
  deletingId,
  onSearchChange,
  onBadgeFilterChange,
  onClearFilters,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (quizzes.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <FilterControls
        searchTerm={searchTerm}
        selectedBadgeFilter={selectedBadgeFilter}
        badges={badges}
        onSearchChange={onSearchChange}
        onBadgeFilterChange={onBadgeFilterChange}
        onClearFilters={onClearFilters}
        totalQuizzes={quizzes.length}
        filteredCount={filteredQuizzes.length}
      />
      
      <QuizTable
        quizzes={filteredQuizzes}
        badges={badges}
        onEdit={onEdit}
        onDelete={onDelete}
        deletingId={deletingId}
      />
    </>
  );
};