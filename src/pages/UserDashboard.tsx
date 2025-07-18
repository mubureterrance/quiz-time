// src/pages/UserDashboard.tsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUserResults } from "../hooks/useUserResults";
import { useBadges } from "../hooks/useBadges";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  History,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function UserDashboard() {
  const { userProfile, user, logout } = useAuth();
  const { quizzes, loading: quizzesLoading } = useQuizzes(userProfile?.badges);
  const { history, loading: resultsLoading } = useUserResults(user?.uid);
  const { badges, loading: badgesLoading } = useBadges();
  const loading = quizzesLoading || resultsLoading || badgesLoading;

  // Utility to ensure text is readable on colored backgrounds
  function getContrastYIQ(hexcolor: string) {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  if (loading) return <div className="p-6 dark:bg-gray-900 dark:text-gray-100">Loading dashboard...</div>;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen p-6 dark:text-gray-100">
      
      {/* Quick Stats */}
      {history && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Quizzes Taken</p>
                <p className="text-xl font-bold">{history.totalQuizzes}</p>
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
                <p className="text-xl font-bold">{history.averageScore}%</p>
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
                <p className="text-xl font-bold">{history.bestScore}%</p>
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
                <p className="text-xl font-bold">
                  {history.recentActivity.length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      {history && history.recentActivity.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-300" />
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.recentActivity.slice(0, 3).map((result, index) => {
              const quiz = quizzes.find((q) => q.id === result.quizId);
              const getPerformanceIcon = (percentage: number) => {
                if (percentage >= 80)
                  return <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />;
                if (percentage >= 60)
                  return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300" />;
                return <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />;
              };

              return (
                <Card key={`${result.quizId}-${index}`} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm truncate">
                      {quiz?.title || "Unknown Quiz"}
                    </h3>
                    {getPerformanceIcon(result.percentage)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{result.percentage}%</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => {
          const taken = history?.performanceByQuiz[quiz.id];
          const badge = badges.find((b) => b.id === quiz.badge);
          const badgeColor = badge?.color || "#2563eb"; // fallback to blue
          const textColor = getContrastYIQ(badgeColor);
          return (
            <Card key={quiz.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold">{quiz.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Badge: {badge ? badge.name : quiz.badge}
                </p>
                {taken && (
                  <div className="mt-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-300 mr-1" />
                    <span className="text-green-600 dark:text-green-300 font-medium text-sm">
                      Best: {taken.percentage}%
                    </span>
                  </div>
                )}
              </div>
              <Link
                to={`/quiz/${quiz.id}`}
                style={{ backgroundColor: badgeColor, color: textColor }}
                className="mt-4 inline-block px-4 py-2 rounded text-sm text-center transition-colors duration-200 hover:opacity-90"
              >
                {taken ? "Retake Quiz" : "Take Quiz"}
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
