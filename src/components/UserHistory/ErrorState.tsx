import { XCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <XCircle className="w-12 h-12 text-red-500 dark:text-red-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading History</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    </div>
  );
}