import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { type SortConfig } from "../../types/user";

interface UserTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (field: SortConfig['field']) => void;
}

export default function UserTableHeader({ sortConfig, onSort }: UserTableHeaderProps) {
  const SortIcon = ({ field }: { field: SortConfig['field'] }) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  const createSortHandler = (field: SortConfig['field']) => () => onSort(field);

  return (
    <thead className="bg-gray-50 dark:bg-gray-900">
      <tr role="row">
        <th
          className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
          onClick={createSortHandler("name")}
          role="columnheader"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && createSortHandler("name")()}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </span>
            <SortIcon field="name" />
          </div>
        </th>
        <th
          className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
          onClick={createSortHandler("email")}
          role="columnheader"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && createSortHandler("email")()}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Email
            </span>
            <SortIcon field="email" />
          </div>
        </th>
        <th
          className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
          onClick={createSortHandler("role")}
          role="columnheader"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && createSortHandler("role")()}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role
            </span>
            <SortIcon field="role" />
          </div>
        </th>
        <th className="px-6 py-3 text-left" role="columnheader">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Badges
          </span>
        </th>
        <th className="px-6 py-3 text-left" role="columnheader">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </span>
        </th>
      </tr>
    </thead>
  );
}