import React from "react";
import { Navigate } from "react-router-dom";
import { XCircle } from "lucide-react";

import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { useAllQuizResults } from "../hooks/useAllQuizResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUsers, type User } from "../hooks/useUsers";

import DashboardHeader from "../components/adminDashboard/DashboardHeader";
import SummaryStats from "../components/adminDashboard/SummaryStats";
import HighlightCards from "../components/adminDashboard/HighlightCards";
import TopActiveUsers from "../components/adminDashboard/TopActiveUsers";
import RecentActivity from "../components/adminDashboard/RecentActivity";
import QuizPerformanceTable from "../components/adminDashboard/QuizPerformanceTable";

// Types

interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  percentage: number;
  date: string;
}

interface Quiz {
  id: string;
  title: string;
  [key: string]: any;
}

interface QuizAverage {
  id: string;
  title: string;
  avg: number;
  attempts: number;
}

interface ActiveUser {
  displayName: string;
  attempts: number;
  avgScore: number;
}

interface QuizAttemptCount {
  [quizId: string]: number;
}

interface UserScoreData {
  [userId: string]: {
    total: number;
    count: number;
  };
}

// Constants
const LOADING_MESSAGES = {
  ANALYTICS: "Loading analytics...",
};

const ERROR_MESSAGES = {
  USERS_LOAD_FAILED: "Failed to load users",
  NO_DATA: "No data",
};

const TOP_USERS_LIMIT = 10;
const RECENT_ATTEMPTS_LIMIT = 5;

// Custom hooks can now be imported from hooks folder

// Utility functions
const calculateAverageScore = (results: QuizResult[]): number => {
  if (results.length === 0) return 0;
  
  const totalScore = results.reduce((sum, result) => sum + result.percentage, 0);
  return Math.round(totalScore / results.length);
};

const groupResultsByQuiz = (results: QuizResult[]): QuizAttemptCount => {
  return results.reduce((acc, result) => {
    acc[result.quizId] = (acc[result.quizId] || 0) + 1;
    return acc;
  }, {} as QuizAttemptCount);
};

const findMostPopularQuiz = (
  quizAttempts: QuizAttemptCount,
  quizzes: Quiz[]
): Quiz | null => {
  const mostPopularQuizId = Object.entries(quizAttempts)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
    
  return quizzes.find((quiz) => quiz.id === mostPopularQuizId) || null;
};

const calculateQuizAverages = (
  quizzes: Quiz[],
  results: QuizResult[],
  quizAttempts: QuizAttemptCount
): QuizAverage[] => {
  const quizScores = results.reduce((acc, result) => {
    if (!acc[result.quizId]) {
      acc[result.quizId] = { total: 0, count: 0 };
    }
    acc[result.quizId].total += result.percentage;
    acc[result.quizId].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    avg: quizScores[quiz.id] 
      ? Math.round(quizScores[quiz.id].total / quizScores[quiz.id].count)
      : 0,
    attempts: quizAttempts[quiz.id] || 0,
  }));
};

const findBestAndWorstQuizzes = (quizAverages: QuizAverage[]) => {
  const quizzesWithAttempts = quizAverages.filter((quiz) => quiz.attempts > 0);
  
  const bestQuiz = quizzesWithAttempts
    .sort((a, b) => b.avg - a.avg)[0] || null;
    
  const worstQuiz = quizzesWithAttempts
    .sort((a, b) => a.avg - b.avg)[0] || null;
    
  return { bestQuiz, worstQuiz };
};

const calculateTopActiveUsers = (
  results: QuizResult[],
  users: User[]
): ActiveUser[] => {
  const userAttempts: Record<string, number> = {};
  const userScores: UserScoreData = {};

  results.forEach((result) => {
    userAttempts[result.userId] = (userAttempts[result.userId] || 0) + 1;
    
    if (!userScores[result.userId]) {
      userScores[result.userId] = { total: 0, count: 0 };
    }
    userScores[result.userId].total += result.percentage;
    userScores[result.userId].count += 1;
  });

  return Object.entries(userAttempts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_USERS_LIMIT)
    .map(([userId, attempts]) => {
      const user = users.find((u) => u.uid === userId);
      const avgScore = userScores[userId]
        ? Math.round(userScores[userId].total / userScores[userId].count)
        : 0;
        
      return {
        displayName: user?.displayName || userId,
        attempts,
        avgScore,
      };
    });
};

const getRecentAttempts = (results: QuizResult[]): QuizResult[] => {
  return [...results]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, RECENT_ATTEMPTS_LIMIT);
};

// Components
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-300">
        {LOADING_MESSAGES.ANALYTICS}
      </p>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 dark:text-gray-100">
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
        <div className="text-red-600 dark:text-red-300 mb-2">
          <XCircle className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-red-700 dark:text-red-300 font-medium">
          {message}
        </p>
      </div>
    </div>
  </div>
);

// Main component
const AdminDashboard: React.FC = () => {
  const { loading: authLoading, shouldRedirect } = useAdminGuard();
  const { loading: badgesLoading } = useBadges();
  const { quizzes, loading: quizzesLoading } = useQuizzes();
  const { results, loading: resultsLoading, error: resultsError } = useAllQuizResults();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const isLoading = authLoading || badgesLoading || quizzesLoading || resultsLoading || usersLoading;
  const hasError = usersError || resultsError;

  // Early returns for loading and error states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  if (hasError) {
    return <ErrorDisplay message={hasError} />;
  }

  // Analytics calculations
  const totalUsers = users.length;
  const totalQuizzes = quizzes.length;
  const totalAttempts = results.length;
  const averageScore = calculateAverageScore(results);
  
  const quizAttempts = groupResultsByQuiz(results);
  const mostPopularQuiz = findMostPopularQuiz(quizAttempts, quizzes);
  const quizAverages = calculateQuizAverages(quizzes, results, quizAttempts);
  const { bestQuiz, worstQuiz } = findBestAndWorstQuizzes(quizAverages);
  const topActiveUsers = calculateTopActiveUsers(results, users);
  const recentAttempts = getRecentAttempts(results);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen dark:text-gray-100">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <SummaryStats
          totalUsers={totalUsers}
          totalQuizzes={totalQuizzes}
          totalAttempts={totalAttempts}
          averageScore={averageScore}
        />

        <HighlightCards
          mostPopular={mostPopularQuiz?.title || ERROR_MESSAGES.NO_DATA}
          mostPopularAttempts={mostPopularQuiz ? quizAttempts[mostPopularQuiz.id] : 0}
          bestQuiz={bestQuiz}
          worstQuiz={worstQuiz}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopActiveUsers topActiveUsers={topActiveUsers} />
          <RecentActivity
            recentAttempts={recentAttempts}
            quizzes={quizzes}
            users={users}
          />
        </div>

        <QuizPerformanceTable quizAverages={quizAverages} results={results} />
      </div>
    </div>
  );
};

export default AdminDashboard;