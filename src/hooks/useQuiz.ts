import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

type Question = {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    topic: string;
};

type Quiz = {
    title: string;
    badge: string;
    questions: Question[];
};

export function useQuiz(quizId?: string) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!quizId) return;
        const fetchQuiz = async () => {
            setLoading(true);
            setError(null);
            try {
                const docSnap = await getDoc(doc(db, "quizzes", quizId));
                if (docSnap.exists()) {
                    setQuiz(docSnap.data() as Quiz);
                } else {
                    setQuiz(null);
                    setError("Quiz not found");
                }
            } catch (err: any) {
                setError("Failed to fetch quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    return { quiz, loading, error };
} 