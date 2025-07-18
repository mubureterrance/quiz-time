import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand and description */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">QuizTime</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Test your knowledge, earn badges</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Register
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © {currentYear} QuizTime. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 