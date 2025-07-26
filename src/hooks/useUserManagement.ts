import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import type { UserData, UserRole } from "../types/user";

export const useUserManagement = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  const addUpdatingUser = useCallback((uid: string) => {
    setUpdatingUsers(prev => new Set(prev).add(uid));
  }, []);

  const removeUpdatingUser = useCallback((uid: string) => {
    setUpdatingUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(uid);
      return newSet;
    });
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const snapshot = await getDocs(collection(db, "users"));
      const userData: UserData[] = snapshot.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...(docSnap.data() as Omit<UserData, "uid">),
      }));
      
      setUsers(userData);
    } catch (err) {
      const errorMessage = "Failed to load users. Please try again.";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (uid: string, newRole: UserRole) => {
    // Prevent users from changing their own role
    if (uid === userProfile?.uid) {
      setError("You cannot change your own role.");
      return;
    }

    addUpdatingUser(uid);

    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      
      setUsers(prev =>
        prev.map(user => 
          user.uid === uid ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError("Failed to update user role. Please try again.");
      console.error("Error updating role:", err);
    } finally {
      removeUpdatingUser(uid);
    }
  }, [userProfile?.uid, addUpdatingUser, removeUpdatingUser]);

  const updateUserBadges = useCallback(async (uid: string, newBadges: string[]) => {
    addUpdatingUser(uid);

    try {
      await updateDoc(doc(db, "users", uid), { badges: newBadges });
      
      setUsers(prev =>
        prev.map(user => 
          user.uid === uid ? { ...user, badges: newBadges } : user
        )
      );
    } catch (err) {
      setError("Failed to update badges. Please try again.");
      console.error("Error updating badges:", err);
    } finally {
      removeUpdatingUser(uid);
    }
  }, [addUpdatingUser, removeUpdatingUser]);

  const deleteUser = useCallback(async (uid: string) => {
    // Prevent users from deleting their own account
    if (uid === userProfile?.uid) {
      setError("You cannot delete your own account.");
      return;
    }

    addUpdatingUser(uid);

    try {
      await deleteDoc(doc(db, "users", uid));
      setUsers(prev => prev.filter(user => user.uid !== uid));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    } finally {
      removeUpdatingUser(uid);
    }
  }, [userProfile?.uid, addUpdatingUser, removeUpdatingUser]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    updatingUsers,
    fetchUsers,
    updateUserRole,
    updateUserBadges,
    deleteUser,
    clearError,
  };
};