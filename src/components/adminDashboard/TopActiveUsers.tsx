import { TrendingUp } from "lucide-react";

interface UserActivity {
  displayName: string;
  attempts: number;
  avgScore: number;
}

interface TopActiveUsersProps {
  topActiveUsers: UserActivity[];
}

export default function TopActiveUsers({ topActiveUsers }: TopActiveUsersProps) {
  return (
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
  );
}
