// utils/userUtils.ts
import type { UserData, UserFilters, SortConfig } from "../types/user";

export const filterAndSortUsers = (
  users: UserData[],
  filters: UserFilters | undefined,
  sortConfig: SortConfig
): UserData[] => {
  // Handle undefined filters gracefully
  if (!filters) {
    return users.slice().sort((a, b) => sortUsers(a, b, sortConfig));
  }

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
    .sort((a, b) => sortUsers(a, b, sortConfig));
};

// Separate sorting function for reusability
const sortUsers = (a: UserData, b: UserData, sortConfig: SortConfig): number => {
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
};