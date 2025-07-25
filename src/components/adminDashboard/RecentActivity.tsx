import { Clock } from "lucide-react";

interface Attempt {
  quizId: string;
  userId: string;
  percentage: number;
  date: string;
}

interface Quiz {
  id: string;
  title: string;
}

interface User {
  uid: string;
  displayName: string;
}

interface Props {
  recentAttempts: Attempt[];
  quizzes: Quiz[];
  users: User[];
}

export default function RecentActivity({ recentAttempts, quizzes, users }: Props) {
  return (
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
              <div key={index} className="flex items-center justify-between py-2">
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
  );
}
