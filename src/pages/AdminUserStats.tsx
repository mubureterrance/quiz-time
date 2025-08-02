import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminGuard } from "../hooks/useAdminGuard";
import { useAuth } from "../context/AuthContext";
import { useUserResults } from "../hooks/useUserResults";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUsers } from "../hooks/useUsers";
import { useUserStats } from "../hooks/useUserStats";
import { useUserSearch } from "../hooks/useUserSearch";
import { UserStatsTable } from "../components/UserStats/UserStatsTable";
import { UserDetailsDrawer } from "../components/UserStats/UserDetailsDrawer";
import { SearchBar } from "../components/UserStats/SearchBar";
import { PerformanceInsights } from "../components/UserHistory/PerformanceInsights";

interface User {
  uid: string;
  displayName?: string;
  email: string;
}

export default function AdminUserStats() {
  const { userProfile, user } = useAuth();
  const { isAdmin, loading: authLoading, shouldRedirect } = useAdminGuard();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { userStats, loading: statsLoading } = useUserStats(users);
  const { quizzes } = useQuizzes(userProfile?.badges, { isAdmin: true });
  const { filteredUsers, totalResults, isSearching } = useUserSearch(
    users,
    searchTerm
  );

  const {
    history,
    loading: historyLoading,
    error: historyError,
  } = useUserResults(selectedUser?.uid);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  if (authLoading || usersLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  if (shouldRedirect) return <Navigate to="/" replace />;

  if (usersError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 dark:text-gray-100">
        {usersError}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen dark:text-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">
            Admin User Statistics
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="w-full sm:w-80"
            />
            {isSearching && (
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {totalResults} user{totalResults !== 1 ? "s" : ""} found
              </div>
            )}
          </div>
        </div>

        {filteredUsers.length === 0 && isSearching ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No users found
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              Try adjusting your search terms
            </div>
          </div>
        ) : (
          <UserStatsTable
            users={filteredUsers}
            userStats={userStats}
            onViewDetails={handleViewDetails}
          />
        )}

        <UserDetailsDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          selectedUser={selectedUser}
          history={history}
          historyLoading={historyLoading}
          historyError={historyError}
          quizzes={quizzes}
        />
      </div>
    </div>
  );
}
