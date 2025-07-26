// components/UserTable.tsx
import { useMemo } from "react";
import { Users } from "lucide-react";
import type {
  Badge,
  UserData,
  UserFilters,
  SortConfig,
} from "../../types/user";
import UserTableHeader from "./UserTableHeader";
import UserRow from "./UserRow";
import { filterAndSortUsers } from "../../utils/userUtils";
import { usePagination } from "../../hooks/usePagination";
import { PaginationControls } from "../ui/PaginationControls";
import { PageSizeSelector } from "../ui/PageSizeSelector";
import { PaginationInfo } from "../ui/PaginationInfo";

interface UserTableProps {
  users: UserData[];
  badges: Badge[];
  filters?: UserFilters; // Make optional
  sortConfig: SortConfig;
  updatingUsers: Set<string>;
  currentUserId?: string;
  onSort: (field: SortConfig["field"]) => void;
  onRoleChange: (uid: string, role: UserData["role"]) => Promise<void>;
  onBadgeChange: (uid: string, badges: string[]) => Promise<void>;
  onDeleteUser: (uid: string) => void;
}

export default function UserTable({
  users,
  badges,
  filters,
  sortConfig,
  updatingUsers,
  currentUserId,
  onSort,
  onRoleChange,
  onBadgeChange,
  onDeleteUser,
}: UserTableProps) {
  const filteredAndSortedUsers = useMemo(
    () => filterAndSortUsers(users, filters, sortConfig),
    [users, filters, sortConfig]
  );

  const isEmpty = filteredAndSortedUsers.length === 0;

  const pagination = usePagination({
    data: filteredAndSortedUsers,
    initialPageSize: 10,
  });

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PaginationInfo
          paginationInfo={{
            ...pagination.paginationInfo,
            displayEnd: Math.min(
              pagination.paginationInfo.displayEnd,
              filteredAndSortedUsers.length
            ),
          }}
        />
        <PageSizeSelector
          currentPageSize={pagination.itemsPerPage}
          onPageSizeChange={pagination.changePageSize}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Users table">
            <UserTableHeader sortConfig={sortConfig} onSort={onSort} />
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pagination.paginatedData.map((user) => (
                <UserRow
                  key={user.uid}
                  user={user}
                  badges={badges}
                  isUpdating={updatingUsers.has(user.uid)}
                  isCurrentUser={user.uid === currentUserId}
                  onRoleChange={onRoleChange}
                  onBadgeChange={onBadgeChange}
                  onDelete={onDeleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>

        {isEmpty && <EmptyState />}
      </div>
      {/* Bottom Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {pagination.currentPage} of{" "}
          {pagination.paginationInfo.totalPages}
        </div>
        <PaginationControls
          paginationInfo={pagination.paginationInfo}
          currentPage={pagination.currentPage}
          onPageChange={pagination.goToPage}
          onFirstPage={pagination.goToFirstPage}
          onLastPage={pagination.goToLastPage}
          onNextPage={pagination.goToNextPage}
          onPreviousPage={pagination.goToPreviousPage}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12" role="status" aria-live="polite">
      <Users
        className="w-12 h-12 text-gray-400 mx-auto mb-4"
        aria-hidden="true"
      />
      <p className="text-gray-500 dark:text-gray-400">
        No users found matching your criteria.
      </p>
    </div>
  );
}
