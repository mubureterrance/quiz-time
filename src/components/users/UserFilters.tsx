import { Search, Filter, Loader2 } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface UserFiltersProps {
  searchInput: string;
  roleFilter: string;
  isSearching?: boolean;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  className?: string;
}

export default function UserFilters({ 
  searchInput,
  roleFilter,
  isSearching = false,
  onSearchChange,
  onRoleFilterChange,
  className = "" 
}: UserFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRoleFilterChange(e.target.value);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-10 w-full"
            aria-label="Search users"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-400">Searching...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="min-w-[120px]"
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </Select>
        </div>
      </div>
    </div>
  );
}