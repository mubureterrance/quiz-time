import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizSummary from '../quiz/QuizSummary';
import type { Result } from '../../hooks/useResultsData';
import type { EnhancedLeaderboardEntry } from '../../utils/leaderboardUtils';

interface ResultsContainerProps {
  quizTitle: string;
  result: Result & { totalQuestions: number };
  topScores: EnhancedLeaderboardEntry[];
  yourRank: number;
  quizId?: string;
}

export const ResultsContainer: React.FC<ResultsContainerProps> = ({
  quizTitle,
  result,
  topScores,
  yourRank,
  quizId
}) => {
  const navigate = useNavigate();

  const handleRetake = () => {
    if (quizId) {
      navigate(`/quiz/${quizId}`);
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <QuizSummary
        quizTitle={quizTitle}
        result={result}
        topScores={topScores}
        yourRank={yourRank}
        onRetake={handleRetake}
        onDashboard={handleDashboard}
      />
    </div>
  );
}