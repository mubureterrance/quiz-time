import { useState, useCallback } from 'react';
import type { Quiz } from '../types/quiz.types';

interface UseDeleteConfirmationReturn {
  pendingDelete: Quiz | null;
  confirmDelete: (quiz: Quiz) => void;
  cancelDelete: () => void;
  executeDelete: () => void;
}

export const useDeleteConfirmation = (
  onDelete: (id: string) => Promise<void>
): UseDeleteConfirmationReturn => {
  const [pendingDelete, setPendingDelete] = useState<Quiz | null>(null);

  const confirmDelete = useCallback((quiz: Quiz) => {
    setPendingDelete(quiz);
  }, []);

  const cancelDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const executeDelete = useCallback(() => {
    if (pendingDelete) {
      onDelete(pendingDelete.id);
      setPendingDelete(null);
    }
  }, [pendingDelete, onDelete]);

  return {
    pendingDelete,
    confirmDelete,
    cancelDelete,
    executeDelete,
  };
};