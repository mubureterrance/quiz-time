import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { ArrowLeft } from "lucide-react";

export function Header() {
  return (
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
          <p className="text-gray-600 dark:text-gray-200">Track your progress and performance</p>
        </div>
      </div>
    </div>
  );
}
