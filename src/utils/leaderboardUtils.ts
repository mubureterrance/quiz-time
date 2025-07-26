export interface LeaderboardEntry {
  userId: string;
  score: number;
  percentage: number;
  date: string;
}

export interface EnhancedLeaderboardEntry extends LeaderboardEntry {
  displayName: string;
  totalQuestions: number;
}

export const enhanceLeaderboardData = (
  leaderboard: LeaderboardEntry[],
  currentUserId?: string,
  userDisplayName?: string,
  totalQuestions: number = 0
): EnhancedLeaderboardEntry[] => {
  return leaderboard.map((entry) => ({
    ...entry,
    totalQuestions,
    displayName: entry.userId === currentUserId 
      ? userDisplayName || "You" 
      : "Anonymous",
  }));
};

export const findUserRank = (
  enhancedLeaderboard: EnhancedLeaderboardEntry[],
  userId?: string
): number => {
  const index = enhancedLeaderboard.findIndex((entry) => entry.userId === userId);
  return index !== -1 ? index + 1 : 0;
};