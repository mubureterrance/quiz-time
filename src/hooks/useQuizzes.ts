import { useEffect, useState, useCallback } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Quiz } from "../types/quiz.types";

type UseQuizzesOptions = {
  isAdmin?: boolean;
};

export function useQuizzes(badges?: string[] | null, options: UseQuizzesOptions = {}) {
  const { isAdmin = false } = options;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Regular user with no badges: immediately give empty result, no listener.
    if (!isAdmin && (!badges || badges.length === 0)) {
      setQuizzes([]);
      setLoading(false);
      return;
    }

    // Build Firestore subscription:
    // If admin: no filtering.
    // If regular user with badges: try to push the badge filter to Firestore (if within limits).
    const colRef = collection(db, "quizzes");
    let unsub: (() => void) | null = null;

    if (!isAdmin && badges && badges.length > 0) {
      // Firestore 'in' queries accept up to 10 items; if more, fallback to client filtering.
      if (badges.length <= 10) {
        const q = query(colRef, where("badge", "in", badges));
        unsub = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const filtered = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<Quiz, "id">),
            }));
            setQuizzes(filtered);
            setLoading(false);
          },
          (err) => {
            setError("Failed to fetch quizzes");
            setLoading(false);
          }
        );
      } else {
        // Too many badges for an 'in' query: fetch all and filter client-side.
        unsub = onSnapshot(
          colRef,
          (snapshot: QuerySnapshot<DocumentData>) => {
            let allQuizzes = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<Quiz, "id">),
            }));
            allQuizzes = allQuizzes.filter((quiz) => badges.includes(quiz.badge));
            setQuizzes(allQuizzes);
            setLoading(false);
          },
          (err) => {
            setError("Failed to fetch quizzes");
            setLoading(false);
          }
        );
      }
    } else {
      // Admin: subscribe to all quizzes.
      unsub = onSnapshot(
        colRef,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const allQuizzes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Quiz, "id">),
          }));
          setQuizzes(allQuizzes);
          setLoading(false);
        },
        (err) => {
          setError("Failed to fetch quizzes");
          setLoading(false);
        }
      );
    }

    return () => {
      if (unsub) unsub();
    };
  }, [badges, isAdmin]);

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

  return {
    quizzes,
    loading,
    error,
    setQuizzes,
    optimisticAdd,
    optimisticUpdate,
    optimisticRemove,
  };
}
