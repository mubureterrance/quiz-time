import React from "react";
import {
  Trophy,
  Target,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  Medal,
  RotateCcw,
  Home
} from 'lucide-react';

type Result = {
  score: number;
  percentage: number;
  date: string;
  userId: string;
  totalQuestions?: number;
};

type QuizSummaryProps = {
  quizTitle: string;
  result: Result;
  topScores: Array<{
    userId: string;
    score: number;
    percentage: number;
    displayName: string;
    totalQuestions?: number;
  }>;
  yourRank: number;
  onRetake: () => void;
  onDashboard: () => void;
};

function getRankIcon(rank: number) {
  if (rank === 1) return { icon: Trophy, color: "text-yellow-500" };
  if (rank === 2) return { icon: Medal, color: "text-gray-400" };
  if (rank === 3) return { icon: Medal, color: "text-amber-600" };
  return { icon: Target, color: "text-blue-500" };
}

function getGradeInfo(percentage: number) {
  if (percentage < 35) return {
    message: "Needs significant improvement. Keep practicing!",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: XCircle,
    iconColor: "text-red-500"
  };
  if (percentage < 40) return {
    message: "Below average. Review the material and try again.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Clock,
    iconColor: "text-orange-500"
  };
  if (percentage < 50) return {
    message: "Almost there! Keep working on it.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: TrendingUp,
    iconColor: "text-yellow-500"
  };
  if (percentage < 60) return {
    message: "Fair effort. You can do even better!",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Target,
    iconColor: "text-blue-500"
  };
  if (percentage < 80) return {
    message: "Good job! You're getting there.",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-500"
  };
  return {
    message: "Excellent work! Outstanding performance!",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: Star,
    iconColor: "text-emerald-500"
  };
}

function getPerformanceLevel(percentage: number) {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 50) return "Fair";
  if (percentage >= 40) return "Below Average";
  return "Needs Improvement";
}

const QuizSummary: React.FC<QuizSummaryProps> = ({
  quizTitle,
  result,
  topScores,
  yourRank,
  onRetake,
  onDashboard
}) => {
  const filteredTopScores = topScores.filter(entry => entry.percentage >= 40);
  const totalQuestions = result.totalQuestions || 0;
  const gradeInfo = getGradeInfo(result.percentage);
  const performanceLevel = getPerformanceLevel(result.percentage);
  const GradeIcon = gradeInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{quizTitle}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Quiz Results</p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-4">
          {/* Score Display */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 shadow-md">
              <div className="text-white text-center">
                <div className="text-xl font-bold">{result.percentage}%</div>
                <div className="text-xs opacity-90">Score</div>
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">{performanceLevel}</h2>
            <p className="text-sm text-gray-600">
              {result.score} {totalQuestions ? `out of ${totalQuestions}` : ""} questions correct
            </p>
          </div>

          {/* Grade Message */}
          <div className={`${gradeInfo.bgColor} ${gradeInfo.borderColor} border-l-4 p-3 rounded-r-lg mb-4`}>
            <div className="flex items-center">
              <GradeIcon className={`w-4 h-4 ${gradeInfo.iconColor} mr-2`} />
              <p className={`${gradeInfo.color} text-sm font-medium`}>{gradeInfo.message}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Completed</p>
              <p className="text-sm font-semibold">{new Date(result.date).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Target className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Accuracy</p>
              <p className="text-sm font-semibold">{result.percentage}%</p>
            </div>
            {yourRank > 0 && result.percentage >= 40 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 text-center border border-yellow-200">
                <Trophy className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Your Rank</p>
                <p className="text-sm font-semibold text-yellow-700">#{yourRank}</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 rounded-full p-1.5 mr-2">
              <Award className="w-4 h-4 text-yellow-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Top Performers</h2>
          </div>

          {filteredTopScores.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No qualifying scores yet. Be the first to score 40% or above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTopScores.slice(0, 5).map((entry, index) => {
                const rank = index + 1;
                const { icon: RankIcon, color: rankColor } = getRankIcon(rank);
                const isCurrentUser = entry.userId === result.userId;
                
                return (
                  <div
                    key={`${entry.userId}-${index}`}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:shadow-sm ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                      rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-blue-100'
                    }`}>
                      <RankIcon className={`w-4 h-4 ${rank <= 3 ? 'text-white' : rankColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${isCurrentUser ? 'text-green-700' : 'text-gray-800'}`}>
                            {entry.displayName}
                            {isCurrentUser && <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">You</span>}
                          </p>
                          <p className="text-xs text-gray-600">Rank #{rank}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${isCurrentUser ? 'text-green-700' : 'text-gray-800'}`}>
                            {entry.percentage}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.score}/{entry.totalQuestions || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetake}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </button>
          <button
            onClick={onDashboard}
            className="flex-1 bg-gray-600 text-white py-2.5 px-4 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSummary;