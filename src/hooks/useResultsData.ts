import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export interface Result {
  score: number;
  percentage: number;
  date: string;
  userId: string;
}

interface UseResultsDataReturn {
  result: Result | null;
  loading: boolean;
  error: string | null;
}

export const useResultsData = (quizId?: string, userId?: string): UseResultsDataReturn => {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!quizId || !userId) {
        setError("Missing quiz or user information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const resultDoc = await getDoc(
          doc(db, "quizResults", `${userId}.${quizId}`)
        );
        
        if (resultDoc.exists()) {
          setResult(resultDoc.data() as Result);
        } else {
          setError("No results found for this quiz");
        }
      } catch (err) {
        console.error("Error fetching result:", err);
        setError("Failed to load quiz results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [quizId, userId]);

  return { result, loading, error };
};