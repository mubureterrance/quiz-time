import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import type { QuizResult } from "./useUserResults";

export function useAllQuizResults() {
    const [results, setResults] = useState<QuizResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const snapshot = await getDocs(collection(db, "quizResults"));
                const allResults: QuizResult[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    allResults.push({
                        quizId: data.quizId,
                        userId: data.userId,
                        score: data.score,
                        percentage: data.percentage,
                        date: data.date,
                        totalQuestions: data.totalQuestions,
                    });
                });
                setResults(allResults);
            } catch (err: any) {
                setError("Failed to fetch quiz results");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return { results, loading, error };
} 