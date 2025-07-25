// hooks/useAllQuizResults.ts
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export interface QuizResult {
  id?: string; // Document ID from Firestore
  quizId: string;
  userId: string;
  score: number;
  percentage: number;
  date: string;
  totalQuestions: number;
}

interface UseAllQuizResultsReturn {
  results: QuizResult[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ERROR_MESSAGES = {
  RESULTS_LOAD_FAILED: "Failed to fetch quiz results",
} as const;

export const useAllQuizResults = (): UseAllQuizResultsReturn => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const snapshot = await getDocs(collection(db, "quizResults"));
      const allResults = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as QuizResult[];
      
      setResults(allResults);
    } catch (err) {
      console.error("Error fetching quiz results:", err);
      setError(ERROR_MESSAGES.RESULTS_LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return { 
    results, 
    loading, 
    error, 
    refetch: fetchResults 
  };
};