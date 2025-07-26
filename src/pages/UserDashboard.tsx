import { useAuth } from "../context/AuthContext";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUserResults } from "../hooks/useUserResults";
import { useBadges } from "../hooks/useBadges";
import { LoadingState } from "../components/userDashboard/LoadingState";
import { QuickStats } from "../components/userDashboard/QuickStats";
import { RecentActivity } from "../components/userDashboard/RecentActivity";
import { QuizGrid } from "../components/userDashboard/QuizGrid";

export default function UserDashboard() {
  const { userProfile, user } = useAuth();
  const { quizzes, loading: quizzesLoading } = useQuizzes(userProfile?.badges);
  const { history, loading: resultsLoading } = useUserResults(user?.uid);
  const { badges, loading: badgesLoading } = useBadges();
  
  const loading = quizzesLoading || resultsLoading || badgesLoading;

  if (loading) return <LoadingState />;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen p-6 dark:text-gray-100">
      {history && <QuickStats history={history} />}
      
      {history && (
        <RecentActivity history={history} quizzes={quizzes} />
      )}
      
      <QuizGrid quizzes={quizzes} badges={badges} history={history} />
    </div>
  );
}
