import { useCallback, useMemo, useState } from "react";
import type { Quiz, QuizForm, Question } from "./types";
import { z } from "zod";
import type { Badge } from "../../hooks/useBadges";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionSchema, QuizFormSchema } from "../../schemas/quiz";

export const EMPTY_QUESTION: Question = {
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
    topic: "",
};

export function useQuizForm({
    badges,
    editingQuiz,
    onCreate,
    onUpdate,
    onClose,
}: {
    badges: Badge[];
    editingQuiz: Quiz | null;
    onCreate: (form: QuizForm) => Promise<void>;
    onUpdate: (id: string, form: QuizForm) => Promise<void>;
    onClose: () => void;
}) {
    const INITIAL_FORM: QuizForm = useMemo(() => ({
        title: "",
        badge: badges[0]?.id || "",
        questions: [{ ...EMPTY_QUESTION }],
    }), [badges]);

    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<QuizForm>({
        resolver: zodResolver(QuizFormSchema),
        defaultValues: INITIAL_FORM,
        mode: "onBlur",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    const openCreate = useCallback(() => {
        reset(INITIAL_FORM);
        setModalOpen(true);
    }, [reset, INITIAL_FORM]);

    const openEdit = useCallback((quiz: Quiz) => {
        reset({
            title: quiz.title,
            badge: quiz.badge,
            questions: quiz.questions.map((q) => ({ ...q })),
        });
        setModalOpen(true);
    }, [reset]);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        onClose();
    }, [onClose]);

    const onSubmit = useCallback(
        async (data: QuizForm) => {
            setSaving(true);
            try {
                if (editingQuiz) {
                    await onUpdate(editingQuiz.id, data);
                } else {
                    await onCreate(data);
                }
                closeModal();
            } catch (error) {
                setError("title", { message: "Failed to save quiz. Please try again." });
            } finally {
                setSaving(false);
            }
        },
        [editingQuiz, onCreate, onUpdate, closeModal, setError]
    );

    return {
        control,
        register,
        handleSubmit,
        errors,
        fields,
        append,
        remove,
        saving,
        modalOpen,
        setModalOpen,
        openCreate,
        openEdit,
        closeModal,
        onSubmit,
    };
} 