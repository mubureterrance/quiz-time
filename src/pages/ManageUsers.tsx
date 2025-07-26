import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, RefreshCw, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBadges } from "../hooks/useBadges";
import { useUserManagement } from "../hooks/useUserManagement";
import { useDebounce } from "../hooks/useDebounce";
import Button from "../components/ui/Button";
import UserStats from "../components/users/UserStats";
import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import DeleteUserModal from "../components/users/DeleteUserModal";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";
import type { UserFilters as IUserFilters, SortConfig } from "../types/user";

export default function ManageUsers() {
  const { userProfile } = useAuth();
  const { badges, loading: badgesLoading, error: badgesError } = useBadges();
  
  const {
    users,
    loading,
    error,
    updatingUsers,
    fetchUsers,
    updateUserRole,
    updateUserBadges,
    deleteUser,
    clearError
  } = useUserManagement();

  // Local state for UI interactions
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "name",
    direction: "asc"
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  // Create filters object with debounced search
  const filters: IUserFilters = useMemo(() => ({
    searchTerm: debouncedSearchTerm,
    roleFilter
  }), [debouncedSearchTerm, roleFilter]);

  // Filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter((user) => {
        const searchTerm = filters.searchTerm?.toLowerCase() || "";
        const matchesSearch = !searchTerm ||
          user.displayName?.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm);
        
        const matchesRole = 
          filters.roleFilter === "all" || user.role === filters.roleFilter;
        
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortConfig.field) {
          case "name":
            aValue = a.displayName?.toLowerCase() || "";
            bValue = b.displayName?.toLowerCase() || "";
            break;
          case "email":
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case "role":
            aValue = a.role;
            bValue = b.role;
            break;
          case "created":
            aValue = a.createdAt?.toDate?.() || new Date(0);
            bValue = b.createdAt?.toDate?.() || new Date(0);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, filters, sortConfig]);

  const handleSort = (field: SortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };

  const handleDeleteUser = async (uid: string) => {
    await deleteUser(uid);
    setShowDeleteConfirm(null);
  };

  // Show loading state
  if (loading || badgesLoading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  // Show error state for critical errors
  if (badgesError) {
    return <ErrorAlert message={badgesError} />;
  }

  const isSearching = searchInput !== debouncedSearchTerm;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen w-full">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                aria-label="Back to admin panel"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Manage Users
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  Manage user roles and permissions
                </p>
              </div>
            </div>
            <Button
              onClick={fetchUsers}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200 flex items-center gap-2"
              aria-label="Refresh user list"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <ErrorAlert 
            message={error} 
            onDismiss={clearError}
            className="mb-6"
          />
        )}

        {/* Stats */}
        <UserStats users={users} className="mb-6" />

        {/* Filters */}
        <UserFilters
          searchInput={searchInput}
          roleFilter={roleFilter}
          isSearching={isSearching}
          onSearchChange={handleSearchChange}
          onRoleFilterChange={handleRoleFilterChange}
          className="mb-8"
        />

        {/* User Table */}
        <UserTable
          users={filteredAndSortedUsers}
          badges={badges}
          sortConfig={sortConfig}
          updatingUsers={updatingUsers}
          currentUserId={userProfile?.uid}
          onSort={handleSort}
          onRoleChange={updateUserRole}
          onBadgeChange={updateUserBadges}
          onDeleteUser={(uid) => setShowDeleteConfirm(uid)}
        />
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDeleteUser(showDeleteConfirm)}
      />
    </div>
  );
}