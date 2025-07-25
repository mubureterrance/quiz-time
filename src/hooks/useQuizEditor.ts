import { useState, useCallback } from 'react';
import type { Quiz } from '../types/quiz.types';

interface UseQuizEditorReturn {
  editingQuiz: Quiz | null;
  openCreate: () => void;
  openEdit: (quiz: Quiz) => void;
  closeEditor: () => void;
}

export const useQuizEditor = (): UseQuizEditorReturn => {
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const openCreate = useCallback(() => {
    setEditingQuiz(null);
  }, []);

  const openEdit = useCallback((quiz: Quiz) => {
    setEditingQuiz(quiz);
  }, []);

  const closeEditor = useCallback(() => {
    setEditingQuiz(null);
  }, []);

  return {
    editingQuiz,
    openCreate,
    openEdit,
    closeEditor,
  };
};