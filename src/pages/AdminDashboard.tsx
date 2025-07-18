import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAllQuizResults } from "../hooks/useAllQuizResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Target,
  Clock,
  Star,
  XCircle,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const { badges, loading: badgesLoading, error: badgesError } = useBadges();
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
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
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
            <p className="text-red-700 dark:text-red-300 font-medium">{error || resultsError}</p>
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
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Platform Analytics & Management
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/users">
                <Button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4" />
                  Users
                </Button>
              </Link>
              <Link to="/badges">
                <Button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2 text-sm font-medium">
                  <Trophy className="w-4 h-4" />
                  Badges
                </Button>
              </Link>
              <Link to="/quizzes">
                <Button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                  Quizzes
                </Button>
              </Link>
              <Button
                onClick={logout}
                className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Stats Grid - compact style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center min-h-0">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
              {totalUsers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-tight">Total Users</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center min-h-0">
            <div className="w-8 h-8 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
              {totalQuizzes.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-tight">Total Quizzes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center min-h-0">
            <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
              {totalAttempts.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-tight">
              Total Attempts
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center min-h-0">
            <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
              {averageScore}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-tight">Average Score</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-yellow-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Most Popular Quiz
              </h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {mostPopularQuiz ? mostPopularQuiz.title : "No data"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {mostPopularQuiz
                ? `${quizAttempts[mostPopularQuiz.id]} attempts`
                : "0 attempts"}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Best Performing Quiz
              </h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {bestQuiz ? bestQuiz.title : "No data"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {bestQuiz ? `${bestQuiz.avg}% average` : "0% average"}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-50 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lowest Performing Quiz
              </h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {worstQuiz ? worstQuiz.title : "No data"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {worstQuiz ? `${worstQuiz.avg}% average` : "0% average"}
            </p>
          </div>
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Top 10 Active Users
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left font-semibold text-gray-500 dark:text-gray-300">
                      User
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-gray-500 dark:text-gray-300">
                      Attempts
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-gray-500 dark:text-gray-300">
                      Avg. Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topActiveUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-2 py-2 text-gray-400 text-center dark:text-gray-500"
                      >
                        No data
                      </td>
                    </tr>
                  ) : (
                    topActiveUsers.map((u, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-2 py-1 font-medium text-gray-900 dark:text-gray-100">
                          {u.displayName}
                        </td>
                        <td className="px-2 py-1">{u.attempts}</td>
                        <td className="px-2 py-1">{u.avgScore}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {recentAttempts.length > 0 ? (
                recentAttempts.map((attempt, index) => {
                  const quiz = quizzes.find((q) => q.id === attempt.quizId);
                  const user = users.find((u) => u.uid === attempt.userId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {user?.displayName || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                          {quiz?.title || "Unknown Quiz"}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {attempt.percentage}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          {new Date(attempt.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-300 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Overview Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quiz Performance Overview
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quiz Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Avg. Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Best Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Worst Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {quizAverages.map((quiz) => {
                  const quizResults = results.filter(
                    (r) => r.quizId === quiz.id
                  );
                  const best =
                    quizResults.length > 0
                      ? Math.max(...quizResults.map((r) => r.percentage))
                      : 0;
                  const worst =
                    quizResults.length > 0
                      ? Math.min(...quizResults.map((r) => r.percentage))
                      : 0;
                  return (
                    <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {quiz.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {quiz.attempts}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{quiz.avg}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{best}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{worst}%</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
