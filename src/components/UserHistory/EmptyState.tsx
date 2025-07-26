import { BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export function EmptyState() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
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
          <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Quiz History Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start taking quizzes to build your history and track your progress!</p>
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