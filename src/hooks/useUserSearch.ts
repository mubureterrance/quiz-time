import { useMemo } from "react";

interface User {
  uid: string;
  displayName?: string;
  email: string;
}

export function useUserSearch(users: User[], searchTerm: string) {
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const lowercaseSearch = searchTerm.toLowerCase().trim();
    
    return users.filter((user) => {
      const displayName = user.displayName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      
      return (
        displayName.includes(lowercaseSearch) ||
        email.includes(lowercaseSearch)
      );
    });
  }, [users, searchTerm]);

  return {
    filteredUsers,
    hasResults: filteredUsers.length > 0,
    totalResults: filteredUsers.length,
    isSearching: searchTerm.trim().length > 0,
  };
}