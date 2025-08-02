import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { LogOut, User, Settings } from "lucide-react";

export default function Header() {
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                QuizTime
              </span>
            </Link>
          </div>

          {/* Navigation - Only show for authenticated users */}
          {user && userProfile && (
            <nav className="hidden md:flex items-center space-x-8">
              {userProfile.role === "admin" ? (
                // Admin navigation
                <>
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/admin")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/quizzes"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/quizzes")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Manage Quizzes
                  </Link>
                  <Link
                    to="/badges"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/badges")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Badges
                  </Link>
                  <Link
                    to="/users"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/users")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/user-stats"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/user-stats")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Stats
                  </Link>
                  {/* Profile Management Button */}
                  <Link
                    to="/profile"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/profile")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                // User navigation
                <>
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/history"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/history")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    History
                  </Link>
                  {/* Profile Management Button */}
                  <Link
                    to="/profile"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/profile")
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* User menu */}
          {user && userProfile ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-600">
                    {userProfile.displayName}
                  </p>
                  <p className="text-gray-500 capitalize">{userProfile.role}</p>
                </div>
              </div>
              <Button
                onClick={logout}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            // Show login/register links for unauthenticated users
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
