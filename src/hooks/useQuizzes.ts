import { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Quiz } from "../types/quiz.types";


export function useQuizzes(badges?: string[]) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const unsubscribe = onSnapshot(
            collection(db, "quizzes"),
            (snapshot: QuerySnapshot<DocumentData>) => {
                let allQuizzes = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Quiz, "id">),
                }));
                if (badges) {
                    allQuizzes = allQuizzes.filter((quiz) => badges.includes(quiz.badge));
                }
                setQuizzes(allQuizzes);
                setLoading(false);
            },
            (err) => {
                setError("Failed to fetch quizzes");
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [badges]);

    // Optimistic helpers
    const optimisticAdd = useCallback((quiz: Quiz) => {
        setQuizzes((prev) => [quiz, ...prev]);
    }, []);
    const optimisticUpdate = useCallback((quiz: Quiz) => {
        setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? quiz : q)));
    }, []);
    const optimisticRemove = useCallback((quizId: string) => {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    }, []);

    return { quizzes, loading, error, setQuizzes, optimisticAdd, optimisticUpdate, optimisticRemove };
} 