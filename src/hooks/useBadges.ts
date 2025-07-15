import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export type Badge = {
  id: string;
  name: string;
  description?: string;
  color?: string;
};

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(collection(db, "badges"));
        const allBadges = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Badge, "id">),
        }));
        setBadges(allBadges);
      } catch (err: any) {
        setError("Failed to fetch badges");
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  return { badges, loading, error };
} 