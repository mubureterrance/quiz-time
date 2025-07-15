import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

type Result = {
    score: number;
    percentage: number;
    date: string;
    userId: string;
    displayName?: string;
    quizId?: string;
};

export function useLeaderboard(quizId?: string) {
    const [leaderboard, setLeaderboard] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!quizId) return;
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const snapshot = await getDocs(collection(db, "quizResults"));
                const allResults: Result[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as Result;
                    if (data.quizId === quizId) {
                        allResults.push(data);
                    }
                });
                const top = allResults
                    .sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 5);
                setLeaderboard(top);
            } catch (err: any) {
                setError("Failed to fetch leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [quizId]);

    return { leaderboard, loading, error };
} 