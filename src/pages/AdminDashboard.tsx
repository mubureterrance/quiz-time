import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAllQuizResults } from "../hooks/useAllQuizResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import DashboardHeader from "../components/adminDashboard/DashboardHeader";
import SummaryStats from "../components/adminDashboard/SummaryStats";
import HighlightCards from "../components/adminDashboard/HighlightCards";
import { XCircle } from "lucide-react";
import TopActiveUsers from "../components/adminDashboard/TopActiveUsers";
import RecentActivity from "../components/adminDashboard/RecentActivity";
import QuizPerformanceTable from "../components/adminDashboard/QuizPerformanceTable";

export default function AdminDashboard() {
  const { loading: authLoading, shouldRedirect } = useAdminGuard();
  const { loading: badgesLoading } = useBadges();
  const { quizzes, loading: quizzesLoading } = useQuizzes();
  const {
    results,
    loading: resultsLoading,
    error: resultsError,
  } = useAllQuizResults();
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch all users (like ManageUsers)
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const snapshot = await getDocs(collection(db, "users"));
        setUsers(
          snapshot.docs.map((docSnap) => ({
            uid: docSnap.id,
            ...(docSnap.data() as any),
          }))
        );
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Loading state
  if (
    authLoading ||
    badgesLoading ||
    quizzesLoading ||
    resultsLoading ||
    loading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }
  if (shouldRedirect) return <Navigate to="/" replace />;
  if (error || resultsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 dark:text-gray-100">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
            <div className="text-red-600 dark:text-red-300 mb-2">
              <XCircle className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium">
              {error || resultsError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Analytics Computation ---
  // User stats
  const totalUsers = users.length;
  // Quiz stats
  const totalQuizzes = quizzes.length;
  // Platform stats
  const totalAttempts = results.length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts
        )
      : 0;
  // Most popular quiz
  const quizAttempts: Record<string, number> = {};
  results.forEach((r) => {
    quizAttempts[r.quizId] = (quizAttempts[r.quizId] || 0) + 1;
  });
  const mostPopularQuizId = Object.entries(quizAttempts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];
  const mostPopularQuiz = quizzes.find((q) => q.id === mostPopularQuizId);
  // Average score per quiz
  const quizScores: Record<string, { total: number; count: number }> = {};
  results.forEach((r) => {
    if (!quizScores[r.quizId]) quizScores[r.quizId] = { total: 0, count: 0 };
    quizScores[r.quizId].total += r.percentage;
    quizScores[r.quizId].count += 1;
  });
  const quizAverages = quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    avg: quizScores[q.id]
      ? Math.round(quizScores[q.id].total / quizScores[q.id].count)
      : 0,
    attempts: quizAttempts[q.id] || 0,
  }));
  const bestQuiz = quizAverages
    .filter((q) => q.attempts > 0)
    .sort((a, b) => b.avg - a.avg)[0];
  const worstQuiz = quizAverages
    .filter((q) => q.attempts > 0)
    .sort((a, b) => a.avg - b.avg)[0];
  // Top 5 active users
  const userAttempts: Record<string, number> = {};
  const userScores: Record<string, { total: number; count: number }> = {};
  results.forEach((r) => {
    userAttempts[r.userId] = (userAttempts[r.userId] || 0) + 1;
    if (!userScores[r.userId]) userScores[r.userId] = { total: 0, count: 0 };
    userScores[r.userId].total += r.percentage;
    userScores[r.userId].count += 1;
  });
  const topActiveUsers = Object.entries(userAttempts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([uid, attempts]) => {
      const user = users.find((u) => u.uid === uid);
      const avgScore = userScores[uid]
        ? Math.round(userScores[uid].total / userScores[uid].count)
        : 0;
      return {
        displayName: user?.displayName || uid,
        attempts,
        avgScore,
      };
    });
  // Recent activity (last 5 attempts)
  const recentAttempts = [...results]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen dark:text-gray-100">
      {/* Header */}
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Stats Grid - compact style */}
        <SummaryStats
          totalUsers={totalUsers}
          totalQuizzes={totalQuizzes}
          totalAttempts={totalAttempts}
          averageScore={averageScore}
        />

        {/* Secondary Stats */}
        <HighlightCards
          mostPopular={mostPopularQuiz ? mostPopularQuiz.title : "No data"}
          mostPopularAttempts={
            mostPopularQuiz ? quizAttempts[mostPopularQuiz.id] : 0
          }
          bestQuiz={bestQuiz}
          worstQuiz={worstQuiz}
        />

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopActiveUsers topActiveUsers={topActiveUsers} />

          <RecentActivity
            recentAttempts={recentAttempts}
            quizzes={quizzes}
            users={users}
          />
        </div>

        {/* Quiz Overview Table */}
        <QuizPerformanceTable quizAverages={quizAverages} results={results} />
      </div>
    </div>
  );
}
