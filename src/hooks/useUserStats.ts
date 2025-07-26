import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

interface User {
  uid: string;
  displayName?: string;
  email: string;
}

interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  lastActivity: string | null;
}

export function useUserStats(users: User[]) {
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (users.length === 0) return;
      
      setLoading(true);
      const stats: Record<string, UserStats> = {};
      
      try {
        for (const user of users) {
          const resultsSnap = await getDocs(collection(db, "quizResults"));
          const userResults = resultsSnap.docs
            .map((doc) => doc.data())
            .filter((r: any) => r.userId === user.uid);
            
          const totalQuizzes = userResults.length;
          const averageScore = totalQuizzes > 0
            ? Math.round(
                userResults.reduce((sum: number, r: any) => sum + r.percentage, 0) / totalQuizzes
              )
            : 0;
            
          const lastActivity = userResults.length > 0
            ? userResults.sort(
                (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )[0].date
            : null;
            
          stats[user.uid] = { totalQuizzes, averageScore, lastActivity };
        }
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [users]);

  return { userStats, loading };
}
