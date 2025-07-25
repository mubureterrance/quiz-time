import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Quiz, QuizForm } from '../types/quiz.types';
import { createQuiz, updateQuiz, deleteQuiz } from '../services/quizService';
import { generateTempId } from '../utils/quizUtils';
import { TOAST_MESSAGES } from '../constants/quiz.constants';

interface UseQuizOperationsProps {
  quizzes: Quiz[];
  optimisticAdd: (quiz: Quiz) => void;
  optimisticUpdate: (quiz: Quiz) => void;
  optimisticRemove: (id: string) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
}

interface UseQuizOperationsReturn {
  deletingId: string | null;
  handleCreate: (form: QuizForm) => Promise<void>;
  handleUpdate: (id: string, form: QuizForm) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export const useQuizOperations = ({
  quizzes,
  optimisticAdd,
  optimisticUpdate,
  optimisticRemove,
  setQuizzes,
}: UseQuizOperationsProps): UseQuizOperationsReturn => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = useCallback(async (form: QuizForm) => {
    const tempId = generateTempId();
    const optimisticQuiz = { ...form, id: tempId };
    const prevQuizzes = quizzes;
    
    optimisticAdd(optimisticQuiz);
    
    try {
      const docRef = await createQuiz(form);
      optimisticRemove(tempId);
      const newQuiz = { ...form, id: docRef.id };
      optimisticAdd(newQuiz);
      toast.success(TOAST_MESSAGES.QUIZ_CREATED);
    } catch (error) {
      setQuizzes(prevQuizzes);
      toast.error(TOAST_MESSAGES.CREATE_ERROR);
    }
  }, [quizzes, optimisticAdd, optimisticRemove, setQuizzes]);

  const handleUpdate = useCallback(async (id: string, form: QuizForm) => {
    const prevQuizzes = quizzes;
    const updatedQuiz = { ...form, id };
    
    optimisticUpdate(updatedQuiz);
    
    try {
      await updateQuiz(id, form);
      toast.success(TOAST_MESSAGES.QUIZ_UPDATED);
    } catch (error) {
      setQuizzes(prevQuizzes);
      toast.error(TOAST_MESSAGES.UPDATE_ERROR);
    }
  }, [quizzes, optimisticUpdate, setQuizzes]);

  const handleDelete = useCallback(async (quizId: string) => {
    setDeletingId(quizId);
    const prevQuizzes = quizzes;
    
    optimisticRemove(quizId);
    
    try {
      await deleteQuiz(quizId);
      toast.success(TOAST_MESSAGES.QUIZ_DELETED);
    } catch (error) {
      setQuizzes(prevQuizzes);
      toast.error(TOAST_MESSAGES.DELETE_ERROR);
    } finally {
      setDeletingId(null);
    }
  }, [quizzes, optimisticRemove, setQuizzes]);

  return {
    deletingId,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};