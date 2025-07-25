import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { Quiz, QuizForm, Badge } from '../types/quiz.types';
import { INITIAL_FORM, EMPTY_QUESTION } from '../constants/quiz.constants';

interface UseQuizFormProps {
  badges: Badge[];
  editingQuiz: Quiz | null;
  onCreate: (form: QuizForm) => Promise<void>;
  onUpdate: (id: string, form: QuizForm) => Promise<void>;
  onClose: () => void;
}

interface UseQuizFormReturn {
  modalOpen: boolean;
  saving: boolean;
  control: any;
  register: any;
  errors: any;
  fields: any;
  append: (question: any) => void;
  remove: (index: number) => void;
  handleSubmit: any;
  onSubmit: (data: QuizForm) => Promise<void>;
  openCreate: () => void;
  openEdit: (quiz: Quiz) => void;
  closeModal: () => void;
}

export const useQuizForm = ({
  badges,
  editingQuiz,
  onCreate,
  onUpdate,
  onClose,
}: UseQuizFormProps): UseQuizFormReturn => {
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<QuizForm>({
    defaultValues: INITIAL_FORM,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const openCreate = useCallback(() => {
    reset(INITIAL_FORM);
    setModalOpen(true);
  }, [reset]);

  const openEdit = useCallback((quiz: Quiz) => {
    reset({
      title: quiz.title,
      badge: quiz.badge,
      questions: quiz.questions,
    });
    setModalOpen(true);
  }, [reset]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    reset(INITIAL_FORM);
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(async (data: QuizForm) => {
    setSaving(true);
    try {
      if (editingQuiz) {
        await onUpdate(editingQuiz.id, data);
      } else {
        await onCreate(data);
      }
      closeModal();
    } catch (error) {
      // Error handling is done in the operation hooks
    } finally {
      setSaving(false);
    }
  }, [editingQuiz, onCreate, onUpdate, closeModal]);

  const addQuestion = useCallback(() => {
    append({ ...EMPTY_QUESTION });
  }, [append]);

  return {
    modalOpen,
    saving,
    control,
    register,
    errors,
    fields,
    append: addQuestion,
    remove,
    handleSubmit,
    onSubmit,
    openCreate,
    openEdit,
    closeModal,
  };
};