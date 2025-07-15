// src/pages/ResultsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import QuizSummary from "../components/quiz/QuizSummary";
import { useQuiz } from "../hooks/useQuiz";
import { useLeaderboard } from "../hooks/useLeaderboard";

type Result = {
  score: number;
  percentage: number;
  date: string;
  userId: string;
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded-lg w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-slate-200 rounded-lg"></div>
            <div className="h-32 bg-slate-200 rounded-lg"></div>
            <div className="h-16 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error state component
const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-md border border-red-200 p-6 max-w-md w-full text-center">
      <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-sm text-slate-600 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default function ResultsPage() {
  const { quizId } = useParams();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [result, setResult] = useState<Result | null>(null);
  const { quiz, loading: quizLoading } = useQuiz(quizId);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(quizId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!quizId || !user?.uid) {
        setError("Missing quiz or user information");
        setLoading(false);
        return;
      }

      try {
        const resultDoc = await getDoc(
          doc(db, "quizResults", `${user.uid}.${quizId}`)
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
  }, [quizId, user]);

  // Show loading state
  if (loading || quizLoading || leaderboardLoading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (error || !result) {
    return <ErrorState message={error || "Result not found"} />;
  }

  const totalQuestions = quiz?.questions?.length || 0;

  // Add displayName to leaderboard entries
  const topScores = leaderboard.map((entry) => ({
    ...entry,
    displayName:
      entry.userId === user?.uid
        ? userProfile?.displayName || "You"
        : "Anonymous",
  }));

  const yourRank =
    topScores.findIndex((entry) => entry.userId === user?.uid) + 1;

  return (
    <QuizSummary
      quizTitle={quiz?.title || ""}
      result={{ ...result, totalQuestions }}
      topScores={topScores.map((entry) => ({
        ...entry,
        totalQuestions,
      }))}
      yourRank={yourRank}
      onRetake={() => navigate(`/quiz/${quizId}`)}
      onDashboard={() => navigate("/dashboard")}
    />
  );
}
