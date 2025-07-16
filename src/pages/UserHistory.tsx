import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUserResults, type QuizResult } from "../hooks/useUserResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  BookOpen,
  ArrowLeft,
  Star,
  Award,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function UserHistory() {
  const { userProfile, user } = useAuth();
  const { history, loading, error } = useUserResults(user?.uid);
  const { quizzes } = useQuizzes();
  const [filter, setFilter] = useState<"all" | "recent" | "best">("all");

  if (loading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading History</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!history || history.results.length === 0) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/dashboard" className="mr-4">
              <Button className="bg-gray-600 text-white hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Quiz History</h1>
          </div>
          
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Quiz History Yet</h2>
            <p className="text-gray-500 mb-6">Start taking quizzes to build your history and track your progress!</p>
            <Link to="/dashboard">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Take Your First Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter results based on selected filter
  const getFilteredResults = () => {
    switch (filter) {
      case "recent":
        return history.results.slice(0, 10);
      case "best":
        return [...history.results].sort((a, b) => b.percentage - a.percentage).slice(0, 10);
      default:
        return history.results;
    }
  };

  const filteredResults = getFilteredResults();

  // Get quiz title by ID
  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.title || "Unknown Quiz";
  };

  // Get performance level
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { level: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", icon: Star };
    if (percentage >= 60) return { level: "Good", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle };
    if (percentage >= 40) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-50", icon: Target };
    return { level: "Needs Work", color: "text-red-600", bg: "bg-red-50", icon: XCircle };
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <Button className="bg-gray-600 text-white hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Quiz History</h1>
              <p className="text-gray-600">Track your progress and performance</p>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold">{history.totalQuizzes}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{history.averageScore}%</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold">{history.bestScore}%</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold">{history.recentActivity.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setFilter("all")}
            className={`${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
          >
            All Quizzes
          </Button>
          <Button
            onClick={() => setFilter("recent")}
            className={`${filter === "recent" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
          >
            Recent
          </Button>
          <Button
            onClick={() => setFilter("best")}
            className={`${filter === "best" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
          >
            Best Scores
          </Button>
        </div>

        {/* Quiz History Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quiz</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Score</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Performance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result, index) => {
                  const performance = getPerformanceLevel(result.percentage);
                  const PerformanceIcon = performance.icon;
                  
                  return (
                    <tr key={`${result.quizId}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{getQuizTitle(result.quizId)}</p>
                          <p className="text-sm text-gray-500">ID: {result.quizId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{result.percentage}%</p>
                          <p className="text-sm text-gray-500">
                            {result.score}/{result.totalQuestions || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}>
                          <PerformanceIcon className="w-3 h-3 mr-1" />
                          {performance.level}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(result.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Link to={`/results/${result.quizId}`}>
                            <Button className="bg-blue-600 text-white text-xs px-2 py-1 hover:bg-blue-700">
                              View Details
                            </Button>
                          </Link>
                          <Link to={`/quiz/${result.quizId}`}>
                            <Button className="bg-green-600 text-white text-xs px-2 py-1 hover:bg-green-700">
                              Retake
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Performance Insights */}
        {history.results.length > 1 && (
          <div className="mt-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Performance Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Progress Trend</h4>
                  <p className="text-sm text-gray-600">
                    {history.averageScore >= 60 ? "Great job! You're performing well above average." :
                     history.averageScore >= 40 ? "You're making steady progress. Keep it up!" :
                     "Keep practicing! Focus on areas where you can improve."}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                  <p className="text-sm text-gray-600">
                    {history.bestScore >= 80 ? "Excellent work! Try more challenging quizzes." :
                     history.bestScore >= 60 ? "Good progress! Focus on consistency." :
                     "Review the material and retake quizzes to improve your scores."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 