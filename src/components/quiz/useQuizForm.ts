import { useState, useCallback, useMemo } from "react";
import type { Quiz, QuizForm, Question } from "./types";
import { z } from "zod";

const EMPTY_QUESTION: Question = {
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
    topic: "",
};

const QuestionSchema = z.object({
    question: z.string().min(1, "Question text is required"),
    options: z.array(z.string().min(1, "Option is required")).length(4, "Exactly 4 options required"),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string(),
    topic: z.string(),
});

const QuizFormSchema = z.object({
    title: z.string().min(1, "Quiz title is required"),
    badge: z.string().min(1, "Badge selection is required"),
    questions: z.array(QuestionSchema).min(1, "At least one question is required"),
});

export function useQuizForm({
    badges,
    editingQuiz,
    onCreate,
    onUpdate,
    onClose,
}: {
    badges: { id: string; name: string }[];
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

    const [form, setForm] = useState<QuizForm>(INITIAL_FORM);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const openCreate = useCallback(() => {
        setForm(INITIAL_FORM);
        setFormError("");
        setModalOpen(true);
    }, [INITIAL_FORM]);

    const openEdit = useCallback((quiz: Quiz) => {
        setForm({
            title: quiz.title,
            badge: quiz.badge,
            questions: quiz.questions.map((q) => ({ ...q })),
        });
        setFormError("");
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setFormError("");
        onClose();
    }, [onClose]);

    const handleFormChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    const handleQuestionChange = useCallback(
        (index: number, field: keyof Question, value: any) => {
            setForm((prev) => {
                const updated = [...prev.questions];
                updated[index] = { ...updated[index], [field]: value };
                return { ...prev, questions: updated };
            });
        },
        []
    );

    const addQuestion = useCallback(() => {
        setForm((prev) => ({
            ...prev,
            questions: [...prev.questions, { ...EMPTY_QUESTION }],
        }));
    }, []);

    const removeQuestion = useCallback((index: number) => {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }));
    }, []);

    const handleSave = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setFormError("");
            setSaving(true);
            const result = QuizFormSchema.safeParse(form);
            if (!result.success) {
                const firstError = result.error.errors[0]?.message || "Invalid form";
                setFormError(firstError);
                setSaving(false);
                return;
            }
            try {
                if (editingQuiz) {
                    await onUpdate(editingQuiz.id, form);
                } else {
                    await onCreate(form);
                }
                closeModal();
            } catch (error) {
                setFormError("Failed to save quiz. Please try again.");
            } finally {
                setSaving(false);
            }
        },
        [form, editingQuiz, onCreate, onUpdate, closeModal]
    );

    return {
        form,
        setForm,
        formError,
        setFormError,
        saving,
        modalOpen,
        setModalOpen,
        openCreate,
        openEdit,
        closeModal,
        handleFormChange,
        handleQuestionChange,
        addQuestion,
        removeQuestion,
        handleSave,
    };
} 