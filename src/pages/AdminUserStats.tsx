import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import Drawer from "../components/ui/Drawer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { Navigate } from "react-router-dom";
import { useUserResults } from "../hooks/useUserResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { BarChart3, BookOpen, Target, Trophy, TrendingUp, XCircle } from "lucide-react";

export default function AdminUserStats() {
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { quizzes } = useQuizzes();
  const [userStats, setUserStats] = useState<Record<string, any>>({});

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const snapshot = await getDocs(collection(db, "users"));
        setUsers(snapshot.docs.map(docSnap => ({ uid: docSnap.id, ...(docSnap.data() as any) })));
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Fetch summary stats for all users
  useEffect(() => {
    async function fetchStats() {
      const stats: Record<string, any> = {};
      for (const user of users) {
        const resultsSnap = await getDocs(
          collection(db, "quizResults")
        );
        const userResults = resultsSnap.docs
          .map(doc => doc.data())
          .filter((r: any) => r.userId === user.uid);
        const totalQuizzes = userResults.length;
        const averageScore = totalQuizzes > 0 ? Math.round(userResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / totalQuizzes) : 0;
        const lastActivity = userResults.length > 0 ? userResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date : null;
        stats[user.uid] = { totalQuizzes, averageScore, lastActivity };
      }
      setUserStats(stats);
    }
    if (users.length > 0) fetchStats();
  }, [users]);

  // Drawer: fetch selected user's quiz history
  const { history, loading: historyLoading, error: historyError } = useUserResults(selectedUser?.uid);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">Loading...</div>;
  }
  if (shouldRedirect) return <Navigate to="/" replace />;
  if (error) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 dark:text-gray-100">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen dark:text-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin User Statistics</h1>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Total Quizzes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Average Score</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Last Activity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(user => (
                  <tr key={user.uid}>
                    <td className="px-4 py-3">{user.displayName || user.email}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{userStats[user.uid]?.totalQuizzes ?? '-'}</td>
                    <td className="px-4 py-3">{userStats[user.uid]?.averageScore ?? '-'}</td>
                    <td className="px-4 py-3">{userStats[user.uid]?.lastActivity ? new Date(userStats[user.uid].lastActivity).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <Button
                        className="bg-blue-600 text-white text-xs px-2 py-1 hover:bg-blue-700"
                        onClick={() => { setSelectedUser(user); setDrawerOpen(true); }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedUser ? `${selectedUser.displayName || selectedUser.email}'s Quiz History` : "User Quiz History"}
        >
          {historyLoading ? (
            <div className="p-6 text-center">Loading quiz history...</div>
          ) : historyError ? (
            <div className="p-6 text-center text-red-500">{historyError}</div>
          ) : !history || history.results.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">No quiz history for this user.</div>
          ) : (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Quizzes</p>
                      <p className="text-2xl font-bold">{history.totalQuizzes}</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                      <Target className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Average Score</p>
                      <p className="text-2xl font-bold">{history.averageScore}%</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg mr-3">
                      <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Best Score</p>
                      <p className="text-2xl font-bold">{history.bestScore}%</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                      <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Recent Activity</p>
                      <p className="text-2xl font-bold">{history.recentActivity.length}</p>
                    </div>
                  </div>
                </Card>
              </div>
              {/* Quiz History Table */}
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Quiz</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Score</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {history.results.map((result, index) => {
                        const quiz = quizzes.find(q => q.id === result.quizId);
                        return (
                          <tr key={`${result.quizId}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{quiz?.title || "Unknown Quiz"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {result.quizId}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{result.percentage}%</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {result.score}/{result.totalQuestions || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(result.date).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </Drawer>
      </div>
    </div>
  );
} 