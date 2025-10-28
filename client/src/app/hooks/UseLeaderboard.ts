import { useQuery } from '@tanstack/react-query';

export interface LeaderboardEntry {
 rank: number;
 playerName: string;
 score: number;
 time: number;
}

/**
 * Hook to fetch leaderboard data for a specific game
 */
export function useLeaderboard(gameId: string) {
 return useQuery<{ leaderboards: LeaderboardEntry[] }, Error>({
  queryKey: ['leaderboard', gameId] as const,
  queryFn: async () => {
   if (!gameId) return { leaderboards: [] };

   const res = await fetch(`/api/v1/GeneralGame/${gameId}/leaderboard`, {
    cache: 'no-store',
   });

   if (!res.ok) {
    // במקרה שהשרת מחזיר 404 – נחזיר מערך ריק במקום להפיל שגיאה
    if (res.status === 404) {
     return { leaderboards: [] };
    }
    throw new Error(`Failed to fetch leaderboard (status ${res.status})`);
   }

   const data = await res.json();

   // התאמה לכל פורמט אפשרי שה-API מחזיר
   const leaderboards = Array.isArray(data)
    ? data
    : Array.isArray(data?.leaderboards)
     ? data.leaderboards
     : Array.isArray(data?.data?.leaderboards)
      ? data.data.leaderboards
      : [];

   return { leaderboards };
  },
  enabled: !!gameId,
  staleTime: 1000 * 60, // דקה אחת
 });
}
