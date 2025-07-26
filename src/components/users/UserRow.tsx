// components/UserRow.tsx
import { memo } from "react";
import { Trash2 } from "lucide-react";
import ReactSelect from "react-select";
import Select from "../ui/Select";
import UserAvatar from "./UserAvatar";
import type { Badge, UserData, UserRole } from "../../types/user";
import { getSelectStyles } from "../../utils/selectStyles";

const ROLE_OPTIONS: UserRole[] = ["user", "admin"];

interface UserRowProps {
  user: UserData;
  badges: Badge[];
  isUpdating: boolean;
  isCurrentUser: boolean;
  onRoleChange: (uid: string, role: UserRole) => Promise<void>;
  onBadgeChange: (uid: string, badges: string[]) => Promise<void>;
  onDelete: (uid: string) => void;
}

function UserRow({
  user,
  badges,
  isUpdating,
  isCurrentUser,
  onRoleChange,
  onBadgeChange,
  onDelete,
}: UserRowProps) {
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as UserRole;
    onRoleChange(user.uid, newRole);
  };

  const handleBadgeChange = (selectedOptions: any) => {
    const selectedBadgeIds = Array.isArray(selectedOptions)
      ? selectedOptions.map((opt) => opt.value)
      : [];
    onBadgeChange(user.uid, selectedBadgeIds);
  };

  const selectedBadgeOptions = badges
    .filter(badge => user.badges?.includes(badge.id))
    .map(badge => ({
      value: badge.id,
      label: badge.name,
      color: badge.color,
    }));

  const badgeOptions = badges.map(badge => ({
    value: badge.id,
    label: badge.name,
    color: badge.color,
  }));

  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      role="row"
    >
      {/* User Info */}
      <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
        <div className="flex items-center">
          <UserAvatar
            name={user.displayName}
            className="mr-4"
          />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.displayName || "No name"}
            </div>
            {isCurrentUser && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                (You)
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {user.email}
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
        <Select
          value={user.role}
          onChange={handleRoleChange}
          disabled={isUpdating || isCurrentUser}
          className="text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-gray-100"
          aria-label={`Role for ${user.displayName || user.email}`}
        >
          {ROLE_OPTIONS.map((role) => (
            <option 
              key={role} 
              value={role} 
              className="dark:bg-gray-800 dark:text-gray-100"
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </Select>
      </td>

      {/* Badges */}
      <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
        <div className="min-w-[220px]">
          <ReactSelect
            isMulti
            value={selectedBadgeOptions}
            options={badgeOptions}
            onChange={handleBadgeChange}
            isDisabled={isUpdating}
            className="text-sm"
            styles={getSelectStyles()}
            placeholder="Select badges..."
            aria-label={`Badges for ${user.displayName || user.email}`}
          />
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
        {!isCurrentUser && (
          <button
            onClick={() => onDelete(user.uid)}
            disabled={isUpdating}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition duration-200"
            aria-label={`Delete ${user.displayName || user.email}`}
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export default memo(UserRow);