// src/pages/UserDashboard.tsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUserResults } from "../hooks/useUserResults";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp, 
  History,
  Star,
  CheckCircle,
  Clock
} from "lucide-react";

export default function UserDashboard() {
  const { userProfile, user, logout } = useAuth();
  const { quizzes, loading: quizzesLoading } = useQuizzes(userProfile?.badges);
  const { history, loading: resultsLoading } = useUserResults(user?.uid);
  const loading = quizzesLoading || resultsLoading;

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {userProfile?.displayName}</h1>
          <p className="text-gray-600">Ready to test your knowledge?</p>
        </div>
        <div className="flex gap-2">
          <Link to="/history">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </Link>
          <Button
            onClick={logout}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {history && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
                <p className="text-xl font-bold">{history.totalQuizzes}</p>
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
                <p className="text-xl font-bold">{history.averageScore}%</p>
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
                <p className="text-xl font-bold">{history.bestScore}%</p>
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
                <p className="text-xl font-bold">{history.recentActivity.length}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      {history && history.recentActivity.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.recentActivity.slice(0, 3).map((result, index) => {
              const quiz = quizzes.find(q => q.id === result.quizId);
              const getPerformanceIcon = (percentage: number) => {
                if (percentage >= 80) return <Star className="w-4 h-4 text-emerald-600" />;
                if (percentage >= 60) return <CheckCircle className="w-4 h-4 text-green-600" />;
                return <Target className="w-4 h-4 text-yellow-600" />;
              };
              
              return (
                <Card key={`${result.quizId}-${index}`} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm truncate">{quiz?.title || "Unknown Quiz"}</h3>
                    {getPerformanceIcon(result.percentage)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{result.percentage}%</span>
                    <span className="text-gray-500">{new Date(result.date).toLocaleDateString()}</span>
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
          return (
            <Card
              key={quiz.id}
              className="flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold">{quiz.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Badge: {quiz.badge}</p>
                {taken && (
                  <div className="mt-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium text-sm">
                      Best: {taken.percentage}%
                    </span>
                  </div>
                )}
              </div>
              <Link
                to={`/quiz/${quiz.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm text-center"
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
