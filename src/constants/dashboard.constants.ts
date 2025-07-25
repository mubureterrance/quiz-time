export const LOADING_MESSAGES = {
  ANALYTICS: "Loading analytics...",
} as const;

export const ERROR_MESSAGES = {
  USERS_LOAD_FAILED: "Failed to load users",
  NO_DATA: "No data",
} as const;

export const LIMITS = {
  TOP_USERS: 10,
  RECENT_ATTEMPTS: 5,
} as const;
