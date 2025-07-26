export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  badges: string[];
  createdAt?: any;
  lastLogin?: any;
}

export type UserRole = "user" | "admin";

export interface Badge {
  id: string;
  name: string;
  color: string;
}

export interface UserFilters {
  searchTerm: string;
  roleFilter: string;
}

export interface SortConfig {
  field: "name" | "email" | "role" | "created";
  direction: "asc" | "desc";
}