import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuiz } from "../hooks/useQuiz";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useResultsData } from "../hooks/useResultsData";
import {
  enhanceLeaderboardData,
  findUserRank,
} from "../utils/leaderboardUtils";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { ResultsContainer } from "../components/results/ResultsContainer";

export default function ResultsPage() {
  const { quizId } = useParams();
  const { user, userProfile } = useAuth();

  // Data fetching hooks
  const { quiz, loading: quizLoading } = useQuiz(quizId);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(quizId);
  const {
    result,
    loading: resultLoading,
    error,
  } = useResultsData(quizId, user?.uid);

  // Loading state
  const isLoading = resultLoading || quizLoading || leaderboardLoading;
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error || !result) {
    return <ErrorState message={error || "Result not found"} />;
  }

  // Data processing
  const totalQuestions = quiz?.questions?.length || 0;
  const enhancedLeaderboard = enhanceLeaderboardData(
    leaderboard,
    user?.uid,
    userProfile?.displayName,
    totalQuestions
  );
  const yourRank = findUserRank(enhancedLeaderboard, user?.uid);

  return (
    <ResultsContainer
      quizTitle={quiz?.title || ""}
      result={{ ...result, totalQuestions }}
      topScores={enhancedLeaderboard}
      yourRank={yourRank}
      quizId={quizId}
    />
  );
}
