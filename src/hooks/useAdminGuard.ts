import { useAuth } from "../context/AuthContext";

export function useAdminGuard() {
  const { userProfile, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return {
      isAdmin: false,
      loading: true,
      shouldRedirect: false,
    };
  }

  // Check if user is admin
  const isAdmin = userProfile?.role === "admin";

  // If not admin, should redirect
  if (!isAdmin) {
    return {
      isAdmin: false,
      loading: false,
      shouldRedirect: true,
    };
  }

  return {
    isAdmin: true,
    loading: false,
    shouldRedirect: false,
  };
} 