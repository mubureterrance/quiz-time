import React from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { usePagination } from "../../hooks/usePagination";
import { PaginationControls } from "../ui/PaginationControls";
import { PageSizeSelector } from "../ui/PageSizeSelector";
import { PaginationInfo } from "../ui/PaginationInfo";

interface User {
  uid: string;
  displayName?: string;
  email: string;
}

interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  lastActivity: string | null;
}

interface UserStatsTableProps {
  users: User[];
  userStats: Record<string, UserStats>;
  onViewDetails: (user: User) => void;
}

const TABLE_COLUMNS = [
  "Name",
  "Email",
  "Total Plays",
  "Average Score",
  "Last Activity",
  "Actions",
];

const TABLE_HEADER_CLASS =
  "px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300";
const TABLE_DATA_CLASS = "px-4 py-3";

export function UserStatsTable({
  users,
  userStats,
  onViewDetails,
}: UserStatsTableProps) {
  const pagination = usePagination({
    data: users,
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
              users.length
            ),
          }}
        />
        <PageSizeSelector
          currentPageSize={pagination.itemsPerPage}
          onPageSizeChange={pagination.changePageSize}
        />
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {TABLE_COLUMNS.map((col) => (
                  <th key={col} className={TABLE_HEADER_CLASS}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pagination.paginatedData.map((user) => (
                <UserStatsRow
                  key={user.uid}
                  user={user}
                  stats={userStats[user.uid]}
                  onViewDetails={onViewDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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

interface UserStatsRowProps {
  user: User;
  stats?: UserStats;
  onViewDetails: (user: User) => void;
}

function UserStatsRow({ user, stats, onViewDetails }: UserStatsRowProps) {
  const formatDate = (dateString: string | null) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "-";
  };

  return (
    <tr>
      <td className={TABLE_DATA_CLASS}>{user.displayName || user.email}</td>
      <td className={TABLE_DATA_CLASS}>{user.email}</td>
      <td className={TABLE_DATA_CLASS}>{stats?.totalQuizzes ?? "-"}</td>
      <td className={TABLE_DATA_CLASS}>{stats?.averageScore ?? "-"}</td>
      <td className={TABLE_DATA_CLASS}>
        {formatDate(stats?.lastActivity || null)}
      </td>
      <td className={TABLE_DATA_CLASS}>
        <Button
          className="bg-blue-600 text-white text-xs px-2 py-1 hover:bg-blue-700"
          onClick={() => onViewDetails(user)}
        >
          View Details
        </Button>
      </td>
    </tr>
  );
}
