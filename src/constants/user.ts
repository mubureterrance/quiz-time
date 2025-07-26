export const USER_ROLES = {
  USER: 'user' as const,
  ADMIN: 'admin' as const,
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.ADMIN]: 'Administrator',
} as const;

export const SORT_FIELDS = {
  NAME: 'name' as const,
  EMAIL: 'email' as const,
  ROLE: 'role' as const,
  CREATED: 'created' as const,
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FETCH_USERS_FAILED: "Failed to load users. Please try again.",
  UPDATE_ROLE_FAILED: "Failed to update user role. Please try again.",
  UPDATE_BADGES_FAILED: "Failed to update badges. Please try again.",
  DELETE_USER_FAILED: "Failed to delete user. Please try again.",
  CANNOT_CHANGE_OWN_ROLE: "You cannot change your own role.",
  CANNOT_DELETE_SELF: "You cannot delete your own account.",
  BADGES_LOAD_FAILED: "Failed to load badges. Please try again.",
} as const;