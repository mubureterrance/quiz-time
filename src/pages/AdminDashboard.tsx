import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useBadges } from "../hooks/useBadges";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { useAllQuizResults } from "../hooks/useAllQuizResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUsers } from "../hooks/useUsers";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";

import { LoadingSpinner } from "../components/adminDashboard/LoadingSpinner";
import { ErrorDisplay } from "../components/adminDashboard/ErrorDisplay";
import { DashboardContent } from "../components/adminDashboard/DashboardContent";

const AdminDashboard: React.FC = () => {
  const { userProfile, user } = useAuth();
  const { loading: authLoading, shouldRedirect } = useAdminGuard();
  const { loading: badgesLoading } = useBadges();
  const { quizzes, loading: quizzesLoading } = useQuizzes(userProfile?.badges, {
    isAdmin: true,
  });
  const {
    results,
    loading: resultsLoading,
    error: resultsError,
  } = useAllQuizResults();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const isLoading =
    authLoading ||
    badgesLoading ||
    quizzesLoading ||
    resultsLoading ||
    usersLoading;
  const hasError = usersError || resultsError;

  const analytics = useDashboardAnalytics({
    users: users || [],
    quizzes: quizzes || [],
    results: results || [],
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  if (hasError) {
    return <ErrorDisplay message={hasError} />;
  }

  return (
    <DashboardContent analytics={analytics} quizzes={quizzes} users={users} />
  );
};

export default AdminDashboard;
