// hooks/useUsers.ts
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export interface User {
  uid: string;
  displayName?: string;
  email?: string;
  createdAt?: string;
  [key: string]: any;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ERROR_MESSAGES = {
  USERS_LOAD_FAILED: "Failed to load users",
} as const;

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const snapshot = await getDocs(collection(db, "users"));
      const usersData = snapshot.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...docSnap.data(),
      })) as User[];
      
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(ERROR_MESSAGES.USERS_LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { 
    users, 
    loading, 
    error, 
    refetch: fetchUsers 
  };
};