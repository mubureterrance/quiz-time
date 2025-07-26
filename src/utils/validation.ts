import type { UserRole } from "../types/user";

export const isValidRole = (role: string): role is UserRole => {
  return role === "user" || role === "admin";
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDisplayName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};