import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

type Quiz = {
    id: string;
    title: string;
    badge: string;
    questions?: any[];
};

export function useQuizzes(badges?: string[]) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            setError(null);
            try {
                const snapshot = await getDocs(collection(db, "quizzes"));
                let allQuizzes = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Quiz, "id">),
                }));
                if (badges) {
                    allQuizzes = allQuizzes.filter((quiz) => badges.includes(quiz.badge));
                }
                setQuizzes(allQuizzes);
            } catch (err: any) {
                setError("Failed to fetch quizzes");
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [badges]);

    return { quizzes, loading, error };
} 