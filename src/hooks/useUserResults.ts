import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export type QuizResult = {
    quizId: string;
    userId: string;
    score: number;
    percentage: number;
    date: string;
    totalQuestions?: number;
};

export type UserHistory = {
    results: QuizResult[];
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    recentActivity: QuizResult[];
    performanceByQuiz: Record<string, QuizResult>;
};

export function useUserResults(userId?: string) {
    const [history, setHistory] = useState<UserHistory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                // Query all results for this user (without orderBy to avoid index requirement)
                const resultsQuery = query(
                    collection(db, "quizResults"),
                    where("userId", "==", userId)
                );

                const snapshot = await getDocs(resultsQuery);
                const results: QuizResult[] = [];

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    results.push({
                        quizId: data.quizId,
                        userId: data.userId,
                        score: data.score,
                        percentage: data.percentage,
                        date: data.date,
                        totalQuestions: data.totalQuestions,
                    });
                });

                // Sort by date in JavaScript (most recent first)
                results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                // Calculate analytics
                const totalQuizzes = results.length;
                const averageScore = totalQuizzes > 0
                    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
                    : 0;
                const bestScore = totalQuizzes > 0
                    ? Math.max(...results.map(r => r.percentage))
                    : 0;
                const recentActivity = results.slice(0, 5); // Last 5 quizzes

                // Create performance by quiz lookup (keep best score for each quiz)
                const performanceByQuiz: Record<string, QuizResult> = {};
                results.forEach(result => {
                    if (!performanceByQuiz[result.quizId] ||
                        result.percentage > performanceByQuiz[result.quizId].percentage) {
                        performanceByQuiz[result.quizId] = result;
                    }
                });

                setHistory({
                    results,
                    totalQuizzes,
                    averageScore,
                    bestScore,
                    recentActivity,
                    performanceByQuiz,
                });
            } catch (err: any) {
                console.error("Error fetching user results:", err);
                setError("Failed to fetch user results");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [userId]);

    return { history, loading, error };
} 