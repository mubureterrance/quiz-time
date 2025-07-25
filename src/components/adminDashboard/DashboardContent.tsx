import React from 'react';
import type { DashboardAnalytics } from '../../types/dashboard.types';
import type { User } from '../../hooks/useUsers';
import type { Quiz } from '../../types/dashboard.types';
import { ERROR_MESSAGES } from '../../constants/dashboard.constants';

import DashboardHeader from '../adminDashboard/DashboardHeader';
import SummaryStats from '../adminDashboard/SummaryStats';
import HighlightCards from '../adminDashboard/HighlightCards';
import TopActiveUsers from '../adminDashboard/TopActiveUsers';
import RecentActivity from '../adminDashboard/RecentActivity';
import QuizPerformanceTable from '../adminDashboard/QuizPerformanceTable';

interface DashboardContentProps {
  analytics: DashboardAnalytics;
  quizzes: Quiz[];
  users: User[];
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  analytics,
  quizzes,
  users,
}) => {
  const {
    totalUsers,
    totalQuizzes,
    totalAttempts,
    averageScore,
    mostPopularQuiz,
    bestQuiz,
    worstQuiz,
    topActiveUsers,
    recentAttempts,
    quizAverages,
    quizAttempts,
  } = analytics;

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

        <QuizPerformanceTable quizAverages={quizAverages} results={analytics.recentAttempts} />
      </div>
    </div>
  );
};